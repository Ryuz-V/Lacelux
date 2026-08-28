const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Anda dapat mengatur JWT_SECRET di file .env untuk keamanan (contoh: JWT_SECRET=rahasia_super)
const JWT_SECRET = process.env.JWT_SECRET || 'rahasia_sepatu_123!';

// Register
router.post('/register', async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: 'Semua field harus diisi' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email sudah terdaftar' });
        }

        const user = new User({ fullName, email, password });
        await user.save();

        const token = jwt.sign(
            { userId: user._id, email: user.email, fullName: user.fullName },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({ 
            message: 'Registrasi berhasil',
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email dan password harus diisi' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Email atau password salah' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Email atau password salah' });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email, fullName: user.fullName },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login berhasil',
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
});

// Get current user profile
router.get('/me', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Token tidak tersedia' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }

        res.json(user);
    } catch (error) {
        res.status(401).json({ message: 'Token tidak valid' });
    }
});

module.exports = router;
