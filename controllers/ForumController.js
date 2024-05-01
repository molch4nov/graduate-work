import ForumModels from '../models/Forum.js';

const { Topic} = ForumModels;

export const createTopic = async (req, res) => {
    try {
        const title = req.body.title;

        const newTopic = new Topic({ title: title });
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

        res.json(allTopics.map(doc => {
            return {"_id": doc['_id'], "title": doc['title']}
        }));
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

        topic['messages'].push(message);

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
