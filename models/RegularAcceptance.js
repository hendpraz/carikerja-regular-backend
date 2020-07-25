import { Schema, model } from 'mongoose';
/* eslint-disable */
const RegularJob = require('./RegularJob');
const RegularUser = require('./RegularUser');
/* eslint-enable */
/**
 * Document Interface
 * @typedef {Object} Document
 * @property {String} regular_user Id ke object RegularUser
 * @property {String} regular_job Id ke object RegularJob
 * @property {Date} date Tanggal historis
 */
const Id = Schema.Types.ObjectId;
const documentSchema = new Schema(
  {
    regular_user: { type: Id, required: false, ref: 'RegularUser' },
    regular_job: {type: Id, required: true, ref: 'RegularJob'},
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

const RegularAcceptance = model('RegularAcceptance', documentSchema);

export default RegularAcceptance;
