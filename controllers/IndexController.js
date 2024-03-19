import GeneralIndex from "../models/GeneralIndex.js";
import NewsModel from "../models/News.js";

export const getSeparateIndex = async (req, res) => {
    try {
        const year = req.params.year;
        const quarter = req.params.quarter;
        const record = await GeneralIndex.find({year: year, quarter: quarter});

        if (!record) {
            return res.status(404).json({
                message: 'Индекс не найден или не существует.'
            })
        }

        res.json(record);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить индекс'
        })
    }
}

export const create = async (req, res) => {
    try {
        const year = req.params.year;
        const quarter = req.params.quarter;
        const doc = new GeneralIndex({
            revenue: req.body.revenue,
            size: req.body.size,
            finance: req.body.finance,
            investment: req.body.investment,
            innovation: req.body.innovation,
            summaryIndex: req.body.summaryIndex,
            quarter: quarter,
            year: year,
        });

        const record = await doc.save();

        res.json(record);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось создать запись об индексе.',
        })
    }
}
