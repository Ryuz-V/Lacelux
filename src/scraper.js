const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const UserAgent = require('user-agents');
const fs = require('fs');
const mongoose = require('mongoose');
const Shoe = require('./models/Shoe');

puppeteer.use(StealthPlugin());

const mongoURI = 'mongodb://127.0.0.1:27017/tokoh_sepatu';
const COOKIE_FILE = './cookies.json';

async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            let totalHeight = 0;
            let distance = 100;
            let timer = setInterval(() => {
                let scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight - window.innerHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100); 
        });
    });
}

const delay = (time) => new Promise(resolve => setTimeout(resolve, time));

async function scrapeFootLocker() {
    try {
        await mongoose.connect(mongoURI);
        console.log('Terhubung ke MongoDB (Scraper)');
        const PROXY_SERVER = '';
        const browserArgs = [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-blink-features=AutomationControlled',
            '--window-size=1920,1080'
        ];
        if (PROXY_SERVER) browserArgs.push(PROXY_SERVER);

        const browser = await puppeteer.launch({ 
            headless: false, 
            args: browserArgs
        });
        
        const page = await browser.newPage();
        const userAgent = new UserAgent({ deviceCategory: 'desktop' });
        await page.setUserAgent(userAgent.toString());
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'en-US,en;q=0.9',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-User': '?1',
        });

        if (fs.existsSync(COOKIE_FILE)) {
            const cookiesString = fs.readFileSync(COOKIE_FILE);
            const parsedCookies = JSON.parse(cookiesString);
            if (parsedCookies.length !== 0) {
                await page.setCookie(...parsedCookies);
                console.log('Session Cookies dimuat ke browser.');
            }
        }

        // Ganti URL tunggal dengan Array untuk halaman 2 dan 3
        const urlsToScrape = [
            'https://www.footlocker.id/all-shoes.html?p=2&product_list_order=newest_sorting',
            'https://www.footlocker.id/all-shoes.html?p=3&product_list_order=newest_sorting'
        ];

        let allProducts = [];

        for (let i = 0; i < urlsToScrape.length; i++) {
            const url = urlsToScrape[i];
            console.log(`\nMulai mengunjungi: ${url}`);

            await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 });
            
            // Jeda lebih lama di iterasi pertama buat jaga-jaga ada CAPTCHA
            if (i === 0) {
                console.log('Menunggu 45 detik... Silakan selesaikan CAPTCHA di browser jika muncul!');
                await delay(45000);
            } else {
                console.log('Menunggu 10 detik sebelum scraping halaman selanjutnya agar tidak terdeteksi spam...');
                await delay(10000); 
            }

            await page.mouse.move(100, 100);
            await page.mouse.move(200, 200);
            console.log('Mulai melakukan scrolling...');
            await autoScroll(page);
            
            try {
                await page.waitForSelector('.item.product.product-item', { timeout: 60000 }); 
            } catch (e) {
                console.log(`Selector produk tidak ditemukan di halaman ini, kemungkinan diblokir. Lanjut ke URL berikutnya...`);
                continue;
            }

            const products = await page.evaluate(() => {
                let items = [];
                let productNodes = document.querySelectorAll('.item.product.product-item'); 
                
                productNodes.forEach(node => {
                    const name = node.querySelector('.product-item-link')?.innerText.trim() || '';
                    const price = node.querySelector('.price')?.innerText.trim() || '';
                    const imageUrl = node.querySelector('.product-image-main')?.src || '';
                    const productLink = node.querySelector('a.product-item-link')?.href || '';
                    const brand = node.querySelector('.brand-name')?.innerText.trim() || 'Footlocker';
                    
                    if (name && price) {
                        items.push({ name, price, imageUrl, productLink, brand });
                    }
                });
                return items;
            });

            console.log(`Berhasil mengambil ${products.length} produk dari halaman ${i + 2}.`);
            allProducts = allProducts.concat(products);
        }

        if (allProducts.length > 0) {
            // await Shoe.deleteMany({}); // Dimatikan agar data page 1 tidak terhapus
            await Shoe.insertMany(allProducts);
            console.log(`\nTotal ${allProducts.length} data dari page 2 & 3 berhasil ditambahkan ke database!`);
        } else {
            console.log('Gagal mengambil data produk (0 items). Anda mungkin masih diblokir oleh sistem keamanan.');
            console.log('Coba jalankan dengan headless: false dan selesaikan CAPTCHA secara manual jika muncul.');
        }

        const currentCookies = await page.cookies();
        fs.writeFileSync(COOKIE_FILE, JSON.stringify(currentCookies, null, 2));
        console.log('Session Cookies berhasil disimpan untuk request selanjutnya.');

        await browser.close();
    } catch (error) {
        console.error('Terjadi kesalahan saat scraping:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Koneksi MongoDB ditutup.');
    }
}

scrapeFootLocker();