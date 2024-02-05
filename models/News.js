import mongoose from "mongoose";

const NewsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    shortContent: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    }
},
{
    timestamps: true,
});

export default mongoose.model('News', NewsSchema);
