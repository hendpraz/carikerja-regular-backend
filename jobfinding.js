import handler from "./libs/handler-lib";
import RegularJob from './models/RegularJob';
import { connectToDatabase } from './libs/db';

/* FOR LINE CHATBOT */
const getLastPage = (session, q) => {
  console.log(`session: ${session}, q: ${q}`);
  return 1;
};

export const findjobsbot = async (event, context) => {
  try {
    console.log(event.body);
    const data = JSON.parse(event.body);

    await connectToDatabase();

    const location = data.queryResult.parameters['geo-city'];
    const profession = data.queryResult.parameters.Profession;

    // Build query
    const q = `${profession} ${location}`;
    const page = getLastPage(data.session, q);

    const limit = 3;
    const searchQuery = {
      $text: {
        $search: q
          .split(' ')
          .map(str => `"${str}"`)
          .join(' ')
      }
    };

    const foundJobs = await RegularJob.find(searchQuery)
      .populate('owner')
      .limit(limit)
      .skip((page - 1) * limit);

    let jobsMessage = '';
    let i = 1;
    foundJobs.forEach(element => {
      jobsMessage += `${i}. ${element.title} - ${element.location} - ${element.owner.name} - ${element.owner.whatsapp_number}\n`;
      i += 1;
    });

    console.log(foundJobs);

    return {
      statusCode: 200,
      body: JSON.stringify({
        "fulfillmentMessages": [
          {
            "text": {
              "text": [
                `Pekerjaan: \n${jobsMessage}\nFilter diterima: Lokasi-${location}; Profesi-${profession};`
              ]
            }
          }
        ]
      }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        "fulfillmentMessages": [
          {
            "text": {
              "text": [
                `Terjadi error: ${err}`
              ]
            }
          }
        ]
      }),
    };
  }
};

/* FOR WEB APP */
export const findjobsweb = handler(async (event, context) => {
  return { foo: "bar" };
});