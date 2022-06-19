import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { NavBar } from "../components/Navbar";
import { UIStore } from "../store";

test("renders navbar in the page", () => {
  render(<NavBar />);

  const settingsButton = screen.getByRole("toggleSettings");
  expect(settingsButton).toBeInTheDocument();

  const connectButton = screen.getByRole("connect");
  expect(connectButton).toBeInTheDocument();
});

test("clicking settings will open settings", () => {
  const { container } = render(<NavBar />);

  const settingsButton = screen.getByRole("toggleSettings");
  expect(settingsButton).toBeInTheDocument();

  fireEvent.click(settingsButton);

  expect(container.getElementsByClassName("open icon").length).toBe(1);
});

test("clicking connect will show the right state", () => {
  UIStore.update((s) => {
    s.connection.connected = true;
    s.connection.loadState = { type: "connected" };
  });
  render(<NavBar />);

  const connectButton = screen.getByRole("connect");
  expect(connectButton).toBeInTheDocument();

  const connectButtonText = screen.getByText("Connected");
  expect(connectButtonText).toBeInTheDocument();
});

test("error state shows error banner with the right message", () => {
  UIStore.update((s) => {
    s.connection.connected = false;
    s.connection.loadState = {
      type: "error",
      error: "Failed to connect to opsdroid",
    };
  });
  const { container } = render(<NavBar />);

  const connectButton = screen.getByRole("connect");
  expect(connectButton).toBeInTheDocument();

  expect(container.getElementsByClassName("error-message").length).toBe(1);
  const errorMessage = screen.getByText(
    "Error Connecting: Failed to connect to opsdroid"
  );
  expect(errorMessage).toBeInTheDocument();

  // Connect button should still say Disconnected
  const buttonText = screen.getByText("Disconnected");
  expect(buttonText).toBeInTheDocument();
});
