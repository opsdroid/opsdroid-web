import { MessageType } from "../types";
import { UIStore } from "../store";
import * as settings from "browser-cookies";

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
    console.log(e);
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
      });
    } else {
      // TODO: Need to do something with this.
      onCloseWithError_(e);
    }
  };

  const onMessage = (e: MessageEvent) => {
    console.log("Received mesage from opsdroid", e);
    // TODO: Should we use "e.isTrusted" here?
    UIStore.update((s) => {
      s.conversation.push({
        text: e.data, // Is the text message as string
        user: "opsdroid",
        timestamp: new Date(),
      });
    });
  };

  const connect = (socket: string) => {
    const url = generateConnectionURL(socket, "ws");
    ws = new WebSocket(url);
    // TODO: How should we handle timeouts and errors?
    ws.onopen = () => {
      console.log("Connected to WS");
      UIStore.update((s) => {
        s.connection.loadState.type = "connecting";
      });
    };
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
      ws.send(message.text);
    } else {
      const readyState = ws ? clientReadyState[ws.readyState] : "CLOSED";
      const message = `Unable to send message, state is: ${readyState} `;
      console.error(message);

      UIStore.update((s) => {
        s.connection = {
          ...s.connection,
          // TODO: Should this be simply disconnected instead?
          loadState: {
            type: "error",
            error: "Not connected",
            data: message,
          },
          connected: false,
          client: undefined,
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
