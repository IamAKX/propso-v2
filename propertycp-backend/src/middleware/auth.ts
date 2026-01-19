import { Context, Next } from 'hono';
import db from '../db/database';

export interface AuthUser {
  id: number;
  email: string;
  userType: string;
}

export const authMiddleware = async (c: Context, next: Next) => {
  try {
    // Get userId from header
    const userId = c.req.header('X-User-Id');

    if (!userId) {
      return c.json({
        success: false,
        message: 'User ID required',
      }, 401);
    }

    // Fetch user from database to get full user info
    const user = db.prepare('SELECT id, email, user_type FROM users WHERE id = ?').get(userId) as any;

    if (!user) {
      return c.json({
        success: false,
        message: 'User not found',
      }, 401);
    }

    // Attach user to context
    c.set('user', {
      id: user.id,
      email: user.email,
      userType: user.user_type,
    });

    await next();
  } catch (error) {
    return c.json({
      success: false,
      message: 'Authentication failed',
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
