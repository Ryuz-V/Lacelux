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
        const selectedProduct = products.find(product => String(product.id) === String(productId));

        // 4. Masukkan data ke dalam elemen HTML
        if (selectedProduct) {
            document.getElementById('product-container').classList.remove('hidden');
            
            // Format harga (menyesuaikan format dari API)
            let displayPrice = selectedProduct.price || selectedProduct.harga || "Rp 0";
            if (typeof displayPrice === 'number') {
                displayPrice = 'Rp. ' + displayPrice.toLocaleString('id-ID');
            }

            // Perhatikan penggunaan .name atau .title tergantung response API kamu
            const productName = selectedProduct.name || selectedProduct.title || "Tanpa Nama";

            document.getElementById('product-title').textContent = productName;
            document.getElementById('product-price').textContent = displayPrice;
            document.getElementById('product-desc').textContent = selectedProduct.desc || selectedProduct.description || "Deskripsi tidak tersedia.";
            
            document.title = productName;
        } else {
            // Tampilkan pesan error jika ID tidak ditemukan di database API
            document.getElementById('error-message').classList.remove('hidden');
        }
    } catch (error) {
        console.error("Terjadi kesalahan:", error);
        document.getElementById('error-message').classList.remove('hidden');
        document.getElementById('error-message').textContent = "Terjadi kesalahan saat memuat data produk.";
    }
});