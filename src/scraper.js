// src/scraper.js
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const UserAgent = require('user-agents');
const fs = require('fs');
const mongoose = require('mongoose');
const Shoe = require('./models/Shoe');

// 4. Gunakan Alat Pengotomatisasi Tingkat Lanjut (Puppeteer Stealth)
// Stealth Plugin berguna untuk menghapus jejak puppeteer default (seperti properti webdriver: true)
puppeteer.use(StealthPlugin());

const mongoURI = 'mongodb://127.0.0.1:27017/tokoh_sepatu';
const COOKIE_FILE = './cookies.json';

// 3. Atur Pola Perilaku (Fungsi untuk scroll halaman secara acak seperti manusia)
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
            }, 100); // 100ms jeda per scroll
        });
    });
}

// Jeda acak (Random Delay) untuk meniru perilaku manusia
const delay = (time) => new Promise(resolve => setTimeout(resolve, time));

async function scrapeFootLocker() {
    try {
        await mongoose.connect(mongoURI);
        console.log('Terhubung ke MongoDB (Scraper)');

        // 2. Kelola Alamat IP (Proxy)
        // Jika Anda berlangganan layanan proxy rotasi (seperti BrightData, Smartproxy), masukkan URL-nya di sini
        const PROXY_SERVER = ''; // contoh: '--proxy-server=http://ip_address:port'
        const browserArgs = [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-blink-features=AutomationControlled',
            '--window-size=1920,1080'
        ];
        if (PROXY_SERVER) browserArgs.push(PROXY_SERVER);

        const browser = await puppeteer.launch({ 
            headless: false, // Gunakan false dulu untuk melihat prosesnya lolos Captcha/Cloudflare atau tidak
            args: browserArgs
        });
        
        const page = await browser.newPage();

        // 1. Manipulasi Request Headers (User Agent, Bahasa, dll)
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

        // 5. Simpan Cookies dan Session
        // Jika cookie sudah ada, muat cookie tersebut agar server mengira kita adalah user lama
        if (fs.existsSync(COOKIE_FILE)) {
            const cookiesString = fs.readFileSync(COOKIE_FILE);
            const parsedCookies = JSON.parse(cookiesString);
            if (parsedCookies.length !== 0) {
                await page.setCookie(...parsedCookies);
                console.log('Session Cookies dimuat ke browser.');
            }
        }

        const url = 'https://www.footlocker.id/en/men/shoes/sneakers.html';
        console.log(`Mulai mengunjungi: ${url}`);
        
        // Timeout lebih lama karena Cloudflare / Datadome mungkin menampilkan halaman verifikasi (Captcha)
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 });

        // 6. Gunakan Layanan Solver Captcha
        // Jika muncul halaman captcha Cloudflare, Anda harus menggunakan plugin solver captcha 
        // (Contoh: 2captcha atau anti-captcha API) atau menyelesaikannya secara manual jika headless: false
        console.log('Menunggu 5 detik secara acak (Simulasi Human Delay)...');
        await delay(Math.floor(Math.random() * 3000) + 5000);

        // Simulasi pergerakan kursor mouse dan scroll ke bawah agar dikira manusia
        await page.mouse.move(100, 100);
        await page.mouse.move(200, 200);
        console.log('Mulai melakukan scrolling...');
        await autoScroll(page);

        // Tunggu produk muncul
        try {
            await page.waitForSelector('.product-item, .product-card', { timeout: 15000 });
        } catch (e) {
            console.log('Selector produk tidak ditemukan, kemungkinan terblokir Anti-Bot atau struktur web berubah.');
        }

        // Ambil data produk
        const products = await page.evaluate(() => {
            let items = [];
            // Class ini HARUS dicocokkan dengan inspect element Footlocker ID
            let productNodes = document.querySelectorAll('.item.product.product-item'); 
            
            productNodes.forEach(node => {
                const name = node.querySelector('.product-item-link')?.innerText.trim() || '';
                const price = node.querySelector('.price')?.innerText.trim() || '';
                const imageUrl = node.querySelector('.product-image-photo')?.src || '';
                const productLink = node.querySelector('a.product-item-link')?.href || '';
                const brand = node.querySelector('.brand-name')?.innerText.trim() || 'Footlocker';
                
                if (name && price) {
                    items.push({ name, price, imageUrl, productLink, brand });
                }
            });
            return items;
        });

        console.log(`Berhasil mengambil ${products.length} produk dari halaman.`);

        if (products.length > 0) {
            await Shoe.deleteMany({});
            await Shoe.insertMany(products);
            console.log('Data asli berhasil disimpan ke database!');
        } else {
            console.log('Gagal mengambil data produk (0 items). Anda mungkin masih diblokir oleh sistem keamanan.');
            console.log('Coba jalankan dengan headless: false dan selesaikan CAPTCHA secara manual jika muncul.');
        }

        // Simpan Cookies session terbaru untuk digunakan nanti
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