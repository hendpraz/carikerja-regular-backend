import handler from "../libs/handler-lib";

export const listMyApplications = handler(async (event, context) => {
  return { message: "OK" };
});

export const listMyJobApplications = handler(async (event, context) => {
  return { message: "OK" };
});

export const getApplication = handler(async (event, context) => {
  // Either user or jobposter
  // IF JOBPOSTER: Change application status to 'reviewed'
  return { message: "OK" };
});

export const rejectApplication = handler(async (event, context) => {
  return { message: "OK" };
});