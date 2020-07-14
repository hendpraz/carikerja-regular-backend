import handler from "../libs/handler-lib";
import { connectToDatabase } from '../libs/db';

export const renewVillageSubscription = handler(async (event, context) => {
  // Must Be Admin
  
  console.log(event.body);
  await connectToDatabase();

  return { foo: "bar" };
});

export const updateVillageSubscription = handler(async (event, context) => {
  // Must Be Admin
  
  console.log(event.body);
  await connectToDatabase();

  return { foo: "bar" };
});

export const stopVillageSubscription = handler(async (event, context) => {
    // Must Be Admin
    
    console.log(event.body);
    await connectToDatabase();
  
    return { foo: "bar" };
  });