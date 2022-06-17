import React from "react";
import { UIStore } from "../../store";
import PersonIcon from "../../icons/personOutlineIcon";

export const UserSettings = (): React.ReactElement => {
  const { username } = UIStore.useState((s) => ({
    username: s.username,
  }));

  const updateUsername = (e: React.FormEvent<HTMLInputElement>) => {
    UIStore.update((s) => {
      s.username = e.currentTarget.value;
    });
  };

  return (
    <div>
      <h2 className="flex align-items-center">
        <PersonIcon className="settings-icon" />
        {" User Settings"}
      </h2>
      <div className="flex flex-column padding-left">
        <div className="flex align-items-center">
          <p className="padding-right settings-text">Username</p>
          <input
            type="text"
            id="username"
            placeholder={username}
            defaultValue={username}
            onChange={updateUsername}
          />
        </div>
      </div>
    </div>
  );
};
