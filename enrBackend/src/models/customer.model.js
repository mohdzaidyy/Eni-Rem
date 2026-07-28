import mongoose, { Schema } from 'mongoose';

const customerSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null, // set once customer-facing login is added
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    dob: {
      type: Date,
    },
    likesDislikes: {
      type: String,
      trim: true,
    },
    favouriteDesigns: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const Customer = mongoose.model('Customer', customerSchema);
export default Customer;