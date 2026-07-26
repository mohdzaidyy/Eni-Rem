const mongoose = require('mongoose');
const { Schema } = mongoose;

// One field definition inside a category, e.g. { key: 'chest', label: 'Chest', unit: 'in' }
const fieldDefSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      trim: true, // used as the key inside Measurement.values, e.g. "chest"
    },
    label: {
      type: String,
      required: true,
      trim: true, // shown in the UI, e.g. "Chest"
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
      unique: true, // e.g. "Kameez", "Shalwar", "Frock", "Gharara", "Lehnga"
    },
    fields: {
      type: [fieldDefSchema],
      default: [],
    },
    // who added this category - lets you track tailor-added vs built-in categories
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MeasurementCategory', measurementCategorySchema);