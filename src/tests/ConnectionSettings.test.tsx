import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { ConnectionSettings } from "../components/Settings/ConnectionSettings";

test("renders connection settings in the page", () => {
  render(<ConnectionSettings />);

  const heading = screen.getByText("Connection Settings");
  expect(heading).toBeInTheDocument();

  const portInput = screen.getByDisplayValue("8080");
  expect(portInput).toBeInTheDocument();

  const hostInput = screen.getByDisplayValue("localhost");
  expect(hostInput).toBeInTheDocument();
});

test("clicking to toggle ssl sets the right protocol", () => {
  render(<ConnectionSettings />);

  const sslToggle = screen.getByRole("toggleSSL");
  expect(sslToggle).toBeInTheDocument();
  // This should be the default
  expect(sslToggle).not.toBeChecked();

  fireEvent.click(sslToggle);

  // We are just assuming that this just works.
  expect(sslToggle).toBeChecked();

  fireEvent.click(sslToggle);
  expect(sslToggle).not.toBeChecked();
});

test("updating port shows the right port in input", () => {
  render(<ConnectionSettings />);

  fireEvent.change(screen.getByDisplayValue("8080"), {
    target: { value: "8081" },
  });
  expect(screen.getByDisplayValue("8081")).toBeInTheDocument();
});

test("Previously updated port should still be set", () => {
  render(<ConnectionSettings />);

  fireEvent.change(screen.getByDisplayValue("localhost"), {
    target: { value: "opsdroid.dev" },
  });
  expect(screen.getByDisplayValue("opsdroid.dev")).toBeInTheDocument();
});

test("updating host shows the right host in input", () => {
  render(<ConnectionSettings />);

  fireEvent.change(screen.getByDisplayValue("opsdroid.dev"), {
    target: { value: "localhost" },
  });
  expect(screen.getByDisplayValue("localhost")).toBeInTheDocument();
});

test("Previously updated host should still be set", () => {
  render(<ConnectionSettings />);

  fireEvent.change(screen.getByDisplayValue("8081"), {
    target: { value: "8080" },
  });
  expect(screen.getByDisplayValue("8080")).toBeInTheDocument();
});
