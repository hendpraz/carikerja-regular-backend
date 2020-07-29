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
 * @property {String} status ['sent', 'reviewed', 'rejected', 'accepted']
 */
const Id = Schema.Types.ObjectId;
const documentSchema = new Schema(
  {
    regular_user: { type: Id, required: true, ref: 'RegularUser' },
    regular_job: {type: Id, required: true, ref: 'RegularJob'},
    status: { type: String, required: true },
    attachment: { type: String },
    cover_letter: { type: String }
  },
  { timestamps: true }
);

const RegularApplication = model('RegularApplication', documentSchema);

export default RegularApplication;
