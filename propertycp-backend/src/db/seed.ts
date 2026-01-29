import db from './database';
import bcrypt from 'bcrypt';

export const seedDatabase = () => {
  console.log('Seeding database with sample data...');

  // Check if data already exists
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  if (userCount.count > 0) {
    console.log('Database already seeded. Skipping...');
    return;
  }

  const hashedPassword = bcrypt.hashSync('password123', 10);
  const hashedAdminPassword = bcrypt.hashSync('admin123', 10);

  // Insert users
  const insertUser = db.prepare(`
    INSERT INTO users (full_name, email, password, mobile_no, status, user_type, image, vpa, referral_code, is_kyc_verified)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const users = [
    ['John Doe', 'john@example.com', hashedPassword, '9876543210', 'ACTIVE', 'Agent', 'https://i.pravatar.cc/150?img=12', 'john@upi', 'REF001', 1],
    ['Jane Smith', 'jane@example.com', hashedPassword, '9876543211', 'ACTIVE', 'Agent', 'https://i.pravatar.cc/150?img=45', 'jane@upi', 'REF002', 1],
    ['Admin User', 'admin@example.com', hashedAdminPassword, '9876543212', 'ACTIVE', 'Admin', 'https://i.pravatar.cc/150?img=33', 'admin@upi', 'ADMIN001', 1],
  ];

  const insertMany = db.transaction((users) => {
    for (const user of users) {
      insertUser.run(...user);
    }
  });
  insertMany(users);
  console.log('✓ Users seeded');

  // Insert properties
  const insertProperty = db.prepare(`
    INSERT INTO properties (title, sub_title, price, number_of_rooms, bhk, location, city, main_image, images, type, area, area_unit, description, builder_phone_number)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const properties = [
    [
      'Luxury 3BHK Apartment',
      'Prime Location in City Center',
      '5000000',
      '5',
      '3',
      'MG Road, Bangalore',
      'Bangalore',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
      JSON.stringify([
        { id: 1, link: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800', isVideo: false, propertyId: 1 },
        { id: 2, link: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800', isVideo: false, propertyId: 1 },
        { id: 3, link: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', isVideo: false, propertyId: 1 },
        { id: 4, link: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', isVideo: false, propertyId: 1 },
      ]),
      'Flat',
      '1500',
      'Sqft',
      'Beautiful luxury apartment with modern amenities, spacious rooms, and excellent ventilation. Located in the heart of the city with easy access to schools, hospitals, and shopping centers.',
      '9876543210',
    ],
    [
      'Modern 2BHK Flat',
      'Near Metro Station',
      '3500000',
      '4',
      '2',
      'Whitefield, Bangalore',
      'Bangalore',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      JSON.stringify([
        { id: 5, link: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', isVideo: false, propertyId: 2 },
        { id: 6, link: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', isVideo: false, propertyId: 2 },
        { id: 7, link: 'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800', isVideo: false, propertyId: 2 },
      ]),
      'Flat',
      '1100',
      'Sqft',
      'Newly constructed modern flat with premium fittings. Close to IT parks and metro station. Perfect for working professionals.',
      '9876543211',
    ],
    [
      'Spacious 4BHK Villa',
      'Independent House with Garden',
      '12000000',
      '7',
      '4',
      'Sarjapur Road, Bangalore',
      'Bangalore',
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
      JSON.stringify([
        { id: 8, link: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800', isVideo: false, propertyId: 3 },
        { id: 9, link: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800', isVideo: false, propertyId: 3 },
        { id: 10, link: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800', isVideo: false, propertyId: 3 },
        { id: 11, link: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800', isVideo: false, propertyId: 3 },
      ]),
      'Flat',
      '2500',
      'Sqft',
      'Luxurious independent villa with large garden, parking for 3 cars, and premium interiors. Gated community with 24/7 security.',
      '9876543212',
    ],
    [
      'Commercial Office Space',
      'Premium Business Location',
      '8000000',
      '6',
      null,
      'Koramangala, Bangalore',
      'Bangalore',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
      JSON.stringify([
        { id: 12, link: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800', isVideo: false, propertyId: 4 },
        { id: 13, link: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800', isVideo: false, propertyId: 4 },
      ]),
      'Commercial',
      '2000',
      'Sqft',
      'Ready to move commercial space with modern facilities. Ideal for startups and small businesses. High-speed internet and power backup included.',
      '9876543213',
    ],
    [
      'Studio Apartment',
      'Perfect for Singles',
      '2500000',
      '2',
      '1',
      'Indiranagar, Bangalore',
      'Bangalore',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      JSON.stringify([
        { id: 14, link: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', isVideo: false, propertyId: 5 },
        { id: 15, link: 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800', isVideo: false, propertyId: 5 },
      ]),
      'Flat',
      '650',
      'Sqft',
      'Cozy studio apartment with modern amenities. Perfect for young professionals. Walking distance to cafes and restaurants.',
      '9876543214',
    ],
    [
      'Penthouse Suite',
      'Top Floor with City View',
      '15000000',
      '8',
      '4',
      'UB City, Bangalore',
      'Bangalore',
      'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800',
      JSON.stringify([
        { id: 16, link: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800', isVideo: false, propertyId: 6 },
        { id: 17, link: 'https://images.unsplash.com/photo-1600585152915-d208bec867a1?w=800', isVideo: false, propertyId: 6 },
        { id: 18, link: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', isVideo: false, propertyId: 6 },
      ]),
      'Flat',
      '3500',
      'Sqft',
      'Ultra-luxury penthouse with panoramic city views, private terrace, jacuzzi, and premium Italian marble flooring.',
      '9876543215',
    ],
    [
      'Plot for Sale',
      'Ready to Construct',
      '4500000',
      null,
      null,
      'Gachibowli, Hyderabad',
      'Hyderabad',
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
      JSON.stringify([
        { id: 19, link: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800', isVideo: false, propertyId: 7 },
        { id: 20, link: 'https://images.unsplash.com/photo-1464146072230-91cabc968266?w=800', isVideo: false, propertyId: 7 },
      ]),
      'Plot',
      '2400',
      'Sqft',
      'Prime residential plot in developing area. Clear title, HMDA approved. Excellent investment opportunity with good appreciation potential.',
      '9876543216',
    ],
    [
      'Rental Apartment',
      'Fully Furnished 2BHK',
      '25000',
      '4',
      '2',
      'Bandra West, Mumbai',
      'Mumbai',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      JSON.stringify([
        { id: 21, link: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', isVideo: false, propertyId: 8 },
        { id: 22, link: 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800', isVideo: false, propertyId: 8 },
      ]),
      'Rent',
      '1200',
      'Sqft',
      'Beautifully furnished 2BHK apartment available for rent. Sea-facing, modern amenities, gym, and swimming pool. Monthly rent.',
      '9876543217',
    ],
    [
      'Commercial Showroom',
      'High Street Location',
      '18000000',
      null,
      null,
      'Anna Nagar, Chennai',
      'Chennai',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
      JSON.stringify([
        { id: 23, link: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800', isVideo: false, propertyId: 9 },
        { id: 24, link: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800', isVideo: false, propertyId: 9 },
      ]),
      'Commercial',
      '3000',
      'Sqft',
      'Premium showroom space on main road. High footfall area, perfect for retail business. Ample parking space available.',
      '9876543218',
    ],
    [
      'Farmland',
      'Agricultural Land with Water',
      '6000000',
      null,
      null,
      'Outskirts, Hyderabad',
      'Hyderabad',
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
      JSON.stringify([
        { id: 25, link: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800', isVideo: false, propertyId: 10 },
        { id: 26, link: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800', isVideo: false, propertyId: 10 },
      ]),
      'Farmland',
      '5',
      'Acres',
      'Fertile agricultural land with borewells and electricity connection. Suitable for organic farming. Peaceful location away from city.',
      '9876543219',
    ],
    [
      '3BHK Apartment',
      'Spacious Family Home',
      '7500000',
      '5',
      '3',
      'Andheri East, Mumbai',
      'Mumbai',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
      JSON.stringify([
        { id: 27, link: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800', isVideo: false, propertyId: 11 },
        { id: 28, link: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800', isVideo: false, propertyId: 11 },
      ]),
      'Flat',
      '1800',
      'Sqft',
      'Spacious 3BHK with balconies in all rooms. Well-connected to metro, schools, and hospitals. Society with all modern amenities.',
      '9876543220',
    ],
    [
      'Residential Plot',
      'DTCP Approved',
      '3200000',
      null,
      null,
      'OMR Road, Chennai',
      'Chennai',
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
      JSON.stringify([
        { id: 29, link: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800', isVideo: false, propertyId: 12 },
      ]),
      'Plot',
      '1800',
      'Sqft',
      'DTCP approved residential plot in gated community. All basic amenities available. Near IT corridor.',
      '9876543221',
    ],
    [
      'Luxury Penthouse',
      '5BHK with Private Pool',
      '28000000',
      '9',
      '5',
      'Banjara Hills, Hyderabad',
      'Hyderabad',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
      JSON.stringify([
        { id: 30, link: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', isVideo: false, propertyId: 13 },
        { id: 31, link: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800', isVideo: false, propertyId: 13 },
      ]),
      'Flat',
      '4200',
      'Sqft',
      'Ultra-luxury penthouse with private swimming pool, home theater, and panoramic city views. Premium Italian marble flooring throughout.',
      '9876543222',
    ],
    [
      'Commercial Complex',
      'Multi-Storey Shopping Mall',
      '150000000',
      null,
      null,
      'Powai, Mumbai',
      'Mumbai',
      'https://images.unsplash.com/photo-1519642918688-7e101c5e6e47?w=800',
      JSON.stringify([
        { id: 32, link: 'https://images.unsplash.com/photo-1519642918688-7e101c5e6e47?w=800', isVideo: false, propertyId: 14 },
        { id: 33, link: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800', isVideo: false, propertyId: 14 },
      ]),
      'Commercial',
      '50000',
      'Sqft',
      'Premium shopping complex with multiple floors. High footfall area, excellent investment opportunity. Food court and entertainment zone included.',
      '9876543223',
    ],
    [
      'Budget Rental Home',
      '1BHK Furnished',
      '12000',
      '2',
      '1',
      'Madipakkam, Chennai',
      'Chennai',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      JSON.stringify([
        { id: 34, link: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', isVideo: false, propertyId: 15 },
      ]),
      'Rent',
      '550',
      'Sqft',
      'Affordable 1BHK apartment for rent. Fully furnished with bed, wardrobe, and kitchen appliances. Monthly rental, 2 months deposit.',
      '9876543224',
    ],
    [
      'IT Park Office Space',
      'Ready-to-Move Commercial',
      '45000000',
      null,
      null,
      'Hitech City, Hyderabad',
      'Hyderabad',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800',
      JSON.stringify([
        { id: 35, link: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800', isVideo: false, propertyId: 16 },
        { id: 36, link: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800', isVideo: false, propertyId: 16 },
      ]),
      'Commercial',
      '8000',
      'Sqft',
      'Grade A commercial office space in IT corridor. Central AC, high-speed elevators, 24/7 security, and power backup. Perfect for tech companies.',
      '9876543225',
    ],
    [
      'Farmhouse Plot',
      'Scenic Location with Mango Trees',
      '8500000',
      null,
      null,
      'Kanakapura Road, Bangalore',
      'Bangalore',
      'https://images.unsplash.com/photo-1500076656116-558758c991c1?w=800',
      JSON.stringify([
        { id: 37, link: 'https://images.unsplash.com/photo-1500076656116-558758c991c1?w=800', isVideo: false, propertyId: 17 },
        { id: 38, link: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800', isVideo: false, propertyId: 17 },
      ]),
      'Farmland',
      '3',
      'Acres',
      'Beautiful farmland with mature mango trees, natural water source, and electricity. Perfect weekend getaway spot with potential for organic farming.',
      '9876543226',
    ],
    [
      'Beach View Apartment',
      '2BHK Sea Facing',
      '18000',
      '4',
      '2',
      'Juhu, Mumbai',
      'Mumbai',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      JSON.stringify([
        { id: 39, link: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', isVideo: false, propertyId: 18 },
        { id: 40, link: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800', isVideo: false, propertyId: 18 },
      ]),
      'Rent',
      '1100',
      'Sqft',
      'Premium 2BHK rental apartment with stunning sea view. Fully furnished with modern amenities, gym, and swimming pool. Available immediately.',
      '9876543227',
    ],
    [
      'Investment Plot',
      'HMDA Approved',
      '5500000',
      null,
      null,
      'Shamshabad, Hyderabad',
      'Hyderabad',
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
      JSON.stringify([
        { id: 41, link: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800', isVideo: false, propertyId: 19 },
      ]),
      'Plot',
      '3000',
      'Sqft',
      'HMDA approved plot near airport. Excellent investment opportunity with high appreciation potential. Clear title, ready for construction.',
      '9876543228',
    ],
    [
      'Heritage Villa',
      'Colonial Architecture',
      '35000000',
      '8',
      '4',
      'Alwarpet, Chennai',
      'Chennai',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      JSON.stringify([
        { id: 42, link: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', isVideo: false, propertyId: 20 },
        { id: 43, link: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', isVideo: false, propertyId: 20 },
      ]),
      'Flat',
      '5000',
      'Sqft',
      'Beautiful colonial style heritage villa with vintage architecture. Large garden, antique interiors, and modern amenities. Prime location.',
      '9876543229',
    ],
    [
      'Warehouse Space',
      'Godown with Loading Dock',
      '22000000',
      null,
      null,
      'Turbhe, Mumbai',
      'Mumbai',
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800',
      JSON.stringify([
        { id: 44, link: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800', isVideo: false, propertyId: 21 },
      ]),
      'Commercial',
      '15000',
      'Sqft',
      'Large warehouse with loading dock facilities. 24/7 security, CCTV surveillance, and ample parking. Ideal for logistics and distribution.',
      '9876543230',
    ],
    [
      'Organic Farmland',
      'Coconut Plantation',
      '7200000',
      null,
      null,
      'ECR, Chennai',
      'Chennai',
      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800',
      JSON.stringify([
        { id: 45, link: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800', isVideo: false, propertyId: 22 },
        { id: 46, link: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800', isVideo: false, propertyId: 22 },
      ]),
      'Farmland',
      '4',
      'Acres',
      'Certified organic coconut plantation with regular yield. Drip irrigation, farm house, and caretaker quarters. Near ECR beach.',
      '9876543231',
    ],
    [
      'Student Housing',
      'PG Accommodation',
      '8000',
      '10',
      null,
      'Kukatpally, Hyderabad',
      'Hyderabad',
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
      JSON.stringify([
        { id: 47, link: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800', isVideo: false, propertyId: 23 },
      ]),
      'Rent',
      '3000',
      'Sqft',
      'PG accommodation for students and working professionals. Fully furnished rooms, meals included, WiFi, laundry, and housekeeping services.',
      '9876543232',
    ],
    [
      'Gated Community Plot',
      'Premium Villa Plot',
      '12000000',
      null,
      null,
      'Whitefield, Bangalore',
      'Bangalore',
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
      JSON.stringify([
        { id: 48, link: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800', isVideo: false, propertyId: 24 },
      ]),
      'Plot',
      '4000',
      'Sqft',
      'Premium villa plot in gated community with clubhouse, swimming pool, and 24/7 security. Near IT parks and international schools.',
      '9876543233',
    ],
    [
      'Retail Shop',
      'Ground Floor Corner',
      '8500000',
      null,
      null,
      'Linking Road, Mumbai',
      'Mumbai',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
      JSON.stringify([
        { id: 49, link: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800', isVideo: false, propertyId: 25 },
      ]),
      'Commercial',
      '800',
      'Sqft',
      'Prime retail shop on ground floor corner. High visibility location with heavy footfall. Perfect for boutique, café, or showroom.',
      '9876543234',
    ],
  ];

  const insertManyProperties = db.transaction((properties) => {
    for (const property of properties) {
      insertProperty.run(...property);
    }
  });
  insertManyProperties(properties);
  console.log('✓ Properties seeded');

  // Insert leads
  const insertLead = db.prepare(`
    INSERT INTO leads (lead_property_type, property_type, mobile_no, full_name, status, lead_comment_model, created_by_id, property_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const leads = [
    [
      'Buy',
      'Flat',
      '9988776655',
      'Rahul Kumar',
      'Open',
      JSON.stringify([
        { id: 1, comment: 'Customer interested in 3BHK apartments', leadId: 1, createdDate: new Date('2023-10-21T10:00:00').toISOString() },
        { id: 2, comment: 'Scheduled property visit for tomorrow', leadId: 1, createdDate: new Date('2023-10-21T14:30:00').toISOString() },
      ]),
      1,
      1,
    ],
    [
      'Rent',
      'Commercial',
      '9988776656',
      'Priya Sharma',
      'Open',
      JSON.stringify([
        { id: 3, comment: 'Looking for office space in Koramangala', leadId: 2, createdDate: new Date('2023-10-22T09:00:00').toISOString() },
      ]),
      1,
      4,
    ],
    [
      'Buy',
      'Flat',
      '9988776657',
      'Amit Patel',
      'Closed',
      JSON.stringify([
        { id: 4, comment: 'Interested in villa', leadId: 3, createdDate: new Date('2023-10-18T11:00:00').toISOString() },
        { id: 5, comment: 'Deal finalized, booking done', leadId: 3, createdDate: new Date('2023-10-20T16:00:00').toISOString() },
      ]),
      2,
      3,
    ],
  ];

  const insertManyLeads = db.transaction((leads) => {
    for (const lead of leads) {
      insertLead.run(...lead);
    }
  });
  insertManyLeads(leads);
  console.log('✓ Leads seeded');

  console.log('Database seeding completed!');
};
