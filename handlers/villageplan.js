import handler from "../libs/handler-lib";
import { validateSuperuser } from "../libs/villagevalidator";

export const renewVillageSubscription = handler(async (event, context) => {
  const identityId = event.requestContext.identity.cognitoIdentityId;
  await validateSuperuser(identityId);

  return { foo: "bar" };
});

export const updateVillageSubscription = handler(async (event, context) => {
  const identityId = event.requestContext.identity.cognitoIdentityId;
  await validateSuperuser(identityId);

  return { foo: "bar" };
});

export const stopVillageSubscription = handler(async (event, context) => {
  const identityId = event.requestContext.identity.cognitoIdentityId;
  await validateSuperuser(identityId);

  return { foo: "bar" };
});