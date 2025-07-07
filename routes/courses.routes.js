import express from "express";
import requireAuth from "../middlewares/authentication.middleware.js";
import Video from "../models/video.model.js";
import Progress from "../models/video.Progress.model.js";


const router = express.Router();

// Example route to get all courses for the user with progress
router.get("/", requireAuth, async (req, res) => {
  try {
    const courses = await Video.find(); // Get all courses

    // For each course, calculate completion percentage for current user
    const coursesWithProgress = await Promise.all(
      courses.map(async (course) => {
        try {
          const totalLectures = course.lectures.length;
          const completedLectures = await Progress.countDocuments({
            userId: req.user._id,
            courseId: course._id,
            completed: true,
          });
          const completionPercentage = totalLectures === 0
            ? 0
            : Math.round((completedLectures / totalLectures) * 100);
        } catch (err) {
          console.error(`Progress error for course ${course._id}:`, err);
          return {
            _id: course._id,
            title: course.title,
            completionPercentage: 0
          };
        }
      })
    );

    res.render("courses", { courses: coursesWithProgress });
  } catch (err) {
    console.error("Fetch courses error:", err);
    res.status(500).send("Server error loading courses");
  }
});

export default router;
