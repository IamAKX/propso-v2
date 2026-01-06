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
      'Residential',
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
      'Residential',
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
      'Residential',
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
      'Residential',
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
      'Residential',
      '3500',
      'Sqft',
      'Ultra-luxury penthouse with panoramic city views, private terrace, jacuzzi, and premium Italian marble flooring.',
      '9876543215',
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
      'Residential',
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
      'Residential',
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
