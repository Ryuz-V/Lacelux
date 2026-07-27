// Data akan diambil dari API /api/shoes

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get("category");

    const pageTitle = document.getElementById("category-page-title");
    const countInfo = document.querySelector("#product-count-info span");
    const gridContainer = document.getElementById("catalog-products-grid");

    // Format Nama Judul Berdasarkan Parameter URL (Dinonaktifkan agar tetap "All Shoe")
    /*
    if (categoryParam) {
        const formattedTitle = categoryParam.replace("-", " ").toUpperCase();
        pageTitle.textContent = `Sepatu - Koleksi ${formattedTitle}`;
    }
    */

    // Fungsi Render Produk
    function renderProducts(products) {
        gridContainer.innerHTML = "";
        countInfo.textContent = products.length;

        if (products.length === 0) {
            gridContainer.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #888;">Tidak ada produk yang sesuai dengan filter.</p>`;
            return;
        }

        products.forEach(item => {
            // Kita sesuaikan nama field yang berasal dari backend (scraper/mongodb)
            // Di scraper: imageUrl, brand, name, price, dll.
            
            // Format price: jika dari database bentuknya string dengan 'Rp' sudah ada, tampilkan saja. 
            // Jika number, diformat toLocaleString.
            let displayPrice = item.price;
            if (typeof displayPrice === 'number') {
                displayPrice = 'Rp. ' + displayPrice.toLocaleString('id-ID');
            }

            const cardHtml = `
                <div class="product-card">
                    <button class="wishlist"><i data-feather="heart"></i></button>
                    <div class="product-thumb">
                        <img src="${item.imageUrl || item.image || 'https://via.placeholder.com/300'}" alt="${item.name}">
                    </div>
                    <div class="product-info">
                        <p class="product-brand">${item.brand || 'No Brand'}</p>
                        <h3 class="product-name">${item.name}</h3>
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

    // Fungsi untuk mengambil data dari backend
    async function fetchProducts() {
        try {
            const response = await fetch('http://localhost:3000/api/shoes');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
            return [];
        }
    }

    let allProducts = [];

    // Cek apakah data dari scraper sudah punya field category/gender.
    // Kalau BELUM ADA SAMA SEKALI produk yang punya field ini, jangan difilter,
    // supaya tidak selalu menampilkan 0 hasil hanya karena data scraper
    // memang belum menyertakan category/gender.
    function filterByCategory(products, categoryParam) {
        if (!categoryParam) return products;

        const hasCategoryData = products.some(p => p.category || p.gender);
        if (!hasCategoryData) {
            console.warn('[catalog] Produk belum punya field category/gender dari scraper, filter kategori dilewati.');
            return products;
        }

        return products.filter(p =>
            (p.category && p.category.toLowerCase() === categoryParam.toLowerCase()) ||
            (p.gender && p.gender.toLowerCase() === categoryParam.toLowerCase())
        );
    }

    // Filter Awal Berdasarkan Query URL
    async function initCatalog() {
        allProducts = await fetchProducts();
        const filteredList = filterByCategory(allProducts, categoryParam);
        renderProducts(filteredList);
    }

    initCatalog();

    // Dynamic Filter Event Listeners (Checkbox Gender & Brand)
    const genderCheckboxes = document.querySelectorAll(".filter-gender");
    genderCheckboxes.forEach(cb => {
        cb.addEventListener("change", applyFilters);
    });

    function applyFilters() {
        const selectedGenders = Array.from(genderCheckboxes)
            .filter(i => i.checked)
            .map(i => i.value.toLowerCase());

        let result = filterByCategory(allProducts, categoryParam);

        if (selectedGenders.length > 0) {
            result = result.filter(p => p.gender && selectedGenders.includes(p.gender.toLowerCase()));
        }

        renderProducts(result);
    }
});