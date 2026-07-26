import jwt from 'jsonwebtoken';

/**
 * Signs a JWT for the given user and attaches it to the response
 * as an httpOnly cookie (safer than localStorage - not readable by JS).
 */
function generateToken(res, user) {
  const token = jwt.sign(
    { id: user._id, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
  );

  res.cookie('access_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
    sameSite: 'strict',
    maxAge: 60 * 60 * 1000, // 1 hour, keep in sync with expiresIn above
  });

  return token;
}

export default generateToken;