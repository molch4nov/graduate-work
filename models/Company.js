import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema({
        shortName: {
            type: String,
            required: true,
        },
        fullName: {
            type: String,
            required: true,
        },
        rating: {
            type: String,
            required: true,
        },
        inn: {
            type: String,
            required: false,
        },
        ogrn: {
            type: String,
            required: false,
        }
        ,
        kpp: {
            type: String,
            required: false,
        },
        okpo: {
            type: String,
            required: false,
        },
        country: {
            type: String,
            required: false,
        },
        region: {
            type: String,
            required: false,
        },
        industry: {
            type: String,
            required: false,
        }   ,
        address: {
            type: String,
            required: false,
        }
    },
    {
        timestamps: true,
    });

export default mongoose.model('Company', CompanySchema);
