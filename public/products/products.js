function detectBrand(product) {
    const nameStr = ((product.name || product.title || "")).toLowerCase();
    const rawBrand = (product.brand || "").trim();
    const knownBrands = [
        "Nike", "Jordan", "Adidas", "Puma", "New Balance", "Asics", "Vans", "Converse",
        "On Running", "On", "Reebok", "Under Armour", "Skechers", "Fila", "Diadora",
        "Salomon", "Hoka", "Brooks", "Saucony", "Umbro", "Kappa", "Crocs", "Birkenstock",
        "Onitsuka Tiger", "Timberland", "Dr. Martens", "Champion", "K-Swiss", "Mizuno",
        "Le Coq Sportif", "Superga", "Clarks", "ECCO", "Merrell", "Xero Shoes", "Veja",
        "Allbirds", "Common Projects", "Golden Goose", "Yeezy"
    ];
    const matchedKnown = knownBrands.find(b => b.toLowerCase() === rawBrand.toLowerCase());
    if (matchedKnown) return matchedKnown;

    const brandKeywords = [
        { brand: "Nike", keywords: ["nike", "jordan", "dunk", "air force", "af1", "air max", "blazer", "pegasus", "react", "zoom", "vapormax", "cortez", "waffle"] },
        { brand: "Adidas", keywords: ["adidas", "yeezy", "samba", "gazelle", "stan smith", "ultraboost", "boost", "primeknit", "nmd", "forum", "campus", "ozweego"] },
        { brand: "Puma", keywords: ["puma", "suede", "rs-x", "rs-x3", "cali", "future rider", "velocity nitro", "speedcat"] },
        { brand: "New Balance", keywords: ["new balance", "nb ", "fuelcell", "fuel cell", "574", "990", "9060", "2002r", "530"] },
        { brand: "Asics", keywords: ["asics", "gel-", "gel ", "kayano", "nimbus", "gt-2000"] },
        { brand: "Vans", keywords: ["vans", "old skool", "sk8-hi", "authentic", "era"] },
        { brand: "Converse", keywords: ["converse", "shai", "chuck taylor", "chuck 70", "run star", "weapon", "one star"] },
        { brand: "On Running", keywords: ["cloud", "on running"] },
        { brand: "Reebok", keywords: ["reebok", "classic leather", "club c", "nano", "instapump", "zig"] },
        { brand: "Under Armour", keywords: ["under armour", "curry"] },
        { brand: "Skechers", keywords: ["skechers"] },
        { brand: "Fila", keywords: ["fila"] },
        { brand: "Diadora", keywords: ["diadora"] },
        { brand: "Salomon", keywords: ["salomon"] },
        { brand: "Hoka", keywords: ["hoka"] },
        { brand: "Brooks", keywords: ["brooks"] },
        { brand: "Saucony", keywords: ["saucony", "shadow", "jazz"] },
        { brand: "Umbro", keywords: ["umbro"] },
        { brand: "Kappa", keywords: ["kappa"] },
        { brand: "Crocs", keywords: ["crocs"] },
        { brand: "Birkenstock", keywords: ["birkenstock"] },
        { brand: "Onitsuka Tiger", keywords: ["onitsuka"] },
        { brand: "Timberland", keywords: ["timberland"] },
        { brand: "Dr. Martens", keywords: ["dr. martens", "dr martens", "doc martens"] },
        { brand: "Champion", keywords: ["champion"] },
        { brand: "K-Swiss", keywords: ["k-swiss"] },
        { brand: "Mizuno", keywords: ["mizuno", "wave"] },
        { brand: "Le Coq Sportif", keywords: ["le coq sportif"] },
        { brand: "Superga", keywords: ["superga"] },
        { brand: "Clarks", keywords: ["clarks"] },
        { brand: "ECCO", keywords: ["ecco"] },
        { brand: "Merrell", keywords: ["merrell"] },
        { brand: "Xero Shoes", keywords: ["xero"] },
        { brand: "Veja", keywords: ["veja"] },
        { brand: "Allbirds", keywords: ["allbirds"] },
        { brand: "Common Projects", keywords: ["common projects"] },
        { brand: "Golden Goose", keywords: ["golden goose"] },
    ];

    for (const entry of brandKeywords) {
        if (entry.keywords.some(k => nameStr.includes(k))) {
            return entry.brand;
        }
    }
    return "Tanpa Merek";
}

document.addEventListener("DOMContentLoaded", async () => {
    // 1. Ambil parameter ID dari URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    try {
        // 2. Fetch data dari API (Sama seperti di katalog)
        const response = await fetch('http://localhost:3000/api/shoes');
        if (!response.ok) throw new Error("Gagal mengambil data");
        const products = await response.json();

        // 3. Cari produk berdasarkan ID
        // Menggunakan String() untuk memastikan tipe data cocok (aman dari perbedaan int/string)
        const selectedProduct = products.find(product => String(product._id) === String(productId));

        // 4. Masukkan data ke dalam elemen HTML
        if (selectedProduct) {
            // Format harga (menyesuaikan format dari API)
            let displayPrice = selectedProduct.price || selectedProduct.harga || "Rp 0";
            if (typeof displayPrice === 'number') {
                displayPrice = 'Rp. ' + displayPrice.toLocaleString('id-ID');
            }

        // 1. Logika penentuan gender/kategori (Men, Women, Kids)
let determinedCategory = "Unisex";
const productInfo = ((selectedProduct.category || "") + " " + (selectedProduct.gender || "") + " " + (selectedProduct.name || "")).toLowerCase();

if (productInfo.includes("wanita") || productInfo.includes("women") || productInfo.includes("girl")) {
    determinedCategory = "Women";
} else if (productInfo.includes("pria") || productInfo.includes("men") || productInfo.includes("boy")) {
    determinedCategory = "Men";
} else if (productInfo.includes("anak") || productInfo.includes("kids") || productInfo.includes("toddler")) {
    determinedCategory = "Kids";
}

// 2. Logika deteksi Brand otomatis (mengabaikan nama toko Footlocker)
// Menggunakan fungsi detectBrand() yang sama dengan halaman katalog (lihat catalog.js)
// supaya hasil deteksi brand konsisten di semua halaman, untuk semua produk.
let determinedBrand = detectBrand(selectedProduct);

// 3. Mapping data akhir
const mappedData = {
    brand: determinedBrand, // Sekarang menggunakan hasil deteksi pintar
    title: selectedProduct.name || selectedProduct.title || "Tanpa Nama",
    category: determinedCategory,
    sku: selectedProduct._id || "-",
    price: displayPrice,
    oldPrice: selectedProduct.oldPrice || "Rp. 1.549.000",
    discount: selectedProduct.discount || "30% OFF",
    rating: selectedProduct.rating || 4.3,
    reviewCount: selectedProduct.reviewCount || 375,
    images: [
        selectedProduct.imageUrl || selectedProduct.image || "https://placehold.co/600x400?text=No+Image"
    ],
    sizes: selectedProduct.sizes || ["US 6.5", "US 7", "US 8", "US 8.5", "US 9", "US 10"],
    description: selectedProduct.description || `
        <h3>${determinedBrand} ${selectedProduct.name || "Produk"}</h3>
        <ul>
            <li>There may be a 1-2cm difference in measurements depending on the development and manufacturing process.</li>
        </ul>
        <h3>Color Disclaimer:</h3>
        <ul>
            <li>Actual colors may vary. This is due to the fact that every computer monitor has a different capability to display colors, we cannot guarantee that the color you see accurately portrays the true color of the product.</li>
        </ul>
    `,
    reviews: selectedProduct.reviews || [
        {
            user: "CampTheHit",
            date: "8 days ago",
            title: "Super comfy",
            text: "Very comfy and true to size. Already got 2 and will definitely get more!",
            source: "Originally posted on Brand Site"
        },
        {
            user: "SalmaH",
            date: "14 days ago",
            title: "I love it",
            text: "Runs a little big but nothing too serious. Look just as pictured.",
            source: "Originally posted on Brand Site"
        }
    ]
};

            populateData(mappedData);
            switchTab('details');
            document.title = mappedData.title;
        } else {
            document.getElementById('loading').classList.add('hidden');
            document.getElementById('error-message').classList.remove('hidden');
            document.getElementById('error-message').textContent = "Produk tidak ditemukan!";
        }
    } catch (error) {
        console.error("Terjadi kesalahan:", error);
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('error-message').classList.remove('hidden');
        document.getElementById('error-message').textContent = "Terjadi kesalahan saat memuat data produk.";
    }
});

const scrapedData = {
    brand: "Nike",
    title: "Nike Dunk Low Women's Basketball Shoes - Photon Dust",
    category: "Women",
    sku: "0886-NIKDD1503103",
    price: "Rp. 1.084.300",
    oldPrice: "Rp. 1.549.000",
    discount: "30% OFF",
    rating: 4.3,
    reviewCount: 375,
    images: [
        "https://via.placeholder.com/600x400?text=Nike+Dunk+1",
        "https://via.placeholder.com/600x400?text=Nike+Dunk+2",
        "https://via.placeholder.com/600x400?text=Nike+Dunk+3"
    ],
    sizes: ["US 6.5", "US 8", "US 8.5"],
    description: `
        <h3>Nike Dunk Low</h3>
        <ul>
            <li>There may be a 1-2cm difference in measurements depending on the development and manufacturing process.</li>
        </ul>
        <h3>Color Disclaimer:</h3>
        <ul>
            <li>Actual colors may vary. This is due to the fact that every computer monitor has a different capability to display colors, we cannot guarantee that the color you see accurately portrays the true color of the product.</li>
        </ul>
    `,
    reviews: [
        {
            user: "CampTheHit",
            date: "8 days ago",
            title: "Super comfy",
            text: "Dunk low very comfy and true to size. Already got 2 and will definitely get more!",
            source: "Originally posted on Nike"
        },
        {
            user: "SalmaH",
            date: "14 days ago",
            title: "I love it",
            text: "Runs a little big but nothing too serious. Look just as pictured.",
            source: "Originally posted on Nike"
        }
    ]
};



function populateData(data) {
    if (!data) {
        document.getElementById("loading").classList.add("hidden");
        document.getElementById("error-message").classList.remove("hidden");
        return;
    }

    document.getElementById("loading").classList.add("hidden");
    document.getElementById("product-container").classList.remove("hidden");

    document.getElementById("product-brand").textContent = data.brand;
    document.getElementById("product-title").textContent = data.title;
    document.getElementById("product-category-sku").textContent = `${data.category} | ${data.sku}`;
    document.getElementById("product-price").textContent = data.price;
    document.getElementById("product-old-price").textContent = data.oldPrice;
    document.getElementById("product-discount").textContent = data.discount;
    
    document.getElementById("product-rating").innerHTML = `★★★★☆ <span style="color:#2563eb;text-decoration:underline;cursor:pointer;margin-right:10px">${data.rating} (${data.reviewCount})</span> <a href="#" class="write-review-link">Write a review</a>`;
    
    // Render Gambar & Thumbnail
    document.getElementById("main-image").src = data.images[0];
    const thumbnailContainer = document.getElementById("thumbnails");
    data.images.forEach((imgSrc, index) => {
        const imgEl = document.createElement("img");
        imgEl.src = imgSrc;
        if (index === 0) imgEl.classList.add("active-thumb");
        
        imgEl.onclick = () => {
            document.getElementById("main-image").src = imgSrc;
            Array.from(thumbnailContainer.children).forEach(child => child.classList.remove("active-thumb"));
            imgEl.classList.add("active-thumb");
        };
        thumbnailContainer.appendChild(imgEl);
    });

    // Render Ukuran (Size Grid)
    const sizeGrid = document.getElementById("size-grid");
    data.sizes.forEach(size => {
        const sizeBtn = document.createElement("button");
        sizeBtn.className = "size-btn";
        sizeBtn.textContent = size;
        sizeBtn.onclick = () => {
            Array.from(sizeGrid.children).forEach(child => child.classList.remove("selected"));
            sizeBtn.classList.add("selected");
            
            const cartBtn = document.getElementById("add-to-cart-btn");
            cartBtn.classList.remove("disabled");
            cartBtn.removeAttribute("disabled");
        };
        sizeGrid.appendChild(sizeBtn);
    });

    document.getElementById("details").innerHTML = data.description;
    document.getElementById("review-count").textContent = `(${data.reviewCount})`;

    renderReviews(data);
    
    // Update breadcrumb
    const breadcrumb = document.querySelector('.breadcrumb');
    if (breadcrumb) {
        breadcrumb.innerHTML = `Home / <span>${data.title}</span>`;
    }

    // Refresh feather icons for new DOM elements
    if (window.feather) {
        feather.replace();
    }
}

function renderReviews(data) {
    // Rating Snapshot (Column 1)
    const snapshotHTML = `
        <h3>Rating Snapshot</h3>
        <p style="font-size:0.78rem;color:#2563eb;margin:0 0 12px 0;cursor:pointer;">Select a row below to filter reviews.</p>
        <div class="rating-bars">
            <div class="bar-row"><span style="min-width:48px">5 stars</span> <div class="bar-bg" style="flex:1"><div class="bar-fill" style="width: 69%;"></div></div><span style="min-width:28px;text-align:right;color:#2563eb">259</span></div>
            <div class="bar-row"><span style="min-width:48px">4 stars</span> <div class="bar-bg" style="flex:1"><div class="bar-fill" style="width: 9%;"></div></div><span style="min-width:28px;text-align:right;color:#2563eb">32</span></div>
            <div class="bar-row"><span style="min-width:48px">3 stars</span> <div class="bar-bg" style="flex:1"><div class="bar-fill" style="width: 10%;"></div></div><span style="min-width:28px;text-align:right;color:#2563eb">36</span></div>
            <div class="bar-row"><span style="min-width:48px">2 stars</span> <div class="bar-bg" style="flex:1"><div class="bar-fill" style="width: 6%;"></div></div><span style="min-width:28px;text-align:right;color:#2563eb">24</span></div>
            <div class="bar-row"><span style="min-width:48px">1 star</span>  <div class="bar-bg" style="flex:1"><div class="bar-fill" style="width: 6%;"></div></div><span style="min-width:28px;text-align:right;color:#dc2626">24</span></div>
        </div>
    `;
    document.getElementById("rating-snapshot").innerHTML = snapshotHTML;

    // Overall Rating (Column 2)
    const stars = Math.round(data.rating);
    const starStr = '★'.repeat(stars) + '☆'.repeat(5 - stars);
    const overallScore = document.getElementById('overall-score');
    const overallStars = document.getElementById('overall-stars');
    const overallLink  = document.getElementById('overall-link');
    if (overallScore) overallScore.textContent = data.rating;
    if (overallStars) overallStars.textContent = starStr;
    if (overallLink)  overallLink.textContent  = `${data.reviewCount} Reviews`;

    // Review total label
    const totalLabel = document.getElementById('review-total-label');
    if (totalLabel) totalLabel.textContent = `1 – 10 of ${data.reviewCount} Reviews`;

    // Star input interactivity
    const starBoxes = document.querySelectorAll('#star-input .star-box');
    starBoxes.forEach((btn, idx) => {
        btn.addEventListener('mouseenter', () => {
            starBoxes.forEach((b, i) => {
                b.textContent = i <= idx ? '★' : '☆';
                b.style.color = i <= idx ? '#f59e0b' : '';
            });
        });
        btn.addEventListener('mouseleave', () => {
            const active = document.querySelector('#star-input .star-box.active');
            const activeVal = active ? parseInt(active.dataset.value) - 1 : -1;
            starBoxes.forEach((b, i) => {
                b.textContent = i <= activeVal ? '★' : '☆';
                b.style.color = i <= activeVal ? '#f59e0b' : '';
            });
        });
        btn.addEventListener('click', () => {
            starBoxes.forEach(b => b.classList.remove('active'));
            for (let i = 0; i <= idx; i++) starBoxes[i].classList.add('active');
        });
    });

    // Review List
    const reviewList = document.getElementById("review-list");
    data.reviews.forEach(review => {
        const revEl = document.createElement("div");
        revEl.className = "review-item";
        revEl.innerHTML = `
            <div class="review-user">${review.user}</div>
            <div class="review-body">
                <div class="review-meta">★★★★★ ${review.date}</div>
                <div class="review-title-text">${review.title}</div>
                <div class="review-desc">${review.text}</div>
                <div class="review-source">
                    <span style="font-weight: bold; font-style: italic;">✔</span> ${review.source}
                </div>
            </div>
        `;
        reviewList.appendChild(revEl);
    });
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    document.querySelector(`button[onclick="switchTab('${tabId}')"]`).classList.add('active');
    document.getElementById(tabId).classList.add('active');
}