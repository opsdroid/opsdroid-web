import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { UserSettings } from "../components/Settings/UserSettings";

test("renders user settings in the page", () => {
  render(<UserSettings />);
  const heading = screen.getByText("User Settings");
  expect(heading).toBeInTheDocument();

  const usernameInput = screen.getByDisplayValue("user"); // Default value
  expect(usernameInput).toBeInTheDocument();

  fireEvent.change(usernameInput, { target: { value: "user-123" } });
  expect(screen.getByDisplayValue("user-123")).toBeInTheDocument();
});
