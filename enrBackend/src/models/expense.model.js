const mongoose = require('mongoose');
const { Schema } = mongoose;

const expenseSchema = new Schema(
  {
    category: {
      type: String,
      enum: ['Fabric', 'Electricity', 'Rent', 'TailorSalary', 'Embroidery', 'Packaging', 'Transport'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
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

module.exports = mongoose.model('Expense', expenseSchema);