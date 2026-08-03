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

            const mappedData = {
                brand: selectedProduct.brand || "Footlocker",
                title: selectedProduct.name || selectedProduct.title || "Tanpa Nama",
                category: selectedProduct.category || selectedProduct.gender || "Unisex",
                sku: selectedProduct._id || "-",
                price: displayPrice,
                oldPrice: "", 
                discount: "",
                rating: 5.0,
                reviewCount: 1,
                images: [
                    selectedProduct.imageUrl || selectedProduct.image || "https://placehold.co/600x400?text=No+Image"
                ],
                sizes: ["US 7", "US 8", "US 9", "US 10", "US 11"],
                description: `<p>Ini adalah halaman detail untuk produk ${selectedProduct.name || selectedProduct.title}.</p>`,
                reviews: [
                    {
                        user: "Anonymous",
                        date: "Just now",
                        title: "Great shoe",
                        text: "Looks amazing and fits perfectly.",
                        source: "Verified Buyer"
                    }
                ]
            };

            populateData(mappedData);
            switchTab('details');
            document.title = mappedData.title;
        } else {
            // Tampilkan pesan error jika ID tidak ditemukan di database API
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
    
    document.getElementById("product-rating").innerHTML = `★★★★☆ <span>${data.rating} (${data.reviewCount})</span>`;
    
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
}

function renderReviews(data) {
    const snapshotHTML = `
        <h3>Reviews</h3>
        <div class="rating-overview">
            <span class="rating-score">${data.rating}</span>
            <span class="rating-count-text">★★★★☆<br>${data.reviewCount} reviews</span>
        </div>
        <div class="rating-bars">
            <div class="bar-row"><span>5 Star</span> <div class="bar-bg"><div class="bar-fill" style="width: 75%;"></div></div></div>
            <div class="bar-row"><span>4 Star</span> <div class="bar-bg"><div class="bar-fill" style="width: 25%;"></div></div></div>
            <div class="bar-row"><span>3 Star</span> <div class="bar-bg"></div></div>
            <div class="bar-row"><span>2 Star</span> <div class="bar-bg"></div></div>
            <div class="bar-row"><span>1 Star</span> <div class="bar-bg"></div></div>
        </div>
    `;
    document.getElementById("rating-snapshot").innerHTML = snapshotHTML;

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