import { useCallback, useRef } from "react";
import { IconButton } from "./iconButton";

type Props = {
  userMessage: string;
  isMicRecording: boolean;
  isChatProcessing: boolean;
  onChangeUserMessage: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onClickSendButton: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onClickMicButton: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

export const MessageInput = ({
  userMessage,
  isMicRecording,
  isChatProcessing,
  onChangeUserMessage,
  onClickMicButton,
  onClickSendButton,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && event.ctrlKey) {
      event.preventDefault();
      onClickSendButton(event as unknown as React.MouseEvent<HTMLButtonElement>);

      setTimeout(() => {
        inputRef.current?.focus();
      }, 1500);
    }
  }, [onClickSendButton]);

  return (
    <div className="absolute bottom-0 z-20 w-screen">
      <div className="bg-base text-black">
        <div className="mx-auto max-w-4xl p-16">
          <div className="grid grid-flow-col gap-[8px] grid-cols-[min-content_1fr_min-content]">
            <IconButton
              iconName="24/Microphone"
              className="bg-secondary hover:bg-secondary-hover active:bg-secondary-press disabled:bg-secondary-disabled"
              isProcessing={isMicRecording}
              disabled={isChatProcessing}
              onClick={onClickMicButton}
            />
            <input
              ref={inputRef}
              type="text"
              placeholder="聞きたいことをいれてね"
              onChange={onChangeUserMessage}
              onKeyDown={handleKeyDown}
              disabled={isChatProcessing}
              className="bg-surface1 hover:bg-surface1-hover focus:bg-surface1 disabled:bg-surface1-disabled disabled:text-primary-disabled rounded-16 w-full px-16 text-text-primary typography-16 font-bold disabled"
              value={userMessage}
            ></input>

            <IconButton
              iconName="24/Send"
              className="bg-secondary hover:bg-secondary-hover active:bg-secondary-press disabled:bg-secondary-disabled"
              isProcessing={isChatProcessing}
              disabled={isChatProcessing || !userMessage}
              onClick={onClickSendButton}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
