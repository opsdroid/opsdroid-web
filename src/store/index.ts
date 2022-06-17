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
  token?: string;
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

export type Appearance = {
  darkTheme: boolean;
  accentColor: "blue" | "green";
};

export type AppState = {
  clientSettings: ClientSettings;
  connection: Connection;
  conversation: Array<MessageType>;
  username: string;
  appearance: Appearance;
};

export const UIStore = new Store<AppState>({
  clientSettings: {
    host: settings.get("host") || "localhost",
    port: settings.get("port") || "8080",
    sslEnabled: settings.get("sslEnabled") === "true" || false,
    showSettings: false,
    token: settings.get("token") || undefined,
  },
  connection: {
    loadState: { type: "disconnected" },
    cooldown: 1,
    timeout: 1000,
    client: undefined,
    connected: false,
  },
  conversation: [],
  username: "user",
  appearance: {
    darkTheme: false,
    accentColor: "blue",
  },
});

// Reactions for state change

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
    if (original.token) {
      settings.set("token", String(original.token));
    }
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
