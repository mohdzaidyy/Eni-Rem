import Invoice from '../models/invoice.model.js';
import Order from '../models/order.model.js';

function buildInvoiceNumber() {
  // simple, readable, unlikely to collide: INV-<timestamp>
  return `INV-${Date.now()}`;
}

// POST /api/invoices/order/:orderId - generates an invoice for a delivered order
export async function generateInvoice(req, res) {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.orderStatus !== 'Delivered') {
      return res.status(400).json({ message: 'Invoice can only be generated once the order is Delivered' });
    }

    const existing = await Invoice.findOne({ orderId: order._id });
    if (existing) {
      return res.status(409).json({ message: 'Invoice already exists for this order', invoice: existing });
    }

    const invoice = await Invoice.create({
      orderId: order._id,
      invoiceNo: buildInvoiceNumber(),
    });

    res.status(201).json(invoice);
  } catch (err) {
    res.status(500).json({ message: 'Failed to generate invoice', error: err.message });
  }
}

export async function getInvoiceByOrder(req, res) {
  try {
    const invoice = await Invoice.findOne({ orderId: req.params.orderId });
    if (!invoice) {
      return res.status(404).json({ message: 'No invoice found for this order' });
    }
    res.status(200).json(invoice);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch invoice', error: err.message });
  }
}

export async function getInvoices(req, res) {
  try {
    const invoices = await Invoice.find().populate('orderId').sort({ generatedAt: -1 });
    res.status(200).json(invoices);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch invoices', error: err.message });
  }
}