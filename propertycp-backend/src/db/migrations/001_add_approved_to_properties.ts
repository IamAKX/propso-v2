import { Database } from 'bun:sqlite';

export const up = (db: Database) => {
  console.log('Running migration: Add approved column to properties table...');

  try {
    // Check if column already exists
    const tableInfo = db.query('PRAGMA table_info(properties)').all();
    const columnExists = tableInfo.some((col: any) => col.name === 'approved');

    if (!columnExists) {
      // Add approved column with default value 'Pending'
      db.run(`
        ALTER TABLE properties
        ADD COLUMN approved TEXT DEFAULT 'Pending'
        CHECK(approved IN ('Pending', 'Approved', 'Rejected'))
      `);

      // Create index on approved column for better query performance
      db.run(`
        CREATE INDEX IF NOT EXISTS idx_properties_approved
        ON properties(approved)
      `);

      console.log('✅ Successfully added approved column to properties table');
    } else {
      console.log('ℹ️  Approved column already exists, skipping migration');
    }
  } catch (error) {
    console.error('❌ Error running migration:', error);
    throw error;
  }
};

export const down = (db: Database) => {
  console.log('Rolling back migration: Remove approved column from properties table...');

  // SQLite doesn't support DROP COLUMN directly, so we would need to:
  // 1. Create a new table without the column
  // 2. Copy data
  // 3. Drop old table
  // 4. Rename new table
  // For now, we'll just log a warning

  console.warn('⚠️  SQLite does not support DROP COLUMN. Manual rollback required if needed.');
};
