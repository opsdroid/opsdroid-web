import React from "react";
import { UIStore } from "../store";
import { connectToWebsocket, WebsocketConnector } from "../websockets";
import SettingsSharpIcon from "../icons/settingsIcon";
import BxLinkIcon from "../icons/connectIcon";
import BxUnlinkIcon from "../icons/disconnectIcon";
import WarningIcon from "../icons/warningIcon";
import Logo from "../icons/logo";

export const NavBar = (): React.ReactElement => {
  const { showSettings, connected, client, connectedState } = UIStore.useState(
    (s) => ({
      showSettings: s.clientSettings.showSettings,
      connected: s.connection.connected,
      client: s.connection.client,
      connectedState: s.connection.loadState,
    })
  );
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

  const showConnectionState = (): React.ReactElement => {
    if (connectedState.type == "error") {
      return (
        <React.Fragment>
          <WarningIcon className="icon" /> {"Disconnected"}
        </React.Fragment>
      );
    } else if (connected) {
      return (
        <React.Fragment>
          <BxLinkIcon className="icon" /> {"Connected"}
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <BxUnlinkIcon className="icon" /> {"Disconnected"}
        </React.Fragment>
      );
    }
  };

  return (
    <header className="navbar">
      <Logo className="logo" />
      <div className="navbar-right">
        <button
          className="connection-button"
          onClick={() => connectIfNeeded(client)}
        >
          {showConnectionState()}
        </button>
        <button className="settings-button" onClick={toggleSettings}>
          <SettingsSharpIcon className={showSettings ? "open icon" : "icon"} />
        </button>
      </div>
      {connectedState.type == "error" && (
        <div className="error-message">
          <p>Error Connecting: {connectedState.error}</p>
        </div>
      )}
    </header>
  );
};
