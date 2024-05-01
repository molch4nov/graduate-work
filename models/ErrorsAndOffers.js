import mongoose from "mongoose";

const offerSchema = new mongoose.Schema({
    typeOfMessage: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
    ,
    userName: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    }
});

const Offer = mongoose.model('Offers', offerSchema);

export default { Offer };