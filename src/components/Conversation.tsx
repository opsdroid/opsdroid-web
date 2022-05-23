import { UIStore } from "../store";
import { MessageType } from "../types";

interface MessageProps {
  message: MessageType;
}

export const Message = ({ message }: MessageProps): React.ReactElement => {
  const getTime = (timestamp: Date): string => {
    return timestamp.toTimeString().replace(/.*(\d{2}:\d{2}):\d{2}.*/, "$1");
  };

  //TODO: Think about this, should we always include the user name?

  return (
    <div className="message">
      {message.image && (
        <li
          className={`${message.user} image`}
          style={{ backgroundImage: `url(${message.image})` }}
        />
      )}
      {message.text != message.image && (
        <li className={message.user}>{message.text}</li>
      )}
      <li className="clearfix" />
      {message.user != "info" && (
        <li className={`${message.user} timestamp`}>
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

  // TODO: Make sure we always scroll down to show messages, previously we had:
  // componentDidUpdate() {
  //   window.scrollTo(0, document.body.scrollHeight);
  // }

  return (
    <div className="conversation">
      {conversation.map((message: MessageType, index: number) => (
        <Message message={message} key={index} />
      ))}
    </div>
  );
};
