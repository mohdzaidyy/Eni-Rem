import Customer from '../models/customer.model.js';

export async function createCustomer(req, res) {
  try {
    const { name, phone, address, dob, likesDislikes, favouriteDesigns } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'name is required' });
    }

    const customer = await Customer.create({
      name,
      phone,
      address,
      dob,
      likesDislikes,
      favouriteDesigns,
    });

    res.status(201).json(customer);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create customer', error: err.message });
  }
}

// GET /api/customers?search=ali
export async function getCustomers(req, res) {
  try {
    const { search } = req.query;
    const filter = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { phone: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const customers = await Customer.find(filter).sort({ createdAt: -1 });
    res.status(200).json(customers);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch customers', error: err.message });
  }
}

export async function getCustomerById(req, res) {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json(customer);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch customer', error: err.message });
  }
}

export async function updateCustomer(req, res) {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json(customer);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update customer', error: err.message });
  }
}

export async function deleteCustomer(req, res) {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json({ message: 'Customer deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete customer', error: err.message });
  }
}