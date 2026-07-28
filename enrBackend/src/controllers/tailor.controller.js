import Tailor from '../models/tailor.model.js';
import Order from '../models/order.model.js';

// POST /api/tailors  - expects a userId of an existing User with role: 'tailor'
export async function createTailor(req, res) {
  try {
    const { userId, name, dailyCapacity } = req.body;

    if (!userId || !name) {
      return res.status(400).json({ message: 'userId and name are required' });
    }

    const existing = await Tailor.findOne({ userId });
    if (existing) {
      return res.status(409).json({ message: 'A tailor profile already exists for this user' });
    }

    const tailor = await Tailor.create({ userId, name, dailyCapacity });
    res.status(201).json(tailor);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create tailor', error: err.message });
  }
}

export async function getTailors(req, res) {
  try {
    const tailors = await Tailor.find().sort({ name: 1 });
    res.status(200).json(tailors);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tailors', error: err.message });
  }
}

// GET /api/tailors/:id - includes current workload (ongoing orders count)
export async function getTailorById(req, res) {
  try {
    const tailor = await Tailor.findById(req.params.id);
    if (!tailor) {
      return res.status(404).json({ message: 'Tailor not found' });
    }

    const ongoingOrders = await Order.countDocuments({
      tailorId: tailor._id,
      orderStatus: { $ne: 'Delivered' },
    });

    res.status(200).json({ ...tailor.toObject(), ongoingOrders });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tailor', error: err.message });
  }
}

export async function updateTailor(req, res) {
  try {
    const tailor = await Tailor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!tailor) {
      return res.status(404).json({ message: 'Tailor not found' });
    }
    res.status(200).json(tailor);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update tailor', error: err.message });
  }
}

export async function deleteTailor(req, res) {
  try {
    const tailor = await Tailor.findByIdAndDelete(req.params.id);
    if (!tailor) {
      return res.status(404).json({ message: 'Tailor not found' });
    }
    res.status(200).json({ message: 'Tailor deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete tailor', error: err.message });
  }
}
