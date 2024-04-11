import mongoose from "mongoose";

const AnswersScheme = new mongoose.Schema({
        region: {
            type: Number,
            required: true,
        },
        branch: {
            type: Number,
            required: true,
        },
        revenue: {
            type: Number,
            required: true,
        },
        q1: {
            type: Number,
            required: true,
        },
        q2: {
            type: Number,
            required: true,
        },
        q3: {
            type: Number,
            required: true,
        },
        q4: {
            type: Number,
            required: true,
        },
        q5: {
            type: Number,
            required: true,
        },
        quarter: {
            type: Number,
            required: true,
        },
        year: {
            type: Number,
            required: true,
        },
    });

export default mongoose.model('AnswersScheme', AnswersScheme);
