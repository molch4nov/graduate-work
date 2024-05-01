import NewsModel from '../models/News.js'
import {startSendingEmails} from "../services/mail-service.js";

export const create = async (req, res) => {
    try {
        const doc = new NewsModel({
            title: req.body.title,
            content: req.body.content,
            shortContent: req.body.shortContent,
            date: req.body.date,
        });

        const post = await doc.save();

        await startSendingEmails(`${doc.title} - тема новой новости. Узнайте подробности!`, doc.shortContent);

        res.json(post);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось создать новость',
        })
    }
}

export const getAll = async (req, res) => {
    try {
        const posts = await NewsModel.find();
        res.json(posts)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось получить новости',
        })
    }
}

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;

        const post = await NewsModel.findById(postId);

        if (!post) {
            return res.status(404).json({
                message: 'Статья не найдена'
            })
        }

        res.json(post);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось получить новость',
        })
    }
}
