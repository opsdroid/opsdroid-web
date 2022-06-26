import React from "react";
import { UIStore } from "../store";

export const getTheme = (): string => {
  const { darkTheme, accentColor } = UIStore.useState((s) => ({
    darkTheme: s.appearance.darkTheme,
    accentColor: s.appearance.accentColor,
  }));

  const shouldUseDarkTheme = darkTheme ? "dark" : "light";

  return `${shouldUseDarkTheme}-${accentColor}`;
};
