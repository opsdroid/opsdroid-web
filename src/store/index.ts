import { Store } from "pullstate";
import * as settings from "browser-cookies";
import { MessageType } from "../types";
import { WebsocketConnector } from "../websockets";

export type DisconnectedType = { type: "disconnected" };
export type ConnectingType = { type: "connecting" };
export type ConnectedType = { type: "connected" };
export type ConnectionErrorType = {
  type: "error";
  error: string;
  data?: object | string;
};

export type ClientSettings = {
  host: string;
  port: string;
  sslEnabled: boolean;
  showSettings: boolean;
};

export type ConnectionState =
  | DisconnectedType
  | ConnectingType
  | ConnectedType
  | ConnectionErrorType;

export type Connection = {
  loadState: ConnectionState;
  cooldown: number;
  timeout: number;
  client?: WebsocketConnector;
  connected: boolean;
};

export type AppState = {
  clientSettings: ClientSettings;
  connection: Connection;
  conversation: Array<MessageType>;
};

export const UIStore = new Store<AppState>({
  clientSettings: {
    host: settings.get("host") || "localhost",
    port: settings.get("port") || "8080",
    sslEnabled: settings.get("sslEnabled") === "true" || false,
    showSettings: false,
  },
  connection: {
    loadState: { type: "disconnected" },
    cooldown: 1,
    timeout: 1000,
    client: undefined,
    connected: false,
  },
  conversation: [],
});

// TODO: Add reactions for state change

// TODO: Add reaction for backoff

UIStore.createReaction(
  (s) => s.connection,
  (original, previousState, draft) => {
    // Only create the backoff when connection.cooldown increases
    if (original.loadState.type === "connecting") {
      if (original.cooldown >= previousState.connection.cooldown) {
        draft.connection.timeout = original.cooldown * 2 * 1000;
      } else if (original.cooldown === 1) {
        draft.connection.timeout = 1000;
      }
    }

    // TODO: Probably we should handle other connection things here right?
  }
);

UIStore.createReaction(
  (s) => s.clientSettings,
  (original) => {
    // Note: Here we are just adding any changes to the cookies, it's likely
    // that we don't really need to handle conditionals here, since if only
    // one of the settings is changed, the other one will be updated with the
    // original value.
    settings.set("host", original.host);
    settings.set("port", String(original.port));
    settings.set("sslEnabled", String(original.sslEnabled));
    // TODO: We shouldn't need to update the values in draft right?
  }
);

UIStore.createReaction(
  (s) => s.conversation,
  (watched, draft, original, lastWatched) => {
    if (watched.length > lastWatched.length) {
      const lastMessage = watched[watched.length - 1];
      if (lastMessage.user === "user" && original.connection.client) {
        original.connection.client.send(lastMessage);
      }
    }
  }
);
