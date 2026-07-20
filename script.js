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