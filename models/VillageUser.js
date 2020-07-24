import { Schema, model } from 'mongoose';
/* eslint-disable */
const SubscriptionPlan = require('./SubscriptionPlan');
const Village = require('./Village');
/* eslint-enable */
/**
 * Document Interface
 * @typedef {Object} Document
 * @property {String} name Nama lengkap pengguna
 * @property {String} phone_number Nomor HP
 * @property {String} address Alamat pengguna
 * @property {String} status Status pengguna
 * @property {String} subscription_plan Reference ke subscription plan
 * @property {String} village id desa dari pengguna
 * @property {String} user_id cognito identity id pengguna
 */
const Id = Schema.Types.ObjectId;
const documentSchema = new Schema(
  {
    name: { type: String, required: true },
    phone_number: { type: String, required: true },
    address: { type: String, required: true },
    status: { type: String, required: true },
    subscription_plan: { type: Id, required: true, ref: 'SubscriptionPlan' },
    village: { type: Id, required: true, ref: 'Village' },
    user_id: { type: String, required: true }
  },
  { timestamps: true }
);

const VillageUser = model('VillageUser', documentSchema);

export default VillageUser;
