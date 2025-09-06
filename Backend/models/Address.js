import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    street: { type: String },
    city: { type: String },
    state: { type: String },
    postal_code: { type: String },
    country: { type: String },
    is_primary: { type: Boolean, default: false },
    is_deleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

const Address = mongoose.model('Address', addressSchema);
export default Address;
