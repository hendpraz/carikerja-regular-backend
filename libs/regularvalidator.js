import { connectToDatabase } from './db';
import RegularUser from '../models/RegularUser';

// Village Subscription Plan
const REGULAR_JOBPOSTER = 2;
const REGULAR_SUPERUSER = 8;

export const validateJobposter = async (identityId) => {
  await connectToDatabase();

  const foundUser = RegularUser.findOne({
    user_id: identityId
  });

  if (foundUser) {
    if ((foundUser.subscription_plan != REGULAR_JOBPOSTER)) {
        throw new Error("Auth error: the requesting user is not a jobposter");
    }
  } else {
    throw new Error("Auth error: the requesting user data not found");
  }
};

export const validateSuperuser = async (identityId) => {
  await connectToDatabase();

  const foundUser = RegularUser.findOne({
    user_id: identityId
  });

  if (foundUser) {
    if ((foundUser.subscription_plan != REGULAR_SUPERUSER)) {
      throw new Error("Auth Error: the requesting user isn't regular superuser");
    }
  } else {
    throw new Error("Auth error: the requesting user data not found");
  }
};