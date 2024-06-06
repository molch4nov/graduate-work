import express from 'express';
import mongoose from 'mongoose';
import {
    registerValidation,
    loginValidation,
    postCreateValidation,
    postCreateCompanyValidation
} from './validations/validations.js';
import checkAuth from './utils/chechAuth.js';
import checkAdmin from './utils/checkAdmin.js';
import cors from 'cors';

import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger-output.json' assert { type: "json" };

let corsOptions = {
    methods: ['OPTIONS,GET,POST,PUT,DELETE'],
    credentials: true,
    origin: true,
    maxAge: 3600,
    allowedHeaders: ['Content-Type,Access-Control-Allow-Headers,Authorization,X-Requested-With'],
    optionsSuccessStatus: 200
}

import * as UserController from './controllers/UserController.js';
import * as NewsController from './controllers/NewsController.js';
import * as CompanyController from "./controllers/CompanyController.js";
import * as IndexController from "./controllers/IndexController.js";
import * as AnswersController from "./controllers/AnswersController.js";
import * as ForumController from './controllers/ForumController.js';
import * as FileController from './controllers/FileController.js';
import * as MailController from './services/mail-service.js';
import * as OfferController from './controllers/OfferController.js';
import {changeIndex, getBranchIndex} from "./controllers/IndexController.js";
import {
    createMessageForTopic,
    getAllMessagesFromTopic,
    getAllTopic
} from "./controllers/ForumController.js";
import {createOffer} from "./controllers/OfferController.js";
import fileLogger from "node-file-logger";
import log from "node-file-logger";
import promMid from 'express-prometheus-middleware';
const mongoUrl = 'mongodb+srv://ytwotvladoks:mLi-D7V-TiM-kWn@blogpost.nwj3j2l.mongodb.net/blog?retryWrites=true&w=majority';

mongoose
    .connect(mongoUrl)
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB err', err))

const app = express();
app.use(cors(corsOptions))
app.use(express.json());

app.use(promMid({
    metricsPath: '/metrics',
    collectDefaultMetrics: true,
    requestDurationBuckets: [0.1, 0.5, 1, 1.5],
    requestLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
    responseLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
}));



const options = {
    timeZone: 'Russia/Moscow',
    folderPath: './logs/',
    dateBasedFileNaming: true,
    // Required only if dateBasedFileNaming is set to false
    fileName: 'All_Logs',
    // Required only if dateBasedFileNaming is set to true
    fileNamePrefix: 'Logs_',
    fileNameSuffix: '',
    fileNameExtension: '.log',

    dateFormat: 'YYYY-MM-DD',
    timeFormat: 'HH:mm:ss.SSS',
    logLevel: 'debug',
    onlyFileLogging: true
}

// Note: If you set dateBasedFileNaming to false, then a log file will be created at the folder path with the provided fileName.
// If set to true then a logfile will be created with the name <fileName> provided in the options

log.SetUserOptions(options);

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.post('/auth/login', loginValidation, UserController.login);
app.post('/auth/register', registerValidation, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

//TODO нужно сделать проверку на администратора Владислав
app.post('/announcement', MailController.createAnnouncement);

//TODO Сделать обработку ошибки или создание запроса для администраторов
app.post('/errors-and-offers', OfferController.createOffer)

app.get('/posts', NewsController.getAll);
app.get('/posts/:id', NewsController.getOne);
app.post('/posts', postCreateValidation, NewsController.create);


app.get('/companies',  CompanyController.getAllCompanies);
app.get('/companies/:id',  CompanyController.getOneCompany);
//TODO нужно сделать проверку на администратора Владислав
app.post('/companies', postCreateCompanyValidation, CompanyController.createCompany);


app.get('/jointIndex/:year/:quarter', IndexController.getJointIndex);
app.get('/separateIndex/:year/:quarter', IndexController.getIndex);
app.get('/regionIndex/:year/:quarter/:region', IndexController.getRegionIndex);
app.get('/branchIndex/:year/:quarter/:branch', IndexController.getBranchIndex);
app.get('/revenueIndex/:year/:quarter/:revenue', IndexController.getRevenueIndex);
app.get('/generalIndex/:year/:quarter', IndexController.getGeneralIndex);
app.get('/generalBranchIndex/:year/:quarter', IndexController.getGeneralBranchIndex);
app.get('/years', IndexController.getYear);
app.get('/quarters/:year', IndexController.getQuarter);
app.post('/index/:year/:quarter/:current', IndexController.create);
app.get('/lalala', IndexController.changeIndex);


app.post('/forum', checkAuth, ForumController.createTopic);
app.get('/forum', ForumController.getAllTopic);
app.post('/forum/:id', checkAuth, ForumController.createMessageForTopic);
app.get('/forum/:id', ForumController.getAllMessagesFromTopic);

//TODO for admin panel
app.delete('/forum/:id', checkAdmin, ForumController.removeOneMessageFromTopic);
app.delete('/forum/topic/:id', checkAdmin, ForumController.removeOneTopic);
app.get('/users-list', checkAdmin, UserController.getFullList);
app.put('/user-list/:id', checkAdmin, UserController.putOneRow);
app.post('/create-file/:year/:quarter', checkAdmin, FileController.createNewRow);


//TODO нужно сделать проверку на администратора  Владислав
app.post('/answers/:year/:quarter/:current', AnswersController.createAnswer);

app.get('/years', IndexController.getYear)


app.use('/api-docs', swaggerUi.serve)
app.get('/api-docs', swaggerUi.setup(swaggerDocument))
app.listen(4445, (error) => {
    if (error) {
        return console.log(error);
    } 
    console.log('Server OK');
})
