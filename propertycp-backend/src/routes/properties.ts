import { Hono } from 'hono';
import db, { toCamelCase, toSnakeCase } from '../db/database';
import { authMiddleware, AuthUser, adminMiddleware } from '../middleware/auth';
import { CITIES, PROPERTY_TYPES } from '../constants';
import { deleteFromS3, extractS3KeyFromUrl } from '../services/s3';

const properties = new Hono();

// Get all properties for admin (including pending/rejected)
properties.get('/admin/all', authMiddleware, adminMiddleware, async (c) => {
  try {
    const city = c.req.query('city');
    const propertyType = c.req.query('propertyType');

    let query = 'SELECT * FROM properties';
    const conditions: string[] = [];
    const params: any[] = [];

    if (city) {
      conditions.push('city = ?');
      params.push(city);
    }

    if (propertyType) {
      conditions.push('type = ?');
      params.push(propertyType);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_date DESC';

    const allProperties = db.prepare(query).all(...params);
    const propertiesData = toCamelCase(allProperties);

    // Parse images JSON
    propertiesData.forEach((property: any) => {
      if (property.images) {
        property.images = JSON.parse(property.images);
      }
    });

    return c.json({
      success: true,
      message: 'Properties fetched successfully',
      data: propertiesData,
    });
  } catch (error: any) {
    console.error('Get admin properties error:', error);
    return c.json({
      success: false,
      message: error.message || 'Failed to fetch properties',
    }, 500);
  }
});

// Get all properties with optional filters
properties.get('/', async (c) => {
  try {
    const city = c.req.query('city');
    const propertyType = c.req.query('propertyType');

    let query = 'SELECT * FROM properties';
    const conditions: string[] = [];
    const params: any[] = [];

    // All users can only see approved properties on home page (exclude Sold)
    conditions.push('approved = ?');
    params.push('Approved');

    if (city) {
      conditions.push('city = ?');
      params.push(city);
    }

    if (propertyType) {
      conditions.push('type = ?');
      params.push(propertyType);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_date DESC';

    const allProperties = db.prepare(query).all(...params);
    const propertiesData = toCamelCase(allProperties);

    // Parse images JSON
    propertiesData.forEach((property: any) => {
      if (property.images) {
        property.images = JSON.parse(property.images);
      }
    });

    return c.json({
      success: true,
      message: 'Properties fetched successfully',
      data: propertiesData,
    });
  } catch (error: any) {
    console.error('Get properties error:', error);
    return c.json({
      success: false,
      message: error.message || 'Failed to fetch properties',
    }, 500);
  }
});

// Get property by ID
properties.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');

    const property = db.prepare('SELECT * FROM properties WHERE id = ?').get(id) as any;

    if (!property) {
      return c.json({
        success: false,
        message: 'Property not found',
      }, 404);
    }

    // All users (including admins) can only view approved properties
    if (property.approved !== 'Approved') {
      return c.json({
        success: false,
        message: 'Property not found',
      }, 404);
    }

    const propertyData = toCamelCase(property);

    // Parse images JSON
    if (propertyData.images) {
      propertyData.images = JSON.parse(propertyData.images);
    }

    return c.json({
      success: true,
      message: 'Property fetched successfully',
      data: propertyData,
    });
  } catch (error: any) {
    console.error('Get property error:', error);
    return c.json({
      success: false,
      message: error.message || 'Failed to fetch property',
    }, 500);
  }
});

// Get multiple properties by IDs (for favorites)
properties.post('/get-multiple', async (c) => {
  try {
    const { ids } = await c.req.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return c.json({
        success: false,
        message: 'Invalid input. Please provide an array of property IDs.',
      }, 400);
    }

    // Create placeholders for prepared statement
    const placeholders = ids.map(() => '?').join(', ');
    let query = `SELECT * FROM properties WHERE id IN (${placeholders})`;

    // All users (including admins) can only see approved properties
    query += ` AND approved = 'Approved'`;

    const properties = db.prepare(query).all(...ids);
    const propertiesData = toCamelCase(properties);

    // Parse images JSON for each property
    propertiesData.forEach((property: any) => {
      if (property.images) {
        property.images = JSON.parse(property.images);
      }
    });

    return c.json({
      success: true,
      message: 'Properties fetched successfully',
      data: propertiesData,
    });
  } catch (error: any) {
    console.error('Get multiple properties error:', error);
    return c.json({
      success: false,
      message: error.message || 'Failed to fetch properties',
    }, 500);
  }
});

// Create property
properties.post('/', authMiddleware, async (c) => {
  try {
    const currentUser = c.get('user') as AuthUser;
    const propertyData = await c.req.json();

    // Validate city
    if (!propertyData.city || !CITIES.includes(propertyData.city)) {
      return c.json({
        success: false,
        message: `Invalid city. Must be one of: ${CITIES.join(', ')}`,
      }, 400);
    }

    // Validate property type
    if (!propertyData.type || !PROPERTY_TYPES.includes(propertyData.type)) {
      return c.json({
        success: false,
        message: `Invalid property type. Must be one of: ${PROPERTY_TYPES.join(', ')}`,
      }, 400);
    }

    // Prepare images JSON
    const imagesJson = propertyData.images ? JSON.stringify(propertyData.images) : null;

    const insertProperty = db.prepare(`
      INSERT INTO properties (
        title, sub_title, price, number_of_rooms, bhk, location, city,
        main_image, images, type, area, area_unit, description,
        builder_phone_number, approved, created_by_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insertProperty.run(
      propertyData.title,
      propertyData.subTitle || null,
      propertyData.price,
      propertyData.numberOfRooms || null,
      propertyData.bhk || null,
      propertyData.location,
      propertyData.city,
      propertyData.mainImage,
      imagesJson,
      propertyData.type,
      propertyData.area || null,
      propertyData.areaUnit || null,
      propertyData.description || null,
      propertyData.builderPhoneNumber || null,
      'Pending', // Set approved status to Pending
      currentUser.id
    );

    // Fetch created property
    const newProperty = db.prepare('SELECT * FROM properties WHERE id = ?').get(result.lastInsertRowid);
    const newPropertyData = toCamelCase(newProperty);

    // Parse images JSON
    if (newPropertyData.images) {
      newPropertyData.images = JSON.parse(newPropertyData.images);
    }

    return c.json({
      success: true,
      message: 'Property created successfully',
      data: newPropertyData,
    }, 201);
  } catch (error: any) {
    console.error('Create property error:', error);
    return c.json({
      success: false,
      message: error.message || 'Failed to create property',
    }, 500);
  }
});

// Update property
properties.put('/:id', authMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const currentUser = c.get('user') as AuthUser;
    const updates = await c.req.json();

    // Check if property exists and user has permission
    const existingProperty = db.prepare('SELECT created_by_id FROM properties WHERE id = ?').get(id) as any;

    if (!existingProperty) {
      return c.json({
        success: false,
        message: 'Property not found',
      }, 404);
    }

    if (existingProperty.created_by_id !== currentUser.id && currentUser.userType !== 'Admin') {
      return c.json({
        success: false,
        message: 'Unauthorized to update this property',
      }, 403);
    }

    // Validate city if provided
    if (updates.city && !CITIES.includes(updates.city)) {
      return c.json({
        success: false,
        message: `Invalid city. Must be one of: ${CITIES.join(', ')}`,
      }, 400);
    }

    // Validate property type if provided
    if (updates.type && !PROPERTY_TYPES.includes(updates.type)) {
      return c.json({
        success: false,
        message: `Invalid property type. Must be one of: ${PROPERTY_TYPES.join(', ')}`,
      }, 400);
    }

    // Handle images JSON
    if (updates.images) {
      updates.images = JSON.stringify(updates.images);
    }

    // Build update query
    const snakeUpdates = toSnakeCase(updates);
    delete snakeUpdates.id;
    delete snakeUpdates.created_by_id;

    const updateFields = Object.keys(snakeUpdates)
      .map((key) => `${key} = ?`)
      .join(', ');

    if (updateFields.length === 0) {
      return c.json({
        success: false,
        message: 'No valid fields to update',
      }, 400);
    }

    const values = Object.values(snakeUpdates);
    db.prepare(`UPDATE properties SET ${updateFields}, updated_date = datetime("now") WHERE id = ?`).run(
      ...values,
      id
    );

    // Fetch updated property
    const updatedProperty = db.prepare('SELECT * FROM properties WHERE id = ?').get(id);
    const propertyData = toCamelCase(updatedProperty);

    // Parse images JSON
    if (propertyData.images) {
      propertyData.images = JSON.parse(propertyData.images);
    }

    return c.json({
      success: true,
      message: 'Property updated successfully',
      data: propertyData,
    });
  } catch (error: any) {
    console.error('Update property error:', error);
    return c.json({
      success: false,
      message: error.message || 'Failed to update property',
    }, 500);
  }
});

// Delete property (Admin only) - Deletes property, related entries, and all S3 images
properties.delete('/:id', authMiddleware, adminMiddleware, async (c) => {
  try {
    const id = c.req.param('id');

    // Check if property exists
    const property = db.prepare('SELECT * FROM properties WHERE id = ?').get(id) as any;

    if (!property) {
      return c.json({
        success: false,
        message: 'Property not found',
      }, 404);
    }

    // Delete all S3 images associated with this property
    const deletePromises: Promise<void>[] = [];

    // Delete main image
    if (property.main_image) {
      try {
        const mainImageKey = extractS3KeyFromUrl(property.main_image);
        deletePromises.push(deleteFromS3(mainImageKey));
      } catch (error) {
        console.error('Error deleting main image:', error);
      }
    }

    // Delete all other images
    if (property.images) {
      try {
        const imagesArray = JSON.parse(property.images);
        imagesArray.forEach((image: any) => {
          if (image.link) {
            try {
              const imageKey = extractS3KeyFromUrl(image.link);
              deletePromises.push(deleteFromS3(imageKey));
            } catch (error) {
              console.error(`Error deleting image ${image.id}:`, error);
            }
          }
        });
      } catch (error) {
        console.error('Error parsing images JSON:', error);
      }
    }

    // Wait for all S3 deletions to complete
    await Promise.allSettled(deletePromises);

    // Delete related entries from favorites table (will cascade due to FK constraint)
    db.prepare('DELETE FROM favorites WHERE property_id = ?').run(id);

    // Delete associated leads
    db.prepare('DELETE FROM leads WHERE property_id = ?').run(id);

    // Delete property from database
    db.prepare('DELETE FROM properties WHERE id = ?').run(id);

    return c.json({
      success: true,
      message: 'Property and all related data deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete property error:', error);
    return c.json({
      success: false,
      message: error.message || 'Failed to delete property',
    }, 500);
  }
});

// Approve property (Admin only)
properties.post('/:id/approve', authMiddleware, adminMiddleware, async (c) => {
  try {
    const id = c.req.param('id');

    // Check if property exists
    const property = db.prepare('SELECT * FROM properties WHERE id = ?').get(id) as any;

    if (!property) {
      return c.json({
        success: false,
        message: 'Property not found',
      }, 404);
    }

    // Update property approval status
    db.prepare(`
      UPDATE properties
      SET approved = 'Approved', updated_date = datetime('now')
      WHERE id = ?
    `).run(id);

    // Fetch updated property
    const updatedProperty = db.prepare('SELECT * FROM properties WHERE id = ?').get(id);
    const propertyData = toCamelCase(updatedProperty);

    // Parse images JSON
    if (propertyData.images) {
      propertyData.images = JSON.parse(propertyData.images);
    }

    return c.json({
      success: true,
      message: 'Property approved successfully',
      data: propertyData,
    });
  } catch (error: any) {
    console.error('Approve property error:', error);
    return c.json({
      success: false,
      message: error.message || 'Failed to approve property',
    }, 500);
  }
});

// Reject property (Admin only) - Deletes property and all S3 images
properties.post('/:id/reject', authMiddleware, adminMiddleware, async (c) => {
  try {
    const id = c.req.param('id');

    // Check if property exists
    const property = db.prepare('SELECT * FROM properties WHERE id = ?').get(id) as any;

    if (!property) {
      return c.json({
        success: false,
        message: 'Property not found',
      }, 404);
    }

    // Delete all S3 images associated with this property
    const deletePromises: Promise<void>[] = [];

    // Delete main image
    if (property.main_image) {
      try {
        const mainImageKey = extractS3KeyFromUrl(property.main_image);
        deletePromises.push(deleteFromS3(mainImageKey));
      } catch (error) {
        console.error('Error deleting main image:', error);
      }
    }

    // Delete all other images
    if (property.images) {
      try {
        const imagesArray = JSON.parse(property.images);
        imagesArray.forEach((image: any) => {
          if (image.link) {
            try {
              const imageKey = extractS3KeyFromUrl(image.link);
              deletePromises.push(deleteFromS3(imageKey));
            } catch (error) {
              console.error(`Error deleting image ${image.id}:`, error);
            }
          }
        });
      } catch (error) {
        console.error('Error parsing images JSON:', error);
      }
    }

    // Wait for all S3 deletions to complete (with error handling)
    await Promise.allSettled(deletePromises);

    // Delete related entries from favorites table
    db.prepare('DELETE FROM favorites WHERE property_id = ?').run(id);

    // Delete associated leads
    db.prepare('DELETE FROM leads WHERE property_id = ?').run(id);

    // Delete property from database
    db.prepare('DELETE FROM properties WHERE id = ?').run(id);

    return c.json({
      success: true,
      message: 'Property rejected and deleted successfully',
    });
  } catch (error: any) {
    console.error('Reject property error:', error);
    return c.json({
      success: false,
      message: error.message || 'Failed to reject property',
    }, 500);
  }
});

// Mark property as Sold (Admin only)
properties.post('/:id/sold', authMiddleware, adminMiddleware, async (c) => {
  try {
    const id = c.req.param('id');

    // Check if property exists
    const property = db.prepare('SELECT * FROM properties WHERE id = ?').get(id) as any;

    if (!property) {
      return c.json({
        success: false,
        message: 'Property not found',
      }, 404);
    }

    // Update property status to Sold
    db.prepare(`
      UPDATE properties
      SET approved = 'Sold', updated_date = datetime('now')
      WHERE id = ?
    `).run(id);

    // Fetch updated property
    const updatedProperty = db.prepare('SELECT * FROM properties WHERE id = ?').get(id);
    const propertyData = toCamelCase(updatedProperty);

    // Parse images JSON
    if (propertyData.images) {
      propertyData.images = JSON.parse(propertyData.images);
    }

    return c.json({
      success: true,
      message: 'Property marked as sold successfully',
      data: propertyData,
    });
  } catch (error: any) {
    console.error('Mark property as sold error:', error);
    return c.json({
      success: false,
      message: error.message || 'Failed to mark property as sold',
    }, 500);
  }
});

export default properties;
