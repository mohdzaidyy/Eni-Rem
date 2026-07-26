const mongoose = require('mongoose');
const { Schema } = mongoose;

const measurementSchema = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'MeasurementCategory', // e.g. Kameez, Shalwar, Frock, Gharara, Lehnga
      required: true,
    },
    // flexible key -> value map, shape driven entirely by the category's `fields`
    // e.g. { chest: 38, shoulder: 17, sleeveLength: 24 }
    values: {
      type: Map,
      of: Number,
      default: {},
    },
    dateTaken: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Measurement', measurementSchema);