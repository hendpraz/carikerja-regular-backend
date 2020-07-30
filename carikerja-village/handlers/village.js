import handler from "../libs/handler-lib";
import Village from "../models/Village";
import VillagePlan from "../models/VillagePlan";
import { validateAdmin } from "../libs/villagevalidator";
import { validateSuperuser } from "../libs/villagevalidator";
import VillageUser from "../models/VillageUser";
import { connectToDatabase } from "../libs/db";
import VillageActivity from "../models/VillageActivity";

export const createVillage = handler(async (event, context) => {
  console.log(event.body);
  const data = JSON.parse(event.body);

  const identityId = event.requestContext.identity.cognitoIdentityId;
  await validateSuperuser(identityId);

  const newVillage = {};
  newVillage.name = data.name;
  newVillage.city = data.city;
  newVillage.province = data.province;
  newVillage.country = data.country;

  const newVillageObj = await Village.create(newVillage);

  const newVillagePlan = {};
  newVillagePlan.village = newVillageObj._id;
  newVillagePlan.subscription_plan = data.subscription_plan;

  // BUSINESS LOGIC
  let tempDate = Date.now();
  tempDate.setDate(tempDate.getDate() + 30);

  newVillagePlan.expiry_date = tempDate;
  newVillagePlan.status = "active";

  await VillagePlan.create(newVillagePlan);

  return { message: "OK" };
});

export const getMyVillageProfile = handler(async (event, context) => {
  await connectToDatabase();
  console.log(event);
  const identityId = event.requestContext.identity.cognitoIdentityId;
  const foundUser = await VillageUser.findOne({ identity_id: identityId });
  const foundVillage = await Village.findById(foundUser.village);

  return foundVillage;
});

export const getVillageProfile = handler(async (event, context) => {
  const villageId = event.pathParameters.idv;

  // Validate User First
  const identityId = event.requestContext.identity.cognitoIdentityId;
  await validateAdmin(identityId, villageId);

  const foundVillage = await Village.findById(villageId);

  if (!foundVillage) {
    throw new Error("Village not found");
  }

  return foundVillage;
});

export const updateVillageProfile = handler(async (event, context) => {
  console.log(event.body);
  const data = JSON.parse(event.body);
  const villageId = event.pathParameters.idv;

  // Validate User First
  const identityId = event.requestContext.identity.cognitoIdentityId;
  await validateSuperuser(identityId);

  const foundVillage = await Village.findOne(
    { village: villageId }
  );

  if (!foundVillage) {
    throw new Error("Village not found");
  }

  foundVillage.name = data.name;
  foundVillage.city = data.city;
  foundVillage.province = data.province;
  foundVillage.country = data.country;
  await foundVillage.save();

  return { message: "OK" };
});

export const listVillageActivity = handler(async (event, context) => {
  const villageId = event.pathParameters.idv;

  // Validate User First
  const identityId = event.requestContext.identity.cognitoIdentityId;
  await validateAdmin(identityId, villageId);

  const foundVillageActivities = await VillageActivity.find({ village: villageId }).populate('village_user');

  if (!foundVillageActivities) {
    throw new Error("Village Activity not found");
  }

  return foundVillageActivities;
});