import handler from "../libs/handler-lib";
import VillageUser from '../models/VillageUser';
import { connectToDatabase } from '../libs/db';

// Village Subscription Plan
const VILLAGE_SUPERUSER = 7;

const validateSuperuser = (identityId) => {
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
}

/* 
  *******
  VILLAGE 
  *******
  */

export const createVillage = handler(async (event, context) => {
  const identityId = event.requestContext.identity.cognitoIdentityId;
  validateSuperuser(identityId);

  return { foo: "bar" };
});

export const deactivateVillage = handler(async (event, context) => {
  const identityId = event.requestContext.identity.cognitoIdentityId;
  validateSuperuser(identityId);

  return { foo: "bar" };
});

export const updateVillagePlan = handler(async (event, context) => {
  const identityId = event.requestContext.identity.cognitoIdentityId;
  validateSuperuser(identityId);

  return { foo: "bar" };
});

export const updateVillageProfile = handler(async (event, context) => {
  console.log(event.body);
  const data = JSON.parse(event.body);

  // Validate User First
  const identityId = event.requestContext.identity.cognitoIdentityId;
  validateSuperuser(identityId);

  // await connectToDatabase();
  const foundVillage = await Village.findOne(
    { village: data.village }
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
  validateSuperuser(identityId);

  return { foo: "bar" };
});

export const updateVillageSubscription = handler(async (event, context) => {
  const identityId = event.requestContext.identity.cognitoIdentityId;
  validateSuperuser(identityId);

  return { foo: "bar" };
});

export const stopVillageSubscription = handler(async (event, context) => {
  const identityId = event.requestContext.identity.cognitoIdentityId;
  validateSuperuser(identityId);

  return { foo: "bar" };
});