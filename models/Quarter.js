import mongoose from "mongoose";

const QuarterScheme = new mongoose.Schema({
        quarter: {
            type: Number,
            required: true,
        },
        year: {
            type: Number,
            required: true,
        }
    });

export default mongoose.model('QuarterScheme', QuarterScheme);
