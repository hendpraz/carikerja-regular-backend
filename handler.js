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
          try {
            const data = JSON.parse(chunk);
            console.log(data);
            const intentName = data.intents[0].name;
            const location = data.entities['wit$location:location'];
            const profession = data.entities['profession:profession'];

            switch(intentName) {
              case 'Default_Welcome_Intent':
                replyMessage.text = 'Halo. Kami bisa memberikan informasi pekerjaan dan informasi mengenai platform CariKerja. Apa yang sedang Anda cari atau ingin ketahui?';
                break;
              case 'SmartVillage_Registration':
                replyMessage.text = 'Untuk mendaftarkan desa Anda ke program "SmartVillage" atau "Desa Pintar", administrator desa perlu menghubungi kami untuk diskusi kontrak';
                break;
              case 'SmartVillage_Job_Finding':
                replyMessage.text = 'Administrator desa yang telah mendaftar "SmartVillage" cukup mendaftarkan nomor HP milik warga desa. Jika ada pekerjaan baru yang ditambahkan, sistem akan mengirim SMS ke nomor HP tersebut';
                break;
              case 'Regular_Job_Posting':
                replyMessage.text = 'Untuk memasang pekerjaan, Anda perlu mendaftarkan akun di website kami. Kemudian, admin akan verifikasi data Anda. Setelah terverifikasi, Anda dapat memasang pekerjaan. Setiap pekerjaan yang dipasang akan memiliki biaya pemasangan.';
                break;
              case 'Regular_Job_Posting_Fee':
                replyMessage.text = 'Untuk setiap pekerjaan yang dipasang, akan ditagihkan biaya sebesar Rp. 100.000,- dengan pemasangan berlaku 30 hari.';
                break;
              case 'Regular_Job_Finding':
                replyMessage.text = 'Saya akan menampilkan pekerjaan. Boleh tahu kategori pekerjaannya? Misalnya nama pekerjaan, lokasi, atau jenis pekerjaan?';
                break;
              case 'Show_Regular_Jobs':
                replyMessage.text = 'Menampilkan pekerjaan: 1. 2. 3. 1-3 dari x pekerjaan\n';
                if(location) {
                  replyMessage.text += `\nLokasi terdeteksi ${location}`;
                }
                if(profession) {
                  replyMessage.text += `\nProfesi terdeteksi ${profession}`;
                }

                break;
              default:
                console.log(`Invalid intent name: ${intentName}`);
            }

            console.log('Done!');
          } catch (err) {
            console.log(err);
            replyMessage.text = 'Saya tidak mengerti maksud Anda. Bisa diulangi?';
          }
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