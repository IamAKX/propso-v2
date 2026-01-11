import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import propertyRoutes from './routes/properties';
import leadRoutes from './routes/leads';
import favoriteRoutes from './routes/favorites';
import uploadRoutes from './routes/uploads';
import { initDatabase } from './db/database';
import { seedDatabase } from './db/seed';

// Initialize and seed database on startup
try {
  initDatabase();
  console.log('✅ Database initialized successfully');
  seedDatabase();
  console.log('✅ Database seeded successfully');
} catch (error) {
  console.error('❌ Error initializing database:', error);
  process.exit(1);
}

const app = new Hono();

// Middleware
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((s) => s.trim())
  : ['http://localhost:3000', 'http://localhost:3001'];

// CORS middleware: keep localhost by default; optionally allow all IP origins or all origins using env flags
app.use('*', async (c, next) => {
  const origin = c.req.headers.get('origin') || '';
  const allowAll = process.env.CORS_ALLOW_ALL === 'true';
  const allowAllIPs = process.env.CORS_ALLOW_ALL_IPS === 'true';
  const isIpOrigin = /^https?:\/\/\d+\.\d+\.\d+\.\d+(?::\d+)?$/.test(origin);

  if (allowAll || allowedOrigins.includes(origin) || (allowAllIPs && isIpOrigin)) {
    // When allowing credentials, we must echo the request origin (cannot use '*')
    c.header('Access-Control-Allow-Origin', allowAll ? (origin || '*') : origin);
    c.header('Access-Control-Allow-Credentials', 'true');
    c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

    // Handle preflight
    if (c.req.method === 'OPTIONS') {
      return c.text('', 204);
    }
  }

  return await next();
});
app.use('*', logger());

// Health check
app.get('/', (c) => {
  return c.json({
    success: true,
    message: 'PropertyCP Backend API',
    version: '1.0.0',
  });
});

// Routes
app.route('/api/auth', authRoutes);
app.route('/api/users', userRoutes);
app.route('/api/properties', propertyRoutes);
app.route('/api/leads', leadRoutes);
app.route('/api/favorites', favoriteRoutes);
app.route('/api/uploads', uploadRoutes);

// 404 handler
app.notFound((c) => {
  return c.json({
    success: false,
    message: 'Route not found',
  }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('Error:', err);
  return c.json({
    success: false,
    message: err.message || 'Internal server error',
  }, 500);
});

const port = process.env.PORT || 3001;

console.log(`🚀 PropertyCP Backend starting on port ${port}...`);

export default {
  port,
  fetch: app.fetch,
};
