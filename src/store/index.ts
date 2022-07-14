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

export type PartialConnectionState = {
  loadState: ConnectionState;
  client?: WebsocketConnector;
  connected: boolean;
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

export type UserSettings = {
  username: string;
  avatar?: string;
};

export type AppState = {
  clientSettings: ClientSettings;
  connection: Connection;
  conversation: Array<MessageType>;
  userSettings: UserSettings;
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
  appearance: {
    darkTheme: false,
    accentColor: "blue",
  },
  userSettings: {
    username: settings.get("username") || "user",
    avatar: localStorage.getItem("avatar") || undefined,
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
      if (lastMessage.user !== "opsdroid" && original.connection.client) {
        original.connection.client.send(lastMessage);
      }
    }
  }
);

UIStore.createReaction(
  (s) => s.userSettings,
  (original) => {
    settings.set("username", original.username);
    if (original.avatar) {
      localStorage.setItem("avatar", original.avatar);
    }
  }
);
