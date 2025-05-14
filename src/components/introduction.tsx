import { useState, useCallback } from "react";
import { Link } from "./link";

type Props = {
  // openAiKey: string;
  // koeiroMapKey: string;
  // onChangeAiKey: (openAiKey: string) => void;
  // onChangeKoeiromapKey: (koeiromapKey: string) => void;
  initialized: boolean;
  setInitialized: (initialized: boolean) => void;
  mnemnkApiKey: string;
  mnemnkHost: string;
  onChangeMnemnkApiKey: (mnemnkApiKey: string) => void;
  onChangeMnemnkHost: (mnemnkHost: string) => void;
};

export const Introduction = ({
  // openAiKey,
  // koeiroMapKey,
  // onChangeAiKey,
  // onChangeKoeiromapKey,
  initialized,
  setInitialized,
  mnemnkApiKey,
  mnemnkHost,
  onChangeMnemnkApiKey,
  onChangeMnemnkHost,
}: Props) => {
  const handleMnemnkApiKeyChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChangeMnemnkApiKey(event.target.value);
    },
    [onChangeMnemnkApiKey]
  );

  const handleMnemnkHostChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChangeMnemnkHost(event.target.value);
    },
    [onChangeMnemnkHost]
  );

  // const handleAiKeyChange = useCallback(
  //   (event: React.ChangeEvent<HTMLInputElement>) => {
  //     onChangeAiKey(event.target.value);
  //   },
  //   [onChangeAiKey]
  // );

  // const handleKoeiromapKeyChange = useCallback(
  //   (event: React.ChangeEvent<HTMLInputElement>) => {
  //     onChangeKoeiromapKey(event.target.value);
  //   },
  //   [onChangeKoeiromapKey]
  // );

  return !initialized ? (
    <div className="absolute z-40 w-full h-full px-24 py-40  bg-black/30 font-M_PLUS_2">
      <div className="mx-auto my-auto max-w-3xl max-h-full p-24 overflow-auto bg-white rounded-16">
        <div className="my-24">
          <div className="my-8 font-bold typography-20 text-secondary ">
            このアプリケーションについて
          </div>
          <div>
            Mnemnkと通信することで3Dキャラクターとの会話を楽しめます。キャラクター（VRM）の変更もできます。
          </div>
        </div>

        <div className="my-24">
          <div className="my-8 font-bold typography-20 text-secondary">
            利用上の注意
          </div>
          <div>
            VRMモデルを使ってキャラクターを差し替える際はモデルの利用条件に従ってください。
          </div>
        </div>

        <div className="my-24">
          <div className="my-8 font-bold typography-20 text-secondary">
            Mnemnk APIキー
          </div>
          <input
            type="text"
            placeholder="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
            value={mnemnkApiKey}
            onChange={handleMnemnkApiKeyChange}
            className="my-4 px-16 py-8 w-full h-40 bg-surface3 hover:bg-surface3-hover rounded-4 text-ellipsis"
          ></input>
        </div>
        <div className="my-24">
          <div className="my-8 font-bold typography-20 text-secondary">
            Mnemnk Host
          </div>
          <input
            type="text"
            placeholder="http://localhost:3296"
            value={mnemnkHost}
            onChange={handleMnemnkHostChange}
            className="my-4 px-16 py-8 w-full h-40 bg-surface3 hover:bg-surface3-hover rounded-4 text-ellipsis"
          ></input>
        </div>
        <div className="my-24">
          <button
            onClick={() => {
              setInitialized(true);
            }}
            className="font-bold bg-secondary hover:bg-secondary-hover active:bg-secondary-press disabled:bg-secondary-disabled text-white px-24 py-8 rounded-oval"
          >
            設定を保存してはじめる
          </button>
        </div>
      </div>
    </div>
  ) : null;
};
