import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, required: true }, // e.g., order, message, system
    content: { type: String, required: true },
    is_read: { type: Boolean, default: false, index: true },
    is_deleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
