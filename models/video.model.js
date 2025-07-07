import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  lectures: [
    {
      lectureId: Number,
      title: String,
      videoUrl: String,
      duration: Number,
    },
  ],
});

const Video = mongoose.model("Video", videoSchema);

export default Video;
