import { UIStore } from "../store";
import { MessageType } from "../types";
import React, { useRef, useEffect } from "react";

interface MessageProps {
  message: MessageType;
}

export const Message = ({ message }: MessageProps): React.ReactElement => {
  const getTime = (timestamp: Date): string => {
    return timestamp.toTimeString().replace(/.*(\d{2}:\d{2}):\d{2}.*/, "$1");
  };

  return (
    <div className="message">
      {message.image && (
        <li
          className={`${message.user} image`}
          style={{ backgroundImage: `url(${message.image})` }}
        />
      )}
      {message.text != message.image && (
        <li className={message.user !== "opsdroid" ? "user" : message.user}>
          {message.text}
        </li>
      )}
      <li className="clearfix" />
      {message.user != "info" && (
        <li
          className={`${
            message.user !== "opsdroid" ? "user" : message.user
          } timestamp`}
        >
          {getTime(message.timestamp)}
        </li>
      )}
      <li className="clearfix" />
    </div>
  );
};

export const Conversation = () => {
  const { conversation } = UIStore.useState((s) => ({
    conversation: s.conversation,
  }));
  const messagesRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    if (messagesRef.current) {
      messagesRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "end",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();

    return () => scrollToBottom();
  }, [conversation]);

  return (
    <React.Fragment>
      <div className="conversation" ref={messagesRef}>
        {conversation.map((message: MessageType, index: number) => (
          <Message message={message} key={index} />
        ))}
      </div>
      <div ref={messagesRef} />
    </React.Fragment>
  );
};
