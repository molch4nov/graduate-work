import Offer from "../models/ErrorsAndOffers.js";

export const createOffer = async (req, res) => {
    try {
        const doc = new Offer({
            typeOfMessage: req.body.typeOfMessage,
            title: req.body.title,
            message: req.body.message,
            userId: req.body.userId,
            userName: req.body.userName,
            userEmail: req.body.userEmail,
        });

        const post = await doc.save();

        res.json(post);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось отправить запрос',
        })
    }
}