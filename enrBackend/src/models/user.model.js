const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true, // store bcrypt hash, never plaintext
    },
    role: {
      type: String,
      enum: ['owner', 'tailor', 'customer'],
      required: true,
    },
    phone: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true } // adds createdAt, updatedAt
);

module.exports = mongoose.model('User', userSchema);