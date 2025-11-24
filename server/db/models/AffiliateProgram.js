import { Schema, model } from 'mongoose';

const AffiliateProgramSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    points: {
        type: Number,
        required: true,
        default: 0
    },
    cardNumber: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
}, { strict: true, timestamps: true, versionKey: false });

const AffiliateProgramModel = model('AffiliateProgram', AffiliateProgramSchema);

export default AffiliateProgramModel;