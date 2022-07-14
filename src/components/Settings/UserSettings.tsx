import React from "react";
import { UIStore } from "../../store";
import PersonIcon from "../../icons/personOutlineIcon";

export const UserSettings = (): React.ReactElement => {
  const { username } = UIStore.useState((s) => ({
    username: s.userSettings.username,
  }));

  const updateUsername = (e: React.FormEvent<HTMLInputElement>) => {
    UIStore.update((s) => {
      s.userSettings.username = e.currentTarget.value;
    });
  };

  const updateAvatar = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length) {
      const avatar = target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(avatar);
      reader.onload = () => {
        const result = reader.result as string;
        if (result) {
          UIStore.update((s) => {
            s.userSettings.avatar = result;
          });
        }
      };
    }
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
        <div className="flex align-items-center">
          <p className="padding-right settings-text">Avatar</p>
          <input
            type="file"
            style={{ paddingTop: ".3rem" }}
            onChange={updateAvatar}
          />
        </div>
      </div>
    </div>
  );
};
