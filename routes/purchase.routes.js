import express from 'express';
import requireAuth from '../middlewares/authentication.middleware.js';
import User from '../models/user.model.js';
import Order from '../models/order.model.js';

const router = express.Router();

router.post('/purchase', requireAuth, async (req, res) => {
  const { items, totalAmount } = req.body;

  if (!items || !Array.isArray(items) || !totalAmount || totalAmount <= 0) {
    return res.status(400).json({ message: 'Invalid purchase data' });
  }

  try {
    const newOrder = await Order.create({
      userId: req.user._id,
      items,
      amount: totalAmount,
      status: 'completed',
      date: new Date()
    });

    const buyer = await User.findById(req.user._id);

    if (buyer.referredBy) {
      const pointsToAdd = Math.floor(totalAmount * 0.1);
      await User.findByIdAndUpdate(
        buyer.referredBy,
        { $inc: { wallet: pointsToAdd } },
        { new: true }
      );
    }

    res.status(201).json({ message: 'Purchase completed successfully', order: newOrder });
  } catch (error) {
    console.error('Purchase error:', error);
    res.status(500).json({ message: 'Error processing purchase' });
  }
});

export default router;
