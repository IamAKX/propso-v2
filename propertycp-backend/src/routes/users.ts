import { Hono } from 'hono';
import bcrypt from 'bcrypt';
import db, { toCamelCase, toSnakeCase } from '../db/database';
import { authMiddleware, AuthUser } from '../middleware/auth';
import { deleteFromS3, extractS3KeyFromUrl } from '../services/s3';

const users = new Hono();

// Get all users (Admin only)
users.get('/', async (c) => {
  try {
    const allUsers = db.prepare('SELECT * FROM users').all();
    const usersData = toCamelCase(allUsers);

    // Remove passwords
    usersData.forEach((user: any) => delete user.password);

    return c.json({
      success: true,
      message: 'Users fetched successfully',
      data: usersData,
    });
  } catch (error: any) {
    console.error('Get users error:', error);
    return c.json({
      success: false,
      message: error.message || 'Failed to fetch users',
    }, 500);
  }
});

// Get user by mobile number
users.get('/mobile/:mobileNo', async (c) => {
  try {
    const mobileNo = c.req.param('mobileNo');
    const user = db.prepare('SELECT * FROM users WHERE mobile_no = ?').get(mobileNo);

    if (!user) {
      return c.json({
        success: false,
        message: 'User not found',
      }, 404);
    }

    const userData = toCamelCase(user);
    delete userData.password;

    return c.json({
      success: true,
      message: 'User fetched successfully',
      data: userData,
    });
  } catch (error: any) {
    console.error('Get user by mobile error:', error);
    return c.json({
      success: false,
      message: error.message || 'Failed to fetch user',
    }, 500);
  }
});

// Get user by email
users.get('/email/:email', async (c) => {
  try {
    const email = c.req.param('email');
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

    if (!user) {
      return c.json({
        success: false,
        message: 'User not found',
      }, 404);
    }

    const userData = toCamelCase(user);
    delete userData.password;

    return c.json({
      success: true,
      message: 'User fetched successfully',
      data: userData,
    });
  } catch (error: any) {
    console.error('Get user by email error:', error);
    return c.json({
      success: false,
      message: error.message || 'Failed to fetch user',
    }, 500);
  }
});

// Get user by ID
users.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);

    if (!user) {
      return c.json({
        success: false,
        message: 'User not found',
      }, 404);
    }

    const userData = toCamelCase(user);
    delete userData.password;

    return c.json({
      success: true,
      message: 'User fetched successfully',
      data: userData,
    });
  } catch (error: any) {
    console.error('Get user error:', error);
    return c.json({
      success: false,
      message: error.message || 'Failed to fetch user',
    }, 500);
  }
});

// Update user
users.put('/:id', authMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const currentUser = c.get('user') as AuthUser;
    const updates = await c.req.json();

    // Check if user is updating their own profile or is admin
    if (currentUser.id !== parseInt(id) && currentUser.userType !== 'Admin') {
      return c.json({
        success: false,
        message: 'Unauthorized to update this user',
      }, 403);
    }

    // Build update query dynamically
    const snakeUpdates = toSnakeCase(updates);
    delete snakeUpdates.id;
    delete snakeUpdates.email; // Don't allow email updates
    delete snakeUpdates.password; // Handle password separately

    const updateFields = Object.keys(snakeUpdates)
      .map((key) => `${key} = ?`)
      .join(', ');

    if (updateFields.length === 0 && !updates.password) {
      return c.json({
        success: false,
        message: 'No valid fields to update',
      }, 400);
    }

    // Handle password update separately
    if (updates.password) {
      const hashedPassword = await bcrypt.hash(updates.password, 10);
      db.prepare('UPDATE users SET password = ?, updated_date = datetime("now") WHERE id = ?').run(
        hashedPassword,
        id
      );
    }

    // Update other fields
    if (updateFields.length > 0) {
      const values = Object.values(snakeUpdates);
      db.prepare(`UPDATE users SET ${updateFields}, updated_date = datetime("now") WHERE id = ?`).run(
        ...values,
        id
      );
    }

    // Fetch updated user
    const updatedUser = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    const userData = toCamelCase(updatedUser);
    delete userData.password;

    return c.json({
      success: true,
      message: 'User updated successfully',
      data: userData,
    });
  } catch (error: any) {
    console.error('Update user error:', error);
    return c.json({
      success: false,
      message: error.message || 'Failed to update user',
    }, 500);
  }
});

// Delete user (Admin only)
users.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');

    // Fetch user to get S3 URLs before deletion
    const user: any = db.prepare('SELECT * FROM users WHERE id = ?').get(id);

    if (!user) {
      return c.json({
        success: false,
        message: 'User not found',
      }, 404);
    }

    // Delete KYC documents from S3
    const kycDocuments = [user.aadhar_front, user.aadhar_back, user.pan];
    for (const docUrl of kycDocuments) {
      if (docUrl) {
        try {
          const key = extractS3KeyFromUrl(docUrl);
          await deleteFromS3(key);
          console.log(`✅ Deleted KYC document: ${key}`);
        } catch (error) {
          console.error(`⚠️ Failed to delete KYC document: ${docUrl}`, error);
          // Continue with deletion even if S3 deletion fails
        }
      }
    }

    // Get all properties owned by this user
    const userProperties: any[] = db.prepare('SELECT * FROM properties WHERE created_by_id = ?').all(id);

    // Delete property images from S3
    for (const property of userProperties) {
      // Delete main image
      if (property.main_image) {
        try {
          const key = extractS3KeyFromUrl(property.main_image);
          await deleteFromS3(key);
          console.log(`✅ Deleted main property image: ${key}`);
        } catch (error) {
          console.error(`⚠️ Failed to delete main property image: ${property.main_image}`, error);
        }
      }

      // Delete property images array
      const images = property.images ? JSON.parse(property.images) : [];
      for (const imageUrl of images) {
        if (imageUrl) {
          try {
            const key = extractS3KeyFromUrl(imageUrl);
            await deleteFromS3(key);
            console.log(`✅ Deleted property image: ${key}`);
          } catch (error) {
            console.error(`⚠️ Failed to delete property image: ${imageUrl}`, error);
          }
        }
      }
    }

    // Delete user's leads (cascade)
    db.prepare('DELETE FROM leads WHERE created_by_id = ?').run(id);
    console.log(`✅ Deleted all leads for user ${id}`);

    // Delete user's properties (cascade)
    db.prepare('DELETE FROM properties WHERE created_by_id = ?').run(id);
    console.log(`✅ Deleted all properties for user ${id}`);

    // Delete user's favorites (cascade)
    db.prepare('DELETE FROM favorites WHERE user_id = ?').run(id);
    console.log(`✅ Deleted all favorites for user ${id}`);

    // Finally, delete the user
    const result = db.prepare('DELETE FROM users WHERE id = ?').run(id);

    if (result.changes === 0) {
      return c.json({
        success: false,
        message: 'User not found',
      }, 404);
    }

    console.log(`✅ Successfully deleted user ${id} and all associated data`);

    return c.json({
      success: true,
      message: 'User and all associated data deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete user error:', error);
    return c.json({
      success: false,
      message: error.message || 'Failed to delete user',
    }, 500);
  }
});

export default users;
