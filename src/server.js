// src/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const Shoe = require('./models/Shoe');
const authRoutes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../public')));
app.use('/public', express.static(path.join(__dirname, '../public')));

const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tokoh_sepatu';

mongoose.connect(mongoURI)
    .then(() => console.log('Terhubung ke MongoDB'))
    .catch(err => console.error('Gagal terhubung:', err));

// Endpoint Auth
app.use('/api/auth', authRoutes);

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