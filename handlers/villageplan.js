import handler from "../libs/handler-lib";
import { validateSuperuser } from "../libs/villagevalidator";
import VillagePlan from "../models/VillagePlan";
import Village from "../models/Village";

export const renewVillageSubscription = handler(async (event, context) => {
  const identityId = event.requestContext.identity.cognitoIdentityId;
  await validateSuperuser(identityId);

  const data = JSON.parse(event.body);
  const villagePlanId = event.pathParameters.idvp;
  const villagePlan = await VillagePlan.findById(villagePlanId);

  villagePlan.expiry_date.setDate(villagePlan.expiry_date.getDate() + data.days);
  await villagePlan.save();

  return { message: "OK" };
});

export const updateVillageSubscription = handler(async (event, context) => {
  const identityId = event.requestContext.identity.cognitoIdentityId;
  await validateSuperuser(identityId);

  const data = JSON.parse(event.body);
  const villagePlanId = event.pathParameters.idvp;
  const villagePlan = await VillagePlan.findById(villagePlanId);

  villagePlan.subscription_plan = data.subscription_plan;
  await villagePlan.save();

  return { message: "OK" };
});

export const stopVillageSubscription = handler(async (event, context) => {
  const identityId = event.requestContext.identity.cognitoIdentityId;
  await validateSuperuser(identityId);

  const villageId = event.pathParameters.idv;
  const foundVillagePlan = await Village.findOne({ village: villageId });

  foundVillagePlan.status = 'inactive';

  villagePlan.subscription_plan = data.subscription_plan;
  await villagePlan.save();

  return { message: "OK" };
});