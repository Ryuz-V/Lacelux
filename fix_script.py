import re

with open('public/script.js', 'r', encoding='utf-8') as f:
    text = f.read()

bad_snippet = """                </div>
            img: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150"
        }
    ];"""

good_snippet = """                </div>
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

document.body.addEventListener('click', function (e) {
    const wishlistBtn = e.target.closest('.wishlist') || e.target.closest('.wishlist-btn-overlay');
    if (wishlistBtn) {
        e.preventDefault();
        e.stopPropagation();

        const id = wishlistBtn.getAttribute('data-id');
        const name = wishlistBtn.getAttribute('data-name') || 'Unnamed';
        const price = wishlistBtn.getAttribute('data-price') || '$0.00';
        const image = wishlistBtn.getAttribute('data-image') || 'https://placehold.co/300x300';
        
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
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const testimonials = [
        {
            quote: "\\"Absolutely love my new pair of Pro Runners! They are incredibly lightweight yet give amazing support. Finally found my perfect walking and running buddy. Highly recommended!\\"",
            name: "Alex Johnson",
            role: "Verified Buyer",
            img: "/public/asset/testimonial_person.png"
        },
        {
            quote: "\\"The Cloud Walkers changed my daily commute. I no longer feel foot fatigue after standing for hours. Best investment for my feet!\\"",
            name: "Sarah Miller",
            role: "Verified Buyer",
            img: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150"
        },
        {
            quote: "\\"Bold design and unmatched comfort. I get compliments every time I wear my Hyper Dunks. Will definitely buy another pair soon. Great quality!\\"",
            name: "Michael Chen",
            role: "Verified Buyer",
            img: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150"
        }
    ];"""

new_text = text.replace(bad_snippet, good_snippet)

with open('public/script.js', 'w', encoding='utf-8') as f:
    f.write(new_text)
print("Done fixing script.js")
