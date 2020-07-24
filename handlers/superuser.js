import handler from "../libs/handler-lib";
import { connectToDatabase } from '../libs/db';

export const createVillage = handler(async (event, context) => {
  await connectToDatabase();
  return { foo: "bar" };
});