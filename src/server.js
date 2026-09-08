// src/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const Shoe = require('./models/Shoe');
const authRoutes = require('./routes/auth');

// 1. Import module untuk auto-refresh
const livereload = require('livereload');
const connectLiveReload = require('connect-livereload');

// 2. Buat server LiveReload dan pantau folder public
const publicDirectory = path.join(__dirname, '../public');
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(publicDirectory);

const app = express();
app.use(cors());
app.use(express.json());

// 3. Gunakan middleware connect-livereload 
// (PENTING: Harus diletakkan SEBELUM express.static)
app.use(connectLiveReload());

// Setup static folder bawaan
app.use(express.static(publicDirectory));
app.use('/public', express.static(publicDirectory));

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

// 4. Beri jeda saat server restart lewat nodemon agar browser otomatis refresh
liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
        liveReloadServer.refresh("/");
    }, 100);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});