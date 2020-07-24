import handler from "../libs/handler-lib";
import Village from "../models/Village";
import { validateAdmin } from "../libs/villagevalidator";
import { validateSuperuser } from "../libs/villagevalidator";

export const createVillage = handler(async (event, context) => {
  const identityId = event.requestContext.identity.cognitoIdentityId;
  await validateSuperuser(identityId);

  return { foo: "bar" };
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

  return { message: "OK", village: foundVillage };
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

  const foundVillageActivities = await Village.find({ village: villageId });

  if (!foundVillageActivities) {
    throw new Error("Village Activity not found");
  }

  return { message: "OK", village_activities: foundVillageActivities };
});