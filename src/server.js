// src/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const Shoe = require('./models/Shoe');

const app = express();
app.use(cors());
app.use(express.json());

// Satu mount saja untuk folder public, sekaligus melayani root ("/") dan prefix "/public"
app.use(express.static(path.join(__dirname, '../public')));
app.use('/public', express.static(path.join(__dirname, '../public')));

const mongoURI = 'mongodb://127.0.0.1:27017/tokoh_sepatu';

mongoose.connect(mongoURI)
    .then(() => console.log('Terhubung ke MongoDB'))
    .catch(err => console.error('Gagal terhubung:', err));

// Endpoint untuk mengambil semua data sepatu
app.get('/api/shoes', async (req, res) => {
    try {
        const shoes = await Shoe.find();
        res.json(shoes);
    } catch (error) {
        res.status(500).json({ message: 'Error mengambil data' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});