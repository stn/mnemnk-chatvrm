import { invoke } from '@tauri-apps/api/core';
import { listen, UnlistenFn } from '@tauri-apps/api/event';
import {
  useCallback,
  useContext,
  useEffect,
  useState
} from "react";
import VrmViewer from "@/components/vrmViewer";
import { ViewerContext } from "@/features/vrmViewer/viewerContext";
import {
  Message,
  textsToScreenplay,
  Screenplay,
} from "@/features/messages/messages";
import { speakCharacter } from "@/features/messages/speakCharacter";
import { MessageInputContainer } from "@/components/messageInputContainer";
import { DEFAULT_MNEMNK_HOST, DEFAULT_MNEMNK_BOARD, DEFAULT_CHATVRM_PORT } from '@/features/constants/mnemnk';
import { Introduction } from "@/components/introduction";
import { Menu } from "@/components/menu";
// import { GitHubLink } from "@/components/githubLink";
import { Meta } from "@/components/meta";

interface EmitMessage {
  text: string;
}

export default function Home() {
  const { viewer } = useContext(ViewerContext);
  const [initialized, setInitialized] = useState(false);
  const [chatProcessing, setChatProcessing] = useState(false);
  const [chatLog, setChatLog] = useState<Message[]>([]);
  const [assistantMessage, setAssistantMessage] = useState("");
  const [chatvrmPort, setChatvrmPort] = useState(DEFAULT_CHATVRM_PORT);
  const [mnemnkApiKey, setMnemnkApiKey] = useState("");
  const [mnemnkHost, setMnemnkHost] = useState(DEFAULT_MNEMNK_HOST);
  const [mnemnkBoard, setMnemnkBoard] = useState(DEFAULT_MNEMNK_BOARD);

  useEffect(() => {
      if (window.localStorage.getItem("chatVRMParams")) {
        const params = JSON.parse(
          window.localStorage.getItem("chatVRMParams") as string
        );
        setInitialized(params.initialized ?? false);
        setChatvrmPort(params.chatvrmPort ?? DEFAULT_CHATVRM_PORT);
        setMnemnkApiKey(params.mnemnkApiKey ?? "");
        setMnemnkBoard(params.mnemnkBoard ?? DEFAULT_MNEMNK_BOARD);
        setMnemnkHost(params.mnemnkHost ?? DEFAULT_MNEMNK_HOST);
      }

      // const l = window.localStorage.getItem("chatLog");
      // if (l) {
      //   setChatLog(JSON.parse(l));
      // }
  }, []);

  useEffect(() => {
    process.nextTick(() => {
      window.localStorage.setItem(
        "chatVRMParams",
        JSON.stringify({ initialized, chatvrmPort, mnemnkApiKey, mnemnkBoard, mnemnkHost})
      )
    });
  }, [initialized, chatvrmPort, mnemnkApiKey, mnemnkBoard, mnemnkHost]);

  // useEffect(() => {
  //   process.nextTick(() => {
  //     window.localStorage.setItem(
  //       "chatLog",
  //       JSON.stringify(chatLog)
  //     )
  //   });
  // }, [chatLog]);

  let didInit = false;

  useEffect(() => {
    if (!didInit) {
      didInit = true;
      let unlisten: UnlistenFn;
      listen<EmitMessage>('message-received', async (event) => {
        let receivedMessage = event.payload.text;

        let aiTextLog = "";
        const sentences = new Array<string>();
        try {
          const taggedTexts: [string, string][] = [];
          
          // 正規表現でタグとテキストを抽出
          const tagPattern = /\[(.*?)\](.*?)(?=\[|$)/g;
          let match;
          
          // 全てのタグとそれに続くテキストを抽出
          while ((match = tagPattern.exec(receivedMessage + " ")) !== null) {
            const tag = `[${match[1]}]`;
            const text = match[2].trim();
            if (text) {
              taggedTexts.push([tag, text]);
            }
          }
          
          // // 最後にnormalに戻すためのダミー。
          // taggedTexts.push(["[normal]", ""]);

          // タグ付きテキストからscreenplayを生成
          const aiTalks = textsToScreenplay(
            taggedTexts.map(([tag, text]) => `${tag} ${text}`)
          );
          
          // 各screenplayに対して処理
          for (let i = 0; i < aiTalks.length; i++) {
            const aiText = `${taggedTexts[i][0]} ${taggedTexts[i][1]}`;
            aiTextLog += aiText;
            
            sentences.push(taggedTexts[i][1]);
            
            const currentAssistantMessage = sentences.join(" ");
            await handleSpeakAi(aiTalks[i], () => {
              setAssistantMessage(currentAssistantMessage);
            });
          }
        } catch (e) {
          console.error(e);
        } finally {
          setChatProcessing(false);
        }

        setChatLog(prev => [...prev, { role: "assistant", content: aiTextLog }]);
      }).then(fn => { unlisten = fn; });

      return () => {
        unlisten?.();
      };
    }
  }, []);

  const handleChangeChatLog = useCallback(
    (targetIndex: number, text: string) => {
      const newChatLog = chatLog.map((v: Message, i) => {
        return i === targetIndex ? { role: v.role, content: text } : v;
      });

      setChatLog(newChatLog);
    },
    [chatLog]
  );

  useEffect(() => {
    if (initialized) {
      (async () => {
        await invoke("spawn_server", { port: chatvrmPort });
      })();
    }
  }, [initialized]);

  /**
   * 文ごとに音声を直列でリクエストしながら再生する
   */
  const handleSpeakAi = useCallback(
    async (
      screenplay: Screenplay,
      onStart?: () => void,
      onEnd?: () => void
    ) => {
      await speakCharacter(screenplay, viewer, onStart, onEnd);
    },
    [viewer]
  );

  /**
   * アシスタントとの会話を行う
   */
  const handleSendChat = useCallback(
    async (text: string) => {
      const newMessage = text;

      if (newMessage == null) return;

      setChatProcessing(true);
      setTimeout(() => setChatProcessing(false), 1200);
      setChatLog(prev => [...prev, { role: "user", content: newMessage }]);

      try {
        await invoke("send_message", { host: mnemnkHost, apiKey: mnemnkApiKey, board: mnemnkBoard, message: newMessage });
      } catch (e) {
        console.error("Error sending message:", e);
      }

    }, [mnemnkApiKey, mnemnkHost, mnemnkBoard]
  );

  return (
    <div className={"font-M_PLUS_2"}>
      <Meta />
      <Introduction
        initialized={initialized}
        chatvrmPort={chatvrmPort}
        mnemnkApiKey={mnemnkApiKey}
        mnemnkHost={mnemnkHost}
        mnemnkBoard={mnemnkBoard}
        setInitialized={setInitialized}
        onChangeChatvrmPort={setChatvrmPort}
        onChangeMnemnkApiKey={setMnemnkApiKey}
        onChangeMnemnkHost={setMnemnkHost}
        onChangeMnemnkBoard={setMnemnkBoard}
      />
      <VrmViewer />
      <MessageInputContainer
        isChatProcessing={chatProcessing}
        onChatProcessStart={handleSendChat}
      />
      <Menu
        chatLog={chatLog}
        chatvrmPort={chatvrmPort}
        mnemnkApiKey={mnemnkApiKey}
        mnemnkBoard={mnemnkBoard}
        mnemnkHost={mnemnkHost}
        assistantMessage={assistantMessage}
        onChangeChatLog={handleChangeChatLog}
        onChangeChatvrmPort={setChatvrmPort}
        onChangeMnemnkApiKey={setMnemnkApiKey}
        onChangeMnemnkBoard={setMnemnkBoard}
        onChangeMnemnkHost={setMnemnkHost}
        handleClickResetChatLog={() => setChatLog([])}
      />
      {/* <GitHubLink /> */}
    </div>
  );
}
