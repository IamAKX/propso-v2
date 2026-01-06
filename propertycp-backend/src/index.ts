import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import propertyRoutes from './routes/properties';
import leadRoutes from './routes/leads';
import favoriteRoutes from './routes/favorites';
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
app.use('*', cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
}));
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
