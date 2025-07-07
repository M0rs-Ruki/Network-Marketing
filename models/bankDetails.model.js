
import mongoose from "mongoose";

const bankSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bankName: {
    type: String,
    required: [true, "Please add your bank name"],
    lowercase: true,
    trim: true,
  },
  accNumber: {
    type: String,
    required: [true, "Please add your account number"],
    unique: true,
    trim: true,
  },
  accHolderName: {
    type: String,
    required: [true, "Please add your account holder name"],
    trim: true,
  },
  ifscCode: {
    type: String,
    required: [true, "Please add your IFSC code"],
    match: [/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC format"],
    uppercase: true,
    trim: true,
  },
  upiID: {
    type: String,
    required: [true, "Please add your UPI ID"],
    validate: {
    validator: function (v) {
        return /@/.test(v);
    },
    message: "UPI ID must contain '@'",
    },
    trim: true,
    lowercase: true,
  },
}, { timestamps: true });

// Add indexes
bankSchema.index({ accNumber: 1 });

const Bank = mongoose.model("Bank", bankSchema);

export default Bank;