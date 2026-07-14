const mongoose = require('mongoose');
const { Schema } = mongoose;

const measurementSchema = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    garmentType: {
      type: String,
      required: true,
      trim: true,
    },
    length: Number,
    sleeves: Number,
    neck: Number,
    dateTaken: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Measurement', measurementSchema);