import { connectToDatabase } from './db';
import RegularUser from '../models/RegularUser';
import RegularPlan from '../models/RegularPlan';

// Regular Subscription Plan
const REGULAR_JOBPOSTER = 2;
const REGULAR_SUPERUSER = 8;

export const validateJobposter = async (identityId) => {
  await connectToDatabase();

  const foundUser = await RegularUser.findOne({
    identity_id: identityId
  });

  if (foundUser) {
    if ((foundUser.subscription_plan != REGULAR_JOBPOSTER)) {
        throw new Error("Auth error: the requesting user is not a jobposter");
    }
  } else {
    throw new Error("Auth error: the requesting user data not found");
  }

  const foundRegularPlan = await RegularPlan.findOne({regular_user: foundUser._id});

  // Check if inactive
  if (foundRegularPlan.status == "inactive") {
    throw new Error("Auth error: the requesting user's plan is inactive");
  } else if (foundRegularPlan.expiry_date < Date.now()) {
    throw new Error("Auth error: user is no longer a jobposter");
  }
};

export const validateSuperuser = async (identityId) => {
  await connectToDatabase();

  const foundUser = await RegularUser.findOne({
    identity_id: identityId
  });

  if (foundUser) {
    if ((foundUser.subscription_plan != REGULAR_SUPERUSER)) {
      throw new Error("Auth Error: the requesting user isn't regular superuser");
    }
  } else {
    throw new Error("Auth error: the requesting user data not found");
  }
};