import { Schema, model } from 'mongoose';
/* eslint-disable */
const RegularUser = require('./RegularUser');
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
    owner: { type: Id, required: true, ref: 'RegularUser'},
    description: { type: String, required: true },
    num_of_openings: { type: Number, required: true },
    status: { type: String, required: true },
    location: { type: String, required: true },
    profession: { type: String, required: true },
    expiry_date: Date
  },
  { timestamps: true }
);

documentSchema.index({
  title: 'text',
  description: 'text'
});
const RegularJob = model('RegularJob', documentSchema);

export default RegularJob;
