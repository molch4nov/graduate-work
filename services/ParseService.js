import XLSX from 'xlsx'
import * as fs from "fs";
import {login} from "../controllers/UserController.js";

const selectedFields = ['Регион',
    'Отрасль',
    'Размер выручки',
    'Q1: Выручка в 4 квартале',
    'Q2: Выручка в 1 квартале',
    'Q3: Занятых в 4 квартале',
    'Q4: Занятых в 1 квартале',
    'Q5: Затраты на развитие в 4 квартале',
    'Q6: Затраты на развитие в 1 квартале',
    'Q7: Кредиты',
    'Q8: Разработка новых продуктов'
];



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

export const votedBlock  = (a, b) => {return (a === 99 || b === 99) ? 0 : 1};
export const voted  = (a) => {return a === 99 ? 0 : 1};


export const Optimism = (a) => {return a > 4 ? 0 : a > 2 ? 0.5 : 1};

export const calcJointIndex = (answers, quarterPast = 4, quarterFuture = 1, yearPast = '', yearFuture = '') => {
    const OptimismBlock = (a, b) => {
        return ((a === 1 ? 2 : (a === 2 ? 1 : 0)) + (b === 1 ? 2 : (b === 2 ? 1 : 0))) * 0.25;
    }

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

    answers.forEach(item => {
        const revenue = OptimismBlock(
            item['Q1: Выручка в ' + `${quarterPast}` +' квартале'],
            item['Q2: Выручка в ' + `${quarterFuture}` +' квартале']);

        const size = OptimismBlock(
            item['Q3: Занятых в ' + `${quarterPast}` +' квартале'],
            item['Q4: Занятых в ' + `${quarterFuture}` +' квартале']
        );

        const finance = OptimismBlock(
            item['Q5: Затраты на развитие в ' + `${quarterPast}` + ' квартале'],
            item['Q6: Затраты на развитие в ' + `${quarterFuture}` + ' квартале']
        );

        const investment = Optimism(item['Q7: Кредиты']);
        const innovation = Optimism(item['Q8: Разработка новых продуктов']);



        const answerRevenue = votedBlock(
            item['Q1: Выручка в ' + `${quarterPast}` +' квартале'],
            item['Q2: Выручка в ' + `${quarterFuture}` +' квартале']
        );

        const answerSize = votedBlock(
            item['Q3: Занятых в ' + `${quarterPast}` +' квартале'],
            item['Q4: Занятых в ' + `${quarterFuture}` +' квартале']
        );

        const answerFinance = votedBlock(
            item['Q5: Затраты на развитие в ' + `${quarterPast}` + ' квартале'],
            item['Q6: Затраты на развитие в ' + `${quarterFuture}` + ' квартале']
        );

        const answerInvestment = voted(
            item['Q7: Кредиты']
        );

        const answerInnovation = voted(
            item['Q8: Разработка новых продуктов']
        );

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
    })

    const index = (
        takeIndex(revenueIndexes, revenueJoin)
        + takeIndex(sizeIndexes,sizeJoin)
        + takeIndex(financeIndexes,financeJoin)
        + takeIndex(investmentIndexes,  investmentJoin)
        + takeIndex(innovationIndexes, innovationJoin)
    ) / (5);
    return [takeIndex(revenueIndexes, revenueJoin),
        takeIndex(sizeIndexes,sizeJoin),
        takeIndex(financeIndexes,financeJoin),
        takeIndex(investmentIndexes,  investmentJoin),
        takeIndex(innovationIndexes, innovationJoin),
        index
    ];
}

export const calcSeparateIndex = (answers, quarter = 1,  year = 2024) => {
    const OptimismBlock = (a) => {
        return (a === 1 ? 2 : (a === 2 ? 1 : 0)) * 0.5;
    }

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

    answers.forEach(item => {
        // console.log(item)
        const revenue = OptimismBlock(item['Q1: Выручка']);

        const size = OptimismBlock(item['Q2: Занятых']);

        const finance = OptimismBlock(item['Q3: Затраты']);

        const investment = Optimism(item['Q4: Кредиты']);
        const innovation = Optimism(item['Q5: Разработка новых продуктов']);


        const answerRevenue = voted(
            item['Q1: Выручка']
        );

        const answerSize = voted(
            item['Q2: Занятых']
        );

        const answerFinance = voted(
            item['Q3: Затраты']
        );

        const answerInvestment = voted(
            item['Q4: Кредиты']
        );

        const answerInnovation = voted(
            item['Q5: Разработка новых продуктов']
        );

         console.log(revenue, ',', size, ',', finance, ',', investment, ',', innovation)

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
    })

    const index = (
        takeIndex(revenueIndexes, revenueJoin)
        + takeIndex(sizeIndexes,sizeJoin)
        + takeIndex(financeIndexes,financeJoin)
        + takeIndex(investmentIndexes,  investmentJoin)
        + takeIndex(innovationIndexes, innovationJoin)
    ) / (5);

    return [takeIndex(revenueIndexes, revenueJoin),
        takeIndex(sizeIndexes,sizeJoin),
        takeIndex(financeIndexes,financeJoin),
        takeIndex(investmentIndexes,  investmentJoin),
        takeIndex(innovationIndexes, innovationJoin),
        index
    ];
}


export const parseFile = (filename = '../docs/answers.xlsx') => {
    const workbook = XLSX.readFile(filename);
    const sheet_name_list = workbook.SheetNames;
    const answers = XLSX.utils.sheet_to_json(workbook.Sheets['answers']);
    console.log(answers)
    console.log(calcJointIndex(answers.slice(0, -2)));
    // console.log(calcSeparateIndex(answers.slice(0, -2), false, 4));
    // console.log(calcSeparateIndex(answers.slice(0, -2), true, 1));

    fs.writeFileSync('./target.json', JSON.stringify(calcJointIndex(answers)))
}

parseFile();


