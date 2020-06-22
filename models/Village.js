import { Schema, model } from 'mongoose';

/**
 * Document Interface
 * @typedef {Object} Document
 * @property {String} name Nama desa
 * @property {String} city Kota/kabupaten
 * @property {String} province Provincy
 * @property {String} country Status pengguna reguler
 */
const documentSchema = new Schema(
  {
    name: { type: String, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true },
    country: { type: String, required: true }
  },
  { timestamps: true }
);

const RegularUser = model('VillageUser', documentSchema);

export default RegularUser;
