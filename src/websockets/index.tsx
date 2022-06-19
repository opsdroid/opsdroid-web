import { MessageType } from "../types";
import { UIStore, PartialConnectionState } from "../store";
import * as settings from "browser-cookies";
import { expandMessage } from "../utils/message";

// interface headersInit {
//   [key: string]: string;
// }

const updateConnectionStateWithError = (
  error: string,
  data?: string | object
): PartialConnectionState => {
  return {
    loadState: { type: "error", error: error, data: data },
    connected: false,
    client: undefined,
  };
};

export const connectToWebsocket = () => {
  const url = generateConnectionURL("", "http");
  // TODO: uncomment this once we dealt with the cors issue
  // const headersInit = {
  //   "Content-Type": "application/json",
  // } as headersInit;
  // const websocketToken = settings.get("token");
  // if (websocketToken) {
  //   headersInit["Authorization"] = `${websocketToken}`;
  // }

  // const headers = new Headers(headersInit);
  fetch(url, {
    method: "POST",
    mode: "cors",
    // headers: headers,
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        console.error(
          `Received ${response.status} from opsdroid. Unable to connect to websocket.`
        );
      }
    })
    .then((wsSocket) => {
      if (wsSocket) {
        const ws = WebsocketClient();
        ws.connect(wsSocket.socket);
        UIStore.update((s) => {
          s.connection.client = ws;
        });
      }
    })
    .catch((err: Error) => {
      let error = err.message;
      if (err.message == "Failed to fetch") {
        error = "Unable to request socket. Is the server running?";
      }
      UIStore.update((s) => {
        s.connection = {
          ...s.connection,
          ...updateConnectionStateWithError(error, err),
        };
      });
      console.error("Unable to connect to websocket", err);
    });
};

export type WebsocketConnector = {
  connect: (socket: string) => void;
  disconnect: (code: number, reason: string) => void;
  send: (message: MessageType) => void;
};

// Used when we do client.readyState
// https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/readyState
enum clientReadyState {
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3,
}

const sslEnabled = settings.get("sslEnabled") === "true" || false;
const host = settings.get("host") || "localhost";
const port = settings.get("port") || "8080";

export const generateConnectionURL = (
  socket: string,
  connectionType: "http" | "ws"
): string => {
  let protocol: string;
  let urlPath = `${host}:${port}/connector/websocket`;
  if (connectionType === "ws" && socket) {
    protocol = sslEnabled ? "wss" : "ws";
    urlPath = `${urlPath}/${socket}`;
  } else {
    protocol = sslEnabled ? "https" : "http";
  }
  return `${protocol}://${urlPath}`;
};

export const WebsocketClient = (): WebsocketConnector => {
  let ws: WebSocket | undefined;

  const onCloseWithError_ = (e: CloseEvent) => {
    const reason = e.reason
      ? e.reason
      : "No reason provided. Did you lose connection with the server?";
    console.error(reason);

    // TODO: We should perhaps add a reconnect logic here

    UIStore.update((s) => {
      s.connection = {
        ...s.connection,
        ...updateConnectionStateWithError(reason, e),
      };
    });
  };

  const onOpen = () => {
    send({
      text: "Connected to websocket",
      user: "info",
      timestamp: new Date(),
    });
    UIStore.update((s) => {
      s.connection.connected = true;
      s.connection.loadState.type = "connected";
    });
  };

  const onError = (e: Event) => {
    UIStore.update((s) => {
      s.connection.connected = false;
      s.connection.loadState = { type: "error", error: "Error", data: e };
    });
  };

  const onClose = (e: CloseEvent) => {
    console.log("Received onClose event", e);
    if (e.wasClean) {
      send({
        text: "Disconnected from websocket",
        user: "info",
        timestamp: new Date(),
      });
      UIStore.update((s) => {
        s.connection.connected = false;
        s.connection.loadState.type = "disconnected";
        s.connection.client = undefined;
      });
    } else {
      // TODO: Need to do something with this.
      onCloseWithError_(e);
    }
  };

  const onMessage = (e: MessageEvent) => {
    const isImage = expandMessage(e.data);
    // TODO: Should we use "e.isTrusted" here?
    if (isImage) {
      isImage.then((imageUrl) => {
        UIStore.update((s) => {
          s.conversation.push({
            text: e.data, // Is the text message as string
            user: "opsdroid",
            timestamp: new Date(),
            image: imageUrl,
          });
        });
      });
    } else {
      UIStore.update((s) => {
        s.conversation.push({
          text: e.data, // Is the text message as string
          user: "opsdroid",
          timestamp: new Date(),
        });
      });
    }
  };

  const connect = (socket: string) => {
    const url = generateConnectionURL(socket, "ws");
    UIStore.update((s) => {
      s.connection.loadState.type = "connecting";
    });
    ws = new WebSocket(url);
    // TODO: How should we handle timeouts and errors?
    ws.onerror = onError;
    ws.onopen = onOpen;
    ws.onmessage = onMessage;
    ws.onclose = onClose;
  };

  const disconnect = (code: number, reason: string) => {
    if (
      ws &&
      (ws.readyState === clientReadyState.OPEN ||
        ws.readyState === clientReadyState.CONNECTING)
    ) {
      ws.close(code, reason);
    } else {
      // Kind of assuming that if ws is undefined we don't have an active connection
      const readyState = ws ? clientReadyState[ws.readyState] : "CLOSED";
      console.error(
        "Unable to disconnect websocket connection, state is: ",
        readyState
      );
    }
    UIStore.update((s) => {
      s.connection = {
        ...s.connection,
        loadState: { type: "disconnected" },
        client: undefined,
        connected: false,
      };
    });
  };

  const send = (message: MessageType) => {
    if (ws && ws.readyState === clientReadyState.OPEN) {
      ws.send(JSON.stringify({ message: message.text, user: message.user }));
    } else {
      const readyState = ws ? clientReadyState[ws.readyState] : "CLOSED";
      const message = `Unable to send message, state is: ${readyState} `;
      console.error(message);

      UIStore.update((s) => {
        s.connection = {
          ...s.connection,
          ...updateConnectionStateWithError("Not connected", message),
        };
      });
    }
  };

  return {
    connect,
    disconnect,
    send,
  };
};
