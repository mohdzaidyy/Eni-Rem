import Measurement from '../models/measurment.model.js';
import MeasurementCategory from '../models/measurmentCategory.model.js';

// POST /api/measurements - values object is validated against the category's field list
export async function createMeasurement(req, res) {
  try {
    const { customerId, categoryId, values, notes } = req.body;

    if (!customerId || !categoryId || !values) {
      return res.status(400).json({ message: 'customerId, categoryId, and values are required' });
    }

    const category = await MeasurementCategory.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Measurement category not found' });
    }

    // check every required field on the category is present in values
    const missingRequired = category.fields
      .filter((f) => f.required)
      .filter((f) => values[f.key] == null)
      .map((f) => f.key);

    if (missingRequired.length > 0) {
      return res.status(400).json({ message: `Missing required fields: ${missingRequired.join(', ')}` });
    }

    // check no unknown keys were sent
    const validKeys = new Set(category.fields.map((f) => f.key));
    const unknownKeys = Object.keys(values).filter((k) => !validKeys.has(k));
    if (unknownKeys.length > 0) {
      return res.status(400).json({ message: `Unknown fields for this category: ${unknownKeys.join(', ')}` });
    }

    const measurement = await Measurement.create({ customerId, categoryId, values, notes });
    res.status(201).json(measurement);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create measurement', error: err.message });
  }
}

// GET /api/measurements/customer/:customerId
export async function getMeasurementsForCustomer(req, res) {
  try {
    const measurements = await Measurement.find({ customerId: req.params.customerId })
      .populate('categoryId', 'name fields')
      .sort({ dateTaken: -1 });
    res.status(200).json(measurements);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch measurements', error: err.message });
  }
}

export async function getMeasurementById(req, res) {
  try {
    const measurement = await Measurement.findById(req.params.id).populate('categoryId');
    if (!measurement) {
      return res.status(404).json({ message: 'Measurement not found' });
    }
    res.status(200).json(measurement);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch measurement', error: err.message });
  }
}

export async function updateMeasurement(req, res) {
  try {
    const { values, notes } = req.body;
    const measurement = await Measurement.findByIdAndUpdate(
      req.params.id,
      { values, notes, dateTaken: new Date() },
      { new: true, runValidators: true }
    );
    if (!measurement) {
      return res.status(404).json({ message: 'Measurement not found' });
    }
    res.status(200).json(measurement);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update measurement', error: err.message });
  }
}

export async function deleteMeasurement(req, res) {
  try {
    const measurement = await Measurement.findByIdAndDelete(req.params.id);
    if (!measurement) {
      return res.status(404).json({ message: 'Measurement not found' });
    }
    res.status(200).json({ message: 'Measurement deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete measurement', error: err.message });
  }
}