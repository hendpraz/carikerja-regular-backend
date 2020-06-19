import { Schema, model } from 'mongoose';

/**
 * Document Interface
 * @typedef {Object} Document
 * @property {Number} subs_id Id subcription plan [1, 2, 3, 4]
 * @property {String} name Nama subscription plan
 * @property {String} description Deskripsi subscription plan
 */
const documentSchema = new Schema(
  {
    subs_id: { type: Number, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true }
  },
  { timestamps: true }
);

const SubscriptionPlan = model('SubscriptionPlan', documentSchema);

export default SubscriptionPlan;
