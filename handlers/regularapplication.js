import handler from "../libs/handler-lib";
import RegularUser from "../models/RegularUser";
import RegularApplication from "../models/RegularApplication";
import {validateJobposter} from "../libs/regularvalidator";

export const listMyApplications = handler(async (event, context) => {
  const identityId = event.requestContext.identity.cognitoIdentityId;
  
  const userFound = await RegularUser.findOne({ user_id: identityId });
  const applicationFound = await RegularApplication.find({ regular_user: userFound._id });

  return { message: "OK", applications: applicationFound };
});

export const listMyJobApplications = handler(async (event, context) => {
  const jobId = event.pathParameters.idj;
  
  // Validate User First
  const identityId = event.requestContext.identity.cognitoIdentityId;
  await validateJobposter(identityId);

  const foundUser = RegularUser.findOne({ user_id: identityId});
  const foundJob = RegularJob.findById(jobId);
  
  let foundRegularApplication;

  if ((!foundUser) || (!foundJob)) {
    throw new Error("User or job not found");
  } else if (foundJob.owner == foundUser._id) {
    foundJob.status = data.status;

    foundRegularApplication = await RegularApplication.find({ regular_job: jobId });
  } else {
    throw new Error("Unauthorized update action");
  }

  return { message: "OK", applications: foundRegularApplication };
});

export const getApplication = handler(async (event, context) => {
  // Either user or jobposter
  // IF JOBPOSTER: Change application status to 'reviewed'
  return { message: "OK" };
});

export const rejectApplication = handler(async (event, context) => {
  return { message: "OK" };
});