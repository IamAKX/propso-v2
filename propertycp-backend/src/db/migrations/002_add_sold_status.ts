import type Database from 'better-sqlite3';

export const up = (db: Database.Database) => {
  // SQLite doesn't support ALTER TABLE to modify CHECK constraints directly
  // We need to create a new table, copy data, drop old table, rename new table

  console.log('Creating new properties table with Sold status...');

  // Create new properties table with updated CHECK constraint
  db.exec(`
    CREATE TABLE properties_new (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      sub_title TEXT,
      price TEXT NOT NULL,
      number_of_rooms TEXT,
      bhk TEXT,
      location TEXT NOT NULL,
      city TEXT NOT NULL CHECK(city IN ('Bangalore', 'Hyderabad', 'Mumbai', 'Chennai')),
      main_image TEXT NOT NULL,
      images TEXT,
      type TEXT NOT NULL CHECK(type IN ('Rent', 'Plot', 'Flat', 'Commercial', 'Farmland')),
      area TEXT,
      area_unit TEXT,
      description TEXT,
      builder_phone_number TEXT,
      approved TEXT DEFAULT 'Pending' CHECK(approved IN ('Pending', 'Approved', 'Rejected', 'Sold')),
      created_by_id INTEGER,
      created_date TEXT DEFAULT (datetime('now')),
      updated_date TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (created_by_id) REFERENCES users(id) ON DELETE SET NULL
    );
  `);

  console.log('Copying data from old table...');

  // Copy data from old table to new table
  db.exec(`
    INSERT INTO properties_new
    SELECT * FROM properties;
  `);

  console.log('Dropping old table...');

  // Drop old table
  db.exec(`DROP TABLE properties;`);

  console.log('Renaming new table...');

  // Rename new table to properties
  db.exec(`ALTER TABLE properties_new RENAME TO properties;`);

  console.log('Recreating indexes...');

  // Recreate indexes
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
    CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);
    CREATE INDEX IF NOT EXISTS idx_properties_approved ON properties(approved);
  `);

  console.log('✅ Migration 002 completed: Added "Sold" status to properties.approved column');
};

export const down = (db: Database.Database) => {
  // Revert back to original CHECK constraint (without 'Sold')
  console.log('Reverting: Creating properties table without Sold status...');

  db.exec(`
    CREATE TABLE properties_new (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      sub_title TEXT,
      price TEXT NOT NULL,
      number_of_rooms TEXT,
      bhk TEXT,
      location TEXT NOT NULL,
      city TEXT NOT NULL CHECK(city IN ('Bangalore', 'Hyderabad', 'Mumbai', 'Chennai')),
      main_image TEXT NOT NULL,
      images TEXT,
      type TEXT NOT NULL CHECK(type IN ('Rent', 'Plot', 'Flat', 'Commercial', 'Farmland')),
      area TEXT,
      area_unit TEXT,
      description TEXT,
      builder_phone_number TEXT,
      approved TEXT DEFAULT 'Pending' CHECK(approved IN ('Pending', 'Approved', 'Rejected')),
      created_by_id INTEGER,
      created_date TEXT DEFAULT (datetime('now')),
      updated_date TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (created_by_id) REFERENCES users(id) ON DELETE SET NULL
    );
  `);

  // Copy only non-Sold properties
  db.exec(`
    INSERT INTO properties_new
    SELECT * FROM properties WHERE approved != 'Sold';
  `);

  db.exec(`DROP TABLE properties;`);
  db.exec(`ALTER TABLE properties_new RENAME TO properties;`);

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
    CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);
    CREATE INDEX IF NOT EXISTS idx_properties_approved ON properties(approved);
  `);

  console.log('✅ Migration 002 reverted: Removed "Sold" status from properties.approved column');
};
