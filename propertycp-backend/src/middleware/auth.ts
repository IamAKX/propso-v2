import { Context, Next } from 'hono';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'propertycp-secret-key-2024';

export interface AuthUser {
  id: number;
  email: string;
  userType: string;
}

export const authMiddleware = async (c: Context, next: Next) => {
  try {
    const authHeader = c.req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({
        success: false,
        message: 'Authorization token required',
      }, 401);
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;

    // Attach user to context
    c.set('user', decoded);

    await next();
  } catch (error) {
    return c.json({
      success: false,
      message: 'Invalid or expired token',
    }, 401);
  }
};

export const adminMiddleware = async (c: Context, next: Next) => {
  const user = c.get('user') as AuthUser;

  if (!user || user.userType !== 'Admin') {
    return c.json({
      success: false,
      message: 'Admin access required',
    }, 403);
  }

  await next();
};

export const generateToken = (user: AuthUser): string => {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
};
