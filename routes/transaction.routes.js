
import express from "express";
import Transaction from "../models/transaction.model.js";
import requireAuth from "../middlewares/authentication.middleware.js";

const router = express.Router();

router.post('/addTransaction', requireAuth, async (req, res) => {
  const { type, description, amount, date } = req.body;

  try {
    const newTransaction = await Transaction.create({
      userID: req.user._id,
      type,
      description,
      amount,
      date: new Date()
    });
    res.status(201).json({ message: 'Transaction added', transaction: newTransaction });
  } catch (error) {
    console.error('Transaction add error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



export default router;