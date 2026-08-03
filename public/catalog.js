// Data diambil dari API /api/shoes

document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get("category");

    const pageTitle = document.getElementById("category-page-title");
    const countInfo = document.querySelector("#product-count-info span");
    const gridContainer = document.getElementById("catalog-products-grid");

if (pageTitle && categoryParam) {
        const formattedTitle = categoryParam.replace("-", " ").toUpperCase();
        
        // Cek apakah kategorinya sudah "NEW ARRIVALS" agar tidak menjadi double
        if (formattedTitle === "NEW ARRIVALS") {
            pageTitle.textContent = formattedTitle;
        } else {
            pageTitle.textContent = `NEW ARRIVALS ${formattedTitle}`;
        }
    }

    // 1. Fungsi Render Kartu Produk
    function renderProducts(products) {
        if (!gridContainer) return;
        gridContainer.innerHTML = "";

        if (countInfo) {
            countInfo.textContent = products.length;
        }

        if (!products || products.length === 0) {
            gridContainer.innerHTML = `
                <p style="grid-column: 1/-1; text-align: center; color: #888; padding: 3rem 0;">
                    Tidak ada produk yang sesuai dengan filter.
                </p>`;
            return;
        }

        products.forEach(item => {
            let displayPrice = item.price || item.harga || "Rp 0";
            if (typeof displayPrice === 'number') {
                displayPrice = 'Rp. ' + displayPrice.toLocaleString('id-ID');
            }

            const imageSrc = item.imageUrl || item.image || item.img || item.image_url || 'https://placehold.co/300x300?text=No+Image';

const cardHtml = `
    <!-- Tambahkan event onclick yang mengarah ke halaman detail produk beserta ID produk -->
    <div class="product-card" onclick="window.location.href='/produk/produk.html?id=${item.id}'">
        
        <!-- Tambahkan event.stopPropagation() agar klik wishlist tidak ikut membuka halaman produk -->
        <button class="wishlist" onclick="event.stopPropagation();"><i data-feather="heart"></i></button>
        
        <div class="product-thumb">
            <img src="${imageSrc}" alt="${item.name || 'Sepatu'}" loading="lazy">
        </div>
        <div class="product-info">
            <p class="product-brand">${item.brand || 'No Brand'}</p>
            <h3 class="product-name">${item.name || 'Tanpa Nama'}</h3>
            <div class="product-details">
                <p class="product-category">${(item.gender || item.category || 'Unisex').toUpperCase()}</p>
                <p class="product-color-count">Warna : ${item.color || '-'}</p>
            </div>
            <div class="product-price">
                <p>${displayPrice}</p>
            </div>
        </div>
    </div>
`;

            gridContainer.insertAdjacentHTML("beforeend", cardHtml);
        });

        if (window.feather) feather.replace();
    }

    // 2. Fungsi Fetch Data dari API
    async function fetchProducts() {
        try {
            const response = await fetch('http://localhost:3000/api/shoes');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Gagal mengambil data dari backend API:', error);
            return [];
        }
    }

    // 3. Mapping Kategori & Gender (Pria/Men, Wanita/Women, Anak/Kids)
    function matchCategory(product, queryCat) {
        if (!queryCat) return true;
        
        const q = queryCat.toLowerCase();
        const pCat = (product.category || "").toLowerCase();
        const pGen = (product.gender || "").toLowerCase();

        // Normalisasi padanan kata Indonesia & Inggris
        if (q === "pria" || q === "men" || q === "man") {
            return pCat.includes("pria") || pCat.includes("men") || pGen.includes("pria") || pGen.includes("men");
        }
        if (q === "wanita" || q === "women") {
            return pCat.includes("wanita") || pCat.includes("women") || pGen.includes("wanita") || pGen.includes("women");
        }
        if (q === "anak" || q === "kids") {
            return pCat.includes("anak") || pCat.includes("kids") || pGen.includes("anak") || pGen.includes("kids");
        }
        
        // Kategori promo / general
        if (["new-arrivals", "eksklusif", "brands", "sale", "coming-soon"].includes(q)) {
            return true;
        }

        return pCat.includes(q) || pGen.includes(q);
    }

    function filterByCategory(products, queryCat) {
        if (!queryCat) return products;

        const hasCategoryData = products.some(p => p.category || p.gender);
        if (!hasCategoryData) {
            console.warn('[catalog] Data produk belum mengandung field category/gender. Menampilkan semua produk.');
            return products;
        }

        return products.filter(p => matchCategory(p, queryCat));
    }

    // 4. Load Data Awal
    const allProducts = await fetchProducts();
    let currentList = filterByCategory(allProducts, categoryParam);
    renderProducts(currentList);

    // 5. Interaktivitas Filter (Gender, Brand, & Sorting)
    const genderCheckboxes = document.querySelectorAll(".filter-gender");
    const brandCheckboxes = document.querySelectorAll(".filter-brand");
    const sortSelect = document.getElementById("sort-select");

    function applyFilters() {
        const selectedGenders = Array.from(genderCheckboxes)
            .filter(i => i.checked)
            .map(i => i.value.toLowerCase());

        const selectedBrands = Array.from(brandCheckboxes)
            .filter(i => i.checked)
            .map(i => i.value.toLowerCase());

        let result = filterByCategory(allProducts, categoryParam);

        // Filter berdasarkan Gender
        if (selectedGenders.length > 0) {
            result = result.filter(p => {
                const gen = (p.gender || p.category || "").toLowerCase();
                return selectedGenders.some(g => gen.includes(g));
            });
        }

        // Filter berdasarkan Brand
        if (selectedBrands.length > 0) {
            result = result.filter(p => {
                const brand = (p.brand || "").toLowerCase();
                return selectedBrands.some(b => brand.includes(b));
            });
        }

        // Sorting Harga
        if (sortSelect) {
            const sortVal = sortSelect.value;
            if (sortVal === "price-low") {
                result.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
            } else if (sortVal === "price-high") {
                result.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
            }
        }

        renderProducts(result);
    }
    function parsePrice(val) {
        if (typeof val === 'number') return val;
        if (!val) return 0;
        return parseFloat(val.toString().replace(/[^0-9]/g, '')) || 0;
    }
    genderCheckboxes.forEach(cb => cb.addEventListener("change", applyFilters));
    brandCheckboxes.forEach(cb => cb.addEventListener("change", applyFilters));
    if (sortSelect) sortSelect.addEventListener("change", applyFilters);
});