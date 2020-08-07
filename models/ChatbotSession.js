import { Schema, model } from 'mongoose';
/**
 * Document Interface
 * @typedef {Object} Document
 * @property {String} session Sesi user
 * @property {String} query Query user
 * @property {Number} page Nomor halaman terakhir
 */
const documentSchema = new Schema(
  {
    session: { type: String, required: true },
    query: { type: String, required: true },
    page: { type: Number, required: true }
  },
  { timestamps: true }
);

const ChatbotSession = model('ChatbotSession', documentSchema);

export default ChatbotSession;