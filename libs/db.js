import { set, connect, connection } from 'mongoose';

export const connectToDatabase = async () => {
  set('useFindAndModify', false);
  set('useCreateIndex', true);
  set('useNewUrlParser', true);
  connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  connection.on('error', err => {
    console.error(err);
    console.log('%s MongoDB connection error. Please make sure MongoDB is running.');
    process.exit();
  });
  console.log('Connected MongoDB!');
};