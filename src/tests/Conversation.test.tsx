import { render, screen } from "@testing-library/react";
import { Message, Conversation } from "../components/Conversation";
import { MessageType } from "../types";

test("renders message correctly", () => {
  const message: MessageType = {
    text: "Hello",
    user: "BobTheBuilder",
    timestamp: new Date(),
  };
  render(<Message message={message} />);
  // TODO: uncomment once user name is shown in message
  // const username = screen.getByText("BobTheBuilder")
  // expect(username).toBeInTheDocument();

  const messageText = screen.getByText("Hello");
  expect(messageText).toBeInTheDocument();

  const timestamp = screen.getByText(
    message.timestamp.toTimeString().replace(/.*(\d{2}:\d{2}):\d{2}.*/, "$1")
  );
  expect(timestamp).toBeInTheDocument();
});

test("renders conversation section correctly", () => {
  const { container } = render(<Conversation />);

  // Very basic test that just confirms that the component was rendered correctly
  // this basically means: get elements with the className 'conversatin' and since
  // we have a single entry, we expect the length of the elements to be 1
  expect(container.getElementsByClassName("conversation").length).toBe(1);
});
