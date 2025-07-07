import express from "express";
import Bank from "../models/bankDetails.model.js";
import requireAuth from "../middlewares/authentication.middleware.js";
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

const router = express.Router();

// Add bank account
router.post('/addBankAccount', requireAuth, async (req, res) => {
  const { bankName, accountHolderName, accountNumber, ifscCode, upiId } = req.body;
  
  try {
    const existingBank = await Bank.findOne({ accNumber: accountNumber });
    if (existingBank) {
      return res.status(400).send("Account already exists");
    }
    
    const newAcc = await Bank.create({
      userID: req.user._id,
      bankName,
      accHolderName: accountHolderName,
      accNumber: accountNumber,
      ifscCode,
      upiID: upiId
    });
    
    res.redirect('/dashboard');
  } catch (err) {
    console.error("Add error:", err);
    res.status(500).send("Server error");
  }
});

// Edit account details
router.put('/editBankAccount/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  try {
    const updatedAcc = await Bank.findOneAndUpdate(
      { _id: id, userID: req.user._id },     
      updates,
      { new: true, runValidators: true }
    );
    
    if (!updatedAcc) {
      return res.status(404).send("Account not found");
    }
    
    res.status(200).json({ message: "Bank account updated successfully", account: updatedAcc });
  } catch (err) {
    console.error("Edit error:", err);
    res.status(500).send("Server error");
  }
});

// Delete bank account
router.delete('/deleteBankAccount/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  
  try {
    const deletedAcc = await Bank.findByIdAndDelete({ 
      _id: id, 
      userID: req.user._id // Add userID check
    });
    if (!deletedAcc) {
      return res.status(404).send("Account not found");
    }
    
    res.status(200).json({ message: "Bank account deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).send("Server error");
  }
});

export default router;
