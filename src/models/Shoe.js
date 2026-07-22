// src/models/Shoe.js
const mongoose = require('mongoose');

const shoeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: String, required: true },
    imageUrl: { type: String },
    productLink: { type: String },
    brand: { type: String }
});

module.exports = mongoose.model('Shoe', shoeSchema);