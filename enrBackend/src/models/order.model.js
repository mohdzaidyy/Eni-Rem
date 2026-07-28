import mongoose, { Schema } from 'mongoose';

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
      ref: 'Measurement',
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
    modifications: {
      type: String,
      trim: true,
    },
    fabricType: {
      type: String,
      trim: true,
    },
    fabricImages: {
      type: [String], // array of /uploads/<filename> paths
      default: [],
    },
    inspirationImages: {
      type: [String], // array of /uploads/<filename> paths
      default: [],
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
    },
    deliveredAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;