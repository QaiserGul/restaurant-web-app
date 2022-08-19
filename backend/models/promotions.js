const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const promotionSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    label: {
        type: String,
        default: ''
    },
    price: {
        type: String,
        required: true,
        min: 0
    }
},{
    timestamps: true
});

let Promotion = mongoose.model('promotion',promotionSchema);

module.exports = Promotion;
