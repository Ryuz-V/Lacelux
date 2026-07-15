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
