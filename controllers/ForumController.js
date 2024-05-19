import ForumModels from '../models/Forum.js';

const { Topic} = ForumModels;

export const createTopic = async (req, res) => {
    try {
        const title = req.body.title;
        const author = req.body.author;

        const newTopic = new Topic({ title: title, author: author });
        const record = await newTopic.save();

        res.json(record);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось создать топик'
        })
    }
}

export const getAllTopic = async (req, res) => {
    try {
        const allTopics = await Topic.find();

        res.json(allTopics);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось получить все топики'
        })
    }
}

export const createMessageForTopic = async (req, res) => {
    try {
        const topicId = req.params.id;
        const topic = await Topic.findOne({_id: topicId});

        const message = req.body.message;
        const author = req.body.author;
        const date = new Date();

        topic['messages'].push({message: message, author: author, date: date});

        const record = await topic.save();

        res.json(record);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось создать сообщение для топика'
        })
    }
}

export const getAllMessagesFromTopic = async (req, res) => {
    try {
        const topicId = req.params.id;
        const topic = await Topic.findOne({_id: topicId});

        res.json(topic);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось получить все топики'
        })
    }
}
