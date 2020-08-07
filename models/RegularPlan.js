import { Schema, model } from 'mongoose';
/* eslint-disable */
const RegularUser = require('./RegularUser');
/* eslint-enable */
/**
 * Document Interface
 * @typedef {Object} Document
 * @property {String} regular_user Id ke object RegularUser
 * @property {String} role Kode role
 * @property {Date} expiry_date Tanggal kadaluarsa paket
 * @property {String} status ["active", "inactive"]
 */
const Id = Schema.Types.ObjectId;
const documentSchema = new Schema(
  {
    regular_user: { type: Id, required: true, ref: 'RegularUser' },
    role: { type: Number, required: true },
    expiry_date: { type: Date, required: true },
    status: { type: String, required: true }
  },
  { timestamps: true }
);

const RegularPlan = model('RegularPlan', documentSchema);

export default RegularPlan;
