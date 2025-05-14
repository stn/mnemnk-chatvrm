import { invoke } from '@tauri-apps/api/core';
import { listen, UnlistenFn } from '@tauri-apps/api/event';
import {
  useCallback,
  //useContext,
  useEffect,
  useState
} from "react";
import VrmViewer from "@/components/vrmViewer";
// import { ViewerContext } from "@/features/vrmViewer/viewerContext";
import {
  Message,
  // textsToScreenplay,
  // Screenplay,
} from "@/features/messages/messages";
// import { speakCharacter } from "@/features/messages/speakCharacter";
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
  // const { viewer } = useContext(ViewerContext);
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

      const l = window.localStorage.getItem("chatLog");
      if (l) {
        setChatLog(JSON.parse(l));
      }
  }, []);

  useEffect(() => {
    process.nextTick(() => {
      window.localStorage.setItem(
        "chatVRMParams",
        JSON.stringify({ initialized, chatvrmPort, mnemnkApiKey, mnemnkBoard, mnemnkHost})
      )
    });
  }, [initialized, chatvrmPort, mnemnkApiKey, mnemnkBoard, mnemnkHost]);

  useEffect(() => {
    process.nextTick(() => {
      window.localStorage.setItem(
        "chatLog",
        JSON.stringify(chatLog)
      )
    });
  }, [chatLog]);

  let didInit = false;

  useEffect(() => {
    if (!didInit) {
      didInit = true;
      let unlisten: UnlistenFn;
      listen<EmitMessage>('message-received', (event) => {
        console.log('Received message:', event.payload);
        setChatLog(prev => [...prev, { role: "assistant", content: event.payload.text }]);
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

  // /**
  //  * 文ごとに音声を直列でリクエストしながら再生する
  //  */
  // const handleSpeakAi = useCallback(
  //   async (
  //     screenplay: Screenplay,
  //     onStart?: () => void,
  //     onEnd?: () => void
  //   ) => {
  //     speakCharacter(screenplay, viewer, koeiromapKey, onStart, onEnd);
  //   },
  //   [viewer, koeiromapKey]
  // );

  /**
   * アシスタントとの会話を行う
   */
  const handleSendChat = useCallback(
    async (text: string) => {
      const newMessage = text;

      if (newMessage == null) return;

      setChatProcessing(true);
      setChatLog(prev => [...prev, { role: "user", content: newMessage }]);

      try {
        await invoke("send_message", { host: mnemnkHost, apiKey: mnemnkApiKey, board: mnemnkBoard, message: newMessage });
      } catch (e) {
        console.error("Error sending message:", e);
      }

      // // Chat GPTへ
      // const messages: Message[] = [
      //   {
      //     role: "system",
      //     content: systemPrompt,
      //   },
      //   ...messageLog,
      // ];

      // const stream = await getChatResponseStream(messages, openAiKey).catch(
      //   (e) => {
      //     console.error(e);
      //     return null;
      //   }
      // );
      // if (stream == null) {
      //   setChatProcessing(false);
      //   return;
      // }

      // const reader = stream.getReader();
      // let receivedMessage = "";
      // let aiTextLog = "";
      // let tag = "";
      // const sentences = new Array<string>();
      // try {
      //   while (true) {
      //     const { done, value } = await reader.read();
      //     if (done) break;

      //     receivedMessage += value;

      //     // 返答内容のタグ部分の検出
      //     const tagMatch = receivedMessage.match(/^\[(.*?)\]/);
      //     if (tagMatch && tagMatch[0]) {
      //       tag = tagMatch[0];
      //       receivedMessage = receivedMessage.slice(tag.length);
      //     }

      //     // 返答を一文単位で切り出して処理する
      //     const sentenceMatch = receivedMessage.match(
      //       /^(.+[。．！？\n]|.{10,}[、,])/
      //     );
      //     if (sentenceMatch && sentenceMatch[0]) {
      //       const sentence = sentenceMatch[0];
      //       sentences.push(sentence);
      //       receivedMessage = receivedMessage
      //         .slice(sentence.length)
      //         .trimStart();

      //       // 発話不要/不可能な文字列だった場合はスキップ
      //       if (
      //         !sentence.replace(
      //           /^[\s\[\(\{「［（【『〈《〔｛«‹〘〚〛〙›»〕》〉』】）］」\}\)\]]+$/g,
      //           ""
      //         )
      //       ) {
      //         continue;
      //       }

      //       const aiText = `${tag} ${sentence}`;
      //       const aiTalks = textsToScreenplay([aiText], koeiroParam);
      //       aiTextLog += aiText;

      //       // 文ごとに音声を生成 & 再生、返答を表示
      //       const currentAssistantMessage = sentences.join(" ");
      //       handleSpeakAi(aiTalks[0], () => {
      //         setAssistantMessage(currentAssistantMessage);
      //       });
      //     }
      //   }
      // } catch (e) {
      //   setChatProcessing(false);
      //   console.error(e);
      // } finally {
      //   reader.releaseLock();
      // }

      // // アシスタントの返答をログに追加
      // const messageLogAssistant: Message[] = [
      //   ...messageLog,
      //   { role: "assistant", content: aiTextLog },
      // ];

      // setChatLog(messageLogAssistant);
      setChatProcessing(false);
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
