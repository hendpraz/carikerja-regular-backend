import { Schema, model } from 'mongoose';
/* eslint-disable */
const VillageUser = require('./VillageUser');
const Village = require('./Village');
/* eslint-enable */
/**
 * Document Interface
 * @typedef {Object} Document
 * @property {String} title Judul pekerjaan
 * @property {String} owner Id pemilik pekerjaan
 * @property {String} description Deskripsi pekerjaan
 * @property {Number} num_of_openings Banyaknya lowongan yang dibuka
 * @property {Number} status Status lowongan : [active/inactive]
 * @property {String} location Lokasi pekerjaan
 * @property {String} profession Jenis profesi pekerjaan
 */
const Id = Schema.Types.ObjectId;
const documentSchema = new Schema(
  {
    title: { type: String, required: true },
    owner: { type: Id, required: true, ref: 'VillageUser'},
    description: { type: String, required: true },
    num_of_openings: { type: Number, required: true },
    village: { type: Id, required: true, ref: 'Village' },
    status: { type: String, required: true }
  },
  { timestamps: true }
);

documentSchema.index({
  title: 'text',
  description: 'text'
});
const VillageJob = model('VillageJob', documentSchema);

export default VillageJob;
