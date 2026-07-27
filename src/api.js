const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors'); // Penting agar frontend diizinkan mengambil data

const app = express();
app.use(cors());

// Ganti dengan URL dan nama skema database/koleksi yang benar
const uri = "mongodb://localhost:27017"; 
const client = new MongoClient(uri);

app.get('/api/products', async (req, res) => {
    try {
        await client.connect();
        const database = client.db("tokoh_sepatu"); 
        const collection = database.collection("shoes");
        
        // Mengambil semua data dari koleksi
        const products = await collection.find({}).toArray();
        res.json(products); // Mengirim data sebagai JSON
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Jalankan API di port 3001 (karena port 3000 sudah dipakai frontend)
app.listen(3001, () => console.log('API berjalan di http://localhost:3001'));