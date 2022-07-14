import React from "react";
import { UIStore } from "../store";
import { connectToWebsocket, WebsocketConnector } from "../websockets";
import SettingsSharpIcon from "../icons/settingsIcon";
import BxLinkIcon from "../icons/connectIcon";
import BxUnlinkIcon from "../icons/disconnectIcon";
import WarningIcon from "../icons/warningIcon";
import Logo from "../icons/logo";

type ErrorMessageState = {
  showErrorMessage: boolean;
  errorMessage?: string;
};

export const NavBar = (): React.ReactElement => {
  const { showSettings, connected, client, connectedState, accentColor } =
    UIStore.useState((s) => ({
      showSettings: s.clientSettings.showSettings,
      connected: s.connection.connected,
      client: s.connection.client,
      connectedState: s.connection.loadState,
      accentColor: s.appearance.accentColor,
    }));
  const toggleSettings = () => {
    UIStore.update((s) => {
      s.clientSettings.showSettings = !showSettings;
    });
  };

  const [errorMessageState, setErrorMessageState] =
    React.useState<ErrorMessageState>({
      showErrorMessage: true,
    });

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
          <WarningIcon className="icon" title={connectedState.error} />
          {"Disconnected"}
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

  if (
    connectedState.type === "error" &&
    connectedState.error !== errorMessageState.errorMessage
  ) {
    setErrorMessageState({
      showErrorMessage: true,
      errorMessage: connectedState.error,
    });
  }

  const closeErrorMessage = () => {
    setErrorMessageState({
      showErrorMessage: false,
      errorMessage: errorMessageState.errorMessage,
    });
  };

  return (
    <header className="navbar">
      <Logo className="logo" accent={accentColor} />
      <div className="navbar-right">
        <button
          className="connection-button"
          role="connect"
          onClick={() => connectIfNeeded(client)}
        >
          {showConnectionState()}
        </button>
        <button
          className="settings-button"
          role="toggleSettings"
          onClick={toggleSettings}
        >
          <SettingsSharpIcon className={showSettings ? "open icon" : "icon"} />
        </button>
      </div>
      {connectedState.type == "error" && errorMessageState.showErrorMessage ? (
        <div className="error-message">
          <p>Error Connecting: {connectedState.error}</p>
          <button className="close-error-message" onClick={closeErrorMessage}>
            X
          </button>
        </div>
      ) : null}
    </header>
  );
};
