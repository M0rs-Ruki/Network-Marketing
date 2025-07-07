import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/wab"); // command this when you connect the MongoDB Atlas and uncomment the connectDB() in indix.js

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Full name is required"],
    trim: true
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    validate: {
      validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      message: "Invalid email format"
    }
  },
  number: {
    type: String,
    required: [true, "Mobile number is required"],
    unique: true,
    validate: {
      validator: (v) => /^[6-9]\d{9}$/.test(v),
      message: "Invalid Indian mobile number"
    }
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters"]
  },
  package: {
    type: String,
    required: true,
    enum: ["mini", "prime", "supreme", "royal", "dream-achiever"]
  },
  team: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User' // or your actual User model name
    }
  ],
  photoURL: {
    type: String,
    default: ""
  },
  activityStatus: {
    type: String,
    enum: ['active', 'offline', 'idle'],
    default: 'offline'
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  referralCode: {
    type: String,
    unique: true
  },
  wallet: {
    type: Number,
    default: 0
  },
});

const User = mongoose.model("User", userSchema);

export default User;
