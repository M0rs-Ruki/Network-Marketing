

import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
    completed: {
    type: Boolean,
    default: false
    },
    userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video',
        required: true
    },
    lectureId: {
    type: Number,
    required: true
    },
});

const Progress = mongoose.model('Progress', progressSchema);
export default Progress;
