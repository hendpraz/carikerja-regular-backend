import { connectToDatabase } from './db';
import VillageActivity from '../models/VillageActivity';
import VillageUser from '../models/VillageUser';
import VillagePlan from '../models/VillagePlan';

// Village Subscription Plan
const VILLAGE_ADMIN = 4;
const VILLAGE_SUPERUSER = 7;

export const validateAdmin = async (identityId, village, activity_description) => {
  await connectToDatabase();
  console.log(identityId);
  console.log(village);
  console.log(activity_description);

  const foundUser = await VillageUser.findOne({
    identity_id: identityId
  });

  const foundVillagePlan = await VillagePlan.findOne({village: String(village)});
  if (foundVillagePlan) {
    if (foundVillagePlan.status === "inactive") {
      throw new Error("Inactive village access");
    } else if (foundVillagePlan.expiry_date < Date.now()) {
      throw new Error("Village plan is expired");
    }
  } else {
    throw new Error("Village plan not found");
  }

  if (foundUser) {
    if ((foundUser.subscription_plan != VILLAGE_ADMIN)) {
      throw new Error("Auth Error: the requesting user isn't village admin");
    } else if (String(foundUser.village) != String(village)){
      throw new Error("Auth Error: unauthorized village access");
    }
  } else {
    throw new Error("Auth error: the requesting user data not found");
  }

  if (activity_description) {
    const newVillageActivity = {};

    newVillageActivity.village_user = foundUser._id;
    newVillageActivity.village = foundUser.village;
    newVillageActivity.activity_description = activity_description;
    newVillageActivity.date = Date.now();

    await VillageActivity.create(newVillageActivity);
  }
};

export const validateSuperuser = async (identityId) => {
  await connectToDatabase();

  const foundUser = await VillageUser.findOne({
    identity_id: identityId
  });

  if (foundUser) {
    if ((foundUser.subscription_plan != VILLAGE_SUPERUSER)) {
      throw new Error("Auth Error: the requesting user isn't village superuser");
    }
  } else {
    throw new Error("Auth error: the requesting user data not found");
  }
};