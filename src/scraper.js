// Konsep dasar src/scraper.js
const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
const Shoe = require('./models/Shoe');

async function scrapeFootLocker() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    // Target URL Foot Locker
    await page.goto('URL_KATEGORI_SEPATU_FOOT_LOCKER', { waitUntil: 'networkidle2' });

    // Evaluasi DOM untuk mengambil data (Selector ini hanya contoh, kamu harus inspect element web aslinya)
    const products = await page.evaluate(() => {
        let items = [];
        let productNodes = document.querySelectorAll('.product-card'); // Sesuaikan class CSS
        
        productNodes.forEach(node => {
            items.push({
                name: node.querySelector('.product-title')?.innerText || '',
                price: node.querySelector('.product-price')?.innerText || '',
                imageUrl: node.querySelector('img')?.src || ''
            });
        });
        return items;
    });

    console.log(products);
    
    // Simpan ke MongoDB (Pastikan Mongoose sudah connect dulu)
    // await Shoe.insertMany(products);

    await browser.close();
}

// Panggil fungsi
// scrapeFootLocker();