# SQLite Database Guide - Ubuntu/Linux

Complete guide for connecting to and managing PropertyCP SQLite database on Ubuntu/Linux systems.

---

## Database Location

```
/home/ubuntu/propertycp/propertycp-backend/database/propertycp.db
```

---

## Installation on Ubuntu

### Install SQLite3

```bash
# Update package manager
sudo apt update

# Install SQLite3
sudo apt install -y sqlite3

# Verify installation
sqlite3 --version
```

### Install Optional GUI Tools

```bash
# DB Browser for SQLite
sudo apt install -y sqlitebrowser

# Or install DBeaver
sudo snap install dbeaver-ce

# Or using apt
sudo apt install -y dbeaver-community
```

---

## Quick Connection

### Method 1: Direct Command Line (Fastest)

```bash
# Connect to database
sqlite3 /home/ubuntu/propertycp/propertycp-backend/database/propertycp.db

# You'll see sqlite> prompt
# Type SQL queries directly
```

### Method 2: Via Docker Container (If Backend Running)

```bash
# Access backend container
docker compose exec backend sh

# Connect to database inside container
sqlite3 /app/database/propertycp.db

# Now run queries
```

---

## Essential Commands Reference

### List All Databases

```bash
# SQLite doesn't have multiple databases in one file like MySQL
# But you can list all .db files in the project:

find /home/ubuntu/propertycp -name "*.db" -type f -exec ls -lh {} \;

# Output will show:
# -rw-r--r-- 1 ubuntu ubuntu 1.2M Jan 11 10:30 /home/ubuntu/propertycp/propertycp-backend/database/propertycp.db
```

### Connect to Specific Database

```bash
# Connect to propertycp database
sqlite3 /home/ubuntu/propertycp/propertycp-backend/database/propertycp.db

# Inside SQLite CLI, you can also attach other databases if needed:
# ATTACH DATABASE '/path/to/other.db' AS other_db;
```

---

## SQLite CLI Commands (After `sqlite3 propertycp.db`)

### List All Tables

```sql
-- Method 1: List all tables
.tables

-- Method 2: Query sqlite_master for more details
SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;

-- Output should show:
-- favorites  leads  properties  users

-- Method 3: Get table count
SELECT COUNT(*) as table_count FROM sqlite_master WHERE type='table';
```

### Show Table Schema

```sql
-- Show schema of users table
.schema users

-- Show schema of properties table
.schema properties

-- Show all schemas
.schema

-- Show specific column info
PRAGMA table_info(users);
PRAGMA table_info(properties);
```

### Format Output

```sql
-- Pretty print with headers
.mode column
.headers on

-- Set column widths for readability
.width 10 20 30

-- Alternative formats
.mode list      -- Values separated by |
.mode csv       -- Comma-separated
.mode json      -- JSON format
.mode table     -- Nice ASCII table
```

---

## All Tables Query Commands

### Complete Database Dump

```bash
# Backup entire database structure and data
sqlite3 /home/ubuntu/propertycp/propertycp-backend/database/propertycp.db ".dump" > database_backup.sql

# Then view it
cat database_backup.sql
```

### Query All Tables with Row Counts

```sql
-- Count rows in each table
SELECT 
  'users' as table_name, COUNT(*) as row_count FROM users
UNION ALL
SELECT 'properties', COUNT(*) FROM properties
UNION ALL
SELECT 'leads', COUNT(*) FROM leads
UNION ALL
SELECT 'favorites', COUNT(*) FROM favorites;
```

---

## Detailed Query Examples

### 1. Users Table - Complete

```sql
-- Select all users with all columns
SELECT * FROM users;

-- Select specific columns
SELECT id, firstName, lastName, email, status, isKycVerified FROM users;

-- Select with formatting
.mode column
.headers on
SELECT 
  id,
  firstName,
  lastName,
  email,
  status,
  isKycVerified,
  createdAt
FROM users;

-- Count total users
SELECT COUNT(*) as total_users FROM users;

-- Count by status
SELECT status, COUNT(*) as count FROM users GROUP BY status;

-- Count KYC verified
SELECT 
  COUNT(*) as total_users,
  SUM(CASE WHEN isKycVerified = 1 THEN 1 ELSE 0 END) as kyc_verified,
  SUM(CASE WHEN isKycVerified = 0 THEN 1 ELSE 0 END) as kyc_pending
FROM users;

-- Users with S3 KYC documents
SELECT 
  id, 
  firstName, 
  email,
  CASE WHEN aadhar_front IS NOT NULL THEN 'Yes' ELSE 'No' END as has_aadhar_front,
  CASE WHEN aadhar_back IS NOT NULL THEN 'Yes' ELSE 'No' END as has_aadhar_back,
  CASE WHEN pan IS NOT NULL THEN 'Yes' ELSE 'No' END as has_pan
FROM users;

-- First 10 users
SELECT * FROM users LIMIT 10;

-- Last 5 created users
SELECT * FROM users ORDER BY createdAt DESC LIMIT 5;
```

### 2. Properties Table - Complete

```sql
-- Select all properties
SELECT * FROM properties;

-- Select with better formatting
.mode column
.headers on
SELECT 
  id,
  title,
  price,
  bhk,
  city,
  location,
  createdAt
FROM properties;

-- Count total properties
SELECT COUNT(*) as total_properties FROM properties;

-- Properties by city
SELECT city, COUNT(*) as count FROM properties GROUP BY city ORDER BY count DESC;

-- Properties by BHK
SELECT bhk, COUNT(*) as count FROM properties GROUP BY bhk ORDER BY bhk;

-- Properties with images (S3)
SELECT 
  id,
  title,
  CASE WHEN images IS NOT NULL THEN 'Yes' ELSE 'No' END as has_images,
  CASE WHEN mainImage IS NOT NULL THEN 'Yes' ELSE 'No' END as has_main_image
FROM properties;

-- Property with details
SELECT 
  p.id,
  p.title,
  p.price,
  p.bhk,
  p.city,
  p.location,
  u.firstName,
  u.lastName
FROM properties p
LEFT JOIN users u ON p.createdById = u.id;

-- Top 10 properties by price
SELECT * FROM properties ORDER BY price DESC LIMIT 10;

-- Properties in specific city
SELECT * FROM properties WHERE city = 'Bangalore';

-- Properties within price range
SELECT * FROM properties WHERE price BETWEEN 1000000 AND 5000000;
```

### 3. Leads Table - Complete

```sql
-- Select all leads
SELECT * FROM leads;

-- Leads with user and property info
SELECT 
  l.id,
  l.status,
  u.firstName as user_name,
  u.email,
  p.title as property_title,
  p.price,
  l.comment,
  l.createdAt
FROM leads l
LEFT JOIN users u ON l.userId = u.id
LEFT JOIN properties p ON l.propertyId = p.id;

-- Count leads by status
SELECT status, COUNT(*) as count FROM leads GROUP BY status;

-- Count total leads
SELECT COUNT(*) as total_leads FROM leads;

-- Recent leads (last 10)
SELECT * FROM leads ORDER BY createdAt DESC LIMIT 10;

-- Leads for specific property
SELECT 
  l.id,
  u.firstName,
  u.email,
  l.status,
  l.comment
FROM leads l
LEFT JOIN users u ON l.userId = u.id
WHERE l.propertyId = 1;

-- Top properties by leads
SELECT 
  p.id,
  p.title,
  COUNT(l.id) as lead_count
FROM properties p
LEFT JOIN leads l ON p.id = l.propertyId
GROUP BY p.id
ORDER BY lead_count DESC;
```

### 4. Favorites Table - Complete

```sql
-- Select all favorites
SELECT * FROM favorites;

-- Favorites with user and property info
SELECT 
  f.id,
  u.firstName as user_name,
  u.email,
  p.title as property_title,
  p.price,
  p.city,
  f.createdAt
FROM favorites f
LEFT JOIN users u ON f.userId = u.id
LEFT JOIN properties p ON f.propertyId = p.id;

-- Count total favorites
SELECT COUNT(*) as total_favorites FROM favorites;

-- Most favorited properties
SELECT 
  p.id,
  p.title,
  p.price,
  COUNT(f.id) as favorite_count
FROM properties p
LEFT JOIN favorites f ON p.id = f.propertyId
GROUP BY p.id
ORDER BY favorite_count DESC;

-- User's favorite count
SELECT 
  u.firstName,
  u.email,
  COUNT(f.id) as favorite_count
FROM users u
LEFT JOIN favorites f ON u.id = f.userId
GROUP BY u.id
ORDER BY favorite_count DESC;

-- Check if user favorited specific property
SELECT * FROM favorites WHERE userId = 1 AND propertyId = 1;
```

---

## Complete Query Template File

Create a file `queries.sql` with all queries:

```bash
cat > queries.sql << 'EOF'
-- ===========================
-- USERS TABLE QUERIES
-- ===========================

-- 1. All Users
SELECT id, firstName, lastName, email, status, isKycVerified, createdAt FROM users;

-- 2. User Count
SELECT COUNT(*) as total_users FROM users;

-- 3. Users by Status
SELECT status, COUNT(*) as count FROM users GROUP BY status;

-- 4. KYC Status Summary
SELECT 
  COUNT(*) as total_users,
  SUM(CASE WHEN isKycVerified = 1 THEN 1 ELSE 0 END) as kyc_verified,
  SUM(CASE WHEN isKycVerified = 0 THEN 1 ELSE 0 END) as kyc_pending
FROM users;

-- 5. Users with S3 Documents
SELECT 
  id, 
  firstName, 
  email,
  CASE WHEN aadhar_front IS NOT NULL THEN 'Yes' ELSE 'No' END as has_aadhar_front,
  CASE WHEN aadhar_back IS NOT NULL THEN 'Yes' ELSE 'No' END as has_aadhar_back,
  CASE WHEN pan IS NOT NULL THEN 'Yes' ELSE 'No' END as has_pan
FROM users;

-- ===========================
-- PROPERTIES TABLE QUERIES
-- ===========================

-- 1. All Properties
SELECT id, title, price, bhk, city, location, createdAt FROM properties;

-- 2. Property Count
SELECT COUNT(*) as total_properties FROM properties;

-- 3. Properties by City
SELECT city, COUNT(*) as count FROM properties GROUP BY city ORDER BY count DESC;

-- 4. Properties by BHK
SELECT bhk, COUNT(*) as count FROM properties GROUP BY bhk ORDER BY bhk;

-- 5. Properties with Creator Info
SELECT 
  p.id, p.title, p.price, p.bhk, p.city,
  u.firstName, u.lastName, u.email
FROM properties p
LEFT JOIN users u ON p.createdById = u.id;

-- 6. Properties with Images Status
SELECT 
  id, title, price,
  CASE WHEN images IS NOT NULL THEN 'Yes' ELSE 'No' END as has_images,
  CASE WHEN mainImage IS NOT NULL THEN 'Yes' ELSE 'No' END as has_main_image
FROM properties;

-- 7. Top 10 Properties by Price
SELECT * FROM properties ORDER BY price DESC LIMIT 10;

-- ===========================
-- LEADS TABLE QUERIES
-- ===========================

-- 1. All Leads with Details
SELECT 
  l.id, l.status, 
  u.firstName, u.email,
  p.title, p.price,
  l.comment, l.createdAt
FROM leads l
LEFT JOIN users u ON l.userId = u.id
LEFT JOIN properties p ON l.propertyId = p.id;

-- 2. Lead Count by Status
SELECT status, COUNT(*) as count FROM leads GROUP BY status;

-- 3. Total Leads
SELECT COUNT(*) as total_leads FROM leads;

-- 4. Recent Leads
SELECT * FROM leads ORDER BY createdAt DESC LIMIT 10;

-- 5. Top Properties by Leads
SELECT 
  p.id, p.title,
  COUNT(l.id) as lead_count
FROM properties p
LEFT JOIN leads l ON p.id = l.propertyId
GROUP BY p.id
ORDER BY lead_count DESC;

-- ===========================
-- FAVORITES TABLE QUERIES
-- ===========================

-- 1. All Favorites with Details
SELECT 
  f.id,
  u.firstName, u.email,
  p.title, p.price, p.city,
  f.createdAt
FROM favorites f
LEFT JOIN users u ON f.userId = u.id
LEFT JOIN properties p ON f.propertyId = p.id;

-- 2. Total Favorites
SELECT COUNT(*) as total_favorites FROM favorites;

-- 3. Most Favorited Properties
SELECT 
  p.id, p.title, p.price,
  COUNT(f.id) as favorite_count
FROM properties p
LEFT JOIN favorites f ON p.id = f.propertyId
GROUP BY p.id
ORDER BY favorite_count DESC;

-- 4. Users' Favorite Count
SELECT 
  u.firstName, u.email,
  COUNT(f.id) as favorite_count
FROM users u
LEFT JOIN favorites f ON u.id = f.userId
GROUP BY u.id
ORDER BY favorite_count DESC;

-- ===========================
-- SUMMARY/STATISTICS
-- ===========================

-- 1. Complete Database Summary
SELECT 
  'Users' as entity, COUNT(*) as count FROM users
UNION ALL
SELECT 'Properties', COUNT(*) FROM properties
UNION ALL
SELECT 'Leads', COUNT(*) FROM leads
UNION ALL
SELECT 'Favorites', COUNT(*) FROM favorites;

-- 2. Active Users with Properties
SELECT 
  u.id, u.firstName, u.email, u.status,
  COUNT(p.id) as property_count
FROM users u
LEFT JOIN properties p ON u.id = p.createdById
WHERE u.status = 'ACTIVE'
GROUP BY u.id;

-- 3. Revenue Summary (if applicable)
SELECT 
  COUNT(p.id) as total_properties,
  SUM(p.price) as total_value,
  AVG(p.price) as avg_price,
  MIN(p.price) as min_price,
  MAX(p.price) as max_price
FROM properties p;

EOF

# Now run all queries
sqlite3 /home/ubuntu/propertycp/propertycp-backend/database/propertycp.db < queries.sql
```

---

## Run Queries from Command Line

### Single Query

```bash
# Run one query
sqlite3 /home/ubuntu/propertycp/propertycp-backend/database/propertycp.db "SELECT * FROM users LIMIT 5;"

# With formatting
sqlite3 /home/ubuntu/propertycp/propertycp-backend/database/propertycp.db ".mode column" ".headers on" "SELECT * FROM users;"
```

### Multiple Queries from File

```bash
# Execute all queries from file
sqlite3 /home/ubuntu/propertycp/propertycp-backend/database/propertycp.db < queries.sql

# Export results to file
sqlite3 /home/ubuntu/propertycp/propertycp-backend/database/propertycp.db < queries.sql > results.txt
```

### Interactive Session

```bash
# Start interactive session
sqlite3 /home/ubuntu/propertycp/propertycp-backend/database/propertycp.db

# Then type queries:
sqlite> .tables
sqlite> SELECT * FROM users;
sqlite> .quit
```

---

## Export/Backup Commands

### Backup Full Database

```bash
# Backup with timestamp
sqlite3 /home/ubuntu/propertycp/propertycp-backend/database/propertycp.db ".dump" > ~/propertycp_backup_$(date +%Y%m%d_%H%M%S).sql

# Simple backup
cp /home/ubuntu/propertycp/propertycp-backend/database/propertycp.db ~/propertycp.db.backup
```

### Export Table to CSV

```bash
# Export users table
sqlite3 /home/ubuntu/propertycp/propertycp-backend/database/propertycp.db ".mode csv" ".output users.csv" "SELECT * FROM users;" ".output stdout"

# Export properties table
sqlite3 /home/ubuntu/propertycp/propertycp-backend/database/propertycp.db ".mode csv" ".output properties.csv" "SELECT * FROM properties;" ".output stdout"

# Export all tables
for table in users properties leads favorites; do
  sqlite3 /home/ubuntu/propertycp/propertycp-backend/database/propertycp.db ".mode csv" ".output $table.csv" "SELECT * FROM $table;" ".output stdout"
  echo "Exported $table.csv"
done
```

### Export to JSON

```bash
# Export users as JSON
sqlite3 /home/ubuntu/propertycp/propertycp-backend/database/propertycp.db ".mode json" "SELECT * FROM users;" > users.json

# Export properties as JSON
sqlite3 /home/ubuntu/propertycp/propertycp-backend/database/propertycp.db ".mode json" "SELECT * FROM properties;" > properties.json
```

---

## Database Information

### Check Database Size

```bash
# Size of database file
du -h /home/ubuntu/propertycp/propertycp-backend/database/propertycp.db

# Size of all database files
du -h /home/ubuntu/propertycp/propertycp-backend/database/

# Detailed info
ls -lh /home/ubuntu/propertycp/propertycp-backend/database/propertycp.db
```

### Get Database Statistics

```sql
-- Inside SQLite CLI
PRAGMA page_count;           -- Total pages
PRAGMA page_size;            -- Page size in bytes
PRAGMA freelist_count;       -- Free pages
```

---

## Common Operations - Quick Reference

### Start Here - Step by Step

```bash
# Step 1: Connect to database
sqlite3 /home/ubuntu/propertycp/propertycp-backend/database/propertycp.db

# Step 2: Inside SQLite CLI - List all tables
.tables

# Step 3: View users table
SELECT * FROM users;

# Step 4: View properties table
SELECT * FROM properties;

# Step 5: View leads table
SELECT * FROM leads;

# Step 6: View favorites table
SELECT * FROM favorites;

# Step 7: Get summary
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM properties;
SELECT COUNT(*) FROM leads;
SELECT COUNT(*) FROM favorites;

# Step 8: Exit
.quit
```

### One-Liner Commands

```bash
# List all tables
sqlite3 /home/ubuntu/propertycp/propertycp-backend/database/propertycp.db ".tables"

# Count records in each table
sqlite3 /home/ubuntu/propertycp/propertycp-backend/database/propertycp.db "SELECT 'users:' as t, COUNT(*) FROM users; SELECT 'properties:', COUNT(*) FROM properties; SELECT 'leads:', COUNT(*) FROM leads; SELECT 'favorites:', COUNT(*) FROM favorites;"

# Get database schema
sqlite3 /home/ubuntu/propertycp/propertycp-backend/database/propertycp.db ".schema"

# Get all users (formatted)
sqlite3 /home/ubuntu/propertycp/propertycp-backend/database/propertycp.db ".mode column" ".headers on" "SELECT * FROM users;"

# Get all properties (formatted)
sqlite3 /home/ubuntu/propertycp/propertycp-backend/database/propertycp.db ".mode column" ".headers on" "SELECT * FROM properties;"

# Get database file size
du -h /home/ubuntu/propertycp/propertycp-backend/database/propertycp.db
```

---

## Troubleshooting

### Database Locked

```bash
# Problem: database is locked
# Solution: Stop backend container
docker compose down

# Try again
sqlite3 /home/ubuntu/propertycp/propertycp-backend/database/propertycp.db
```

### Permission Denied

```bash
# Change permissions
chmod 644 /home/ubuntu/propertycp/propertycp-backend/database/propertycp.db

# Or with sudo if needed
sudo chmod 644 /home/ubuntu/propertycp/propertycp-backend/database/propertycp.db
```

### File Not Found

```bash
# Verify database exists
ls -lh /home/ubuntu/propertycp/propertycp-backend/database/propertycp.db

# Find all .db files
find /home/ubuntu/propertycp -name "*.db" -type f
```

---

## Tips & Best Practices

1. **Always backup before making changes**
   ```bash
   cp /home/ubuntu/propertycp/propertycp-backend/database/propertycp.db ~/backup.db
   ```

2. **Use .mode column for better readability**
   ```sql
   .mode column
   .headers on
   ```

3. **Limit results when exploring large tables**
   ```sql
   SELECT * FROM users LIMIT 10;
   ```

4. **Export important data**
   ```bash
   sqlite3 /home/ubuntu/propertycp/propertycp-backend/database/propertycp.db ".dump" > backup.sql
   ```

5. **Schedule regular backups**
   ```bash
   # Add to crontab
   0 2 * * * cp /home/ubuntu/propertycp/propertycp-backend/database/propertycp.db ~/backups/propertycp_$(date +\%Y\%m\%d).db
   ```

---

**Ready to query your database on Ubuntu! 🚀**
