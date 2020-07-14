import handler from "../libs/handler-lib";
import VillageUser from '../models/VillageUser';
import { connectToDatabase } from '../libs/db';

export const createVillageAdmin= handler(async (event, context) => {
  // Validate User First
  
  console.log(event.body);
  const data = JSON.parse(event.body);

  await connectToDatabase();

  return { foo: "bar" };
});

export const getVillageAdmin= handler(async (event, context) => {
  // Validate User First
  
  console.log(event.body);
  const data = JSON.parse(event.body);

  await connectToDatabase();

  return { foo: "bar" };
});