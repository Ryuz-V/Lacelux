document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get("category");

    const pageTitle = document.getElementById("category-page-title");
    const countInfo = document.querySelector("#product-count-info span");
    const gridContainer = document.getElementById("catalog-products-grid");

    if (pageTitle && categoryParam) {
        const formattedTitle = categoryParam.replace("-", " ").toUpperCase();
        if (formattedTitle === "NEW ARRIVALS") {
            pageTitle.textContent = formattedTitle;
        } else {
            pageTitle.textContent = `NEW ARRIVALS ${formattedTitle}`;
        }
    }

    // --- 1. SETUP VARIABEL PAGINATION ---
    let currentPage = 1;
    const itemsPerPage = 20;
    let currentList = []; // Akan menyimpan array data produk setelah difilter

    // --- 2. MODIFIKASI FUNGSI RENDER PRODUK ---
    // Tambahkan parameter 'totalItems' agar hitungan hasil pencarian tetap akurat
    function renderProducts(productsToDisplay, totalItems) {
        if (!gridContainer) return;
        gridContainer.innerHTML = "";

        if (countInfo) {
            countInfo.textContent = totalItems !== undefined ? totalItems : productsToDisplay.length;
        }

        if (!productsToDisplay || productsToDisplay.length === 0) {
            gridContainer.innerHTML = `
                <p style="grid-column: 1/-1; text-align: center; color: #888; padding: 3rem 0;">
                    Tidak ada produk yang sesuai dengan filter.
                </p>`;
            return;
        }

        productsToDisplay.forEach(item => {
            let displayPrice = item.price || item.harga || "Rp 0";
            if (typeof displayPrice === 'number') {
                displayPrice = 'Rp. ' + displayPrice.toLocaleString('id-ID');
            }

            const imageSrc = item.imageUrl || item.image || item.img || item.image_url || 'https://placehold.co/300x300?text=No+Image';

            const cardHtml = `
                <div class="product-card" onclick="window.location.href='/products/products.html?id=${item._id}'">
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

    // Fungsi Fetch dan Match Category tetap sama...
    async function fetchProducts() {
        try {
            const response = await fetch('http://localhost:3000/api/shoes');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Gagal mengambil data dari backend API:', error);
            return [];
        }
    }

    function matchCategory(product, queryCat) {
        // ... (KODE LAMA matchCategory TETAP SAMA) ...
        if (!queryCat) return true;
        const q = queryCat.toLowerCase();
        const pCat = (product.category || "").toLowerCase();
        const pGen = (product.gender || "").toLowerCase();

        if (q === "pria" || q === "men" || q === "man") return pCat.includes("pria") || pCat.includes("men") || pGen.includes("pria") || pGen.includes("men");
        if (q === "wanita" || q === "women") return pCat.includes("wanita") || pCat.includes("women") || pGen.includes("wanita") || pGen.includes("women");
        if (q === "anak" || q === "kids") return pCat.includes("anak") || pCat.includes("kids") || pGen.includes("anak") || pGen.includes("kids");
        if (["new-arrivals", "eksklusif", "brands", "sale", "coming-soon"].includes(q)) return true;
        return pCat.includes(q) || pGen.includes(q);
    }

    function filterByCategory(products, queryCat) {
        if (!queryCat) return products;
        return products.filter(p => matchCategory(p, queryCat));
    }

    // --- 3. TAMBAHAN FUNGSI PAGINATION DINAMIS ---
    function renderPaginationUI(totalItems) {
        const paginationContainer = document.querySelector(".catalog-pagination");
        if (!paginationContainer) return;

        const totalPages = Math.ceil(totalItems / itemsPerPage);

        // Jika hanya ada 1 halaman, hilangkan area pagination
        if (totalPages <= 1) {
            paginationContainer.style.display = "none";
            return;
        } else {
            paginationContainer.style.display = "flex";
        }

        let html = "";
        const prevDisabled = currentPage === 1 ? "disabled" : "";
        
        // Tombol Previous
        html += `<a href="#" class="page-arrow ${prevDisabled}" data-action="prev"><i data-feather="chevrons-left"></i></a>`;
        html += `<a href="#" class="page-text ${prevDisabled}" data-action="prev">Prev</a>`;

        // Render Angka Halaman dan Dots
        let l;
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                if (l) {
                    if (i - l === 2) {
                        html += `<a href="#" class="page-num" data-page="${l + 1}">${l + 1}</a>`;
                    } else if (i - l !== 1) {
                        html += `<span class="page-dots">...</span>`;
                    }
                }
                html += `<a href="#" class="page-num ${i === currentPage ? "active" : ""}" data-page="${i}">${i}</a>`;
                l = i;
            }
        }

        // Tombol Next
        const nextDisabled = currentPage === totalPages ? "disabled" : "";
        html += `<a href="#" class="page-text ${nextDisabled ? "disabled" : "underline"}" data-action="next">Next</a>`;
        html += `<a href="#" class="page-arrow ${nextDisabled}" data-action="next"><i data-feather="chevrons-right"></i></a>`;

        paginationContainer.innerHTML = html;
        if (window.feather) feather.replace();

        // Tambahkan Event Listener ke semua tombol pagination
        paginationContainer.querySelectorAll("a").forEach(btn => {
            btn.addEventListener("click", function(e) {
                e.preventDefault();
                if (this.classList.contains("disabled")) return;

                const action = this.getAttribute("data-action");
                const page = this.getAttribute("data-page");

                if (action === "prev" && currentPage > 1) {
                    currentPage--;
                } else if (action === "next" && currentPage < totalPages) {
                    currentPage++;
                } else if (page) {
                    currentPage = parseInt(page);
                }

                // Render produk di halaman baru
                showCurrentPage();
                
                // Auto-scroll ke atas bagian header katalog agar user tidak perlu scroll manual
                document.querySelector(".catalog-header-bar").scrollIntoView({ behavior: 'smooth' });
            });
        });
    }

    // Fungsi helper untuk memotong array dan menampilkan produk per halaman
    function showCurrentPage() {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        
        // Memotong data array agar hanya mengambil maksimal 20 item per halaman
        const productsToShow = currentList.slice(startIndex, endIndex);
        
        // Panggil renderProducts dan passing total jumlah keseluruhan array
        renderProducts(productsToShow, currentList.length);
        renderPaginationUI(currentList.length);
    }

    // --- 4. LOAD DATA AWAL ---
    const allProducts = await fetchProducts();
    currentList = filterByCategory(allProducts, categoryParam);
    
    // Alih-alih memanggil renderProducts() langsung, kita panggil showCurrentPage()
    showCurrentPage();

    // --- 5. UPDATE INTERAKTIVITAS FILTER ---
    const genderCheckboxes = document.querySelectorAll(".filter-gender");
    const brandCheckboxes = document.querySelectorAll(".filter-brand");
    const sortSelect = document.getElementById("sort-select");

    function applyFilters() {
        // ... (Pengambilan filter checkbox sama persis dengan kodinganmu) ...
        const selectedGenders = Array.from(genderCheckboxes).filter(i => i.checked).map(i => i.value.toLowerCase());
        const selectedBrands = Array.from(brandCheckboxes).filter(i => i.checked).map(i => i.value.toLowerCase());

        let result = filterByCategory(allProducts, categoryParam);

        if (selectedGenders.length > 0) {
            result = result.filter(p => {
                const gen = (p.gender || p.category || "").toLowerCase();
                return selectedGenders.some(g => gen.includes(g));
            });
        }

        if (selectedBrands.length > 0) {
            result = result.filter(p => {
                const brand = (p.brand || "").toLowerCase();
                return selectedBrands.some(b => brand.includes(b));
            });
        }

        if (sortSelect) {
            const sortVal = sortSelect.value;
            if (sortVal === "price-low") {
                result.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
            } else if (sortVal === "price-high") {
                result.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
            }
        }

        // *** PERUBAHAN PADA APPLY FILTER ***
        currentList = result; // Simpan hasil pencarian filter ke currentList
        currentPage = 1;      // Reset ke Halaman 1 setiap kali filter digunakan
        showCurrentPage();    // Render ulang dengan limit 20 dan pagination
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