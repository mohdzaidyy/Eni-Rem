const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['TodayDelivery', 'TomorrowDelivery', 'PendingPayment', 'LateOrder', 'BirthdayCustomer'],
      required: true,
    },
    // recipient can be a Customer or a User (tailor/owner) depending on `type`
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

module.exports = mongoose.model('Notification', notificationSchema);