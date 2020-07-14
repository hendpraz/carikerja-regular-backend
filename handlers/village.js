import handler from "../libs/handler-lib";
import { connectToDatabase } from '../libs/db';

export const getVillageProfile = handler(async (event, context) => {
  // Must be Admin
  
  console.log(event.body);
  await connectToDatabase();

  return { foo: "bar" };
});

export const updateVillageProfile = handler(async (event, context) => {
  // Must be Admin
  
  console.log(event.body);
  await connectToDatabase();

  return { foo: "bar" };
});