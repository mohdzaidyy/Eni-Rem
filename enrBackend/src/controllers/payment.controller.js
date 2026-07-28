import Payment from '../models/payment.model.js';
import Order from '../models/order.model.js';

// POST /api/payments - records a payment and updates the order's balance
export async function createPayment(req, res) {
  try {
    const { orderId, amount, method, paymentDate } = req.body;

    if (!orderId || amount == null || !method) {
      return res.status(400).json({ message: 'orderId, amount, and method are required' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const payment = await Payment.create({ orderId, amount, method, paymentDate });

    // keep the order's running totals in sync
    order.advancePaid += amount;
    order.balanceDue = order.totalPrice - order.advancePaid;
    await order.save();

    res.status(201).json({ payment, order });
  } catch (err) {
    res.status(500).json({ message: 'Failed to record payment', error: err.message });
  }
}

// GET /api/payments/order/:orderId
export async function getPaymentsForOrder(req, res) {
  try {
    const payments = await Payment.find({ orderId: req.params.orderId }).sort({ paymentDate: -1 });
    res.status(200).json(payments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch payments', error: err.message });
  }
}

// DELETE /api/payments/:id - reverses the payment's effect on the order
export async function deletePayment(req, res) {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    const order = await Order.findById(payment.orderId);
    if (order) {
      order.advancePaid -= payment.amount;
      order.balanceDue = order.totalPrice - order.advancePaid;
      await order.save();
    }

    res.status(200).json({ message: 'Payment deleted and order balance reverted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete payment', error: err.message });
  }
}