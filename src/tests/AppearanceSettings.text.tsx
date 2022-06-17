import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { AppearanceSettings } from "../components/Settings/AppearanceSettings";

test("renders appearance settings in the page", () => {
  render(<AppearanceSettings />);

  const heading = screen.getByText("Appearance Settings");
  expect(heading).toBeInTheDocument();

  const darkThemeToggle = screen.getByText("Dark Theme");
  expect(darkThemeToggle).toBeInTheDocument();

  const accentColorPicker = screen.getByText("Accent Color");
  expect(accentColorPicker).toBeInTheDocument();
});
