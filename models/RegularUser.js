import { Schema, model } from 'mongoose';
/* eslint-disable */
const SubscriptionPlan = require('./SubscriptionPlan');
/* eslint-enable */
/**
 * Document Interface
 * @typedef {Object} Document
 * @property {String} name Nama pengguna reguler
 * @property {String} email Email pengguna reguler
 * @property {String} phone_number Nomor HP
 * @property {String} whatsapp_number Nomor whatsapp
 * @property {String} profile_picture Nama file profile picture pengguna
 * @property {String} address Alamat pengguna
 * @property {String} status Status pengguna reguler
 * @property {String} subscription_plan Reference ke subscription plan
 * @property {String} identity_id cognito identity id pengguna
 */
const Id = Schema.Types.ObjectId;
const documentSchema = new Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    phone_number: { type: String, unique: true },
    whatsapp_number: { type: String },
    profile_picture: { type: String },
    address: { type: String },
    status: { type: String, required: true },
    subscription_plan: { type: Id, required: true, ref: 'SubscriptionPlan' },
    plan_expiry_date : Date,
    identity_id: { type: String, required: true }
  },
  { timestamps: true }
);

const RegularUser = model('RegularUser', documentSchema);

export default RegularUser;
