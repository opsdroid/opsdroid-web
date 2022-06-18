import React from "react";
import { UIStore } from "../../store";
import BxLinkIcon from "../../icons/connectIcon";

export const ConnectionSettings = (): React.ReactElement => {
  const { host, port, sslEnabled } = UIStore.useState((s) => ({
    host: s.clientSettings.host,
    port: s.clientSettings.port,
    sslEnabled: s.clientSettings.sslEnabled,
  }));

  const toggleSSL = () => {
    UIStore.update((s) => {
      s.clientSettings.sslEnabled = !sslEnabled;
    });
  };

  const updatePort = (e: React.FormEvent<HTMLInputElement>) => {
    UIStore.update((s) => {
      s.clientSettings.port = e.currentTarget.value;
    });
  };

  const updateHost = (e: React.FormEvent<HTMLInputElement>) => {
    UIStore.update((s) => {
      s.clientSettings.host = e.currentTarget.value;
    });
  };

  return (
    <div id="connection-settings">
      <h2 className="flex align-items-center">
        <BxLinkIcon className="settings-icon" />
        {" Connection Settings"}
      </h2>
      <div className="flex flex-column padding-left">
        <div className="flex align-items-center">
          <p className="padding-right settings-text">SSL</p>
          <label className="switch">
            <input
              type="checkbox"
              role="toggleSSL"
              checked={sslEnabled}
              onChange={toggleSSL}
            />
            <span className="slider round" />
          </label>
        </div>
        <div className="flex align-items-center">
          <p className="padding-right settings-text">Host</p>
          <input
            type="text"
            id="host"
            placeholder={host}
            defaultValue={host}
            onChange={updateHost}
          />
        </div>
        <div className="flex align-items-center">
          <p className="padding-right settings-text">Port</p>
          <input
            type="text"
            id="port"
            placeholder={port}
            defaultValue={port}
            onChange={updatePort}
          />
        </div>
      </div>
    </div>
  );
};
