import { Schema, model } from 'mongoose';
/* eslint-disable */
const Village = require('./Village');
const VillageUser = require('./VillageUser');
/* eslint-enable */
/**
 * Document Interface
 * @typedef {Object} Document
 * @property {String} village_user Id ke object VillageUser
 * @property {String} village Id ke object Vilage
 * @property {String} activity_description Deskripsi aktivitas
 * @property {Date} date Tanggal historis
 */
const Id = Schema.Types.ObjectId;
const documentSchema = new Schema(
  {
    village_user: { type: Id, required: true, ref: 'VillageUser' },
    village: {type: Id, required: true, ref: 'Village'},
    activity_description: {type: String, required: true},
    date: { type: Date },
  },
  { timestamps: true }
);

const VillageActivity = model('VillageActivity', documentSchema);

export default VillageActivity;
