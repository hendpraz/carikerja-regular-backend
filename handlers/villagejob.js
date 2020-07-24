import handler from "../libs/handler-lib";
import VillageJob from '../models/VillageJob';
import { validateAdmin } from "../libs/villagevalidator";

export const createVillageJob = handler(async (event, context) => {
  console.log(event.body);
  const data = JSON.parse(event.body);

  // Validate User First
  const identityId = event.requestContext.identity.cognitoIdentityId;
  await validateAdmin(identityId, data.village);

  const newJob = {};

  newJob.title = data.title;
  newJob.owner = data.owner;
  newJob.description = data.description;
  newJob.num_of_openings = data.num_of_openings;
  newJob.status = 'active';
  newJob.location = data.location;
  newJob.profession = data.profession;

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
  );

  return { message: "OK", job_list: foundJobs };
});

export const getVillageJob = handler(async (event, context) => {
  const jobId = event.pathParameters.idj;
  const villageId = event.pathParameters.idv;

  // Validate User First
  const identityId = event.requestContext.identity.cognitoIdentityId;
  await validateAdmin(identityId, villageId);

  const foundJob = await VillageJob.findById(jobId);

  if (!foundJob) {
    throw new Error("Job not found");
  }

  return { message: "OK", job: foundJob };
});