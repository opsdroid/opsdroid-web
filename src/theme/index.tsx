import React from "react";
import { UIStore } from "../store";

export const getTheme = (): string => {
  const defaultDark = window.matchMedia("(prefers-color-scheme: dark").matches;

  const { darkTheme, accentColor } = UIStore.useState((s) => ({
    darkTheme: s.appearance.darkTheme,
    accentColor: s.appearance.accentColor,
  }));

  const shouldUseDarkTheme = darkTheme || defaultDark ? "dark" : "light";

  return `${shouldUseDarkTheme}-${accentColor}`;
};
