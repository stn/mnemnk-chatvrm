# Mnemnk ChatVRM

[ChatVRM](https://github.com/pixiv/ChatVRM)をフォークしたものです。変更点は

- REST APIの追加
- Tauriによるアプリケーション化
- Koeiromapの削除
- OpenAIの削除
- 各種ライブラリーのアップデート

OpenAIを直接呼び出すのではなく、[mnemnk-chatvrm-connector]()を用いて[Mnemnk App](https://github.com/mnemnk/mnemnk-app/)のフローと繋ぐことで、さまざまな処理のインターフェースとして用いることができます。

---

ChatVRMは簡単に3Dキャラクターと会話ができるデモアプリケーションです。

VRMファイルをインポートしてキャラクターに合わせた声の調整や、感情表現を含んだ返答文の生成などを行うことができます。

ChatVRMの各機能は主に以下の技術を使用しています。

- ユーザーの音声の認識
  - [Web Speech API(SpeechRecognition)](https://developer.mozilla.org/ja/docs/Web/API/SpeechRecognition)
- 3Dキャラクターの表示
  - [@pixiv/three-vrm](https://github.com/pixiv/three-vrm)
- アプリケーション化
  - [Tauri](https://tauri.app/)

## 実行

```bash
git clone https://github.com/stn/ChatVRM.git
```

必要なパッケージをインストールしてください。
```bash
npm install
```

パッケージのインストールが完了した後、以下のコマンドで開発用のアプリを起動します。
```bash
npm run tauri dev
```
