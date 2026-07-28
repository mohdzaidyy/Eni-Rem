import mongoose, { Schema } from 'mongoose';

const measurementSchema = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'MeasurementCategory',
      required: true,
    },
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

const Measurement = mongoose.model('Measurement', measurementSchema);
export default Measurement;