import express from "express";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const router = express.Router();

router.get(["", "/"], (req, res) => {
  res.render("register", { error: "Invalid referral code." });
});

router.post(["", "/"], async (req, res) => {
  try {
    const {
      fullName,
      email,
      mobileNumber,
      password,
      confirmPassword,
      referralCode, // this is the code of the referrer
      packageSelect,
    } = req.body;

    if (!email || !password || !fullName || !mobileNumber) {
      return res
        .status(400)
        .render("register", { error: "All fields are required." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).render("register", { error: "Invalid email" });
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .render("register", { error: "Passwords do not match." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .render("register", { error: "Email already registered." });
    }

    let referredBy = null;
    if (referralCode) {
      const referrer = await User.findOne({ referralCode });
      if (referrer) {
        await User.findByIdAndUpdate(referrer._id, {
          $push: { team: newUser._id },
        });
      } else {
        return res
          .status(400)
          .render("register", { error: "Invalid referral code." });
      }
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate a unique referral code for the new user
    let isUnique = false;
    let userReferralCode;
    while (!isUnique) {
      userReferralCode = Math.random().toString(36).substr(2, 8).toUpperCase();
      const exists = await User.findOne({ referralCode: userReferralCode });
      if (!exists) isUnique = true;
    }

    const newUser = await User.create({
      name: fullName,
      email,
      number: mobileNumber,
      password: hashedPassword,
      package: packageSelect || "default",
      referralCode: userReferralCode,
      referredBy,
    });

    const token = jwt.sign(
      { userId: newUser._id, email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const expiresInMs = process.env.JWT_EXPIRES_IN.includes("h")
      ? parseInt(process.env.JWT_EXPIRES_IN) * 3600000
      : 3600000; // Default 1 hour

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: expiresInMs, // 1 hour
    });

    return res.redirect("/dashboard");
  } catch (err) {
    console.error("Registration error:", err);

    if (err.name === "ValidationError") {
      return res.status(400).render("register", {
        error: "Validation failed. Please check your inputs.",
      });
    }

    res.status(500).render("register", {
      error: "Internal server error. Please try again later.",
    });
  }
});

export default router;
