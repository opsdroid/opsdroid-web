import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { ConnectionSettings } from "../components/ConnectionSettings";

test("renders settings in the page", () => {
  render(<ConnectionSettings />);
  const portInput = screen.getByDisplayValue("8080");
  expect(portInput).toBeInTheDocument();

  const hostInput = screen.getByDisplayValue("localhost");
  expect(hostInput).toBeInTheDocument();

  const submitButton = screen.getByDisplayValue("Connect");
  expect(submitButton).toBeInTheDocument();

  const protocol = screen.getByText("http://");
  expect(protocol).toBeInTheDocument();
});

test("clicking to toggle ssl shows the right protocol", () => {
  render(<ConnectionSettings />);

  const sslEnabledButton = screen.getByText("http://");

  fireEvent.click(sslEnabledButton);
  expect(sslEnabledButton).toHaveTextContent("https://");

  // Second click should turn https:// to http://
  fireEvent.click(sslEnabledButton);
  expect(sslEnabledButton).toHaveTextContent("http://");
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
// TODO: Add test for showing/hiding settings
