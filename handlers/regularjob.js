import handler from "../libs/handler-lib";
import RegularJob from "../models/RegularJob";
import { validateJobposter } from "../libs/regularvalidator";
import RegularUser from "../models/RegularUser";
import { connectToDatabase } from "../libs/db";
import RegularApplication from "../models/RegularApplication";

export const getMyApplicationOnJob = handler(async (event, context) => {
  console.log(event);
  await connectToDatabase();

  const identityId = event.requestContext.identity.cognitoIdentityId;
  const jobId = event.pathParameters.idj;

  const foundUser = await RegularUser.findOne({ identity_id: identityId});
  const foundApplication = await RegularApplication.findOne({regular_user: foundUser._id, regular_job: jobId});

  return foundApplication;
});

export const applyRegularJob = handler(async (event, context) => {
  console.log(event);
  await connectToDatabase();
  const data = JSON.parse(event.body);
  const identityId = event.requestContext.identity.cognitoIdentityId;
  const jobId = event.pathParameters.idj;

  const foundUser = await RegularUser.findOne({ identity_id: identityId});

  const foundApplication = await RegularApplication.findOne({regular_user: foundUser._id, regular_job: jobId});
  if (foundApplication) {
    throw new Error("User already applied this job");
  }
  const newApplication = {
    regular_user: foundUser._id,
    regular_job: jobId,
    status: "sent",
    attachment: data.attachment,
    cover_letter: data.cover_letter
  };

  await RegularApplication.create(newApplication);

  return { message: "OK" };
});

export const createRegularJob = handler(async (event, context) => {
  console.log(event);
  const data = JSON.parse(event.body);

  // Validate User First
  const identityId = event.requestContext.identity.cognitoIdentityId;
  await validateJobposter(identityId);

  const foundUser = await RegularUser.findOne({ identity_id: identityId});

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
  console.log(event);
  await connectToDatabase();

  const jobId = event.pathParameters.idj;

  const foundJob = await RegularJob.findById(jobId)
    .populate('owner');

  if (!foundJob) {
    throw new Error("Job not found");
  }

  return foundJob;
});

export const listMyJob = handler(async (event, context) => {
  console.log(event);
  await connectToDatabase();

  const identityId = event.requestContext.identity.cognitoIdentityId;
  const foundUser = await RegularUser.findOne({ identity_id: identityId });

  const foundJob = await RegularJob.find({owner: foundUser._id});

  if (!foundJob) {
    throw new Error("Job not found");
  }

  return foundJob;
});

export const updateRegularJobDetail = handler(async (event, context) => {
  console.log(event);
  const jobId = event.pathParameters.idj;
  const data = JSON.parse(event.body);

  // Validate User First
  const identityId = event.requestContext.identity.cognitoIdentityId;
  await validateJobposter(identityId);

  const foundUser = await RegularUser.findOne({ identity_id: identityId});
  const foundJob = await RegularJob.findById(jobId);

  if ((!foundUser) || (!foundJob)) {
    throw new Error("User or job not found");
  } else if (String(foundJob.owner) == String(foundUser._id)) {
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
  console.log(event);
  const jobId = event.pathParameters.idj;
  const data = JSON.parse(event.body);

  // Validate User First
  const identityId = event.requestContext.identity.cognitoIdentityId;
  await validateJobposter(identityId);

  const foundUser = await RegularUser.findOne({ identity_id: identityId});
  const foundJob = await RegularJob.findById(jobId);

  if ((!foundUser) || (!foundJob)) {
    throw new Error("User or job not found");
  } else if (String(foundJob.owner) == String(foundUser._id)) {
    foundJob.status = data.status;
  } else {
    throw new Error("Unauthorized update action");
  }

  await foundJob.save();

  return { message: "OK" };
});