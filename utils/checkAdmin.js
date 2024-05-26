import jwt from 'jsonwebtoken';
import UserModel from '../models/User.js';

export default async (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

    if (token) {
        try {
            const decoded = jwt.verify(token, 'secret123');
            const id = decoded._id;
            const user = await UserModel.findOne({_id: id});
            if (user.role === 'admin') {
                next();
            } else {
                res.status(403).json({
                    message: 'Нет доступа'
                })
            }
        } catch (error) {
            res.status(403).json({
                message: 'Нет доступа'
            })
        }
    } else {
        res.status(403).json({
            message: 'Нет доступа'
        })
    }
}
