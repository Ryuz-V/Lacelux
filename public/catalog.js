// Sample Data Produk (Bisa diganti dengan data scraper/API kamu)
const scrapedProducts = [
    {
        id: 1,
        brand: "ASICS",
        name: "GEL-NYC Men's Sneakers - Cocoa Powder/Pure Silver",
        category: "men",
        gender: "pria",
        price: 2399000,
        color: "Coklat",
        image: "https://www.footlocker.id/media/catalog/product/0/8/0886-NEWU740BM2005007-1.jpg?width=300&height=300&quality=80&fit=cover&dpr=2"
    },
    {
        id: 2,
        brand: "ASICS",
        name: "GEL-STRATUS MC Unisex Lifestyle Shoes - Cream",
        category: "new-arrivals",
        gender: "unisex",
        price: 1699000,
        color: "Krem",
        image: "https://www.footlocker.id/media/catalog/product/0/1/01-ASICS-FFSSEASIA-ASI23A542107-Cream.jpg?width=300&height=300&quality=80&fit=cover&dpr=2"
    },
    {
        id: 3,
        brand: "ON",
        name: "Cloudmonster 1 Women's Sneakers - Black",
        category: "women",
        gender: "wanita",
        price: 3000000,
        color: "Hitam",
        image: "https://www.footlocker.id/media/catalog/product/0/1/01-NIKE-FFSSBNIK5-NIKCD6404107-White.jpg?width=300&height=300&quality=80&fit=cover&dpr=2"
    },
    {
        id: 4,
        brand: "NEW BALANCE",
        name: "327 Lace GradeBoys Sneakers - Grey",
        category: "kids",
        gender: "kids",
        price: 1199000,
        color: "Abu-abu",
        image: "https://www.footlocker.id/media/catalog/product/0/1/01-NEW-BALANCE-FFSCSNEWA-NEWU7407MK-Grey.jpg?width=300&height=300&quality=80&fit=cover&dpr=2"
    }
];

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get("category");

    const pageTitle = document.getElementById("category-page-title");
    const countInfo = document.querySelector("#product-count-info span");
    const gridContainer = document.getElementById("catalog-products-grid");

    // Format Nama Judul Berdasarkan Parameter URL
    if (categoryParam) {
        const formattedTitle = categoryParam.replace("-", " ").toUpperCase();
        pageTitle.textContent = `Sepatu - Koleksi ${formattedTitle}`;
    }

    // Fungsi Render Produk
    function renderProducts(products) {
        gridContainer.innerHTML = "";
        countInfo.textContent = products.length;

        if (products.length === 0) {
            gridContainer.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #888;">Tidak ada produk yang sesuai dengan filter.</p>`;
            return;
        }

        products.forEach(item => {
            const cardHtml = `
                <div class="product-card">
                    <button class="wishlist"><i data-feather="heart"></i></button>
                    <div class="product-thumb">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="product-info">
                        <p class="product-brand">${item.brand}</p>
                        <h3 class="product-name">${item.name}</h3>
                        <div class="product-details">
                            <p class="product-category">${item.gender.toUpperCase()}</p>
                            <p class="product-color-count">Warna : ${item.color}</p>
                        </div>
                        <div class="product-price">
                            <p>Rp. ${item.price.toLocaleString('id-ID')}</p>
                        </div>
                    </div>
                </div>
            `;
            gridContainer.insertAdjacentHTML("beforeend", cardHtml);
        });

        if (window.feather) feather.replace();
    }

    // Filter Awal Berdasarkan Query URL
    let filteredList = scrapedProducts;
    if (categoryParam) {
        filteredList = scrapedProducts.filter(p => p.category === categoryParam || p.gender === categoryParam);
    }

    renderProducts(filteredList);

    // Dynamic Filter Event Listeners (Checkbox Gender & Brand)
    const genderCheckboxes = document.querySelectorAll(".filter-gender");
    genderCheckboxes.forEach(cb => {
        cb.addEventListener("change", applyFilters);
    });

    function applyFilters() {
        const selectedGenders = Array.from(genderCheckboxes)
            .filter(i => i.checked)
            .map(i => i.value);

        let result = scrapedProducts;

        if (categoryParam) {
            result = result.filter(p => p.category === categoryParam || p.gender === categoryParam);
        }

        if (selectedGenders.length > 0) {
            result = result.filter(p => selectedGenders.includes(p.gender));
        }

        renderProducts(result);
    }
});