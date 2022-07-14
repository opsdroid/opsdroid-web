import { UIStore } from "../store";
import { MessageType } from "../types";
import React, { useRef, useEffect } from "react";
import PersonFillIcon from "../icons/personIcon";
import Logo from "../icons/logo";

interface MessageProps {
  message: MessageType;
}

export const Message = ({ message }: MessageProps): React.ReactElement => {
  const getTime = (timestamp: Date): string => {
    return timestamp.toTimeString().replace(/.*(\d{2}:\d{2}):\d{2}.*/, "$1");
  };
  const user = message.user !== "opsdroid" ? "user" : message.user;
  const userAvatar = message.userAvatar ? (
    <img src={message.userAvatar} className="user-avatar" alt="user-avatar" />
  ) : (
    <PersonFillIcon className={`${user}-icon`} />
  );
  return (
    <div className="message-section">
      <div className={`${user} avatar`}>
        {user === "opsdroid" ? <Logo className={`${user}-icon`} /> : userAvatar}
      </div>
      <div className={`${user} message`}>
        <li className={user}>
          <p
            className={`username ${user !== "opsdroid" ? "invert" : "normal"}`}
          >
            {message.user}{" "}
            <span className="timestamp">{getTime(message.timestamp)}</span>
          </p>
          {message.image && (
            <p>
              <a className="image-url" href={message.text}>
                {message.text}
              </a>
              <p
                className={`${user} image`}
                style={{ backgroundImage: `url(${message.image})` }}
              />
            </p>
          )}
          {message.text != message.image && <p>{message.text}</p>}
        </li>
        <li className="clearfix" />
      </div>
    </div>
  );
};

export const Conversation = () => {
  const { conversation, userAvatar } = UIStore.useState((s) => ({
    conversation: s.conversation,
    userAvatar: s.userSettings.avatar,
  }));
  const messagesRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    if (messagesRef.current && conversation.length > 4) {
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
