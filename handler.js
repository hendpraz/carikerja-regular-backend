const line = require('@line/bot-sdk');

export const handle = async (event, context) => {
  // Validate that the request is from your LINE Channel first

  // Get channelAccessToken from env variables
  const channelAccessToken = process.env.ACCESS_TOKEN;

  console.log(event);
  const data = JSON.parse(event.body);
  const lineEvent = data.events[0];
  console.log(lineEvent);

  const replyToken = lineEvent.replyToken;
  const incomeMessage = lineEvent.message.text;

  const client = new line.Client({
    channelAccessToken: channelAccessToken
  });

  const replyMessage = {
    type: 'text',
    text: `Pesan Anda: ${incomeMessage}`
  };

  await client.replyMessage(replyToken, replyMessage)
    .then(() => {
      console.log('OK');
      console.log(replyToken);
      console.log(replyMessage);
    })
    .catch((err) => {
      console.error(err);
    });
};