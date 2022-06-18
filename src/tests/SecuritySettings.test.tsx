import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { SecuritySettings } from "../components/Settings/SecuritySettings";

test("renders security settings in the page", () => {
  render(<SecuritySettings />);

  const heading = screen.getByText("Security Settings");
  expect(heading).toBeInTheDocument();

  const tokenInput = screen.getByPlaceholderText("websocket token");
  expect(tokenInput).toBeInTheDocument();
});

test("updating token shows the right value in input", () => {
  render(<SecuritySettings />);

  fireEvent.change(screen.getByPlaceholderText("websocket token"), {
    target: { value: "token-123" },
  });

  expect(screen.getByDisplayValue("token-123")).toBeInTheDocument();
});
