import AnswersScheme from "../models/Answers.js";
import fs from "fs";

export const createAnswer = async (req, res) => {
    try {
        const year = req.params.year;
        const quarter = req.params.quarter;
        const dataArray = req.body;
        console.log(dataArray.length)
        for (const item of dataArray) {
            const doc = new AnswersScheme({
                region: item.region,
                branch: item.branch,
                revenue: item.revenue,
                q1: item.q1,
                q2: item.q2,
                q3: item.q3,
                q4: item.q4,
                q5: item.q5,
                quarter: quarter,
                year: year,
            });

            const record = await doc.save();
        }
        res.status(200)

        //
        // res.json(record);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось создать запись об индексе.',
        })
    }
}