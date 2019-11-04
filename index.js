// -----------------------------------------------------------------------------
// モジュールのインポート
const server = require('express')();
const line = require('@line/bot-sdk'); // Messaging APIのSDKをインポート
const dialogflow = require('dialogflow');

// -----------------------------------------------------------------------------
// パラメータ設定
const lineConfig = {
  channelAccessToken: process.env.LINE_ACCESS_TOKEN, // 環境変数からアクセストークンをセットしています
  channelSecret: process.env.LINE_CHANNEL_SECRET, // 環境変数からChannel Secretをセットしています
};

// -----------------------------------------------------------------------------
// Webサーバー設定
server.listen(process.env.PORT || 3000);

const bot = new line.Client(lineConfig);

// Dialogflowのクライアントインスタンスを作成
const sessionClient = new dialogflow.SessionsClient({
  project_id: process.env.GOOGLE_PROJECT_ID,
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
});

// -----------------------------------------------------------------------------
// ルーター設定
server.post('/bot/webhook', line.middleware(lineConfig), (req, res, next) => {
  res.sendStatus(200);
  console.log(req.body);

  // すべてのイベント処理のプロミスを格納する配列。
  // eslint-disable-next-line prefer-const
  let eventsProcessed = [];

  // イベントオブジェクトを順次処理。
  req.body.events.forEach((event) => {
    // この処理の対象をイベントタイプがメッセージで、かつ、テキストタイプだった場合に限定。
    if (event.type === 'message' && event.message.type === 'text') {
      eventsProcessed.push(
        sessionClient.detectIntent({
          session: sessionClient.sessionPath(process.env.GOOGLE_PROJECT_ID, event.source.userId),
          queryInput: {
            text: {
              text: event.message.text,
              languageCode: 'ja',
            },
          },
        }).then((responses) => {
          if (responses[0].queryResult && responses[0].queryResult.action === 'searchRanking') {
            let messageText;
            if (responses[0].queryResult.parameters.fields.ranking.stringValue) {
              messageText = `毎度！${responses[0].queryResult.parameters.fields.ranking.stringValue}ね。どちらにお届けしましょ？`;
            } else {
              messageText = '毎度！ご注文は？';
            }
            return bot.replyMessage(event.replyToken, {
              type: 'text',
              text: messageText,
            });
          }
        }),
      );
    }
  });

  // すべてのイベント処理が終了したら何個のイベントが処理されたか出力。
  Promise.all(eventsProcessed).then(
    (response) => {
      console.log(`${response.length} event(s) processed.`);
    },
  );
});
