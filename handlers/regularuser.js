import handler from "../libs/handler-lib";
import RegularUser from "../models/RegularUser";
import RegularPlan from "../models/RegularPlan";
import { connectToDatabase } from "../libs/db";

// User role
const REGULAR_USER = 1;

export const createMyAccount = handler(async (event, context) => {
  console.log(event);
  await connectToDatabase();
  const data = JSON.parse(event.body);

  // Validate User First
  const identityId = event.requestContext.identity.cognitoIdentityId;

  const newUser = {
    email: data.email,
    status: "active",
    role: REGULAR_USER
  };

  newUser.identity_id = identityId;
  await RegularUser.create(newUser);

  return { message: "OK" };
});

export const getMyProfile = handler(async (event, context) => {
  console.log(event);
  await connectToDatabase();

  const identityId = event.requestContext.identity.cognitoIdentityId;
  const foundUser = await RegularUser.findOne({ identity_id: identityId });
  if (!foundUser) {
    throw new Error("User not found");
  }

  return foundUser;
});

export const getUserProfile = handler(async (event, context) => {
  console.log(event);
  await connectToDatabase();

  const userId = event.pathParameters.idu;
  const foundUser = await RegularUser.findById(userId);
  if (!foundUser) {
    throw new Error("User not found");
  }
  return foundUser;
});

export const updateMyProfile = handler(async (event, context) => {
  console.log(event);
  await connectToDatabase();
  const data = JSON.parse(event.body);
  const identityId = event.requestContext.identity.cognitoIdentityId;

  const foundUser = await RegularUser.findOne(
    { identity_id: identityId }
  );
  foundUser.name = data.name;
  foundUser.phone_number = data.phone_number;
  foundUser.address = data.address;
  foundUser.whatsapp_number = data.whatsapp_number;
  await foundUser.save();

  return { message: "OK" };
});

export const deactivateMyAccount = handler(async (event, context) => {
  // Validate User First
  const identityId = event.requestContext.identity.cognitoIdentityId;
  const foundUser = await RegularUser.findOne(
    { identity_id: identityId }
  );

  foundUser.status = "inactive";
  await foundUser.save();

  const foundRegularPlan = await RegularPlan.findOne({regular_user: foundUser._id });
  foundRegularPlan.status = "inactive";
  foundRegularPlan.save();

  return { message: "OK" };
});