import handler from "../libs/handler-lib";
import RegularJob from '../models/RegularJob';
import ChatbotSession from "../models/ChatbotSession";
import { connectToDatabase } from '../libs/db';

/* FOR LINE CHATBOT */
export const findjobsbot = async (event, context) => {
  try {
    console.log(event);
    const data = JSON.parse(event.body);

    await connectToDatabase();

    const location = data.queryResult.parameters['geo-city'];
    const profession = data.queryResult.parameters.Profession;
    // Build query
    let q = `${profession} ${location}`;
    let page;

    if (!location && !profession) {
      // Find saved query of a session
      const foundChatbotSession = await ChatbotSession.findOne({ session: data.session });
      foundChatbotSession.page += 1;
      await foundChatbotSession.save();

      page = foundChatbotSession.page;
      q = foundChatbotSession.query;
    } else {
      // Create or update ChatbotSession
      page = 1;
      const foundChatbotSession = await ChatbotSession.findOne({ session: data.session });
      if (foundChatbotSession) {
        foundChatbotSession.query = q;
        foundChatbotSession.page = page;
        await foundChatbotSession.save();
      } else {
        await ChatbotSession.create({ session: data.session, query: q, page });
      }
    }

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

    let jobsMessage = "Pekerjaan: \n";
    if (foundJobs.length > 0) {
      let i = ((page - 1) * limit) + 1;
      foundJobs.forEach(element => {
        jobsMessage += `${i}. ${element.title} - ${element.location} - ${element.owner.name} - ${element.owner.whatsapp_number}\n`;
        i += 1;
      });
    } else {
      jobsMessage = "Tidak ada pekerjaan lainnya.\n";
    }

    console.log(foundJobs);

    return {
      statusCode: 200,
      body: JSON.stringify({
        "fulfillmentMessages": [
          {
            "text": {
              "text": [
                `${jobsMessage}\nFilter diterima: ${q}`
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
  console.log(event);
  await connectToDatabase();

  const location = event.queryStringParameters.location;
  const profession = event.queryStringParameters.profession;

  // Build query
  let q = event.queryStringParameters.q;
  let page = event.queryStringParameters.page;
  parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;

  const limit = 10;
  let searchQuery;

  if (!q) {
    searchQuery = {};
  } else {
    q = `${q} ${profession || ''} ${location || ''}`;
    searchQuery = {
      $text: {
        $search: q
          .split(' ')
          .map(str => `"${str}"`)
          .join(' ')
      }
    };
  }

  console.log(searchQuery);
  const foundJobs = await RegularJob.find(searchQuery)
    .populate('owner')
    .limit(limit)
    .skip((page - 1) * limit);

  console.log(foundJobs);
  return foundJobs;
});