import express from 'express';
import mongoose from 'mongoose';
import { registerValidation, loginValidation, postCreateValidation } from './validations/validations.js';
import checkAuth from './utils/chechAuth.js';

let cors = require ( 'cors' );
let corsOptions = {
    methods: ['OPTIONS,GET,POST,PUT,DELETE'],
    credentials: true,
    origin: true,
    maxAge: 3600,
    allowedHeaders: ['Content-Type,Access-Control-Allow-Headers,Authorization,X-Requested-With'],
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions))


import * as UserController from './controllers/UserController.js';
import * as NewsController from './controllers/NewsController.js';

mongoose
    .connect('mongodb+srv://ytwotvladoks:mLi-D7V-TiM-kWn@blogpost.nwj3j2l.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB err', err))

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hellow World!');
})

app.post('/auth/login', loginValidation, UserController.login);
app.post('/auth/register', registerValidation, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

//app.get('/posts', NewsController.getAll);
//app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, NewsController.create);
//app.delete('/posts', PostController.remove);

app.listen(4444, (error) => {
    if (error) {
        return console.log(error);
    } 
    console.log('Server OK');
})