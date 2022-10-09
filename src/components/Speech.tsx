import React from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import BxsMicrophoneIcon from "../icons/microphoneIcon";
import MicrophoneListening from "../icons/microphoneListening";
import MutedMicrophone from "../icons/mutedMicrophone";

type DictaphoneProps = {
  updateInput: (text: string) => void;
};

export const Dictaphone = ({
  updateInput,
}: DictaphoneProps): React.ReactElement => {
  const { transcript, listening, browserSupportsSpeechRecognition } =
    useSpeechRecognition();
  const startListening = () =>
    SpeechRecognition.startListening({ continuous: true });

  const stopListening = () => {
    SpeechRecognition.stopListening();
    if (transcript) {
      updateInput(transcript);
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <button
        id="align-with-input"
        disabled
        title="This browser doesn't support speech recognition"
        className="disabled-button"
      >
        <MutedMicrophone className="icon" />
      </button>
    );
  }

  return (
    <button
      id="align-with-input"
      onTouchStart={startListening}
      onMouseDown={startListening}
      onTouchEnd={stopListening}
      onMouseUp={stopListening}
      title={listening ? "Listening to Microphone" : "Hold to talk"}
    >
      {listening ? (
        <MicrophoneListening className="icon" />
      ) : (
        <BxsMicrophoneIcon className="icon" />
      )}
    </button>
  );
};
export default Dictaphone;
