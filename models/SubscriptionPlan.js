import { Schema, model } from 'mongoose';

/**
 * Document Interface
 * @typedef {Object} Document
 * @property {String} name Nama subscription plan
 * @property {String} description Deskripsi subscription plan
 */
const Id = Schema.Types.ObjectId;
const documentSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true }
  },
  { timestamps: true }
);

const SubscriptionPlan = model('SubscriptionPlan', documentSchema);

export default SubscriptionPlan;
