import { MessageType } from "../types";
import { UIStore } from "../store";
import React from "react";

export type WebsocketConnector = {
  connect: () => void;
  disconnect: (code: number, reason: string) => void;
  send: (message: MessageType) => void;
  // onMessage: (callback: (message: Message) => void) => void;
};

// Used when we do client.readyState
// https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/readyState
enum clientReadyState {
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3,
}

// This is a wrapper around the Websocket which allow us to handle things like backoff, different states, logging, etc
export const WebsocketClient = (): WebsocketConnector => {
  let ws: WebSocket | undefined;

  // FIXME: Need to fix this, can't use this hook and `UIStore.update()`
  // const {
  //   host,
  //   port,
  //   sslEnabled,
  //   // cooldown,
  //   // timeout,
  //   // client,
  //   // connected
  // } = UIStore.useState((s) => ({
  //   host: s.clientSettings.host,
  //   port: s.clientSettings.port,
  //   sslEnabled: s.clientSettings.sslEnabled,
  //   // cooldown: s.connection.cooldown,
  //   // timeout: s.connection.timeout,
  //   // client: s.connection.client,
  //   // connected: s.connection.connected,
  // }));
  const sslEnabled = false;
  const host = "localhost";
  const port = "8080";

  const generateConnectionURL = (): string => {
    const protocol: string = sslEnabled ? "wss" : "ws";
    return `${protocol}://${host}:${port}/connector/websocket`;
  };

  const connect = () => {
    const url = generateConnectionURL();
    console.log(url);
    ws = new WebSocket(url);
    // TODO: Handle error and state change
    console.log("WebsocketClient his: ", ws);
    UIStore.update((s) => {
      s.connection.connected = true;
    });
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
      ws.send(JSON.stringify(message));
    } else {
      const readyState = ws ? clientReadyState[ws.readyState] : "CLOSED";
      const message = `Unable to send message, state is: ${readyState}`;
      console.error(message);

      UIStore.update((s) => {
        s.connection.loadState = {
          type: "error",
          error: "Not connected",
          data: message,
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

export const WTF = () => {
  const Blah = () => {
    const ws = WebsocketClient();
    ws.connect();
    console.log("Websocket his: ", ws);
  };
  return (
    <React.Fragment>
      <input type="submit" id="connect" value="Connect" onClick={Blah} />
    </React.Fragment>
  );
};
