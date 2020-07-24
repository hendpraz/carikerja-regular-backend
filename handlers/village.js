import handler from "../libs/handler-lib";
import Village from '../models/Village';
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

export const getVillageProfile = handler(async (event, context) => {
  console.log(event.body);
  const data = JSON.parse(event.body);
  const identityId = event.requestContext.identity.cognitoIdentityId;
  // Validate User First
  validateAdmin(identityId, data.village);

  // await connectToDatabase();
  const foundVillage = await Village.findById(data.village);

  if (!foundVillage) {
    throw new Error("Village not found");
  }

  return { message: "OK", village: foundVillage };
});

export const updateVillageProfile = handler(async (event, context) => {
  // Must be Admin
  
  console.log(event.body);
  await connectToDatabase();

  return { foo: "bar" };
});