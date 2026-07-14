const mongoose = require('mongoose');
const { Schema } = mongoose;

const tailorSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    dailyCapacity: {
      type: Number,
      default: 5, // used for delivery-conflict / workload checks
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Tailor', tailorSchema);