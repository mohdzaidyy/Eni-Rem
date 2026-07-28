import mongoose, { Schema } from 'mongoose';

const fieldDefSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      trim: true,
    },
    label: {
      type: String,
      required: true,
      trim: true,
    },
    unit: {
      type: String,
      enum: ['in', 'cm'],
      default: 'in',
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const measurementCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    fields: {
      type: [fieldDefSchema],
      default: [],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const MeasurementCategory = mongoose.model('MeasurementCategory', measurementCategorySchema);
export default MeasurementCategory;