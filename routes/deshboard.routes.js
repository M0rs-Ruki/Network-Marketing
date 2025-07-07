import express from "express";
import requireAuth from "../middlewares/authentication.middleware.js";
import Transaction from "../models/transaction.model.js";
import User from "../models/user.model.js";
import uploadImage from "../middlewares/uploadImage.middleware.js";
import Order from "../models/order.model.js";
import Video from "../models/video.model.js";
import Progress from "../models/video.Progress.model.js";
const router = express.Router();

router.get(["", "/"], requireAuth, async (req, res) => {
  try {
    const user = req.user;
    const currentUser = await User.findById(user._id).populate("team");
    if (!currentUser) {
      return res.status(404).render("dashboard", {
        user: req.user,
        transactions: [],
        teamMembers: [],
        orders: [],
        error: "User not found.",
      });
    }

    const teamMembers = currentUser.team || [];
    const transactions = await Transaction.find({ userID: user._id }).sort({
      date: -1,
    });
    const orders = await Order.find({ userId: user._id }).sort({ date: -1 });
    const baseUrl = process.env.BASE_URL;
    const referralLink = `${baseUrl}/register?ref=${currentUser.referralCode}`;

    const courses = await Video.find(); // Replace Video with Course if needed
    const coursesWithProgress = await Promise.all(
      courses.map(async (course) => {
        const totalLectures = course.lectures.length;
        const completedLectures = await Progress.countDocuments({
          userId: user._id,
          courseId: course._id,
          completed: true,
        });
        const completionPercentage =
          course.lectures?.length && totalLectures > 0
            ? Math.round((completedLectures / totalLectures) * 100)
            : 0;
        return {
          _id: course._id,
          title: course.title,
          completionPercentage,
        };
      })
    );

    const teamCount = teamMembers.length;
    const walletBalance = currentUser.wallet || 0;
    const activeCourses = coursesWithProgress.filter(
      (c) => c.completionPercentage < 100
    ).length;

    res.render('dashboard', {
      user: currentUser,
      transactions,
      teamMembers,
      orders,
      referralLink,
      courses: coursesWithProgress,
      metrics: {
        teamCount,
        walletBalance,
        activeCourses
      }
    });

  } catch (error) {
    console.error("Dashboard fetch error:", error);
    res.status(500).render("dashboard", {
      user: req.user,
      transactions: [],
      teamMembers: [],
      orders: [],
      error: "Could not load data. Please try again later.",
    });
  }
});

router.post(
  "/uploadProfileImage",
  requireAuth,
  uploadImage.single("profileImage"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const photoURL = `/uploads/${req.file.filename}`;
      await User.findByIdAndUpdate(req.user._id, { photoURL });

      res.redirect("/dashboard");
    } catch (error) {
      console.error("Photo upload error:", error);
      res.status(500).json({ message: "Server error during photo upload" });
    }
  }
);

export default router;
