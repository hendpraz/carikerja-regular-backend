import handler from "../libs/handler-lib";
import RegularJob from "../models/RegularJob";
import { validateJobposter } from "../libs/villagevalidator";
import RegularUser from "../models/RegularUser";
import RegularApplication from "../models/RegularApplication";

export const createRegularJob = handler(async (event, context) => {
  console.log(event.body);
  const data = JSON.parse(event.body);

  // Validate User First
  const identityId = event.requestContext.identity.cognitoIdentityId;
  await validateJobposter(identityId);

  const foundUser = RegularUser.findOne({ user_id: identityId});

  const newJob = {};

  newJob.title = data.title;
  newJob.owner = foundUser._id;
  newJob.description = data.description;
  newJob.num_of_openings = data.num_of_openings;
  newJob.status = 'active';
  newJob.location = data.location;
  newJob.profession = data.profession;

  await RegularJob.create(newJob);

  return { message: "OK" };
});

export const getRegularJob = handler(async (event, context) => {
  const jobId = event.pathParameters.idj;

  const foundJob = await RegularJob.findById(jobId);

  if (!foundJob) {
    throw new Error("Job not found");
  }

  return { message: "OK", job: foundJob };
});

export const updateRegularJobDetail = handler(async (event, context) => {
  const jobId = event.pathParameters.idj;
  
  console.log(event.body);
  const data = JSON.parse(event.body);

  // Validate User First
  const identityId = event.requestContext.identity.cognitoIdentityId;
  await validateJobposter(identityId);

  const foundUser = RegularUser.findOne({ user_id: identityId});
  const foundJob = RegularJob.findById(jobId);
  
  if ((!foundUser) || (!foundJob)) {
    throw new Error("User or job not found");
  } else if (foundJob.owner == foundUser._id) {
    foundJob.title = data.title;
    foundJob.description = data.description;
    foundJob.num_of_openings = data.num_of_openings;
    foundJob.location = data.location;
    foundJob.profession = data.profession;
  } else {
    throw new Error("Unauthorized update action");
  }

  await foundJob.save();

  return { message: "OK" };
});

export const updateRegularJobStatus = handler(async (event, context) => {
  const jobId = event.pathParameters.idj;
  
  console.log(event.body);
  const data = JSON.parse(event.body);

  // Validate User First
  const identityId = event.requestContext.identity.cognitoIdentityId;
  await validateJobposter(identityId);

  const foundUser = RegularUser.findOne({ user_id: identityId});
  const foundJob = RegularJob.findById(jobId);
  
  if ((!foundUser) || (!foundJob)) {
    throw new Error("User or job not found");
  } else if (foundJob.owner == foundUser._id) {
    foundJob.status = data.status;
  } else {
    throw new Error("Unauthorized update action");
  }

  await foundJob.save();

  return { message: "OK" };
});

export const completeRegularJob = handler(async (event, context) => {
  const jobId = event.pathParameters.idj;
  
  console.log(event.body);
  const data = JSON.parse(event.body);

  // Validate User First
  const identityId = event.requestContext.identity.cognitoIdentityId;
  await validateJobposter(identityId);

  const foundUser = RegularUser.findOne({ user_id: identityId});
  const foundJob = RegularJob.findById(jobId);
  
  if ((!foundUser) || (!foundJob)) {
    throw new Error("User or job not found");
  } else if (foundJob.owner == foundUser._id) {
    foundJob.status = data.status;

    const newRegularApplication = {};

    newRegularApplication.regular_user = data.regular_user;
    newRegularApplication.regular_job = data.regular_job;
    newRegularApplication.status = 'accepted';

    await RegularApplication.create(newRegularApplication);
  } else {
    throw new Error("Unauthorized update action");
  }

  await foundJob.save();

  return { message: "OK" };
});