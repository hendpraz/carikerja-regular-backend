import { Schema, model } from 'mongoose';

/**
 * Document Interface
 * @typedef {Object} Document
 * @property {Number} role_id Id role [1: Regular User, 2: Regular Jobposter, 8: Regular Superuser]
 * @property {String} description Deskripsi role
 */
const documentSchema = new Schema(
  {
    role_id: { type: Number, required: true },
    description: { type: String, required: true }
  },
  { timestamps: true }
);

const RegularRole = model('RegularRole', documentSchema);

export default RegularRole;