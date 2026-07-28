import mongoose, { Schema } from 'mongoose';

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

const Expense = mongoose.model('Expense', expenseSchema);
export default Expense;