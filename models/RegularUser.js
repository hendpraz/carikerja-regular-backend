import { Schema, model } from 'mongoose';
/**
 * Document Interface
 * @typedef {Object} Document
 * @property {String} name Nama pengguna reguler
 * @property {String} email Email pengguna reguler
 * @property {String} phone_number Nomor HP
 * @property {String} whatsapp_number Nomor whatsapp
 * @property {String} profile_picture Nama file profile picture pengguna
 * @property {String} address Alamat pengguna
 * @property {String} status Status pengguna reguler
 * @property {String} role Kode role
 * @property {String} identity_id cognito identity id pengguna
 */
// const Id = Schema.Types.ObjectId;
const documentSchema = new Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    phone_number: { type: String },
    whatsapp_number: { type: String },
    profile_picture: { type: String },
    address: { type: String },
    status: { type: String, required: true },
    role: { type: Number, required: true },
    identity_id: { type: String, required: true, unique: true }
  },
  { timestamps: true }
);

const RegularUser = model('RegularUser', documentSchema);

export default RegularUser;
