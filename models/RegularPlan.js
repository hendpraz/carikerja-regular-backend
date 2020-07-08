import { Schema, model } from 'mongoose';
/* eslint-disable */
const SubscriptionPlan = require('./SubscriptionPlan');
const RegularUser = require('./RegularUser');
/* eslint-enable */
/**
 * Document Interface
 * @typedef {Object} Document
 * @property {String} user Id ke object Village
 * @property {String} subscription_plan Id ke object SubscriptionPlan
 * @property {Date} expiry_date Tanggal kadaluarsa paket
 * @property {String} status ['active', 'inactive']
 */
const Id = Schema.Types.ObjectId;
const documentSchema = new Schema(
  {
    user: { type: Id, required: true, ref: 'RegularUser' },
    subscription_plan: {type: Id, required: true, ref: 'SubscriptionPlan'},
    expiry_date: { type: String, required: true },
    status: { type: String, required: true }
  },
  { timestamps: true }
);

const RegularPlan = model('RegularPlan', documentSchema);

export default RegularPlan;
