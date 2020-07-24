import handler from "../libs/handler-lib";
import VillageUser from '../models/VillageUser';
import { validateAdmin } from "../libs/villagevalidator";

// Village Subscription Plan Number
const VILLAGE_USER = 3;
const VILLAGE_ADMIN = 4;

/*
  *************
  VILLAGE ADMIN
  *************
  */

export const createVillageAdmin = handler(async (event, context) => {
  console.log(event.body);
  const data = JSON.parse(event.body);

  // Validate User First
  const identityId = event.requestContext.identity.cognitoIdentityId;
  await validateAdmin(identityId, data.village, "Membuat admin baru.");

  const foundUser = VillageUser.findOne({
    user_id: data.user_id
  });

  if (foundUser) {
    if (foundUser.village == data.village) {
      foundUser.subscription_plan = VILLAGE_ADMIN;
      await foundUser.save();
    } else {
      throw new Error("Invalid combination of user and village");
    }
  } else {
    throw new Error("User not found");
  }

  return { message: "OK" };
});

export const listVillageAdmin = handler(async (event, context) => {
  const villageId = event.pathParameters.idv;

  // Validate User First
  const identityId = event.requestContext.identity.cognitoIdentityId;
  await validateAdmin(identityId, villageId);

  const foundAdmins = await VillageUser.find(
    { subscription_plan: VILLAGE_ADMIN, village: villageId }
  );

  return { message: "OK", admin_list: foundAdmins };
});

export const getVillageAdmin = handler(async (event, context) => {
  const userId = event.pathParameters.idu;
  const villageId = event.pathParameters.idv;

  // Validate User First
  const identityId = event.requestContext.identity.cognitoIdentityId;
  await validateAdmin(identityId, villageId);

  const foundUser = await VillageUser.findOne(
    { user_id: userId, subscription_plan: VILLAGE_ADMIN, village: villageId }
  );

  if (!foundUser) {
    throw new Error("Admin not found");
  }

  return { message: "OK", admin: foundUser };
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
    { user_id: userId, subscription_plan: VILLAGE_ADMIN, village: villageId }
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

export const revokeVillageAdmin = handler(async (event, context) => {
  console.log(event.body);
  const data = JSON.parse(event.body);

  // Validate User First
  const identityId = event.requestContext.identity.cognitoIdentityId;
  await validateAdmin(identityId, data.village, "Mencabut akses admin.");

  const foundUser = await VillageUser.findOne(
    { user_id: data.user_id, subscription_plan: VILLAGE_ADMIN, village: data.village }
  );

  if (!foundUser) {
    throw new Error("Admin not found");
  }

  foundUser.subscription_plan = VILLAGE_USER;
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

  // TODO: Register Cognito User
  // username = phone_number
  // password = password

  const userId = null;
  newUser.user_id = userId;

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

  return { message: "OK", user_list: foundUsers };
});

export const getVillageUser = handler(async (event, context) => {
  const userId = event.pathParameters.idu;
  const villageId = event.pathParameters.idv;

  // Validate User First
  const identityId = event.requestContext.identity.cognitoIdentityId;
  await validateAdmin(identityId, villageId);

  const foundUser = await VillageUser.findOne(
    { user_id: userId, subscription_plan: VILLAGE_USER, village: villageId }
  );

  if (!foundUser) {
    throw new Error("User not found");
  }

  return { message: "OK", user: foundUser };
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
    { user_id: userId, subscription_plan: VILLAGE_USER, village: villageId }
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
    { user_id: userId, village: villageId }
  );

  // TODO: Delete Cognito User

  return { message: "OK" };
});