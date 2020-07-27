import handler from "../libs/handler-lib";
import RegularUser from "../models/RegularUser";
import RegularPlan from "../models/RegularPlan";
import { validateSuperuser } from "../libs/regularvalidator";

const REGULAR_USER = 1;
const REGULAR_JOBPOSTER = 2;

export const createRegularJobposter = handler(async (event, context) => {
  // Validate User First
  const identityId = event.requestContext.identity.cognitoIdentityId;
  await validateSuperuser(identityId);

  const userIdentityId = event.pathParameters.uid;

  const foundUser = await RegularUser.findOne(
    { identity_id: userIdentityId, subscription_plan: REGULAR_USER }
  );

  if (!foundUser) {
    throw new Error("User not found");
  }

  foundUser.subscription_plan = REGULAR_JOBPOSTER;
  await foundUser.save();

  const foundRegularPlan = await RegularPlan.findOne({regular_user: foundUser._id });
  
  foundRegularPlan.subscription_plan = REGULAR_JOBPOSTER;
  
  let tempDate = Date.now();
  tempDate.setDate(tempDate.getDate() + 30);

  foundRegularPlan.expiry_date = tempDate;
  foundRegularPlan.status = 'active';
  foundRegularPlan.save();

  return { message: "OK" };
});

export const revokeJobposter = handler(async (event, context) => {
  // Validate User First
  const identityId = event.requestContext.identity.cognitoIdentityId;
  await validateSuperuser(identityId);

  const userIdentityId = event.pathParameters.uid;

  const foundUser = await RegularUser.findOne(
    { identity_id: userIdentityId, subscription_plan: REGULAR_USER}
  );

  if (!foundUser) {
    throw new Error("User not found");
  }

  foundUser.subscription_plan = REGULAR_USER;
  await foundUser.save();

  const foundRegularPlan = await RegularPlan.findOne({regular_user: foundUser._id });
  
  foundRegularPlan.subscription_plan = REGULAR_USER;
  foundRegularPlan.status = 'inactive';
  foundRegularPlan.save();

  return { message: "OK" };
});