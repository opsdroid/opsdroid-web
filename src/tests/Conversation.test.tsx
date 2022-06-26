import { render, screen } from "@testing-library/react";
import { Message, Conversation } from "../components/Conversation";
import { MessageType } from "../types";

test("renders message correctly", () => {
  const message: MessageType = {
    text: "Hello",
    user: "BobTheBuilder",
    timestamp: new Date(),
  };
  render(<Message message={message} accent={"green"} />);

  const username = screen.getByText("BobTheBuilder");
  expect(username).toBeInTheDocument();

  const messageText = screen.getByText("Hello");
  expect(messageText).toBeInTheDocument();

  const timestamp = screen.getByText(
    message.timestamp.toTimeString().replace(/.*(\d{2}:\d{2}):\d{2}.*/, "$1")
  );
  expect(timestamp).toBeInTheDocument();
});

test("renders conversation section correctly", () => {
  // We need this because otherwise the test fails because
  //  messagesRef.current.scrollIntoView is not a function
  // https://stackoverflow.com/questions/53271193/typeerror-scrollintoview-is-not-a-function
  window.HTMLElement.prototype.scrollIntoView = function () {
    console.log("scrolled down");
  };
  const { container } = render(<Conversation />);

  // Very basic test that just confirms that the component was rendered correctly
  // this basically means: get elements with the className 'conversatin' and since
  // we have a single entry, we expect the length of the elements to be 1
  expect(container.getElementsByClassName("conversation").length).toBe(1);
});
