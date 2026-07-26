import User from '../models/user.model.js';
import generateToken from '../utils/generateToken.js';

/**
 * POST /api/auth/register
 * In practice this is mostly used by the owner to create tailor accounts,
 * and later for customer self-signup once that side of the site exists.
 */
export async function register(req, res) {
  try {
    const { name, email, password, role, phone } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'name, email, password, and role are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const user = await User.create({ name, email, password, role, phone });

    generateToken(res, user);

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
}

/**
 * POST /api/auth/login
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    // password has `select: false` on the schema, so it must be requested explicitly
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    generateToken(res, user);

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
}

/**
 * POST /api/auth/logout
 */
export function logout(req, res) {
  res.clearCookie('access_token');
  res.status(200).json({ message: 'Logged out' });
}

/**
 * GET /api/auth/me
 * Used by the frontend on page load to check who's logged in
 * and decide whether to route to /dashboard or /shop.
 */
export async function getMe(req, res) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user', error: err.message });
  }
}