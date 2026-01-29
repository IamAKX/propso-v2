import db from './database';
import * as fs from 'fs';
import * as path from 'path';

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

// Create migrations tracking table
db.run(`
  CREATE TABLE IF NOT EXISTS migrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    executed_at TEXT DEFAULT (datetime('now'))
  )
`);

// Get all migration files
const getMigrationFiles = (): string[] => {
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    console.log('No migrations directory found');
    return [];
  }

  return fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((file) => file.endsWith('.ts') || file.endsWith('.js'))
    .sort();
};

// Check if migration has been run
const hasRun = (name: string): boolean => {
  const result = db
    .query('SELECT id FROM migrations WHERE name = ?')
    .get(name);
  return !!result;
};

// Mark migration as run
const markAsRun = (name: string): void => {
  db.run('INSERT INTO migrations (name) VALUES (?)', [name]);
};

// Run all pending migrations
export const runMigrations = async () => {
  console.log('🔄 Running database migrations...\n');

  const migrationFiles = getMigrationFiles();

  if (migrationFiles.length === 0) {
    console.log('No migrations to run');
    return;
  }

  for (const file of migrationFiles) {
    const migrationName = path.basename(file, path.extname(file));

    if (hasRun(migrationName)) {
      console.log(`⏭️  Skipping ${migrationName} (already run)`);
      continue;
    }

    console.log(`▶️  Running ${migrationName}...`);

    try {
      const migrationPath = path.join(MIGRATIONS_DIR, file);
      const migration = await import(migrationPath);

      if (typeof migration.up === 'function') {
        migration.up(db);
        markAsRun(migrationName);
        console.log(`✅ ${migrationName} completed\n`);
      } else {
        console.error(`❌ ${migrationName} does not export an 'up' function\n`);
      }
    } catch (error) {
      console.error(`❌ Error running ${migrationName}:`, error);
      throw error;
    }
  }

  console.log('✅ All migrations completed successfully!\n');
};

// Run migrations if this file is executed directly
if (import.meta.main) {
  runMigrations()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}
