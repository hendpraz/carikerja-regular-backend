import handler from "../libs/handler-lib";
import RegularUser from "../models/RegularUser";
import RegularPlan from "../models/RegularPlan";
import { validateSuperuser } from "../libs/regularvalidator";

const REGULAR_USER = 1;

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

  // CREATE REGULAR PLAN

  newUser.identity_id = "";

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

  const foundUser = await RegularUser.findOne(
    { identity_id: userId }
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

export const deactivateRegularUser = handler(async (event, context) => {
  // Validate User First
  const identityId = event.requestContext.identity.cognitoIdentityId;
  await validateSuperuser(identityId);

  const userId = event.pathParameters.idu;

  const foundUser = await RegularUser.findOne(
    { identity_id: userId, subscription_plan: REGULAR_USER}
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