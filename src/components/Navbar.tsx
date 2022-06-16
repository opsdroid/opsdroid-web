import React from "react";
import { UIStore } from "../store";
import { connectToWebsocket, WebsocketConnector } from "../websockets";
import SettingsSharpIcon from "../icons/settingsIcon";
import BxLinkIcon from "../icons/connectIcon";
import BxUnlinkIcon from "../icons/disconnectIcon";
import Logo from "../icons/logo";

export const NavBar = (): React.ReactElement => {
  const { showSettings, connected, client } = UIStore.useState((s) => ({
    showSettings: s.clientSettings.showSettings,
    connected: s.connection.connected,
    client: s.connection.client,
  }));
  const toggleSettings = () => {
    UIStore.update((s) => {
      s.clientSettings.showSettings = !showSettings;
    });
  };

  const connectIfNeeded = (client?: WebsocketConnector) => {
    if (connected && client) {
      client.disconnect(1000, "Requested by user");
    } else {
      connectToWebsocket();
    }
  };
  return (
    <header className="navbar">
      <Logo className="logo" />
      <button onClick={() => connectIfNeeded(client)}>
        {connected ? (
          <>
            <BxLinkIcon /> {"Connected"}
          </>
        ) : (
          <>
            <BxUnlinkIcon /> {"Disconnected"}
          </>
        )}
      </button>
      <button onClick={toggleSettings}>
        <SettingsSharpIcon className="settingsIcon" />
      </button>
    </header>
  );
};
