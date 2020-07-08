import { Schema, model } from 'mongoose';
/* eslint-disable */
const VillageJob = require('./VillageJob');
const VillageUser = require('./VillageUser');
/* eslint-enable */
/**
 * Document Interface
 * @typedef {Object} Document
 * @property {String} village_user Id ke object VillageUser
 * @property {String} village_job Id ke object VilageJob
 * @property {Date} date Tanggal historis
 */
const Id = Schema.Types.ObjectId;
const documentSchema = new Schema(
  {
    village_user: { type: Id, required: true, ref: 'VillageUser' },
    village_job: {type: Id, required: true, ref: 'VillageJob'},
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

const VillageAcceptance = model('VillageAcceptance', documentSchema);

export default VillageAcceptance;
