export const createTables = `
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  mobile_no TEXT NOT NULL,
  status TEXT DEFAULT 'CREATED' CHECK(status IN ('ACTIVE', 'PENDING', 'CREATED', 'SUSPENDED')),
  user_type TEXT DEFAULT 'Agent' CHECK(user_type IN ('Agent', 'Buyer', 'Admin')),
  image TEXT,
  aadhar_front TEXT,
  aadhar_back TEXT,
  pan TEXT,
  vpa TEXT,
  referral_code TEXT,
  is_kyc_verified INTEGER DEFAULT 0,
  created_date TEXT DEFAULT (datetime('now')),
  updated_date TEXT DEFAULT (datetime('now'))
);

-- Properties table
CREATE TABLE IF NOT EXISTS properties (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  sub_title TEXT,
  price TEXT NOT NULL,
  number_of_rooms TEXT,
  bhk TEXT,
  location TEXT NOT NULL,
  city TEXT NOT NULL CHECK(city IN ('Bangalore', 'Hyderabad', 'Mumbai', 'Chennai')),
  main_image TEXT NOT NULL,
  images TEXT, -- JSON array of image objects
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

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_property_type TEXT NOT NULL CHECK(lead_property_type IN ('Buy', 'Rent', 'Sell')),
  property_type TEXT CHECK(property_type IN ('Rent', 'Plot', 'Flat', 'Commercial', 'Farmland')),
  mobile_no TEXT NOT NULL,
  full_name TEXT NOT NULL,
  status TEXT DEFAULT 'Open' CHECK(status IN ('Open', 'Closed')),
  lead_comment_model TEXT, -- JSON array of comment objects
  created_by_id INTEGER NOT NULL,
  property_id INTEGER,
  created_date TEXT DEFAULT (datetime('now')),
  updated_date TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (created_by_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE SET NULL
);

-- Favorites table (junction table)
CREATE TABLE IF NOT EXISTS favorites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  property_id INTEGER NOT NULL,
  created_date TEXT DEFAULT (datetime('now')),
  UNIQUE(user_id, property_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_approved ON properties(approved);
CREATE INDEX IF NOT EXISTS idx_leads_created_by ON leads(created_by_id);
CREATE INDEX IF NOT EXISTS idx_leads_property ON leads(property_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_property ON favorites(property_id);
`;
