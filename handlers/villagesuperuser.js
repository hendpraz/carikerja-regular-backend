import handler from "../libs/handler-lib";
import Village from "../models/Village";
import { validateSuperuser } from "../libs/villagevalidator";

/*
  *******
  VILLAGE
  *******
  */

export const createVillage = handler(async (event, context) => {
  const identityId = event.requestContext.identity.cognitoIdentityId;
  await validateSuperuser(identityId);

  return { foo: "bar" };
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

/*
  *************************
  VILLAGE SUBSCRIPTION PLAN
  *************************
  */

export const renewVillageSubscription = handler(async (event, context) => {
  const identityId = event.requestContext.identity.cognitoIdentityId;
  await validateSuperuser(identityId);

  return { foo: "bar" };
});

export const updateVillageSubscription = handler(async (event, context) => {
  const identityId = event.requestContext.identity.cognitoIdentityId;
  await validateSuperuser(identityId);

  return { foo: "bar" };
});

export const stopVillageSubscription = handler(async (event, context) => {
  const identityId = event.requestContext.identity.cognitoIdentityId;
  await validateSuperuser(identityId);

  return { foo: "bar" };
});