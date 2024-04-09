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
        investment: {
            type: Number,
            required: true,
        },
        innovation: {
            type: Number,
            required: true,
        },
        summaryIndex: {
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
