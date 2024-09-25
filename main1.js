

$(document).ready(function() {
    // Fetch product data from Google Sheets or another source
    const productId = new URLSearchParams(window.location.search).get('productId');
const sheetId = '1dRJ72TYn9eBq-VK4sngnZqTCc-1eWNRBuhK6pMrSnt8';
const apiKey = 'AIzaSyCpmFiIHxwX6XhPbvZYTytfpiv_DcA1b2g';
const range = 'Sheet1';
    // Contoh pengambilan data produk menggunakan API
    $.getJSON(`AIzaSyCpmFiIHxwX6XhPbvZYTytfpiv_DcA1b2g?productId=${productId}`, function(data) {
        // Perbarui elemen dengan data produk
        $('#product-title').text(data.title);
        $('#product-image').attr('src', data.imageUrl);
        $('#product-description').text(data.description);
        $('#price-value').text(data.price);
    });

    // Tambahkan fungsionalitas lain seperti pembelian produk
    $('#buy-button').on('click', function() {
        alert('Produk telah ditambahkan ke keranjang!');
    });
});
