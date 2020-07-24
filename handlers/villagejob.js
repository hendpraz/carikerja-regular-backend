import handler from "../libs/handler-lib";
import VillageJob from '../models/VillageJob';
import { validateAdmin } from "../libs/villagevalidator";

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
  const jobId = event.pathParameters.idJ;
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