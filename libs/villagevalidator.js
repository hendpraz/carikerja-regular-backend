import { connectToDatabase } from './db';
import VillageUser from '../models/VillageUser';

// Village Subscription Plan
const VILLAGE_ADMIN = 4;
const VILLAGE_SUPERUSER = 7;

export const validateAdmin = async (identityId, village) => {
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
};

export const validateSuperuser = async (identityId) => {
  await connectToDatabase();

  const foundUser = VillageUser.findOne({
    user_id: identityId
  });

  if (foundUser) {
    if ((foundUser.subscription_plan != VILLAGE_SUPERUSER)) {
      throw new Error("Auth Error: the requesting user isn't village superuser");
    }
  } else {
    throw new Error("Auth error: the requesting user data not found");
  }
};