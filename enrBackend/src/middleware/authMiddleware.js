import jwt from 'jsonwebtoken';

/**
 * Verifies the JWT from the httpOnly cookie and attaches the decoded
 * payload to req.user. Use on any route that requires login.
 */
export function protect(req, res, next) {
  const token = req.cookies?.access_token;

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role, name, iat, exp }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

/**
 * Restricts a route to specific roles. Must run after `protect`.
 * Usage: router.get('/billing', protect, authorize('owner'), handler)
 */
export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden - insufficient permissions' });
    }
    next();
  };
}