// import { Schema, model } from 'mongoose';
const mongoose = require('mongoose');

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
const Id = mongoose.Schema.Types.ObjectId;
const documentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    owner: { type: Id, required: true, ref: 'RegularUser'},
    description: { type: String, required: true },
    num_of_openings: { type: Number, required: true },
    status: { type: Number, required: true },
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
const RegularJobs = mongoose.model('RegularJob', documentSchema);

module.exports = RegularJobs;
