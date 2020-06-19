import { Schema, model } from 'mongoose';

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
 */
const Id = Schema.Types.ObjectId;
const documentSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: Id, required: true },
    phone_number: { type: String, required: true },
    whatsapp_number: { type: String, required: true },
    profile_picture: { type: String, required: true },
    address: { type: String, required: true },
    status: { type: String, required: true },
    subscription_plan: { type: Id, required: true, ref: 'SubscriptionPlans' }
  },
  { timestamps: true }
);

const RegularUser = model('RegularUsers', documentSchema);

export default RegularUser;
