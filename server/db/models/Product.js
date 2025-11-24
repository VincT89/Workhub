import { Schema, model } from 'mongoose';

const ProductsSchema = new Schema({
    name: {
        type: String,
        required: true,
        index: true,
    },
    price: {
        type: Number,
        required: true,
    },
    sku: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
}, { strict: true, timestamps: true, versionKey: false });

const ProductsModel = model('Products', ProductsSchema);

export default ProductsModel;