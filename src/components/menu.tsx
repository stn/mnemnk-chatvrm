import { IconButton } from "./iconButton";
import { Message } from "@/features/messages/messages";
import { ChatLog } from "./chatLog";
import React, { useCallback, useContext, useRef, useState } from "react";
import { Settings } from "./settings";
import { ViewerContext } from "@/features/vrmViewer/viewerContext";
import { AssistantText } from "./assistantText";

type Props = {
  chatLog: Message[];
  chatvrmPort: number;
  mnemnkApiKey: string;
  mnemnkBoard: string;
  mnemnkHost: string;
  assistantMessage: string;
  onChangeChatLog: (index: number, text: string) => void;
  onChangeChatvrmPort: (port: number) => void;
  onChangeMnemnkApiKey: (key: string) => void;
  onChangeMnemnkBoard: (board: string) => void;
  onChangeMnemnkHost: (host: string) => void;
  handleClickResetChatLog: () => void;
};
export const Menu = ({
  chatLog,
  chatvrmPort,
  mnemnkApiKey,
  mnemnkBoard,
  mnemnkHost,
  assistantMessage,
  onChangeChatLog,
  onChangeChatvrmPort,
  onChangeMnemnkApiKey,
  onChangeMnemnkBoard,
  onChangeMnemnkHost,
  handleClickResetChatLog,
}: Props) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showChatLog, setShowChatLog] = useState(true);
  const { viewer } = useContext(ViewerContext);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChangeChatvrmPort = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChangeChatvrmPort(Number(event.target.value));
    },
    [onChangeChatvrmPort]
  );

  const handleMnemnkApiKeyChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChangeMnemnkApiKey(event.target.value);
    },
    [onChangeMnemnkApiKey]
  );

  const handleMnemnkBoardChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChangeMnemnkBoard(event.target.value);
    },
    [onChangeMnemnkBoard]
  );

  const handleMnemnkHostChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChangeMnemnkHost(event.target.value);
    },
    [onChangeMnemnkHost]
  );

  const handleClickOpenVrmFile = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleChangeVrmFile = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files) return;

      const file = files[0];
      if (!file) return;

      const file_type = file.name.split(".").pop();

      if (file_type === "vrm") {
        const blob = new Blob([file], { type: "application/octet-stream" });
        const url = window.URL.createObjectURL(blob);
        viewer.loadVrm(url);
      }

      event.target.value = "";
    },
    [viewer]
  );

  return (
    <>
      <div className="absolute z-10 m-24">
        <div className="grid grid-flow-col gap-[8px]">
          <IconButton
            iconName="24/Menu"
            label="設定"
            isProcessing={false}
            onClick={() => setShowSettings(true)}
          ></IconButton>
          {showChatLog ? (
            <IconButton
              iconName="24/CommentOutline"
              label="会話ログ"
              isProcessing={false}
              onClick={() => setShowChatLog(false)}
            />
          ) : (
            <IconButton
              iconName="24/CommentFill"
              label="会話ログ"
              isProcessing={false}
              disabled={chatLog.length <= 0}
              onClick={() => setShowChatLog(true)}
            />
          )}
        </div>
      </div>
      {showChatLog && <ChatLog messages={chatLog} />}
      {showSettings && (
        <Settings
          chatLog={chatLog}
          chatvrmPort={chatvrmPort}
          mnemnkApiKey={mnemnkApiKey}
          mnemnkBoard={mnemnkBoard}
          mnemnkHost={mnemnkHost}
          onClickClose={() => setShowSettings(false)}
          onChangeChatLog={onChangeChatLog}
          onChangeChatvrmPort={handleChangeChatvrmPort}
          onChangeMnemnkApiKey={handleMnemnkApiKeyChange}
          onChangeMnemnkBoard={handleMnemnkBoardChange}
          onChangeMnemnkHost={handleMnemnkHostChange}
          onClickOpenVrmFile={handleClickOpenVrmFile}
          onClickResetChatLog={handleClickResetChatLog}
        />
      )}
      {!showChatLog && assistantMessage && (
        <AssistantText message={assistantMessage} />
      )}
      <input
        type="file"
        className="hidden"
        accept=".vrm"
        ref={fileInputRef}
        onChange={handleChangeVrmFile}
      />
    </>
  );
};
