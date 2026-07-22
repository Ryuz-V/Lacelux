document.addEventListener('DOMContentLoaded', function() {
    // Pastikan Feather Icons di-load
    feather.replace();
    
    // Search Box Logic
    const searchBtn = document.querySelector('.search-btn');
    const searchBox = document.querySelector('.search-box');
    const closeSearch = document.querySelector('.close-search');
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            searchBox.classList.toggle('active');
            if (searchBox && searchBox.classList.contains('active')) {
                searchInput.focus();
            }
        });
    }
    
    if (closeSearch) {
        closeSearch.addEventListener('click', function() {
            searchBox.classList.remove('active');
        });
    }
    
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = searchInput.value.trim();
            if (query) {
                alert('Anda mencari: ' + query); // Demo logic
                searchBox.classList.remove('active');
                searchInput.value = '';
            }
        });
    }
    
    document.addEventListener('click', function(e) {
        if (searchBox && !searchBox.contains(e.target) && e.target !== searchBtn) {
            searchBox.classList.remove('active');
        }
    });

    // Trending Filters Interaction
    const filterButtons = document.querySelectorAll('.filters button');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // In a real app, this would filter the products. 
            // For now, we'll just log the action for demo.
            console.log('Filtering trending shoes by:', this.innerText);
        });
    });

    // Wishlist Toggle
    const wishlistBtns = document.querySelectorAll('.wishlist');
    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (this.classList.contains('active')) {
                this.classList.remove('active');
                this.style.color = '#111';
                this.style.fill = 'none';
            } else {
                this.classList.add('active');
                this.style.color = '#ef4444';
                this.style.fill = '#ef4444';
            }
        });
    });

    // Spotlight Navigation
    const spotlightItems = document.querySelectorAll('.spotlight-nav li');
    spotlightItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            spotlightItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            // Logic to change the spotlight image based on selection goes here
            console.log('Spotlight category selected:', this.innerText);
        });
    });
});

const navbar = document.querySelector("nav");
const categories = document.querySelector("#categories");

let lastScrollY = window.scrollY;

window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;

    // posisi section categories
    const categoriesTop = categories.offsetTop;

    // 1. Ubah style navbar saat scroll (background putih)
    if (currentScrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
    lastScrollY = currentScrollY;
});

// ==========================================
    // OVERLAY SEARCH MODAL LOGIC
    // ==========================================
    const searchBtn = document.querySelector('.search-btn');
    const searchOverlay = document.getElementById('search-overlay');
    const closeSearchBtn = document.getElementById('close-search');
    const searchInput = document.getElementById('search-input');
    const searchForm = document.getElementById('search-form');
    const clearBtn = document.getElementById('clear-search');
    
    // Buka Overlay
    if (searchBtn && searchOverlay) {
        searchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            searchOverlay.classList.add('active');
            document.body.classList.add('no-scroll'); // Kunci scroll background
            
            // Memberikan fokus ke input setelah animasi CSS selesai
            setTimeout(() => {
                searchInput.focus();
            }, 300); 
        });
    }
    
    // Tutup Overlay (Tombol X)
    if (closeSearchBtn) {
        closeSearchBtn.addEventListener('click', function() {
            searchOverlay.classList.remove('active');
            document.body.classList.remove('no-scroll'); // Kembalikan scroll
        });
    }

    // Fitur Tombol Clear Text
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            searchInput.value = '';
            searchInput.focus();
        });
    }
    
    // Mencegah Refresh Halaman saat Enter Ditekan
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Mencegah reload halaman
            const query = searchInput.value.trim();
            if (query) {
                console.log('Fetching results for:', query); 
                // Di sini nanti kamu bisa memanggil API menggunakan Fetch/Axios (SPA style)
            }
        });
    }

    // Tutup overlay jika menekan tombol "Escape" di keyboard
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
            searchOverlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    });

// Spotlight Navigation
const spotlightItems = document.querySelectorAll('.spotlight-nav li');
const spotlightImage = document.getElementById('spotlight-display'); 
const spotlightDesc = document.getElementById('spotlight-description'); // Ambil elemen deskripsi baru

spotlightItems.forEach((item) => {
    item.addEventListener('click', function() {
        // Hapus class 'active' dari semua menu
        spotlightItems.forEach(i => i.classList.remove('active'));
        
        // Tambahkan class 'active' ke menu yang sedang diklik
        this.classList.add('active');
        
        // Ambil URL gambar dan teks deskripsi dari atribut data
        const newImageSource = this.getAttribute('data-image');
        const newDescription = this.getAttribute('data-description');
        
        // Ganti src gambar jika data-image tersedia
        if (newImageSource) {
            spotlightImage.src = newImageSource;
        }

        // Ganti teks deskripsi jika data-description tersedia
        if (newDescription) {
            spotlightDesc.innerText = newDescription;
        }
        
        console.log('Spotlight category selected:', this.innerText);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const btnPrev = document.getElementById('btn-prev-product');
    const btnNext = document.getElementById('btn-next-product');
    const productGrid = document.querySelector('.trending-section .product-grid');

    // 1. Array Data Produk (Menambahkan 4 produk baru agar bisa berganti)
    const products = [
        // Halaman 1 (Produk awal)
        { brand: 'NIKE', name: 'Pro Runner Elite', cat: "Men's Shoes", color: 'Putih', price: '$185.00', img: 'https://www.footlocker.id/media/catalog/product/0/1/01-ADIDAS-F34KBADI5-ADIJS1778-Green.jpg?width=300&height=300&quality=80&fit=cover&dpr=2' },
        { brand: 'NIKE', name: 'Hyper Dunk', cat: "Men's Shoes", color: 'Hitam', price: '$155.00', img: 'https://www.footlocker.id/media/catalog/product/0/1/01-PUMA-FFSSEPMAA-PMA313454-01-Blue.jpg?width=300&height=300&quality=80&fit=cover&dpr=2' },
        { brand: 'ON', name: 'Cloud Walkers', cat: 'Unisex', color: 'Abu-abu', price: '$120.00', img: 'https://www.footlocker.id/media/catalog/product/0/1/01-NIKE-FFSSBNIK5-NIKFV2295002-Black.jpg?width=300&height=300&quality=80&fit=cover&dpr=2' },
        { brand: 'NEW BALANCE', name: 'Trail Blazer', cat: "Men's Shoes", color: 'Coklat', price: '$145.00', img: 'https://www.footlocker.id/media/catalog/product/0/1/01-NEW-BALANCE-FFSSBNEWA-NEWMR530CK-Grey.jpg?width=300&height=300&quality=80&fit=cover&dpr=2' },
        // Halaman 2 (Tambahan produk baru)
        { brand: 'ASICS', name: 'Gel-Kayano 30', cat: "Men's Shoes", color: 'Hitam/Merah', price: '$160.00', img: 'https://www.footlocker.id/media/catalog/product/0/1/01-ASICS-FFSSEASIA-ASI23A542107-Cream.jpg?width=300&height=300&quality=80&fit=cover&dpr=2' },
        { brand: 'PUMA', name: 'Velocity Nitro', cat: "Women's Shoes", color: 'Pink', price: '$130.00', img: 'https://www.footlocker.id/media/catalog/product/0/1/01-PUMA-FFSSEPMAA-PMA401581-01-White.jpg?width=300&height=300&quality=80&fit=cover&dpr=2' },
        { brand: 'CONVERSE', name: 'Chuck Taylor 70s', cat: "Unisex", color: 'Putih/Biru', price: '$85.00', img: 'https://www.footlocker.id/media/catalog/product/0/1/01-NIKE-F34KBNIK5-NIKIH1401402-Blue.jpg?width=300&height=300&quality=80&fit=cover&dpr=2' },
        { brand: 'ADIDAS', name: 'Ultraboost Light', cat: "Men's Shoes", color: 'Coklat Muda', price: '$190.00', img: 'https://www.footlocker.id/media/catalog/product/0/1/01-ADIDAS-FFSSBADI5-ADIIH6813-Brown.jpg?width=300&height=300&quality=80&fit=cover&dpr=2' }
    ];

    let currentPage = 0;
    const itemsPerPage = 4; // Jumlah item per sekali tampil

    // 2. Fungsi untuk Merender Produk ke HTML
    const renderProducts = () => {
        if (!productGrid) return;
        
        // Kosongkan grid terlebih dahulu
        productGrid.innerHTML = '';
        
        // Ambil produk sesuai halaman saat ini (0-3, lalu 4-7)
        const startIndex = currentPage * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const productsToShow = products.slice(startIndex, endIndex);

        // Map array menjadi elemen HTML
        productsToShow.forEach(prod => {
            const cardHTML = `
                <div class="product-card">
                    <button class="wishlist"><i data-feather="heart"></i></button>
                    <div class="product-thumb">
                        <img src="${prod.img}" alt="${prod.name}">
                    </div>
                    <div class="product-info">
                        <p class="product-brand">${prod.brand}</p>
                        <h3 class="product-name">${prod.name}</h3>
                        <div class="product-details">
                            <p class="product-category">${prod.cat}</p>
                            <p class="product-color-count">Warna : ${prod.color}</p>
                        </div>
                        <div class="product-price">
                            <p>${prod.price}</p>
                        </div>
                    </div>
                </div>
            `;
            productGrid.innerHTML += cardHTML;
        });

        // Wajib me-render ulang icon Feather setelah menyisipkan HTML baru
        feather.replace();
    };

    // 3. Event Listener untuk Tombol Navigasi
    if (btnPrev && btnNext) {
        btnNext.addEventListener('click', () => {
            // Cek apakah masih ada produk di halaman selanjutnya
            if ((currentPage + 1) * itemsPerPage < products.length) {
                currentPage++;
                renderProducts();
            }
        });

        btnPrev.addEventListener('click', () => {
            // Kembali ke halaman sebelumnya
            if (currentPage > 0) {
                currentPage--;
                renderProducts();
            }
        });
    }

    // 4. Event Delegation untuk fitur Wishlist pada elemen yang dinamis
    if (productGrid) {
        productGrid.addEventListener('click', function(e) {
            // Cari elemen tombol wishlist terdekat yang di-klik
            const wishlistBtn = e.target.closest('.wishlist');
            if (wishlistBtn) {
                if (wishlistBtn.classList.contains('active')) {
                    wishlistBtn.classList.remove('active');
                    wishlistBtn.style.color = '#111';
                    wishlistBtn.style.fill = 'none';
                } else {
                    wishlistBtn.classList.add('active');
                    wishlistBtn.style.color = '#ef4444';
                    wishlistBtn.style.fill = '#ef4444';
                }
            }
        });
    }

    // Panggil render pertama kali saat halaman dimuat
    renderProducts();
});

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Testimonial Carousel Logic ---
    const testimonials = [
        {
            quote: "\"Absolutely love my new pair of Pro Runners! They are incredibly lightweight yet give amazing support. Finally found my perfect walking and running buddy. Highly recommended!\"",
            name: "Alex Johnson",
            role: "Verified Buyer",
            img: "/public/asset/testimonial_person.png"
        },
        {
            quote: "\"The Cloud Walkers changed my daily commute. I no longer feel foot fatigue after standing for hours. Best investment for my feet!\"",
            name: "Sarah Miller",
            role: "Verified Buyer",
            img: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150" // Placeholder image
        },
        {
            quote: "\"Bold design and unmatched comfort. I get compliments every time I wear my Hyper Dunks. Will definitely buy another pair soon. Great quality!\"",
            name: "Michael Chen",
            role: "Verified Buyer",
            img: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150" // Placeholder image
        }
    ];

    let currentTestimonialIndex = 0;

    // Grab the DOM elements
    const quoteEl = document.getElementById('testimonial-quote');
    const imgEl = document.getElementById('testimonial-img');
    const nameEl = document.getElementById('testimonial-name');
    const roleEl = document.getElementById('testimonial-role');
    
    const btnPrevTestimonial = document.getElementById('btn-prev-testimonial');
    const btnNextTestimonial = document.getElementById('btn-next-testimonial');

    // Add smooth CSS transition for the UI/UX polish
    if(quoteEl && imgEl) {
        quoteEl.style.transition = 'opacity 0.3s ease';
        imgEl.style.transition = 'opacity 0.3s ease';
    }

    const updateTestimonial = () => {
        const data = testimonials[currentTestimonialIndex];
        
        // Fade out
        quoteEl.style.opacity = '0';
        imgEl.style.opacity = '0';
        
        // Wait for fade out, then update content and fade back in
        setTimeout(() => {
            quoteEl.textContent = data.quote;
            imgEl.src = data.img;
            imgEl.alt = data.name;
            nameEl.textContent = data.name;
            roleEl.textContent = data.role;
            
            // Fade in
            quoteEl.style.opacity = '1';
            imgEl.style.opacity = '1';
        }, 300); // matches the 0.3s CSS transition
    };

    if (btnNextTestimonial && btnPrevTestimonial) {
        // Next Button Event
        btnNextTestimonial.addEventListener('click', () => {
            // Loop back to 0 if at the end of the array
            currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonials.length;
            updateTestimonial();
        });
        btnPrevTestimonial.addEventListener('click', () => {
            currentTestimonialIndex = (currentTestimonialIndex - 1 + testimonials.length) % testimonials.length;
            updateTestimonial();
        });
    }
});

// public/script.js atau script.js di root sesuai gambarmu
document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/shoes')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('shoe-container'); // Pastikan div ini ada di index.html
            
            data.forEach(shoe => {
                const card = document.createElement('div');
                card.className = 'shoe-card';
                card.innerHTML = `
                    <img src="${shoe.imageUrl}" alt="${shoe.name}" style="width:100%">
                    <h3>${shoe.name}</h3>
                    <p>${shoe.price}</p>
                `;
                container.appendChild(card);
            });
        })
        .catch(error => console.error('Error fetching shoes:', error));
});