import { initDatabase } from './database';
import { seedDatabase } from './seed';

console.log('🌱 Initializing and seeding database...\n');

try {
  initDatabase();
  seedDatabase();
  console.log('\n✅ Database initialization and seeding completed successfully!');
  process.exit(0);
} catch (error) {
  console.error('\n❌ Error initializing database:', error);
  process.exit(1);
}
