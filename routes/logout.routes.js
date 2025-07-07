
import express from "express";
import requireAuth from "../middlewares/authentication.middleware.js";
import User from "../models/user.model.js";

const router = express.Router();



router.post(['', '/'], requireAuth, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { activityStatus: 'offline' });
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Logout failed' });
  }
});

export default router;