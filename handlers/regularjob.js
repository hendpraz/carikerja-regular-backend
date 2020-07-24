import handler from "../libs/handler-lib";
import RegularJob from "../models/RegularJob";
import { validateJobposter } from "../libs/villagevalidator";

export const createRegularJob = handler(async (event, context) => {
  console.log(event.body);
  const data = JSON.parse(event.body);

  // Validate User First
  const identityId = event.requestContext.identity.cognitoIdentityId;
  await validateJobposter(identityId);

  const newJob = {};

  newJob.title = data.title;
  newJob.owner = data.owner;
  newJob.description = data.description;
  newJob.num_of_openings = data.num_of_openings;
  newJob.status = 'active';
  newJob.location = data.location;
  newJob.profession = data.profession;

  await RegularJob.create(newJob);

  return { message: "OK" };
});

export const getRegularJob = handler(async (event, context) => {
  return { message: "OK" };
});

export const updateRegularJobDetail = handler(async (event, context) => {
  return { message: "OK" };
});

export const updateRegularJobStatus = handler(async (event, context) => {
  return { message: "OK" };
});

export const completeRegularJob = handler(async (event, context) => {
  return { message: "OK" };
});