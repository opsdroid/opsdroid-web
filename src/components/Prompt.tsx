import { useState, useRef, useEffect } from "react";
import { UIStore } from "../store";
import { expandMessage } from "../utils/message";
import SendIcon from "../icons/sendIcon";
import BxsMicrophoneIcon from "../icons/microphoneIcon";

type inputState = {
  //TODO: This should really be message!
  text: string;
  showTooltip: boolean;
};

export const Prompt = (): React.ReactElement => {
  const promptRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    focus();

    return () => {
      focus();
    };
  }, []);
  const { connected, showSettings, username } = UIStore.useState((s) => ({
    connected: s.connection.connected,
    showSettings: s.clientSettings.showSettings,
    username: s.username,
  }));
  const [input, setInput] = useState<inputState>({
    text: "",
    showTooltip: false,
  });

  const checkForEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (event.key === "Enter" || event.keyCode === 13) {
      handleSend();
    }
  };

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    setInput({
      ...input,
      text: e.currentTarget.value,
    });
  };

  const handleSend = () => {
    if (connected) {
      if (input.text.length > 0) {
        const isImage = expandMessage(input.text);
        if (isImage) {
          isImage.then((imageUrl) => {
            UIStore.update((s) => {
              s.conversation.push({
                text: input.text,
                user: username,
                timestamp: new Date(),
                image: imageUrl,
              });
            });
          });
        } else {
          UIStore.update((s) => {
            s.conversation.push({
              text: input.text,
              user: username,
              timestamp: new Date(),
            });
          });
        }
      }
      setInput({
        ...input,
        text: "",
      });
      focus();
    } else {
      flashTooltip();
    }
  };

  const flashTooltip = () => {
    setInput({
      ...input,
      showTooltip: true,
    });
    setTimeout(() => {
      setInput({
        ...input,
        showTooltip: false,
      });
    }, 1000);
  };

  const focus = () => {
    if (promptRef?.current) {
      promptRef.current.focus();
    }
  };

  return (
    <div className={showSettings ? "prompt inactive" : "prompt active"}>
      <div className="container">
        <button id="align-with-input">
          <BxsMicrophoneIcon className="icon" />
        </button>
        <input
          type="text"
          ref={promptRef}
          id="input"
          className="prompt-input"
          placeholder="Say something..."
          value={input.text}
          onChange={handleInput}
          onKeyUp={checkForEnter}
        />
        <button onClick={handleSend} type="submit" id="align-with-input">
          <SendIcon className="icon" />
          <span id="status-indicator" className={connected ? "show" : "hide"}>
            <span
              id="status-indicator-tooltip"
              className={input.showTooltip ? "show" : "inactive"}
            >
              {connected ? "connected" : "disconnected"}
            </span>
          </span>
        </button>
      </div>
    </div>
  );
};
