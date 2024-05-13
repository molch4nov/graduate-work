import express from 'express';
import mongoose from 'mongoose';
import {
    registerValidation,
    loginValidation,
    postCreateValidation,
    postCreateCompanyValidation
} from './validations/validations.js';
import checkAuth from './utils/chechAuth.js';
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
import * as MailController from './services/mail-service.js';
import * as OfferController from './controllers/OfferController.js';
import {changeIndex, getBranchIndex} from "./controllers/IndexController.js";
import {
    createMessageForTopic,
    getAllMessagesFromTopic,
    getAllTopic
} from "./controllers/ForumController.js";
import {createOffer} from "./controllers/OfferController.js";

const mongoUrl = 'mongodb+srv://ytwotvladoks:mLi-D7V-TiM-kWn@blogpost.nwj3j2l.mongodb.net/blog?retryWrites=true&w=majority';

mongoose
    .connect(mongoUrl)
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB err', err))

const app = express();
app.use(cors(corsOptions))
app.use(express.json());

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
app.post('/index/:year/:quarter', IndexController.create);
app.get('/lalala', IndexController.changeIndex)


app.post('/forum', checkAuth, ForumController.createTopic);
app.get('/forum', checkAuth, ForumController.getAllTopic);
app.post('/forum/:id', checkAuth, ForumController.createMessageForTopic);
app.get('/forum/:id', checkAuth, ForumController.getAllMessagesFromTopic);

//TODO нужно сделать проверку на администратора  Владислав
app.post('/answers/:year/:quarter', AnswersController.createAnswer);

app.get('/years', IndexController.getYear)


app.use('/api-docs', swaggerUi.serve)
app.get('/api-docs', swaggerUi.setup(swaggerDocument))
app.listen(4444, (error) => {
    if (error) {
        return console.log(error);
    } 
    console.log('Server OK');
})
