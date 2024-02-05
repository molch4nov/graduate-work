import CompanyModel from '../models/Company.js'
import {validationResult} from "express-validator";

export const createCompany = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const doc = new CompanyModel({
            shortName: req.body.shortName,
            fullName: req.body.fullName,
            rating: req.body.rating,
            inn: req.body.inn,
            ogrn: req.body.ogrn,
            kpp: req.body.kpp,
            okpo: req.body.okpo,
            country: req.body.country,
            region: req.body.region,
            industry: req.body.industry,
            address: req.body.address,
        });

        const company = await doc.save();

        res.json(company);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось создать компанию',
        })
    }
}

export const getAllCompanies = async (req, res) => {
    try {
        const companies = await CompanyModel.find();
        res.json(companies)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось получить все компании',
        })
    }
}

export const getOneCompany = async (req, res) => {
    try {
        const companyId = req.params.id;

        const company = await CompanyModel.findById(companyId);

        if (!company) {
            return res.status(404).json({
                message: 'Компания не найдена'
            })
        }

        res.json(company);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось получить компанию.',
        })
    }
}
