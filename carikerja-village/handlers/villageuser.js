import handler from "../libs/handler-lib";
import VillageUser from '../models/VillageUser';
import { validateAdmin } from "../libs/villagevalidator";
import { validateSuperuser } from "../libs/villagevalidator";

// Village Subscription Plan Number
const VILLAGE_USER = 3;
const VILLAGE_ADMIN = 4;

/*
  *************
  VILLAGE ADMIN
  *************
  */

export const listVillageAdmin = handler(async (event, context) => {
  const villageId = event.pathParameters.idv;

  // Validate User First
  const identityId = event.requestContext.identity.cognitoIdentityId;
  await validateAdmin(identityId, villageId);

  const foundAdmins = await VillageUser.find(
    { subscription_plan: VILLAGE_ADMIN, village: villageId }
  );

  return foundAdmins;
});

export const getVillageAdmin = handler(async (event, context) => {
  const userId = event.pathParameters.idu;
  const villageId = event.pathParameters.idv;

  // Validate User First
  const identityId = event.requestContext.identity.cognitoIdentityId;
  await validateAdmin(identityId, villageId);

  const foundUser = await VillageUser.findOne(
    { _id: userId, subscription_plan: VILLAGE_ADMIN, village: villageId }
  );

  if (!foundUser) {
    throw new Error("Admin not found");
  }

  return foundUser;
});

export const updateVillageAdmin = handler(async (event, context) => {
  const userId = event.pathParameters.idu;
  const villageId = event.pathParameters.idv;

  console.log(event.body);
  const data = JSON.parse(event.body);

  // Validate User First
  const identityId = event.requestContext.identity.cognitoIdentityId;
  await validateAdmin(identityId, villageId, "Mengupdate data admin.");

  const foundUser = await VillageUser.findOne(
    { _id: userId, subscription_plan: VILLAGE_ADMIN, village: villageId }
  );

  if (!foundUser) {
    throw new Error("Admin not found");
  }

  foundUser.name = data.name;
  foundUser.phone_number = data.phone_number;
  foundUser.address = data.address;
  await foundUser.save();

  return { message: "OK" };
});

/*
  *************
  VILLAGE ADMIN (By Superuser)
  *************
  */

export const createVillageAdmin = handler(async (event, context) => {
  const userId = event.pathParameters.idu;

  console.log(event.body);
  const data = JSON.parse(event.body);

  // Validate User First
  const identityId = event.requestContext.identity.cognitoIdentityId;
  await validateSuperuser(identityId);

  const foundUser = await VillageUser.findById(userId);

  if (foundUser) {
    if (String(foundUser.village) == String(data.village)) {
      foundUser.subscription_plan = VILLAGE_ADMIN;
      foundUser.identity_id = data.identity_id;
      await foundUser.save();
    } else {
      throw new Error("Invalid combination of user and village");
    }
  } else {
    throw new Error("User not found");
  }

  return { message: "OK" };
});

export const revokeVillageAdmin = handler(async (event, context) => {
  const userId = event.pathParameters.idu;

  // Validate User First
  const identityId = event.requestContext.identity.cognitoIdentityId;
  await validateSuperuser(identityId);

  const foundUser = await VillageUser.findOne(
    { _id: userId, subscription_plan: VILLAGE_ADMIN }
  );

  if (!foundUser) {
    throw new Error("Admin not found");
  }

  foundUser.subscription_plan = VILLAGE_USER;
  foundUser.identity_id = "";
  await foundUser.save();

  return { message: "OK" };
});

/*
  ************
  VILLAGE USER
  ************
  */

export const createVillageUser = handler(async (event, context) => {
  console.log(event.body);
  const data = JSON.parse(event.body);

  // Validate User First
  const identityId = event.requestContext.identity.cognitoIdentityId;
  await validateAdmin(identityId, data.village, "Menambah data warga baru.");

  const newUser = {};

  newUser.name = data.name;
  newUser.phone_number = data.phone_number;
  newUser.address = data.address;
  newUser.status = 'active';
  newUser.subscription_plan = VILLAGE_USER;
  newUser.village = data.village;

  const newIdentityId = "";
  newUser.identity_id = newIdentityId;

  await VillageUser.create(newUser);

  return { message: "OK" };
});

export const listVillageUser  = handler(async (event, context) => {
  const villageId = event.pathParameters.idv;

  // Validate User First
  const identityId = event.requestContext.identity.cognitoIdentityId;
  await validateAdmin(identityId, villageId);

  const foundUsers = await VillageUser.find(
    { subscription_plan: VILLAGE_USER, village: villageId }
  );

  return foundUsers;
});

export const getVillageUser = handler(async (event, context) => {
  const userId = event.pathParameters.idu;
  const villageId = event.pathParameters.idv;

  // Validate User First
  const identityId = event.requestContext.identity.cognitoIdentityId;
  await validateAdmin(identityId, villageId);

  const foundUser = await VillageUser.findOne(
    { _id: userId, subscription_plan: VILLAGE_USER, village: villageId }
  );

  if (!foundUser) {
    throw new Error("User not found");
  }

  return foundUser;
});

export const updateVillageUser = handler(async (event, context) => {
  const userId = event.pathParameters.idu;
  const villageId = event.pathParameters.idv;

  console.log(event.body);
  const data = JSON.parse(event.body);

  // Validate User First
  const identityId = event.requestContext.identity.cognitoIdentityId;
  await validateAdmin(identityId, villageId, "Mengubah data warga.");

  const foundUser = await VillageUser.findOne(
    { _id: userId, subscription_plan: VILLAGE_USER, village: villageId }
  );

  if (!foundUser) {
    throw new Error("User not found");
  }

  foundUser.name = data.name;
  foundUser.phone_number = data.phone_number;
  foundUser.address = data.address;
  await foundUser.save();

  return { message: "OK" };
});

export const deleteVillageUser = handler(async (event, context) => {
  const userId = event.pathParameters.idu;
  const villageId = event.pathParameters.idv;

  // Validate User First
  const identityId = event.requestContext.identity.cognitoIdentityId;
  await validateAdmin(identityId, villageId, "Menghapus warga.");

  await VillageUser.deleteOne(
    { _id: userId, village: villageId }
  );

  return { message: "OK" };
});