/* eslint-disable */
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const RegularJob = require('../models/RegularJob');
const RegularUser = require('../models/RegularUser');
const SubscriptionPlan = require('../models/SubscriptionPlan');

dotenv.config({ path: '../.env' });

const connect = new Promise((resolve, reject) => {
  mongoose.connect(process.env.MONGODB_URI, {
    useUnifiedTopology: true,
    useFindAndModify: true,
    useCreateIndex: true,
    useNewUrlParser: true
  });
  mongoose.connection.on('error', err => {
    reject(err);
  });
  resolve('Mongoose is connected');
});

const seeder = (connector, resource, data) =>
  new Promise(async (resolve, reject) => {
    try {
      const connection = await connector;
      if (connection) {
        const promiseArray = data.map(item => {
          const newItem = new resource(item);
          return newItem.save();
        });

        const result = await Promise.all(promiseArray);
        resolve(result);
      }
      throw new Error('Connection could not be established');
    } catch (e) {
      reject(e);
    }
  });

const execute = async () => {
  try {
    const data = [
      {
        subs_id: 1,
        name: "Regular Jobseeker",
        description: "Plan for regular jobseeker"
      },
      {
        subs_id: 2,
        name: "Regular Jobposter",
        description: "Plan for regular jobposter"
      },
      {
        subs_id: 3,
        name: "Village User",
        description: "Plan for village user"
      },
      {
        subs_id: 4,
        name: "Village Administrator",
        description: "Plan for village administrator"
      }
    ];

    const result = await seeder(connect, SubscriptionPlan, data);
    console.info(result);

    const subscriptionPlan = await SubscriptionPlan.find().sort('subs_id');

    const dataJobposter = [
      {
        name: "Hendry Prasetya",
        email: "example@gmail.com",
        phone_number: "081234567890",
        whatsapp_number: "081234567890",
        profile_picture: "1.jpg",
        address: "Coblong, Bandung, Jawa Barat",
        status: "active",
        subscription_plan: subscriptionPlan[1]._id
      }
    ];

    const resultJobposter = await seeder(connect, RegularUser, dataJobposter);
    console.info(resultJobposter);

    const jobposter = await RegularUser.find();

    const dataJob = [
      {
        title: "Kasir Minimarket",
        owner: jobposter[0]._id,
        description: "Kasir Minimarket di Bandung, Jawa Barat",
        num_of_openings: 2,
        status: 1,
        location: "Bandung",
        profession: "Kasir"
      },
      {
        title: "Kasir Rumah Makan",
        owner: jobposter[0]._id,
        description: "Kasir Rumah Makan di Bandung, Jawa Barat",
        num_of_openings: 3,
        status: 1,
        location: "Bandung",
        profession: "Kasir"
      },
      {
        title: "Kasir Toko Swalayan",
        owner: jobposter[0]._id,
        description: "Kasir Toko Swalayan di Bandung, Jawa Barat",
        num_of_openings: 2,
        status: 1,
        location: "Bandung",
        profession: "Kasir"
      },
      {
        title: "Kasir Barber Shop",
        owner: jobposter[0]._id,
        description: "Kasir Barber Shop di Bandung, Jawa Barat",
        num_of_openings: 1,
        status: 1,
        location: "Bandung",
        profession: "Kasir"
      }
    ];

    const resultJob = await seeder(connect, RegularJob, dataJob);
    console.info(resultJob);
  } catch (e) {
    console.error(e);
  } finally {
    process.exit();
  }
};

/* eslint-enable */
execute();
