import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import User from "../models/user.model.js"; // ADD THIS LINE
dotenv.config({ path: './.env' });

const requireAuth = async (req, res, next) => {
  const token = req.cookies.token;
  
  if (!token) {
    return res.redirect('/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      res.clearCookie('token');
      return res.redirect('/login');
    }

    req.user = user;  // Attach full user object
    next();
  } catch (err) {
    res.clearCookie('token');
    res.redirect('/login');
  }
};

export default requireAuth;