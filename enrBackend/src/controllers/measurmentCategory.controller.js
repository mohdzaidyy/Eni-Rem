import MeasurementCategory from '../models/measurmentCategory.model.js';

// POST /api/measurement-categories - tailor/owner creates a new garment type
export async function createCategory(req, res) {
  try {
    const { name, fields } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'name is required' });
    }

    const existing = await MeasurementCategory.findOne({ name });
    if (existing) {
      return res.status(409).json({ message: 'A category with this name already exists' });
    }

    const category = await MeasurementCategory.create({
      name,
      fields: fields || [],
      createdBy: req.user?.id,
    });

    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create category', error: err.message });
  }
}

export async function getCategories(req, res) {
  try {
    const categories = await MeasurementCategory.find().sort({ name: 1 });
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch categories', error: err.message });
  }
}

export async function getCategoryById(req, res) {
  try {
    const category = await MeasurementCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch category', error: err.message });
  }
}

// PATCH /api/measurement-categories/:id/fields - tailor adds a new field to an existing category
// body: { key, label, unit, required }
export async function addFieldToCategory(req, res) {
  try {
    const { key, label, unit, required } = req.body;

    if (!key || !label) {
      return res.status(400).json({ message: 'key and label are required' });
    }

    const category = await MeasurementCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (category.fields.some((f) => f.key === key)) {
      return res.status(409).json({ message: `Field "${key}" already exists on this category` });
    }

    category.fields.push({ key, label, unit, required });
    await category.save();

    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add field', error: err.message });
  }
}

export async function deleteCategory(req, res) {
  try {
    const category = await MeasurementCategory.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete category', error: err.message });
  }
}