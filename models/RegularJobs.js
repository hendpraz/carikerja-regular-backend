import { Schema, model } from 'mongoose';

/**
 * Document Interface
 * @typedef {Object} Document
 * @property {String} title Judul pekerjaan
 * @property {String} owner Id pemilik pekerjaan
 * @property {String} description Deskripsi pekerjaan
 * @property {Number} num_of_openings Banyaknya lowongan yang dibuka
 * @property {Number} status Status lowongan : [1 -> open, 0 -> closed]
 * @property {String} location Lokasi pekerjaan
 * @property {String} profession Jenis profesi pekerjaan
 */
const Id = Schema.Types.ObjectId;
const documentSchema = new Schema(
  {
    title: { type: String, required: true },
    owner: { type: Id, required: true, ref: 'RegularUsers'},
    description: { type: String, required: true },
    num_of_openings: { type: Number, required: true },
    status: { type: Number, required: true },
    location: { type: String, required: true },
    profession: { type: String, required: true }
  },
  { timestamps: true }
);

documentSchema.index({
  title: 'text',
  description: 'text'
});
const RegularJobs = model('RegularJobs', documentSchema);

export default RegularJobs;
