import { Hono } from 'hono';
import bcrypt from 'bcrypt';
import db, { toCamelCase, toSnakeCase } from '../db/database';

const auth = new Hono();

// Login
auth.post('/login', async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({
        success: false,
        message: 'Email and password are required',
      }, 400);
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

    if (!user) {
      return c.json({
        success: false,
        message: 'Invalid credentials',
      }, 401);
    }

    const userData = toCamelCase(user);
    const isValidPassword = await bcrypt.compare(password, userData.password);

    if (!isValidPassword) {
      return c.json({
        success: false,
        message: 'Invalid credentials',
      }, 401);
    }

    // Remove password from response
    delete userData.password;

    return c.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userData,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return c.json({
      success: false,
      message: error.message || 'Login failed',
    }, 500);
  }
});

// Register
auth.post('/register', async (c) => {
  try {
    const userData = await c.req.json();

    if (!userData.email || !userData.password || !userData.fullName || !userData.mobileNo) {
      return c.json({
        success: false,
        message: 'Email, password, full name, and mobile number are required',
      }, 400);
    }

    // Check if user already exists
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(userData.email);
    if (existingUser) {
      return c.json({
        success: false,
        message: 'User with this email already exists',
      }, 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Insert user
    const insertUser = db.prepare(`
      INSERT INTO users (full_name, email, password, mobile_no, status, user_type, image, vpa, referral_code, is_kyc_verified)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insertUser.run(
      userData.fullName,
      userData.email,
      hashedPassword,
      userData.mobileNo,
      'CREATED',
      userData.userType || 'Agent',
      `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
      userData.vpa || null,
      userData.referralCode || null,
      0
    );

    // Fetch created user
    const newUser = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
    const newUserData = toCamelCase(newUser);

    // Remove password from response
    delete newUserData.password;

    return c.json({
      success: true,
      message: 'Registration successful',
      data: {
        user: newUserData,
      },
    }, 201);
  } catch (error: any) {
    console.error('Registration error:', error);
    return c.json({
      success: false,
      message: error.message || 'Registration failed',
    }, 500);
  }
});

export default auth;
