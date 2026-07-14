const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    tailorId: {
      type: Schema.Types.ObjectId,
      ref: 'Tailor',
    },
    measurementId: {
      type: Schema.Types.ObjectId,
      ref: 'Measurement', // snapshot used for this specific order
    },
    orderType: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    deliveryDate: {
      type: Date,
      required: true,
    },
    defectInFabric: {
      type: String,
      trim: true,
    },
    noOfTrims: {
      type: Number,
      default: 0,
    },
    designRef: {
      type: String,
      trim: true,
    },
    fabricType: {
      type: String,
      trim: true,
    },
    orderStatus: {
      type: String,
      enum: ['Received', 'Cutting', 'Stitching', 'Trial', 'Alteration', 'Ready', 'Delivered'],
      default: 'Received',
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    advancePaid: {
      type: Number,
      default: 0,
    },
    balanceDue: {
      type: Number,
      default: function () {
        return this.totalPrice - this.advancePaid;
      },
      // keep this in sync in the order/payment service whenever
      // a new Payment doc is created against this order
    },
    deliveredAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);