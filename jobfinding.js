const mongoose = require('mongoose');
import RegularJobs from './models/RegularJobs';

const connectToDatabase = async () => {
  mongoose.set('useFindAndModify', false);
  mongoose.set('useCreateIndex', true);
  mongoose.set('useNewUrlParser', true);
  mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  mongoose.connection.on('error', err => {
    console.error(err);
    console.log('%s MongoDB connection error. Please make sure MongoDB is running.');
    process.exit();
  });
  console.log('Connected MongoDB!');
};

const getLastPage = (session, q) => {
  console.log(`session: ${session}, q: ${q}`);
  return 1;
};

export const findjobs = async (event, context) => {
  try {
    console.log(event.body);
    const data = JSON.parse(event.body);

    await connectToDatabase();

    const location = data.queryResult.parameters['geo-city'];
    const profession = data.queryResult.parameters.Profession;

    // Build query
    const q = `${location} ${profession}`;
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

    console.log('Part 1');

    const foundJobs = await RegularJobs.find(searchQuery)
      .populate('owner')
      .limit(limit)
      .skip((page - 1) * limit);

    console.log('Part 2');
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
      statusCode: 200,
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