import GeneralIndex from "../models/GeneralIndex.js";
import AnswersScheme from "../models/Answers.js";
import {getBranchNumber} from "./Mapping.js";

// export const getSeparateIndex = async (req, res) => {
//     try {
//         const year = req.params.year;
//         const quarter = req.params.quarter;
//         const record = await GeneralIndex.find({year: year, quarter: quarter});
//
//         if (!record) {
//             return res.status(404).json({
//                 message: 'Индекс не найден или не существует.'
//             })
//         }
//
//         res.json(record);
//
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({
//             message: 'Не удалось получить индекс'
//         })
//     }
// }

const getSummaryIndex = (a) => {
    let answer = 0;
    a.forEach(item => {
        answer += item;
    })
    return answer;
}

function takeIndex(a, b) {
    return getSummaryIndex(a) / b * 100
}

function calculateJointIndex(leftRecord, rightRecord) {
    const OptimismBlock = (a, b) => {
        return ((a === 1 ? 2 : (a === 2 ? 1 : 0)) + (b === 1 ? 2 : (b === 2 ? 1 : 0))) * 0.25;
    }

    const Optimism = (a) => {return a > 4 ? 0 : a > 2 ? 0.5 : 1};
    const votedBlock  = (a, b) => {return (a === 99 || b === 99) ? 0 : 1};
    const voted  = (a) => {return a === 99 ? 0 : 1};

    let revenueIndexes = [];
    let sizeIndexes = [];
    let financeIndexes = [];
    let investmentIndexes = [];
    let innovationIndexes = [];

    let revenueJoin = 0;
    let sizeJoin = 0;
    let financeJoin = 0;
    let investmentJoin = 0;
    let innovationJoin = 0;


    const recordSize = leftRecord.length > rightRecord.length ? leftRecord.length : rightRecord.length;

    for (let i = 0; i < recordSize; i++) {
        const revenue = OptimismBlock(leftRecord[i].q1, rightRecord[i].q1);

        const size = OptimismBlock(leftRecord[i].q2, rightRecord[i].q2);

        const finance = OptimismBlock(leftRecord[i].q3, rightRecord[i].q3);

        const investment = Optimism(leftRecord[i].q4);
        const innovation = Optimism(leftRecord[i].q5);



        const answerRevenue = votedBlock(
            leftRecord[i].q1, rightRecord[i].q1
        );

        const answerSize = votedBlock(leftRecord[i].q2, rightRecord[i].q2);

        const answerFinance = votedBlock(leftRecord[i].q3, rightRecord[i].q3);

        const answerInvestment = voted(leftRecord[i].q4);

        const answerInnovation = voted(leftRecord[i].q5);

        revenueIndexes.push(revenue);
        sizeIndexes.push(size);
        financeIndexes.push(finance);
        investmentIndexes.push(investment);
        innovationIndexes.push(innovation);

        revenueJoin += answerRevenue;
        sizeJoin += answerSize;
        financeJoin += answerFinance;
        investmentJoin += answerInvestment;
        innovationJoin += answerInnovation;
    }

    console.log(revenueJoin, sizeJoin, financeJoin, investmentJoin, innovationJoin)

    const index = (
        takeIndex(revenueIndexes, revenueJoin)
        + takeIndex(sizeIndexes,sizeJoin)
        + takeIndex(financeIndexes,financeJoin)
        + takeIndex(investmentIndexes,  investmentJoin)
        + takeIndex(innovationIndexes, innovationJoin)
    ) / (5);
    return {revenue: takeIndex(revenueIndexes, revenueJoin),
        size: takeIndex(sizeIndexes,sizeJoin),
        finance: takeIndex(financeIndexes,financeJoin),
        investment: takeIndex(investmentIndexes,  investmentJoin),
        innovation: takeIndex(innovationIndexes, innovationJoin),
        index: index
    };
}

export const getJointIndex = async (req, res) => {
    try {
        let leftYear = Number(req.params.year);
        let leftQuarter = Number(req.params.quarter);
        let rightYear = 0;
        let rightQuarter = 0;
        if (leftQuarter === 4) {
            rightYear = leftYear + 1;
            rightQuarter = 1;
        } else {
            rightYear = leftYear;
            rightQuarter = leftQuarter + 1;
        }

        const leftRecord = await AnswersScheme.find({year: leftYear, quarter: leftQuarter, current: true});
        const rightRecord = await AnswersScheme.find({year: rightYear, quarter: rightQuarter, current: false});

        const result = calculateJointIndex(leftRecord, rightRecord);

        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось получить индекс'
        })
    }
}

function calculateIndex(leftRecord, rightRecord) {
    const OptimismBlock = (a, b) => {
        return ((a === 1 ? 2 : (a === 2 ? 1 : 0)) + (b === 1 ? 2 : (b === 2 ? 1 : 0))) * 0.25;
    }

    const OptimismSeparateBlock = (a) => (a === 1) ? 2 * 0.5 : (a === 2) ? 0.5 : 0;


    const Optimism = (a) => {return a > 4 ? 0 : a > 2 ? 0.5 : 1};
    const votedBlock  = (a, b) => {return (a === 99 || b === 99) ? 0 : 1};
    const voted  = (a) => {return a === 99 ? 0 : 1};

    let revenueIndexes = [];
    let sizeIndexes = [];
    let financeIndexes = [];
    let investmentIndexes = [];
    let innovationIndexes = [];

    let revenueJoin = 0;
    let sizeJoin = 0;
    let financeJoin = 0;
    let investmentJoin = 0;
    let innovationJoin = 0;


    const recordSize = leftRecord.length;

    for (let i = 0; i < recordSize; i++) {
        const revenue = OptimismSeparateBlock(leftRecord[i].q1);

        const size = OptimismSeparateBlock(leftRecord[i].q2);

        const finance = OptimismSeparateBlock(leftRecord[i].q3);

        const investment = Optimism(leftRecord[i].q4);
        const innovation = Optimism(leftRecord[i].q5);



        const answerRevenue = votedBlock(
            leftRecord[i].q1, rightRecord[i].q1
        );

        const answerSize = votedBlock(leftRecord[i].q2, rightRecord[i].q2);

        const answerFinance = votedBlock(leftRecord[i].q3, rightRecord[i].q3);

        const answerInvestment = voted(leftRecord[i].q4);

        const answerInnovation = voted(leftRecord[i].q5);

        revenueIndexes.push(revenue);
        sizeIndexes.push(size);
        financeIndexes.push(finance);
        investmentIndexes.push(investment);
        innovationIndexes.push(innovation);

        revenueJoin += answerRevenue;
        sizeJoin += answerSize;
        financeJoin += answerFinance;
        investmentJoin += answerInvestment;
        innovationJoin += answerInnovation;
    }

    const index = (
        takeIndex(revenueIndexes, revenueJoin)
        + takeIndex(sizeIndexes,sizeJoin)
        + takeIndex(financeIndexes,financeJoin)
        + takeIndex(investmentIndexes,  investmentJoin)
        + takeIndex(innovationIndexes, innovationJoin)
    ) / (5);
    return {revenue: takeIndex(revenueIndexes, revenueJoin),
        size: takeIndex(sizeIndexes,sizeJoin),
        finance: takeIndex(financeIndexes,financeJoin),
        investment: takeIndex(investmentIndexes,  investmentJoin),
        innovation: takeIndex(innovationIndexes, innovationJoin),
        index: index
    };


}

export const getIndex = async (req, res) => {
    try {
        let leftYear = Number(req.params.year);
        let leftQuarter = Number(req.params.quarter);
        let rightYear = 0;
        let rightQuarter = 0;
        if (leftQuarter === 4) {
            rightYear = leftYear + 1;
            rightQuarter = 1;
        } else {
            rightYear = leftYear;
            rightQuarter = leftQuarter + 1;
        }

        const leftRecord = await AnswersScheme.find({year: leftYear, quarter: leftQuarter, current: true});
        const rightRecord = await AnswersScheme.find({year: rightYear, quarter: rightQuarter, current: false});

        const leftResult = calculateIndex(leftRecord, rightRecord);
        const rightResult = calculateIndex(rightRecord, leftRecord);

        res.status(200).json({left: leftResult, right: rightResult});
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось получить индекс'
        })
    }
}


export const getRegionIndex = async (req, res) => {
    try {
        let leftYear = Number(req.params.year);
        let leftQuarter = Number(req.params.quarter);
        const region = Number(req.params.region)
        let rightYear = 0;
        let rightQuarter = 0;
        if (leftQuarter === 4) {
            rightYear = leftYear + 1;
            rightQuarter = 1;
        } else {
            rightYear = leftYear;
            rightQuarter = leftQuarter + 1;
        }

        const leftRecord = await AnswersScheme.find({year: leftYear, quarter: leftQuarter, region: region, current: true});
        const rightRecord = await AnswersScheme.find({year: rightYear, quarter: rightQuarter, region: region, current: false});

        const result = calculateJointIndex(leftRecord, rightRecord);

        res.status(200).json(result);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось получить индекс'
        })
    }
}



export const getBranchIndex = async (req, res) => {
    try {
        let leftYear = Number(req.params.year);
        let leftQuarter = Number(req.params.quarter);
        const branch = getBranchNumber.get(req.params.branch.toString());
        let rightYear = 0;
        let rightQuarter = 0;
        if (leftQuarter === 4) {
            rightYear = leftYear + 1;
            rightQuarter = 1;
        } else {
            rightYear = leftYear;
            rightQuarter = leftQuarter + 1;
        }

        const leftRecord = await AnswersScheme.find({year: leftYear, quarter: leftQuarter, branch: { $in: branch }, current: true});
        const rightRecord = await AnswersScheme.find({year: rightYear, quarter: rightQuarter, branch: { $in: branch }, current: false});

        // fs.writeFileSync('./target1.json', JSON.stringify(leftRecord));
        // fs.writeFileSync('./target2.json', JSON.stringify(rightRecord))

        // const leftResult = calculateIndex(leftRecord, rightRecord);
        // const rightResult = calculateIndex(rightRecord, leftRecord);

        const result = calculateJointIndex(leftRecord, rightRecord);
        // res.status(200).json({left: leftResult, right: rightResult});

        res.status(200).json(result);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось получить индекс'
        })
    }
}

export const getRevenueIndex = async (req, res) => {
    try {
        let leftYear = Number(req.params.year);
        let leftQuarter = Number(req.params.quarter);
        const revenue = Number(req.params.revenue);
        let rightYear = 0;
        let rightQuarter = 0;
        if (leftQuarter === 4) {
            rightYear = leftYear + 1;
            rightQuarter = 1;
        } else {
            rightYear = leftYear;
            rightQuarter = leftQuarter + 1;
        }

        const leftRecord = await AnswersScheme.find({year: leftYear, quarter: leftQuarter, revenue: { $in: revenue }, current: true});
        const rightRecord = await AnswersScheme.find({year: rightYear, quarter: rightQuarter, revenue: { $in: revenue }, current: false});

        // fs.writeFileSync('./target1.json', JSON.stringify(leftRecord));
        // fs.writeFileSync('./target2.json', JSON.stringify(rightRecord))

        // const leftResult = calculateIndex(leftRecord, rightRecord);
        // const rightResult = calculateIndex(rightRecord, leftRecord);

        const result = calculateJointIndex(leftRecord, rightRecord);
        // res.status(200).json({left: leftResult, right: rightResult});

        res.status(200).json(result);

    } catch (error) {
        console.log(error);
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



export const getYear = async (req, res) => {
    try {
        const record
            = await GeneralIndex.aggregate([
            { $group: { _id: null, uniqueYears: { $addToSet: 'year' } } },
        ], (err, result) => {
            if (err) {
                console.error('Ошибка при выполнении запроса:', err);
            } else {
                const uniqueYears = result[0].uniqueYears;
                console.log('Уникальные года в коллекции:', uniqueYears);
            }
        });
        if (!record) {
            return res.status(404).json({
                message: 'Индекс не найден или не существует.'
            })
        }

        res.json(record);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось создать запись об индексе.',
        })
    }
}

export const changeIndex = async (req, res) => {
    try {
        let records = await AnswersScheme.find({year: 2024});

        await Promise.all(records.map(async (record) => {
            record.current = false;
            await record.save();
        }));

        res.status(200).json({
            message: 'Индексы успешно обновлены'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось обновить индексы'
        });
    }
}

