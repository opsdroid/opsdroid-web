import { fireEvent, render, screen } from "@testing-library/react";
import { Prompt } from "../components/Prompt";
import { UIStore } from "../store";

test("renders prompt in the page correctly", () => {
  render(<Prompt />);
  const prompt = screen.getByPlaceholderText("Say something...");
  expect(prompt).toBeInTheDocument();
});

test("writing message should update the prompt", () => {
  render(<Prompt />);
  const prompt = screen.getByPlaceholderText("Say something...");
  fireEvent.change(prompt, {
    target: { value: "Hello" },
  });
  expect(prompt).toHaveValue("Hello");
});

test("trying to send message while disconnected flashes tooltip", () => {
  // We expect that our connected state to be false
  const { container } = render(<Prompt />);
  const prompt = screen.getByPlaceholderText("Say something...");
  const submit = screen.getByRole("send");
  fireEvent.change(prompt, {
    target: { value: "Hello" },
  });
  fireEvent.click(submit);
  // Tooltip flashed so we can try to look at the component and see if we can
  // find an element with the className 'show' (it toggles between show/hide)
  expect(container.getElementsByClassName("active").length).toBe(1);
});

test("clicking submit should send the message", () => {
  // Set connected state to true so we can test that sending the
  // message triggers the right action
  UIStore.update((s) => {
    s.connection.connected = true;
  });

  render(<Prompt />);
  const prompt = screen.getByPlaceholderText("Say something...");
  const submit = screen.getByRole("send");
  fireEvent.change(prompt, {
    target: { value: "Hello" },
  });
  fireEvent.click(submit);
  expect(prompt).toHaveValue("");
  const placeholder = screen.getByPlaceholderText("Say something...");
  expect(placeholder).toBeInTheDocument();
});

test("hitting enter should send the message", () => {
  render(<Prompt />);
  const prompt = screen.getByPlaceholderText("Say something...");

  fireEvent.change(prompt, {
    target: { value: "Hello" },
  });
  fireEvent.keyUp(prompt, { key: "Enter", charCode: 13 });
  expect(prompt).toHaveValue("");
  const placeholder = screen.getByPlaceholderText("Say something...");
  expect(placeholder).toBeInTheDocument();
});
