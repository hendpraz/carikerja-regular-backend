import handler from "../libs/handler-lib";
import RegularUser from "../models/RegularUser";
import RegularApplication from "../models/RegularApplication";
import {validateJobposter} from "../libs/regularvalidator";

const REGULAR_JOBPOSTER = 2;

export const listMyApplications = handler(async (event, context) => {
  const identityId = event.requestContext.identity.cognitoIdentityId;
  
  const userFound = await RegularUser.findOne({ identity_id: identityId });
  const applicationFound = await RegularApplication.find({ regular_user: userFound._id });

  return { message: "OK", applications: applicationFound };
});

export const listMyJobApplications = handler(async (event, context) => {
  const jobId = event.pathParameters.idj;
  
  // Validate User First
  const identityId = event.requestContext.identity.cognitoIdentityId;
  await validateJobposter(identityId);

  const foundUser = RegularUser.findOne({ identity_id: identityId});
  const foundJob = RegularJob.findById(jobId);
  
  let foundRegularApplication;

  if ((!foundUser) || (!foundJob)) {
    throw new Error("User or job not found");
  } else if (foundJob.owner == foundUser._id) {
    foundRegularApplication = await RegularApplication.find({ regular_job: jobId });
  } else {
    throw new Error("Unauthorized update action");
  }

  return { message: "OK", applications: foundRegularApplication };
});

export const getApplication = handler(async (event, context) => {
  // Either user or jobposter
  // IF JOBPOSTER: Change application status to 'reviewed'
  const applicationId = event.pathParameters.ida;
  
  const identityId = event.requestContext.identity.cognitoIdentityId;

  const foundRegularApplication = await RegularApplication.findById(applicationId)
    .populate('regular_job');
  const foundUser = await RegularUser.findOne({ identityId });

  if ((!foundRegularApplication)) {
    throw new Error("Application or job not found");
  } else if (foundUser.subscription_plan == REGULAR_JOBPOSTER) {
    if (foundRegularApplication.regular_job.owner != foundUser._id) {
      throw new Error("Unauthorized action by jobposter")
    } else if (foundRegularApplication.status == 'sent') {
      foundRegularApplication.status = 'reviewed';
      foundRegularApplication.save();
    }
  } else if ((foundRegularApplication.regular_user != foundUser._id)) {
    throw new Error("Unauthorized action by regular user");
  }

  return { message: "OK", application: foundRegularApplication };
});

export const acceptApplication = handler(async (event, context) => {
  const applicationId = event.pathParameters.ida;
  
  console.log(event.body);
  const data = JSON.parse(event.body);

  // Validate User First
  const identityId = event.requestContext.identity.cognitoIdentityId;
  await validateJobposter(identityId);

  const foundUser = await RegularUser.findOne({ identity_id: identityId});
  const foundRegularApplication = await RegularApplication.findById(applicationId)
    .populate('regular_job');
  
  if ((!foundUser) || (!foundJob)) {
    throw new Error("User or job not found");
  } else if (foundRegularApplication.regular_job.owner == foundUser._id) {
    foundRegularApplication.num_of_openings -= 1;
    foundRegularApplication.status = 'accepted';
    await foundRegularApplication.save();
  } else {
    throw new Error("Unauthorized update action");
  }

  await foundJob.save();

  return { message: "OK" };
});

export const rejectApplication = handler(async (event, context) => {
  const applicationId = event.pathParameters.ida;
  
  console.log(event.body);
  const data = JSON.parse(event.body);

  // Validate User First
  const identityId = event.requestContext.identity.cognitoIdentityId;
  await validateJobposter(identityId);

  const foundUser = await RegularUser.findOne({ identity_id: identityId});
  const foundRegularApplication = await RegularApplication.findById(applicationId)
    .populate('regular_job');
  
  if ((!foundUser) || (!foundJob)) {
    throw new Error("User or job not found");
  } else if (foundRegularApplication.regular_job.owner == foundUser._id) {
    foundRegularApplication.status = 'rejected';
    await foundRegularApplication.save();
  } else {
    throw new Error("Unauthorized update action");
  }

  await foundJob.save();

  return { message: "OK" };
});