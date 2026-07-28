import mongoose, { Schema } from 'mongoose';

const notificationSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['TodayDelivery', 'TomorrowDelivery', 'PendingPayment', 'LateOrder', 'BirthdayCustomer'],
      required: true,
    },
    recipientId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'recipientModel',
    },
    recipientModel: {
      type: String,
      enum: ['Customer', 'User'],
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    scheduledFor: {
      type: Date,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;