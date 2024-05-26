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

        res.json(allTopics.map(topic => {
            const lastMessage = topic.messages.pop();
            return {
                id: topic._id,
                title: topic.title,
                author: topic.author,
                date: topic.date,
                lastMessage: lastMessage ?? '',
                countOfMessages: topic.messages.length
            }
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

        const message = req.body.message.toString();
        const author = req.body.author.toString();
        const date = new Date();


        topic['messages'].push({message: message, author: author, date: date});
        topic.author = topic.author;
        topic.title = topic.title;
        topic.date = topic.date;

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

export const removeOneMessageFromTopic = async (req, res) => {
    try {
        const id = req.params.id.toString();

        const topic = await Topic.findOne({_id: id});
        const message = req.body.message;

        const filteredMessages = topic['messages'].filter((item) => item !== message);
        topic['messages'] = filteredMessages;
        
        const record = await topic.save();

        res.status(200).json(record);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось удалить сообщение'
        })
    }
}

export const removeOneTopic = async (req, res) => {
    try {
        const id = req.params.id.toString();

        const topic = await Topic.deleteOne({_id: id});

        res.status(200).json(topic);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось удалить сообщение'
        })
    }
}
