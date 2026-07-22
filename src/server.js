// src/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Shoe = require('./models/Shoe'); // Import model yang baru dibuat

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Menyajikan file index.html & style.css

// Ganti URI ini dengan URL MongoDB lokal atau MongoDB Atlas milikmu
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