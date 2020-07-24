import handler from "../libs/handler-lib";
import Village from "../models/Village";
import { validateAdmin } from "../libs/villagevalidator";

export const getVillageProfile = handler(async (event, context) => {
  const villageId = event.pathParameters.idv;

  // Validate User First
  const identityId = event.requestContext.identity.cognitoIdentityId;
  await validateAdmin(identityId, villageId);

  const foundVillage = await Village.findById(villageId);

  if (!foundVillage) {
    throw new Error("Village not found");
  }

  return { message: "OK", village: foundVillage };
});