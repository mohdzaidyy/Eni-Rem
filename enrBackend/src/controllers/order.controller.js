import Order from '../models/order.model.js';

export async function createOrder(req, res) {
  try {
    const {
      customerId,
      tailorId,
      measurementId,
      orderType,
      quantity,
      deliveryDate,
      defectInFabric,
      noOfTrims,
      designRef,
      modifications,
      fabricType,
      fabricImages,
      inspirationImages,
      totalPrice,
      advancePaid,
    } = req.body;

    if (!customerId || !orderType || !deliveryDate || totalPrice == null) {
      return res
        .status(400)
        .json({ message: 'customerId, orderType, deliveryDate, and totalPrice are required' });
    }

    const paid = advancePaid || 0;

    const order = await Order.create({
      customerId,
      tailorId,
      measurementId,
      orderType,
      quantity,
      deliveryDate,
      defectInFabric,
      noOfTrims,
      designRef,
      modifications,
      fabricType,
      fabricImages,
      inspirationImages,
      totalPrice,
      advancePaid: paid,
      balanceDue: totalPrice - paid,
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create order', error: err.message });
  }
}

// GET /api/orders?status=Stitching&customerId=...&tailorId=...
export async function getOrders(req, res) {
  try {
    const { status, customerId, tailorId } = req.query;
    const filter = {};
    if (status) filter.orderStatus = status;
    if (customerId) filter.customerId = customerId;
    if (tailorId) filter.tailorId = tailorId;

    const orders = await Order.find(filter)
      .populate('customerId', 'name phone')
      .populate('tailorId', 'name')
      .sort({ deliveryDate: 1 });

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
}

export async function getOrderById(req, res) {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customerId')
      .populate('tailorId')
      .populate('measurementId');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch order', error: err.message });
  }
}

// general field updates (not status - use updateOrderStatus for that)
export async function updateOrder(req, res) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    Object.assign(order, req.body);

    // keep balanceDue in sync if totalPrice or advancePaid changed
    if (req.body.totalPrice != null || req.body.advancePaid != null) {
      order.balanceDue = order.totalPrice - order.advancePaid;
    }

    await order.save();
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update order', error: err.message });
  }
}

const VALID_STATUSES = ['Received', 'Cutting', 'Stitching', 'Trial', 'Alteration', 'Ready', 'Delivered'];

// PATCH /api/orders/:id/status
export async function updateOrderStatus(req, res) {
  try {
    const { status } = req.body;

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: `status must be one of: ${VALID_STATUSES.join(', ')}` });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.orderStatus = status;
    if (status === 'Delivered') {
      order.deliveredAt = new Date();
    }

    await order.save();
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update order status', error: err.message });
  }
}

export async function deleteOrder(req, res) {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete order', error: err.message });
  }
}