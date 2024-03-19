import mongoose from "mongoose";

const GeneralIndexSchema = new mongoose.Schema({
        revenue: {
            type: Number,
            required: true,
        },
        size: {
            type: Number,
            required: true,
        },
        finance: {
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

export default mongoose.model('GeneralIndex', GeneralIndexSchema);
