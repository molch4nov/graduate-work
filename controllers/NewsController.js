import NewsModel from '../models/News.js'

export const create = async (req, res) => {
    try {
        const doc = new NewsModel({
            title: req.body.title,
            content: req.body.content,
            date: req.body.date,
        });

        const post = await doc.save();

        res.json(post);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось создать новость',
        })
    }
}