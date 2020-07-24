import handler from "../libs/handler-lib";
import VillageUser from '../models/VillageUser';
import { connectToDatabase } from '../libs/db';

// Village Administrator SubsPlan = 4
const VILLAGE_ADMIN = 4;

const validateAdmin = (identityId, village) => {
  await connectToDatabase();

  const foundUser = VillageUser.findOne({
    user_id: identityId
  });

  if (foundUser) {
    if ((foundUser.village == village) && (foundUser.subscription_plan == VILLAGE_ADMIN)){
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

export const createVillageAdmin = handler(async (event, context) => {
  console.log(event.body);
  const data = JSON.parse(event.body);
  const identityId = event.requestContext.identity.cognitoIdentityId;
  
  // Validate User First
  validateAdmin(identityId, data.village);

  await connectToDatabase();
  const foundUser = VillageUser.findOne({
    user_id: data.user_id
  });

  if (foundUser) {
    if (foundUser.village == data.village) {
      foundUser.subscription_plan = VILLAGE_ADMIN;
    } else {
      throw new Error("Invalid combination of user and village");
    }
  } else {
    throw new Error("User not found");
  }

  return { message: "OK" };
});

export const getVillageAdmin = handler(async (event, context) => {  
  console.log(event.body);
  const data = JSON.parse(event.body);
  const identityId = event.requestContext.identity.cognitoIdentityId;
  // Validate User First
  validateAdmin(identityId, data.village);

  const foundAdmin = await VillageUser.find(data.user_id);

  await connectToDatabase();

  return { message: "OK" };
});

export const listVillageAdmin = handler(async (event, context) => {
  // Validate User First
  
  console.log(event.body);
  const data = JSON.parse(event.body);

  await connectToDatabase();

  return { foo: "bar" };
});