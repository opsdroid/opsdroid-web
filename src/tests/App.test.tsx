import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../App";

test("renders learn react link", () => {
  const { container } = render(<App />);
  // Confirm that the prompt was loaded successfully
  const prompt = screen.getByPlaceholderText("Say something...");
  expect(prompt).toBeInTheDocument();

  // Confirm that the conversation component loaded successfully
  expect(container.getElementsByClassName("conversation").length).toBe(1);

  // Confirm that connection settings were loaded successfully
  const submitButton = screen.getByDisplayValue("Connect");
  expect(submitButton).toBeInTheDocument();

  const protocol = screen.getByText("http://");
  expect(protocol).toBeInTheDocument();
});
