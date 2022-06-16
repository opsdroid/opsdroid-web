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
      <div className="navbar-right">
        <button
          className="connectionButton"
          onClick={() => connectIfNeeded(client)}
        >
          {connected ? (
            <>
              <BxLinkIcon className="icon" /> {"Connected"}
            </>
          ) : (
            <>
              <BxUnlinkIcon className="icon" /> {"Disconnected"}
            </>
          )}
        </button>
        <button className="settingsButton" onClick={toggleSettings}>
          <SettingsSharpIcon className={showSettings ? "open icon" : "icon"} />
        </button>
      </div>
    </header>
  );
};
