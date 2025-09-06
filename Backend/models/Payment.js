import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    method: { type: String, enum: ['card', 'upi', 'wallet', 'cod'], required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending', index: true },
    transaction_id: { type: String, unique: true, sparse: true },
    is_deleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
