import { Hono } from 'hono';
import db, { toCamelCase } from '../db/database';
import { authMiddleware, AuthUser } from '../middleware/auth';

const favorites = new Hono();

// Get user's favorites
favorites.get('/', authMiddleware, async (c) => {
  try {
    const currentUser = c.get('user') as AuthUser;

    const userFavorites = db.prepare(`
      SELECT p.* FROM properties p
      INNER JOIN favorites f ON p.id = f.property_id
      WHERE f.user_id = ?
      ORDER BY f.created_date DESC
    `).all(currentUser.id);

    const favoritesData = toCamelCase(userFavorites);

    // Parse images JSON
    favoritesData.forEach((property: any) => {
      if (property.images) {
        property.images = JSON.parse(property.images);
      }
    });

    return c.json({
      success: true,
      message: 'Favorites fetched successfully',
      data: favoritesData,
    });
  } catch (error: any) {
    console.error('Get favorites error:', error);
    return c.json({
      success: false,
      message: error.message || 'Failed to fetch favorites',
    }, 500);
  }
});

// Check if property is favorite
favorites.get('/check/:propertyId', authMiddleware, async (c) => {
  try {
    const currentUser = c.get('user') as AuthUser;
    const propertyId = c.req.param('propertyId');

    const favorite = db.prepare('SELECT id FROM favorites WHERE user_id = ? AND property_id = ?').get(
      currentUser.id,
      propertyId
    );

    return c.json({
      success: true,
      message: 'Favorite status checked',
      data: { isFavorite: !!favorite },
    });
  } catch (error: any) {
    console.error('Check favorite error:', error);
    return c.json({
      success: false,
      message: error.message || 'Failed to check favorite status',
    }, 500);
  }
});

// Add to favorites
favorites.post('/:propertyId', authMiddleware, async (c) => {
  try {
    const currentUser = c.get('user') as AuthUser;
    const propertyId = c.req.param('propertyId');

    // Check if property exists
    const property = db.prepare('SELECT id FROM properties WHERE id = ?').get(propertyId);
    if (!property) {
      return c.json({
        success: false,
        message: 'Property not found',
      }, 404);
    }

    // Check if already favorite
    const existing = db.prepare('SELECT id FROM favorites WHERE user_id = ? AND property_id = ?').get(
      currentUser.id,
      propertyId
    );

    if (existing) {
      return c.json({
        success: false,
        message: 'Property already in favorites',
      }, 400);
    }

    // Add to favorites
    db.prepare('INSERT INTO favorites (user_id, property_id) VALUES (?, ?)').run(
      currentUser.id,
      propertyId
    );

    return c.json({
      success: true,
      message: 'Property added to favorites',
    }, 201);
  } catch (error: any) {
    console.error('Add favorite error:', error);
    return c.json({
      success: false,
      message: error.message || 'Failed to add favorite',
    }, 500);
  }
});

// Remove from favorites
favorites.delete('/:propertyId', authMiddleware, async (c) => {
  try {
    const currentUser = c.get('user') as AuthUser;
    const propertyId = c.req.param('propertyId');

    const result = db.prepare('DELETE FROM favorites WHERE user_id = ? AND property_id = ?').run(
      currentUser.id,
      propertyId
    );

    if (result.changes === 0) {
      return c.json({
        success: false,
        message: 'Favorite not found',
      }, 404);
    }

    return c.json({
      success: true,
      message: 'Property removed from favorites',
    });
  } catch (error: any) {
    console.error('Remove favorite error:', error);
    return c.json({
      success: false,
      message: error.message || 'Failed to remove favorite',
    }, 500);
  }
});

export default favorites;
