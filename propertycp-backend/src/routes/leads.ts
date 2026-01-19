import { Hono } from 'hono';
import db, { toCamelCase, toSnakeCase } from '../db/database';
import { authMiddleware, AuthUser } from '../middleware/auth';

const leads = new Hono();

// Get all leads (Admin only)
leads.get('/', async (c) => {
  try {
    const allLeads = db.prepare(`
      SELECT l.*, u.full_name as created_by_name, u.email as created_by_email
      FROM leads l
      LEFT JOIN users u ON l.created_by_id = u.id
      ORDER BY l.created_date DESC
    `).all();

    const leadsData = toCamelCase(allLeads);

    // Parse lead comments JSON
    leadsData.forEach((lead: any) => {
      if (lead.leadCommentModel) {
        lead.leadCommentModel = JSON.parse(lead.leadCommentModel);
      } else {
        lead.leadCommentModel = [];
      }
    });

    return c.json({
      success: true,
      message: 'Leads fetched successfully',
      data: leadsData,
    });
  } catch (error: any) {
    console.error('Get leads error:', error);
    return c.json({
      success: false,
      message: error.message || 'Failed to fetch leads',
    }, 500);
  }
});

// Get leads by user ID
leads.get('/user/:userId', authMiddleware, async (c) => {
  try {
    const userId = c.req.param('userId');
    const currentUser = c.get('user') as AuthUser;

    // Users can only see their own leads unless they're admin
    if (currentUser.id !== parseInt(userId) && currentUser.userType !== 'Admin') {
      return c.json({
        success: false,
        message: 'Unauthorized to view these leads',
      }, 403);
    }

    const userLeads = db.prepare('SELECT * FROM leads WHERE created_by_id = ? ORDER BY created_date DESC').all(userId);
    const leadsData = toCamelCase(userLeads);

    // Parse lead comments JSON
    leadsData.forEach((lead: any) => {
      if (lead.leadCommentModel) {
        lead.leadCommentModel = JSON.parse(lead.leadCommentModel);
      } else {
        lead.leadCommentModel = [];
      }
    });

    return c.json({
      success: true,
      message: 'Leads fetched successfully',
      data: leadsData,
    });
  } catch (error: any) {
    console.error('Get user leads error:', error);
    return c.json({
      success: false,
      message: error.message || 'Failed to fetch leads',
    }, 500);
  }
});

// Get lead by ID
leads.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(id);

    if (!lead) {
      return c.json({
        success: false,
        message: 'Lead not found',
      }, 404);
    }

    const leadData = toCamelCase(lead);

    // Parse lead comments JSON
    if (leadData.leadCommentModel) {
      leadData.leadCommentModel = JSON.parse(leadData.leadCommentModel);
    } else {
      leadData.leadCommentModel = [];
    }

    return c.json({
      success: true,
      message: 'Lead fetched successfully',
      data: leadData,
    });
  } catch (error: any) {
    console.error('Get lead error:', error);
    return c.json({
      success: false,
      message: error.message || 'Failed to fetch lead',
    }, 500);
  }
});

// Create lead
leads.post('/', authMiddleware, async (c) => {
  try {
    const currentUser = c.get('user') as AuthUser;
    const leadData = await c.req.json();

    const insertLead = db.prepare(`
      INSERT INTO leads (
        lead_property_type, property_type, mobile_no, full_name,
        status, lead_comment_model, created_by_id, property_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insertLead.run(
      leadData.leadPropertyType,
      leadData.propertyType,
      leadData.mobileNo,
      leadData.fullName,
      'Open',
      JSON.stringify([]),
      currentUser.id,
      leadData.propertyId || null
    );

    // Fetch created lead
    const newLead = db.prepare('SELECT * FROM leads WHERE id = ?').get(result.lastInsertRowid);
    const newLeadData = toCamelCase(newLead);

    // Parse lead comments JSON
    if (newLeadData.leadCommentModel) {
      newLeadData.leadCommentModel = JSON.parse(newLeadData.leadCommentModel);
    } else {
      newLeadData.leadCommentModel = [];
    }

    return c.json({
      success: true,
      message: 'Lead created successfully',
      data: newLeadData,
    }, 201);
  } catch (error: any) {
    console.error('Create lead error:', error);
    return c.json({
      success: false,
      message: error.message || 'Failed to create lead',
    }, 500);
  }
});

// Update lead
leads.put('/:id', authMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const currentUser = c.get('user') as AuthUser;
    const updates = await c.req.json();

    // Check if lead exists and user has permission
    const existingLead = db.prepare('SELECT created_by_id FROM leads WHERE id = ?').get(id) as any;

    if (!existingLead) {
      return c.json({
        success: false,
        message: 'Lead not found',
      }, 404);
    }

    if (existingLead.created_by_id !== currentUser.id && currentUser.userType !== 'Admin') {
      return c.json({
        success: false,
        message: 'Unauthorized to update this lead',
      }, 403);
    }

    // Handle lead comments JSON
    if (updates.leadCommentModel) {
      updates.leadCommentModel = JSON.stringify(updates.leadCommentModel);
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
    db.prepare(`UPDATE leads SET ${updateFields}, updated_date = datetime("now") WHERE id = ?`).run(
      ...values,
      id
    );

    // Fetch updated lead
    const updatedLead = db.prepare('SELECT * FROM leads WHERE id = ?').get(id);
    const leadData = toCamelCase(updatedLead);

    // Parse lead comments JSON
    if (leadData.leadCommentModel) {
      leadData.leadCommentModel = JSON.parse(leadData.leadCommentModel);
    } else {
      leadData.leadCommentModel = [];
    }

    return c.json({
      success: true,
      message: 'Lead updated successfully',
      data: leadData,
    });
  } catch (error: any) {
    console.error('Update lead error:', error);
    return c.json({
      success: false,
      message: error.message || 'Failed to update lead',
    }, 500);
  }
});

// Delete lead
leads.delete('/:id', authMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const currentUser = c.get('user') as AuthUser;

    // Check if lead exists and user has permission
    const existingLead = db.prepare('SELECT created_by_id FROM leads WHERE id = ?').get(id) as any;

    if (!existingLead) {
      return c.json({
        success: false,
        message: 'Lead not found',
      }, 404);
    }

    if (existingLead.created_by_id !== currentUser.id && currentUser.userType !== 'Admin') {
      return c.json({
        success: false,
        message: 'Unauthorized to delete this lead',
      }, 403);
    }

    db.prepare('DELETE FROM leads WHERE id = ?').run(id);

    return c.json({
      success: true,
      message: 'Lead deleted successfully',
      data: true,
    });
  } catch (error: any) {
    console.error('Delete lead error:', error);
    return c.json({
      success: false,
      message: error.message || 'Failed to delete lead',
    }, 500);
  }
});

// Add comment to lead
leads.post('/:id/comments', authMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const currentUser = c.get('user') as AuthUser;
    const { comment } = await c.req.json();

    if (!comment) {
      return c.json({
        success: false,
        message: 'Comment text is required',
      }, 400);
    }

    // Check if lead exists and user has permission
    const existingLead = db.prepare('SELECT * FROM leads WHERE id = ?').get(id) as any;

    if (!existingLead) {
      return c.json({
        success: false,
        message: 'Lead not found',
      }, 404);
    }

    if (existingLead.created_by_id !== currentUser.id && currentUser.userType !== 'Admin') {
      return c.json({
        success: false,
        message: 'Unauthorized to add comment to this lead',
      }, 403);
    }

    // Parse existing comments
    let comments = [];
    if (existingLead.lead_comment_model) {
      comments = JSON.parse(existingLead.lead_comment_model);
    }

    // Add new comment
    const newComment = {
      id: comments.length + 1,
      comment,
      leadId: parseInt(id),
      createdDate: new Date().toISOString(),
    };
    comments.push(newComment);

    // Update lead with new comment
    db.prepare('UPDATE leads SET lead_comment_model = ?, updated_date = datetime("now") WHERE id = ?').run(
      JSON.stringify(comments),
      id
    );

    return c.json({
      success: true,
      message: 'Comment added successfully',
      data: newComment,
    }, 201);
  } catch (error: any) {
    console.error('Add comment error:', error);
    return c.json({
      success: false,
      message: error.message || 'Failed to add comment',
    }, 500);
  }
});

export default leads;
