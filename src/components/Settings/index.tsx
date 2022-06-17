import { UIStore } from "../../store";
import { ConnectionSettings } from "./ConnectionSettings";
import { SecuritySettings } from "./SecuritySettings";
import { UserSettings } from "./UserSettings";
import { AppearanceSettings } from "./AppearanceSettings";

export const Settings = (): React.ReactElement => {
  const { showSettings } = UIStore.useState((s) => ({
    showSettings: s.clientSettings.showSettings,
  }));
  return (
    <div id="settings" className={showSettings ? "active" : "inactive"}>
      <UserSettings />
      <ConnectionSettings />
      <SecuritySettings />
      <AppearanceSettings />
    </div>
  );
};
