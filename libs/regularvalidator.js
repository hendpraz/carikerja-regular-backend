import { connectToDatabase } from './db';
import RegularUser from '../models/RegularUser';
import RegularPlan from '../models/RegularPlan';

// Regular role
const REGULAR_JOBPOSTER = 2;

export const validateJobposter = async (identityId) => {
  await connectToDatabase();

  const foundUser = await RegularUser.findOne({
    identity_id: identityId
  });

  if (foundUser) {
    if ((foundUser.role != REGULAR_JOBPOSTER)) {
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