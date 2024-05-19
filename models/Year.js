import mongoose from "mongoose";

const YearScheme = new mongoose.Schema({
        year: {
            type: Number,
            required: true,
            unique: true,
        },
    });

export default mongoose.model('YearScheme', YearScheme);
