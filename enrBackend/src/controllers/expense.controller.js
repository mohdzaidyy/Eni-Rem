import Expense from '../models/expense.model.js';

export async function createExpense(req, res) {
  try {
    const { category, amount, date, notes } = req.body;

    if (!category || amount == null) {
      return res.status(400).json({ message: 'category and amount are required' });
    }

    const expense = await Expense.create({ category, amount, date, notes });
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create expense', error: err.message });
  }
}

// GET /api/expenses?category=Rent&from=2026-01-01&to=2026-01-31
export async function getExpenses(req, res) {
  try {
    const { category, from, to } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    }

    const expenses = await Expense.find(filter).sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch expenses', error: err.message });
  }
}

export async function updateExpense(req, res) {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.status(200).json(expense);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update expense', error: err.message });
  }
}

export async function deleteExpense(req, res) {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.status(200).json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete expense', error: err.message });
  }
}