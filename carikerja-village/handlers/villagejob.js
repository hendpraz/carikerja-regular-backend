import handler from "../libs/handler-lib";
import VillageJob from "../models/VillageJob";
import VillageAcceptance from "../models/VillageAcceptance";
import { validateAdmin } from "../libs/villagevalidator";

export const createVillageJob = handler(async (event, context) => {
  console.log(event.body);
  const data = JSON.parse(event.body);

  // Validate User First
  const identityId = event.requestContext.identity.cognitoIdentityId;
  await validateAdmin(identityId, data.village, "Membuat pekerjaan baru.");

  const newJob = {};

  newJob.title = data.title;
  newJob.owner = data.owner;
  newJob.description = data.description;
  newJob.num_of_openings = data.num_of_openings;
  newJob.status = 'active';
  newJob.village = data.village;

  await VillageJob.create(newJob);

  return { message: "OK" };
});

export const listVillageJob = handler(async (event, context) => {
  const villageId = event.pathParameters.idv;

  // Validate User First
  const identityId = event.requestContext.identity.cognitoIdentityId;
  await validateAdmin(identityId, villageId);

  const foundJobs = await VillageJob.find(
    { village: villageId }
  ).populate('owner');

  return foundJobs;
});

export const getVillageJob = handler(async (event, context) => {
  const jobId = event.pathParameters.idj;
  const villageId = event.pathParameters.idv;

  // Validate User First
  const identityId = event.requestContext.identity.cognitoIdentityId;
  await validateAdmin(identityId, villageId);

  const foundJob = await VillageJob.findById(jobId).populate('owner');

  if (!foundJob) {
    throw new Error("Job not found");
  }

  return foundJob;
});

export const updateVillageJobDetail = handler(async (event, context) => {
  console.log(event.body);
  const data = JSON.parse(event.body);

  const jobId = event.pathParameters.idj;
  const villageId = event.pathParameters.idv;

  // Validate User First
  const identityId = event.requestContext.identity.cognitoIdentityId;
  await validateAdmin(identityId, villageId, "Mengubah detil pekerjaan.");

  const foundJob = await VillageJob.findById(jobId);

  if (!foundJob) {
    throw new Error("Job not found");
  }

  foundJob.title = data.title;
  foundJob.owner = data.owner;
  foundJob.description = data.description;
  foundJob.num_of_openings = data.num_of_openings;

  await foundJob.save();

  return { message: "OK" };
});

export const updateVillageJobStatus = handler(async (event, context) => {
  console.log(event.body);
  const data = JSON.parse(event.body);

  const jobId = event.pathParameters.idj;
  const villageId = event.pathParameters.idv;

  // Validate User First
  const identityId = event.requestContext.identity.cognitoIdentityId;
  await validateAdmin(identityId, villageId, "Mengubah status pekerjaan");

  const foundJob = await VillageJob.findById(jobId);

  if (!foundJob) {
    throw new Error("Job not found");
  }

  if ((data.status === "active") || (data.status === "inactive")) {
    foundJob.status = data.status;
  } else {
    throw new Error("Invalid job status");
  }

  await foundJob.save();

  return { message: "OK" };
});

export const completeVillageJob = handler(async (event, context) => {
  const jobId = event.pathParameters.idj;
  const villageId = event.pathParameters.idv;

  // Validate User First
  const identityId = event.requestContext.identity.cognitoIdentityId;
  await validateAdmin(identityId, villageId, "Mengonfirmasi penerimaan pekerjaan.");

  console.log(event.body);
  const data = JSON.parse(event.body);

  const foundJob = await VillageJob.findOne({_id: jobId, village: villageId});

  if (!foundJob) {
    throw new Error("Job not found");
  }

  const newVillageAcceptance = {};

  foundJob.num_of_openings -= 1;

  newVillageAcceptance.village_user = data.village_user;
  newVillageAcceptance.village_job = jobId;
  newVillageAcceptance.date = Date.now();

  await foundJob.save();
  await VillageAcceptance.create(newVillageAcceptance);

  return { message: "OK" };
});