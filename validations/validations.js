import { body } from 'express-validator';

export const registerValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум 5 символов').isLength({ min: 5 }),
    body('fullName', 'Имя должно быть больше, чем 3 символа').isLength({ min: 3 }),
    body('avatarUrl', 'Неверная ссылка на аватарку').optional().isURL(),
    body('subscription', 'Неверный формат подписки'),
];

export const loginValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум 5 символов').isLength({ min: 5 }),
];


export const postCreateValidation = [
    body('title', 'Введите заголовок статьи').isLength({ min: 3 }).isString(),
    body('content', 'Введите текст статьи').isLength({ min: 3 }).isString(),
    body('shortContent', 'Введите краткий текст статьи').isLength({ min: 3 }).isString(),
    body('date', 'Введите дату статьи').isLength({ min: 3 }).isString(),
];

export const postCreateCompanyValidation = [
    body('shortName', 'Введите сокращенное название компании').isLength({min: 3}).isString(),
    body('fullName', 'Введите полное название компании').isLength({min: 5}).isString(),
    body('rating', 'Введите рейтинг компании').isLength({min: 1}).isString(),
    body('inn', 'Введите ИНН компании').optional().isLength({min: 3}).isString(),
    body('ogrn', 'Введите ОГРН компании').optional().isLength({min: 3}).isString(),
    body('kpp', 'Введите КПП компании').optional().isLength({min: 3}).isString(),
    body('okpo', 'Введите ОКПО компании').optional().isString(),
    body('country', 'Введите страну компании').optional().isLength({min: 3}).isString(),
    body('region', 'Введите регион компании').optional().isLength({min: 3}).isString(),
    body('industry', 'Введите отрасль компании').optional().isLength({min: 3}).isString(),
    body('address', 'Введите адрес компании').optional().isLength({min: 3}).isString(),
];
