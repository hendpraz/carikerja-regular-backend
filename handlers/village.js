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
    if ((foundUser.subscription_plan != VILLAGE_ADMIN)) {
      throw new Error("Auth Error: the requesting user isn't village admin");
    } else if (foundUser.village != village){
      throw new Error("Auth Error: unauthorized village access");
    }
  } else {
    throw new Error("Auth error: the requesting user data not found");
  }
}

export const getVillageProfile = handler(async (event, context) => {
  console.log(event.body);
  const data = JSON.parse(event.body);

  // Validate User First
  const identityId = event.requestContext.identity.cognitoIdentityId;
  validateAdmin(identityId, data.village);

  // await connectToDatabase();
  const foundVillage = await Village.findById(data.village);

  if (!foundVillage) {
    throw new Error("Village not found");
  }

  return { message: "OK", village: foundVillage };
});