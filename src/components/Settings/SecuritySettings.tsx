import React from "react";
import { UIStore } from "../../store";
import LockIcon from "../../icons/lockOutlineIcon";

export const SecuritySettings = (): React.ReactElement => {
  const { token } = UIStore.useState((s) => ({
    token: s.clientSettings.token,
  }));

  const updateWebsocketToken = (e: React.FormEvent<HTMLInputElement>) => {
    UIStore.update((s) => {
      s.clientSettings.token = e.currentTarget.value;
    });
  };

  return (
    <div id="connection-settings">
      <h2 className="flex align-items-center">
        <LockIcon className="settings-icon" />
        {" Security Settings"}
      </h2>
      <div className="flex flex-column padding-left">
        <div className="flex align-items-center">
          <p className="padding-right settings-text">Token</p>
          <input
            type="text"
            id="token"
            placeholder="websocket token"
            defaultValue={token}
            onChange={updateWebsocketToken}
          />
        </div>
      </div>
    </div>
  );
};
