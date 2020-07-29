import handler from "../libs/handler-lib";
import RegularUser from "../models/RegularUser";
import RegularPlan from "../models/RegularPlan";
import { validateSuperuser } from "../libs/regularvalidator";
import { connectToDatabase } from "../libs/db";

const REGULAR_USER = 1;

export const createRegularUser = handler(async (event, context) => {
  console.log(event);
  await connectToDatabase();
  const data = JSON.parse(event.body);

  // Validate User First
  const identityId = event.requestContext.identity.cognitoIdentityId;

  const newUser = {};
  // newUser.name = data.name;
  // newUser.phone_number = data.phone_number;
  // newUser.whatsapp_number = data.whatsapp_number;
  // newUser.address = data.address;
  newUser.email = data.email;
  newUser.profile_picture = "default.jpg";
  newUser.status = 'active';
  newUser.subscription_plan = REGULAR_USER;

  newUser.identity_id = identityId;

  await RegularUser.create(newUser);

  return { message: "OK" };
});

export const getMyProfile = handler(async (event, context) => {
  console.log(event);
  await connectToDatabase();

  const identityId = event.requestContext.identity.cognitoIdentityId;
  const foundUser = await RegularUser.findOne({ identity_id: identityId });

  return foundUser;
});

export const getUserProfile = handler(async (event, context) => {
  console.log(event);
  await connectToDatabase();

  const userId = event.pathParameters.idu;
  const foundUser = await RegularUser.findById(userId);

  return foundUser;
});

export const updateMyProfile = handler(async (event, context) => {
  console.log(event);
  await connectToDatabase();

  const identityId = event.requestContext.identity.cognitoIdentityId;

  const foundUser = await RegularUser.findOne(
    { identity_id: identityId }
  );

  if (!foundUser) {
    throw new Error("User not found");
  }

  console.log(event.body);
  const data = JSON.parse(event.body);

  foundUser.name = data.name;
  foundUser.phone_number = data.phone_number;
  foundUser.address = data.address;
  foundUser.whatsapp_number = data.whatsapp_number;
  await foundUser.save();

  return { message: "OK" };
});

export const deactivateRegularUser = handler(async (event, context) => {
  console.log(event);
  // Validate User First
  const identityId = event.requestContext.identity.cognitoIdentityId;
  await validateSuperuser(identityId);

  const userId = event.pathParameters.idu;

  const foundUser = await RegularUser.findOne(
    { _id: userId }
  );

  if (!foundUser) {
    throw new Error("User not found");
  }

  foundUser.status = 'inactive';
  await foundUser.save();

  const foundRegularPlan = await RegularPlan.findOne({regular_user: foundUser._id });
  foundRegularPlan.status = 'inactive';
  foundRegularPlan.save();

  return { message: "OK" };
});