import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from '../models/User.js';

import { validationResult } from 'express-validator';
import log from "node-file-logger";

const serviceName = 'UserController';

export const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }
    
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
    
        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
            subscription: req.body.subscription,
        });
    
        const user = await doc.save();

        const token = jwt.sign({
            _id: user._id,
        }, 
        'secret123', 
        {
            expiresIn: '30d',
        })

        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...userData,
            token,
        });
    } catch (err) {
        console.log(err);
        log.Error(`${error}`, 'UserService', 'register');
        res.status(500).json({
            message: 'Не удалось зарегестрироваться'
        })
    }
}


export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });

        if (!user) {
            return res.status(400).json({
                message: 'Пользователь не найден',
            });
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if (!isValidPass) {
            return res.status(400).json({
                message: 'Неверный логин или пароль',
            });
        }

        const token = jwt.sign({
            _id: user._id,
        }, 
        'secret123', 
        {
            expiresIn: '30d',
        })
        const { passwordHash, ...userData } = user._doc;
        res.json({
            ...userData,
            token,
        });
    } catch (error) {
        console.log(error);
        log.Error(`${error}`, 'UserService', 'login');
        res.status(500).json({
            message: 'Не удалось авторизоваться',
        })
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            })
        }

        const { passwordHash, ...userData } = user._doc;

        res.json(userData);
    } catch (error) {
        console.log(error);
        log.Error(`${error}`, 'UserService', 'getMe');
        res.status(500).json({
            message: 'Не удалось зарегестрироваться'
        })
    }
}

export const getFullList = async (req, res) => {
    try {
        const users = await UserModel.find();

        if (!users) {
            return res.status(400).json({
                message: 'Пользователи не найден',
            });
        }

        res.status(200).json({
            ...users
        });
    } catch (error) {
        console.log(error);
        log.Error(`${error}`, 'UserService', 'getFullList');
        res.status(500).json({
            message: 'Не удалось авторизоваться',
        })
    }
}

export const putOneRow = async (req, res) => {
    try {
        const id = req.params.id.toString();
        const user = await UserModel.findOne({_id: id});

        if (!user) {
            return res.status(400).json({
                message: 'Пользователи не найден',
            });
        }

        const fullName = req.body.fullName;
        const email = req.body.email;
        const role = req.body.role;

        user.fullName = fullName;
        user.email = email;
        user.role = role;

        const record = await user.save();

        res.status(200).json(record);

    } catch (error) {
        console.log(error);
        log.Error(`${error}`, 'UserService', 'putOneRow');
        res.status(500).json({
            message: 'Не удалось авторизоваться',
        })
    }
}

