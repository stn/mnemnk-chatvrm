import React from "react";
import { IconButton } from "./iconButton";
import { TextButton } from "./textButton";
import { Message } from "@/features/messages/messages";
import { Link } from "./link";
import { on } from "events";

type Props = {
  chatLog: Message[];
  chatvrmPort: number;
  mnemnkApiKey: string;
  mnemnkBoard: string;
  mnemnkHost: string;
  onClickClose: () => void;
  onChangeChatLog: (index: number, text: string) => void;
  onChangeChatvrmPort: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeMnemnkApiKey: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeMnemnkBoard: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeMnemnkHost: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClickOpenVrmFile: () => void;
  onClickResetChatLog: () => void;
};
export const Settings = ({
  chatLog,
  chatvrmPort,
  mnemnkHost,
  mnemnkBoard,
  mnemnkApiKey,
  onClickClose,
  onChangeChatLog,
  onChangeChatvrmPort,
  onChangeMnemnkHost,
  onChangeMnemnkBoard,
  onChangeMnemnkApiKey,
  onClickOpenVrmFile,
  onClickResetChatLog,
}: Props) => {
  return (
    <div className="absolute z-40 w-full h-full bg-white/80 backdrop-blur ">
      <div className="absolute m-24">
        <IconButton
          iconName="24/Close"
          isProcessing={false}
          onClick={onClickClose}
        ></IconButton>
      </div>
      <div className="max-h-full overflow-auto">
        <div className="text-text1 max-w-3xl mx-auto px-24 py-64 ">
          <div className="my-24 typography-32 font-bold">設定</div>
          <div className="my-24">
            <div className="my-8 font-bold typography-20 text-secondary">
              Mnemnk Host
            </div>
            <input
              type="text"
              placeholder="localhost:3296"
              value={mnemnkHost}
              onChange={onChangeMnemnkHost}
              className="my-4 px-16 py-8 w-full h-40 bg-surface3 hover:bg-surface3-hover rounded-4 text-ellipsis"
            ></input>
          </div>
          <div className="my-24">
            <div className="my-8 font-bold typography-20 text-secondary">
              Mnemnk APIキー
            </div>
            <input
              type="text"
              placeholder="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
              value={mnemnkApiKey}
              onChange={onChangeMnemnkApiKey}
              className="my-4 px-16 py-8 w-full h-40 bg-surface3 hover:bg-surface3-hover rounded-4 text-ellipsis"
            ></input>
          </div>
          <div className="my-24">
            <div className="my-8 font-bold typography-20 text-secondary">
              Mnemnk Board
            </div>
            <input
              type="text"
              placeholder="chatvrm"
              value={mnemnkBoard}
              onChange={onChangeMnemnkBoard}
              className="my-4 px-16 py-8 w-full h-40 bg-surface3 hover:bg-surface3-hover rounded-4 text-ellipsis"
            ></input>
          </div>
          <div className="my-24">
            <div className="my-8 font-bold typography-20 text-secondary">
              ChatVRM Port
            </div>
            <input
              type="text"
              placeholder="3299"
              value={chatvrmPort}
              onChange={onChangeChatvrmPort}
              className="my-4 px-16 py-8 w-full h-40 bg-surface3 hover:bg-surface3-hover rounded-4 text-ellipsis"
            ></input>
            <div>
              ChatVRM Portを変更した場合は再起動してください。
            </div>
          </div>
          <div className="my-40">
            <div className="my-16 typography-20 font-bold">
              キャラクターモデル
            </div>
            <div className="my-8">
              <TextButton onClick={onClickOpenVrmFile}>VRMを開く</TextButton>
            </div>
          </div>
          {chatLog.length > 0 && (
            <div className="my-40">
              <div className="my-8 grid-cols-2">
                <div className="my-16 typography-20 font-bold">会話履歴</div>
                <TextButton onClick={onClickResetChatLog}>
                  会話履歴リセット
                </TextButton>
              </div>
              <div className="my-8">
                {chatLog.map((value, index) => {
                  return (
                    <div
                      key={index}
                      className="my-8 grid grid-flow-col  grid-cols-[min-content_1fr] gap-x-fixed"
                    >
                      <div className="w-[64px] py-8">
                        {value.role === "assistant" ? "Character" : "You"}
                      </div>
                      <input
                        key={index}
                        className="bg-surface1 hover:bg-surface1-hover rounded-8 w-full px-16 py-8"
                        type="text"
                        value={value.content}
                        onChange={(event) => {
                          onChangeChatLog(index, event.target.value);
                        }}
                      ></input>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
