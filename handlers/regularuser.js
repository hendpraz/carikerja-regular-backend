import handler from "../libs/handler-lib";
import RegularUser from "../models/RegularUser";
import { validateSuperuser } from "../libs/villagevalidator";

const REGULAR_USER = 1;
const REGULAR_JOBPOSTER = 2;

export const createRegularUser = handler(async (event, context) => {
  console.log(event.body);
  const data = JSON.parse(event.body);

  const newUser = {};

  newUser.name = data.name;
  newUser.email = data.email;
  newUser.phone_number = data.phone_number;
  newUser.whatsapp_number = data.whatsapp_number;
  newUser.profile_picture = "default.jpg";
  newUser.address = data.address;
  newUser.status = 'active';
  newUser.subscription_plan = REGULAR_USER;
  
  // TODO: Cognito signup

  newUser.user_id = "";

  await RegularUser.create(newUser);

  return { message: "OK" };
});

export const updateRegularUser = handler(async (event, context) => {
  // Validate User First
  const userId = event.pathParameters.idu;
  const identityId = event.requestContext.identity.cognitoIdentityId;
  if (identityId != userId) {
    throw new Error("Unauthorized update action by user");
  }

  console.log(event.body);
  const data = JSON.parse(event.body);

  const foundUser = await VillageUser.findOne(
    { user_id: userId }
  );

  if (!foundUser) {
    throw new Error("User not found");
  }

  foundUser.name = data.name;
  foundUser.phone_number = data.phone_number;
  foundUser.address = data.address;
  await foundUser.save();

  return { message: "OK" };
});

export const createRegularJobposter = handler(async (event, context) => {
  // Validate User First
  const identityId = event.requestContext.identity.cognitoIdentityId;
  await validateSuperuser(identityId);

  const userId = event.pathParameters.idu;

  const foundUser = await VillageUser.findOne(
    { user_id: userId, subscription_plan: REGULAR_USER }
  );

  if (!foundUser) {
    throw new Error("User not found");
  }

  foundUser.subscription_plan = REGULAR_JOBPOSTER;
  await foundUser.save();

  return { message: "OK" };
});

export const revokeJobposter = handler(async (event, context) => {
  // Validate User First
  const identityId = event.requestContext.identity.cognitoIdentityId;
  await validateSuperuser(identityId);

  const userId = event.pathParameters.idu;

  const foundUser = await VillageUser.findOne(
    { user_id: userId, subscription_plan: REGULAR_USER}
  );

  if (!foundUser) {
    throw new Error("User not found");
  }

  foundUser.subscription_plan = REGULAR_USER;
  await foundUser.save();

  return { message: "OK" };
});

export const deactivateRegularUser = handler(async (event, context) => {
  // Validate User First
  const identityId = event.requestContext.identity.cognitoIdentityId;
  await validateSuperuser(identityId);

  const userId = event.pathParameters.idu;

  const foundUser = await VillageUser.findOne(
    { user_id: userId, subscription_plan: REGULAR_USER}
  );

  if (!foundUser) {
    throw new Error("User not found");
  }

  foundUser.status = 'inactive';
  await foundUser.save();

  return { message: "OK" };
});