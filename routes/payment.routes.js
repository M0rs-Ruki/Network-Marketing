import express from "express";
import requireAuth from "../middlewares/authentication.middleware.js";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";

const router = express.Router()

router.get('/payment', requireAuth, (req, res) => {
    res.render('payment')
});

router.post('/payment', requireAuth, async (req, res) => {
  try {
    const { items, totalAmount } = req.body; 

    if (!items || !Array.isArray(items) || items.length === 0 || !totalAmount) {
      return res.status(400).render('payment', { error: "Invalid order data." });
    }

    const newOrder = await Order.create({
      userId: req.user._id,
      items,
      totalAmount,
    });

    if (req.user.referredBy) {
      await User.findByIdAndUpdate(req.user.referredBy, { $inc: { points: 10 } });
    }

    return res.redirect('/dashboard');
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).render('payment', { error: "Payment failed. Please try again." });
  }
});

export default router;