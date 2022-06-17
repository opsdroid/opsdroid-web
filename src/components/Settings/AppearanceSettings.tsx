import React from "react";
import { UIStore } from "../../store";
import PaletteSwatchOutlineIcon from "../../icons/paletteOutlineIcon";

export const AppearanceSettings = (): React.ReactElement => {
  const { darkTheme } = UIStore.useState((s) => ({
    darkTheme: s.appearance.darkTheme,
  }));
  const toggleDarkTheme = () => {
    UIStore.update((s) => {
      s.appearance.darkTheme = !darkTheme;
    });
  };

  const updateAccentColor = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const color = e.currentTarget.value;
    switch (color) {
      case "green":
        UIStore.update((s) => {
          s.appearance.accentColor = "green";
        });
        break;
      case "blue":
        UIStore.update((s) => {
          s.appearance.accentColor = "blue";
        });
        break;
    }
  };
  return (
    <div>
      <h2 className="flex align-items-center">
        <PaletteSwatchOutlineIcon className="settings-icon" />
        {" Appearance Settings"}
      </h2>
      <div className="flex flex-column padding-left">
        <div className="flex align-items-center">
          <p className="padding-right settings-text">Dark Theme</p>
          <label className="switch">
            <input
              type="checkbox"
              role="triggerDarkTheme"
              checked={darkTheme}
              onChange={toggleDarkTheme}
            />
            <span className="slider round" />
          </label>
        </div>
        <div className="flex align-items-center">
          <p className="padding-right settings-text">Accent Color</p>
          <button
            onClick={updateAccentColor}
            value="blue"
            className="accentButton blue padding-left"
          />
          <button
            onClick={updateAccentColor}
            value="green"
            className="accentButton green padding-right"
          />
        </div>
      </div>
    </div>
  );
};
