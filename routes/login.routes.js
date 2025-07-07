import express from "express";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { log } from 'console';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

const router = express.Router();

// Login user
router.get(['', '/'], (req, res) => {
  res.render('login');
});

router.post(['', '/'], async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    await User.findByIdAndUpdate(user._id, { activityStatus: 'active' });

    const expiresInMs = process.env.JWT_EXPIRES_IN.includes('h') 
      ? parseInt(process.env.JWT_EXPIRES_IN) * 3600000
      : 3600000; // Default 1 hour
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: expiresInMs  // 1 hour
    });

    return res.status(200).json({
      message: 'Login successful',
      userId: user._id,
      name: user.name,
      redirect: '/dashboard'
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});


export default router;