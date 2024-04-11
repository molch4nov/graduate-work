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
import {create, getSeparateIndex, getYear} from "./controllers/IndexController.js";
import * as AnswersController from "./controllers/AnswersController.js";

mongoose
    .connect('mongodb+srv://ytwotvladoks:mLi-D7V-TiM-kWn@blogpost.nwj3j2l.mongodb.net/blog?retryWrites=true&w=majority')
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

app.get('/posts', NewsController.getAll);
app.get('/posts/:id', NewsController.getOne);
app.post('/posts', postCreateValidation, NewsController.create);


app.get('/companies',  CompanyController.getAllCompanies);
app.get('/companies/:id',  CompanyController.getOneCompany);
app.post('/companies', postCreateCompanyValidation, CompanyController.createCompany);


app.get('/jointIndex/:year/:quarter', IndexController.getJointIndex);
app.get('/separateIndex/:year/:quarter', IndexController.getSeparateIndex);
app.post('/index/:year/:quarter', IndexController.create);

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
