import React from "react";
import { render, screen } from "@testing-library/react";
import { Settings } from "../components/Settings";

test("renders the settings component", () => {
  render(<Settings />);

  const userSettingsHeading = screen.getByText("User Settings");
  expect(userSettingsHeading).toBeInTheDocument();

  const connectionSettingsHeading = screen.getByText("Connection Settings");
  expect(connectionSettingsHeading).toBeInTheDocument();

  const securitySettingsHeading = screen.getByText("Security Settings");
  expect(securitySettingsHeading).toBeInTheDocument();

  const appearanceSettingsHeading = screen.getByText("Appearance Settings");
  expect(appearanceSettingsHeading).toBeInTheDocument();
});
