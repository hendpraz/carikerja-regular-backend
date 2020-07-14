import handler from "../libs/handler-lib";
import { connectToDatabase } from '../libs/db';

export const getVillageJob = handler(async (event, context) => {
  // Must Be Admin
  
  console.log(event.body);
  await connectToDatabase();

  return { foo: "bar" };
});

export const getListOfVillageJob = handler(async (event, context) => {
  // Must Be Admin
  
  console.log(event.body);
  await connectToDatabase();

  return { foo: "bar" };
});