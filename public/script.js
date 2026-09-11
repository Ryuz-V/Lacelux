// Auth State Management
async function checkAuthState() {
    const token = localStorage.getItem('token');
    const userLinks = document.querySelectorAll('a[href*="Login/login.html"]');
    
    if (token) {
        try {
            const response = await fetch('/api/auth/me', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.ok) {
                const user = await response.json();
                console.log('Logged in as:', user.fullName);
                
                // Update User icon to Logout and show Avatar
                // Add CSS for dropdown if not exists
                const styleId = 'user-dropdown-style';
                if (!document.getElementById(styleId)) {
                    const style = document.createElement('style');
                    style.id = styleId;
                    style.textContent = `
                        .user-dropdown-wrapper { position: relative; display: inline-block; }
                        .user-dropdown-menu {
                            display: none;
                            position: absolute;
                            right: 0;
                            top: 100%;
                            background: white;
                            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                            border-radius: 0;
                            width: 150px;
                            z-index: 1000;
                            flex-direction: column;
                            overflow: hidden;
                            margin-top: 10px;
                        }
                        .user-dropdown-wrapper:hover .user-dropdown-menu,
                        .user-dropdown-wrapper.active .user-dropdown-menu {
                            display: flex;
                        }
                        .user-dropdown-menu .dropdown-item {
                            padding: 10px 15px;
                            text-decoration: none;
                            color: #333;
                            display: block;
                            font-size: 14px;
                            border-bottom: 1px solid #eee;
                            transition: background 0.2s;
                        }
                        .user-dropdown-menu .dropdown-item:last-child {
                            border-bottom: none;
                        }
                        .user-dropdown-menu .dropdown-item:hover {
                            background-color: #f5f5f5;
                        }
                        .user-dropdown-menu .logout-btn {
                            color: #d9534f;
                        }
                    `;
                    document.head.appendChild(style);
                }

                userLinks.forEach(link => {
                    const wrapper = document.createElement('div');
                    wrapper.className = 'user-dropdown-wrapper';
                    
                    const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=111&color=fff&size=32`;
                    const avatarUrl = user.avatar || defaultAvatar;
                    
                    wrapper.innerHTML = `
                        <button class="user-btn" title="Account (${user.fullName})" style="padding: 0; border-radius: 50%; overflow: hidden; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border: none; background: transparent; cursor: pointer;">
                            <img src="${avatarUrl}" alt="${user.fullName}" style="width: 100%; height: 100%; object-fit: cover;">
                        </button>
                        <div class="user-dropdown-menu">
                            <a href="/public/profile/profile.html" class="dropdown-item profile-btn">Profile</a>
                            <a href="/public/profile/profile.html#my-orders" class="dropdown-item order-btn">My Order</a>
                            <a href="#" class="dropdown-item logout-btn">Log out</a>
                        </div>
                    `;

                    link.parentNode.replaceChild(wrapper, link);

                    // Toggle active class on click for mobile/click support
                    const btn = wrapper.querySelector('.user-btn');
                    btn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        wrapper.classList.toggle('active');
                    });

                    // Hide dropdown when clicking outside
                    document.addEventListener('click', function(e) {
                        if (!wrapper.contains(e.target)) {
                            wrapper.classList.remove('active');
                        }
                    });

                    // Logout logic
                    wrapper.querySelector('.logout-btn').addEventListener('click', function(e) {
                        e.preventDefault();
                        localStorage.removeItem('token');
                        window.location.reload();
                    });
                });
            } else {
                // Token invalid
                localStorage.removeItem('token');
            }
        } catch (error) {
            console.error('Error checking auth:', error);
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    checkAuthState();
    feather.replace();
    const filterButtons = document.querySelectorAll('.filters button');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            console.log('Filtering trending shoes by:', this.innerText);
        });
    });
    const wishlistBtns = document.querySelectorAll('.wishlist');
    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', function (event) {
            event.stopPropagation();
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
    document.body.addEventListener('click', function(e) {
        const card = e.target.closest('.product-card');
        if (!card) return;
        if (e.target.closest('.wishlist') || e.target.closest('button')) return;

        const nameEl = card.querySelector('.product-name');
        const imgEl = card.querySelector('img');
        const priceEl = card.querySelector('.product-price p') || card.querySelector('.product-price');
        const brandEl = card.querySelector('.product-brand');
        const catEl = card.querySelector('.product-category');
        
        const params = new URLSearchParams();
        if (nameEl && nameEl.innerText) params.set('dummy_name', nameEl.innerText.trim());
        if (imgEl && imgEl.src) params.set('dummy_img', imgEl.src);
        
        const priceSpans = card.querySelectorAll('.product-price span');
        if (priceSpans.length >= 3) {
            params.set('dummy_price', priceSpans[0].innerText.trim());
            params.set('dummy_old_price', priceSpans[1].innerText.trim());
            params.set('dummy_discount', priceSpans[2].innerText.trim());
        } else if (priceEl && priceEl.innerText) {
            params.set('dummy_price', priceEl.innerText.trim());
        }
        
        if (brandEl && brandEl.innerText) params.set('dummy_brand', brandEl.innerText.trim());
        if (catEl && catEl.innerText) params.set('dummy_cat', catEl.innerText.trim());
        
        window.location.href = '/public/products/products.html?' + params.toString();
    });

    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => card.style.cursor = 'pointer');
    const spotlightItems = document.querySelectorAll('.spotlight-nav li');
    spotlightItems.forEach((item, index) => {
        item.addEventListener('click', function () {
            spotlightItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            console.log('Spotlight category selected:', this.innerText);
        });
    });
});
const navbar = document.querySelector("nav");
const categories = document.querySelector("#categories");
let lastScrollY = window.scrollY;
window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;
    if (categories) {
        const categoriesTop = categories.offsetTop;
    }
    if (currentScrollY > 50) {
        if (navbar) navbar.classList.add("scrolled");
    } else {
        if (navbar && !window.location.pathname.includes('profile.html')) {
            navbar.classList.remove("scrolled");
        }
    }
    lastScrollY = currentScrollY;
});
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
    return "Indie";
}
const searchBtn = document.querySelector('.search-btn');
const searchOverlay = document.getElementById('search-overlay');
const closeSearchBtn = document.getElementById('close-search');
const searchInput = document.getElementById('search-input');
const searchForm = document.getElementById('search-form');
const clearBtn = document.getElementById('clear-search');
const searchResultsArea = document.getElementById('search-results-area');
const searchResultsTitle = document.getElementById('search-results-title');
const searchResultsGrid = document.getElementById('search-results-grid');
const exploreAllBtn = document.getElementById('explore-all-btn');
let allProductsCache = null;
async function getAllProductsCached() {
    if (allProductsCache) return allProductsCache;
    try {
        const res = await fetch('http://localhost:3000/api/shoes');
        if (!res.ok) throw new Error('Gagal mengambil data produk');
        allProductsCache = await res.json();
    } catch (err) {
        console.error('Gagal mengambil data produk untuk pencarian:', err);
        allProductsCache = [];
    }
    return allProductsCache;
}
function renderSearchResults(query, products) {
    if (!searchResultsArea || !searchResultsGrid) return;
    if (!query) {
        searchResultsArea.classList.remove('active');
        searchResultsGrid.innerHTML = '';
        if (searchResultsTitle) searchResultsTitle.textContent = '';
        return;
    }
    const q = query.toLowerCase();
    const matches = products.filter(p => {
        const name = (p.name || p.title || '').toLowerCase();
        const brand = detectBrand(p).toLowerCase();
        return name.includes(q) || brand.includes(q);
    }).slice(0, 6);
    searchResultsArea.classList.add('active');
    if (matches.length === 0) {
        if (searchResultsTitle) searchResultsTitle.textContent = `Tidak ada hasil untuk "${query}"`;
        searchResultsGrid.innerHTML = `<p class="search-results-empty">Coba kata kunci lain, misalnya nama brand atau tipe sepatu.</p>`;
    } else {
        if (searchResultsTitle) searchResultsTitle.textContent = `Hasil untuk "${query}"`;
        searchResultsGrid.innerHTML = matches.map(item => {
            const imageSrc = item.imageUrl || item.image || item.img || item.image_url || 'https://placehold.co/300x300?text=No+Image';
            let displayPrice = item.price || item.harga || 'Rp 0';
            if (typeof displayPrice === 'number') {
                displayPrice = 'Rp. ' + displayPrice.toLocaleString('id-ID');
            }
            return `
                <div class="suggested-item" onclick="window.location.href='products/products.html?id=${item._id}'">
                    <img src="${imageSrc}" alt="${item.name || 'Sepatu'}">
                    <div class="suggested-info">
                        <p class="product-brand" style="font-size: 0.75rem; margin-bottom: 2px;">${detectBrand(item)}</p>
                        <h4>${item.name || 'Unnamed'}</h4>
                        <p>${displayPrice}</p>
                    </div>
                </div>
            `;
        }).join('');
    }
    if (exploreAllBtn) {
        exploreAllBtn.href = `products.html?search=${encodeURIComponent(query)}`;
    }
}
let searchDebounceTimer = null;
if (searchInput) {
    searchInput.addEventListener('input', function () {
        const query = this.value.trim();
        clearTimeout(searchDebounceTimer);
        searchDebounceTimer = setTimeout(async () => {
            const products = await getAllProductsCached();
            renderSearchResults(query, products);
        }, 250);
    });
}
if (searchBtn && searchOverlay) {
    searchBtn.addEventListener('click', function (e) {
        e.preventDefault();
        searchOverlay.classList.add('active');
        document.body.classList.add('no-scroll');
        setTimeout(() => {
            searchInput.focus();
        }, 300);
    });
}
if (closeSearchBtn) {
    closeSearchBtn.addEventListener('click', function () {
        searchOverlay.classList.remove('active');
        document.body.classList.remove('no-scroll');
    });
}
if (clearBtn) {
    clearBtn.addEventListener('click', function () {
        searchInput.value = '';
        searchInput.focus();
        renderSearchResults('', allProductsCache || []);
    });
}
if (searchForm) {
    searchForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            window.location.href = `products.html?search=${encodeURIComponent(query)}`;
        }
    });
}
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
        searchOverlay.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }
});
const spotlightItems = document.querySelectorAll('.spotlight-nav li');
const spotlightImage = document.getElementById('spotlight-display');
const spotlightDesc = document.getElementById('spotlight-description');
spotlightItems.forEach((item) => {
    item.addEventListener('click', function () {
        spotlightItems.forEach(i => i.classList.remove('active'));
        this.classList.add('active');
        const newImageSource = this.getAttribute('data-image');
        const newDescription = this.getAttribute('data-description');
        if (newImageSource) {
            spotlightImage.src = newImageSource;
        }
        if (newDescription) {
            spotlightDesc.innerText = newDescription;
        }

        console.log('Spotlight category selected:', this.innerText);
    });
});
document.addEventListener('DOMContentLoaded', () => {
    // Initialize wishlist state for all buttons
    const wishlistBtns = document.querySelectorAll('.wishlist, .wishlist-btn-overlay');
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    wishlistBtns.forEach(btn => {
        let id = btn.getAttribute('data-id');
        if (!id) {
            const productCard = btn.closest('.product-card');
            if (productCard) {
                const name = productCard.querySelector('.product-name') ? productCard.querySelector('.product-name').textContent : '';
                if (name) id = name.toLowerCase().replace(/\s+/g, '-');
            }
        }
        if (id && wishlist.some(w => w.id === id)) {
            btn.classList.add('active');
            btn.style.color = '#ef4444';
            btn.style.fill = '#ef4444';
        }
    });

    const body = document.body;
    const scrollUpBtn = document.getElementById('scroll-up');
    const btnPrev = document.getElementById('btn-prev-product');
    const btnNext = document.getElementById('btn-next-product');
    const productGrid = document.querySelector('.trending-section .product-grid');
    const products = [
        { brand: 'NIKE', name: 'Pro Runner Elite', cat: "Men's Shoes", color: 'White', price: '$185.00', img: 'https://www.footlocker.id/media/catalog/product/0/1/01-ADIDAS-F34KBADI5-ADIJS1778-Green.jpg?width=300&height=300&quality=80&fit=cover&dpr=2' },
        { brand: 'NIKE', name: 'Hyper Dunk', cat: "Men's Shoes", color: 'Black', price: '$155.00', img: 'https://www.footlocker.id/media/catalog/product/0/1/01-PUMA-FFSSEPMAA-PMA313454-01-Blue.jpg?width=300&height=300&quality=80&fit=cover&dpr=2' },
        { brand: 'ON', name: 'Cloud Walkers', cat: 'Unisex', color: 'Gray', price: '$120.00', img: 'https://www.footlocker.id/media/catalog/product/0/1/01-NIKE-FFSSBNIK5-NIKFV2295002-Black.jpg?width=300&height=300&quality=80&fit=cover&dpr=2' },
        { brand: 'NEW BALANCE', name: 'Trail Blazer', cat: "Men's Shoes", color: 'Brown', price: '$145.00', img: 'https://www.footlocker.id/media/catalog/product/0/1/01-NEW-BALANCE-FFSSBNEWA-NEWMR530CK-Grey.jpg?width=300&height=300&quality=80&fit=cover&dpr=2' },
        { brand: 'ASICS', name: 'Gel-Kayano 30', cat: "Men's Shoes", color: 'Black/Merah', price: '$160.00', img: 'https://www.footlocker.id/media/catalog/product/0/1/01-ASICS-FFSSEASIA-ASI23A542107-Cream.jpg?width=300&height=300&quality=80&fit=cover&dpr=2' },
        { brand: 'PUMA', name: 'Velocity Nitro', cat: "Women's Shoes", color: 'Pink', price: '$130.00', img: 'https://www.footlocker.id/media/catalog/product/0/1/01-PUMA-FFSSEPMAA-PMA401581-01-White.jpg?width=300&height=300&quality=80&fit=cover&dpr=2' },
        { brand: 'CONVERSE', name: 'Chuck Taylor 70s', cat: "Unisex", color: 'White/Biru', price: '$85.00', img: 'https://www.footlocker.id/media/catalog/product/0/1/01-NIKE-F34KBNIK5-NIKIH1401402-Blue.jpg?width=300&height=300&quality=80&fit=cover&dpr=2' },
        { brand: 'ADIDAS', name: 'Ultraboost Light', cat: "Men's Shoes", color: 'Light Brown', price: '$190.00', img: 'https://www.footlocker.id/media/catalog/product/0/1/01-ADIDAS-FFSSBADI5-ADIIH6813-Brown.jpg?width=300&height=300&quality=80&fit=cover&dpr=2' }
    ];
    let currentPage = 0;
    const itemsPerPage = 4;
    const renderProducts = () => {
        if (!productGrid) return;
        productGrid.innerHTML = '';
        const startIndex = currentPage * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const productsToShow = products.slice(startIndex, endIndex);
        productsToShow.forEach(prod => {
            const cardHTML = `
                <div class="product-card">
                    <button class="wishlist"><i data-feather="heart"></i></button>
                    <div class="product-thumb">
                        <img src="${prod.img}" alt="${prod.name}">
                    </div>
                        <div class="product-info">
                            <p class="product-brand">${detectBrand(prod)}</p>
                            <h3 class="product-name">${prod.name}</h3>
                        <div class="product-details">
                            <p class="product-category">${prod.cat}</p>
                            <p class="product-color-count">Color : ${prod.color}</p>
                        </div>
                        <div class="product-price">
                            <p>${prod.price}</p>
                        </div>
                    </div>
                </div>
            `;
            productGrid.innerHTML += cardHTML;
        });
        feather.replace();
    };
    if (btnPrev && btnNext) {
        btnNext.addEventListener('click', () => {
            if ((currentPage + 1) * itemsPerPage < products.length) {
                currentPage++;
                renderProducts();
            }
        });
        btnPrev.addEventListener('click', () => {
            if (currentPage > 0) {
                currentPage--;
                renderProducts();
            }
        });
    }
    renderProducts();
});

window.toggleWishlist = function (e, wishlistBtn) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }

    const productCard = wishlistBtn.closest('.product-card');
    
    let id = wishlistBtn.getAttribute('data-id');
    let name = wishlistBtn.getAttribute('data-name');
    let price = wishlistBtn.getAttribute('data-price');
    let image = wishlistBtn.getAttribute('data-image');

    if (!id && productCard) {
        name = productCard.querySelector('.product-name') ? productCard.querySelector('.product-name').textContent : 'Unnamed';
        price = productCard.querySelector('.product-price p') ? productCard.querySelector('.product-price p').textContent : '$0.00';
        image = productCard.querySelector('img') ? productCard.querySelector('img').src : 'https://placehold.co/300x300';
        id = name.toLowerCase().replace(/\s+/g, '-');
        
        wishlistBtn.setAttribute('data-id', id);
        wishlistBtn.setAttribute('data-name', name);
        wishlistBtn.setAttribute('data-price', price);
        wishlistBtn.setAttribute('data-image', image);
    }
    
    if (!id) return; // Prevent saving empty ids

    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const index = wishlist.findIndex(w => w.id === id);

    if (index > -1) {
        // Remove from wishlist
        wishlist.splice(index, 1);
        wishlistBtn.classList.remove('active');
        wishlistBtn.style.color = '#111';
        wishlistBtn.style.fill = 'none';
    } else {
        // Add to wishlist
        wishlist.push({ id, name, price, image });
        wishlistBtn.classList.add('active');
        wishlistBtn.style.color = '#ef4444';
        wishlistBtn.style.fill = '#ef4444';
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));

    // Re-render if on profile page and the render function exists
    if (typeof window.renderWishlist === 'function') {
        window.renderWishlist();
    }
};

document.body.addEventListener('click', function (e) {
    const wishlistBtn = e.target.closest('.wishlist') || e.target.closest('.wishlist-btn-overlay');
    if (wishlistBtn && !wishlistBtn.hasAttribute('onclick')) {
        window.toggleWishlist(e, wishlistBtn);
    }
});

document.addEventListener('DOMContentLoaded', () => {
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
            img: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150"
        },
        {
            quote: "\"Bold design and unmatched comfort. I get compliments every time I wear my Hyper Dunks. Will definitely buy another pair soon. Great quality!\"",
            name: "Michael Chen",
            role: "Verified Buyer",
            img: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150"
        }
    ];
    let currentTestimonialIndex = 0;
    const quoteEl = document.getElementById('testimonial-quote');
    const imgEl = document.getElementById('testimonial-img');
    const nameEl = document.getElementById('testimonial-name');
    const roleEl = document.getElementById('testimonial-role');
    const btnPrevTestimonial = document.getElementById('btn-prev-testimonial');
    const btnNextTestimonial = document.getElementById('btn-next-testimonial');
    if (quoteEl && imgEl) {
        quoteEl.style.transition = 'opacity 0.3s ease';
        imgEl.style.transition = 'opacity 0.3s ease';
    }
    const updateTestimonial = () => {
        const data = testimonials[currentTestimonialIndex];
        quoteEl.style.opacity = '0';
        imgEl.style.opacity = '0';
        setTimeout(() => {
            quoteEl.textContent = data.quote;
            imgEl.src = data.img;
            imgEl.alt = data.name;
            nameEl.textContent = data.name;
            roleEl.textContent = data.role;
            quoteEl.style.opacity = '1';
            imgEl.style.opacity = '1';
        }, 300);
    };
    if (btnNextTestimonial && btnPrevTestimonial) {
        btnNextTestimonial.addEventListener('click', () => {
            currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonials.length;
            updateTestimonial();
        });
        btnPrevTestimonial.addEventListener('click', () => {
            currentTestimonialIndex = (currentTestimonialIndex - 1 + testimonials.length) % testimonials.length;
            updateTestimonial();
        });
    }
});

