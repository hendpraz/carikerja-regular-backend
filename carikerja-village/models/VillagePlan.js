import { Schema, model } from 'mongoose';
/* eslint-disable */
const SubscriptionPlan = require('./SubscriptionPlan');
const Village = require('./Village');
/* eslint-enable */
/**
 * Document Interface
 * @typedef {Object} Document
 * @property {String} village Id ke object Village
 * @property {String} subscription_plan Id ke object SubscriptionPlan
 * @property {Date} expiry_date Tanggal kadaluarsa paket
 * @property {String} status ['active', 'inactive']
 */
const Id = Schema.Types.ObjectId;
const documentSchema = new Schema(
  {
    village: { type: Id, required: true, ref: 'Village' },
    subscription_plan: {type: Number, required: true },
    expiry_date: { type: Date, required: true },
    status: { type: String, required: true }
  },
  { timestamps: true }
);

const VillagePlan = model('VillagePlan', documentSchema);

export default VillagePlan;
