import { UIStore } from "../store";
import { MessageType } from "../types";
import React, { useRef, useEffect } from "react";

interface MessageProps {
  message: MessageType;
}

// export const Message = ({ message }: MessageProps): React.ReactElement => {
//   const getTime = (timestamp: Date): string => {
//     return timestamp.toTimeString().replace(/.*(\d{2}:\d{2}):\d{2}.*/, "$1");
//   };
//   const user = message.user !== "opsdroid" ? "user" : message.user;
//   return (
//     <div className="message">
//       <div className="message-header">
//       </div>
//       {message.image && (
//         <li className={user}>
//           <a className="image-url" href={message.text}>
//             {message.text}
//           </a>
//           <li
//             className={`${user} image`}
//             style={{ backgroundImage: `url(${message.image})` }}
//           />
//         </li>
//       )}
//       {message.text != message.image && (
//         <li className={user}>{message.text}</li>
//       )}
//       <li className="clearfix" />
//       {message.user != "info" && (
//         <li className={`${user} timestamp`}>{getTime(message.timestamp)}</li>
//       )}
//       <li className="clearfix" />
//     </div>
//   );
// };

export const Message = ({ message }: MessageProps): React.ReactElement => {
  const getTime = (timestamp: Date): string => {
    return timestamp.toTimeString().replace(/.*(\d{2}:\d{2}):\d{2}.*/, "$1");
  };
  const user = message.user !== "opsdroid" ? "user" : message.user;
  return (
    <div className="message-section">
      <div className={`${user} message`}>
        <li className={user}>
          <p
            className={`username ${user !== "opsdroid" ? "invert" : "normal"}`}
          >
            {user}{" "}
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
