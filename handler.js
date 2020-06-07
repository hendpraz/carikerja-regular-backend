const line = require('@line/bot-sdk');
const https = require('https');

const executeWitAI = async (incomingMessage) => {
  // Process to Wit.ai
  let url = process.env.WIT_AI_URL;
  url += `q=${incomingMessage}`;

  const options = {
    headers: {
      "Authorization" : `Bearer ${process.env.WIT_AI_AUTHTOKEN}`
    }
  };
  return await new Promise(async (resolve, reject) => {
      https.get(url, options, async function(res) {
        console.log("Got response: " + res.statusCode);
        const replyMessage = {
          type: 'text',
          text: `Pesan Anda: ${incomingMessage}`
        };
        res.on('data', function (chunk) {
          const data = JSON.parse(chunk);
          const intentName = data.intents[0].name;

          switch(intentName) {
            case 'Default_Welcome_Intent':
              replyMessage.text = 'Halo juga';
              break;
            default:
              console.log(`Invalid intent name: ${intentName}`);
          }

          console.log('Done!');
        });
        resolve(replyMessage);
      }).on('error', function(e) {
        console.log("Got error: " + e.message);
        reject(e);
      });
  });
};

export const handle = async (event, context) => {
  // Validate that the request is from your LINE Channel first


  // Get channelAccessToken from env variables
  const channelAccessToken = process.env.CHANNEL_ACCESS_TOKEN;

  console.log(event);
  const data = JSON.parse(event.body);
  const lineEvent = data.events[0];
  console.log(lineEvent);

  const replyToken = lineEvent.replyToken;
  const incomingMessage = lineEvent.message.text;

  const replyMessage = await executeWitAI(incomingMessage);

  // Reply to client
  const client = new line.Client({
    channelAccessToken: channelAccessToken
  });

  console.log(replyToken);
  console.log(replyMessage);

  await client.replyMessage(replyToken, replyMessage)
    .then(() => {
      console.log('OK, reply sent');
    })
    .catch((err) => {
      console.error(err);
    });
};