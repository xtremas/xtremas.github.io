const sheetId = '1dRJ72TYn9eBq-VK4sngnZqTCc-1eWNRBuhK6pMrSnt8';
const apiKey = 'AIzaSyCpmFiIHxwX6XhPbvZYTytfpiv_DcA1b2g';
const range = 'Sheet1';

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('productId');

function fetchProductData(productId) {
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const rows = data.values;
            const productData = rows.find(row => row[0] === productId);

            if (productData) {
                const product = {
                    id: productData[0],
                    imageUrl: productData[1],
                    title: productData[2],
                    originPrice: productData[3],
                    discountPrice: productData[4],
                    discount: productData[5],
                    promotionUrl: productData[6],
                    category: productData[8]
                };

                document.getElementById('breadcrumb-title').textContent = product.title;

                const template = document.getElementById('product-template').innerHTML;
                const rendered = Mustache.render(template, product);
                document.getElementById('product-detail').innerHTML = rendered;

                // Set the document title
                document.title = `${product.title} - Best Diskon Product`;

                fetchRelatedProducts(product.category);
            } else {
                document.getElementById('product-detail').innerHTML = '<p>Product not found.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching product data:', error);
            document.getElementById('product-detail').innerHTML = '<p>Error loading product.</p>';
        });
}

function fetchRelatedProducts(category) {
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const rows = data.values;
            const relatedProducts = rows
                .filter(row => row[8] === category && row[0] !== productId) // Filter by category and exclude the current product
                .map(row => ({
                    id: row[0],
                    imageUrl: row[1],
                    title: row[2],
                    discountPrice: row[4],
                    discount: row[5]
                }));

            const template = document.getElementById('related-products-template').innerHTML;
            const rendered = Mustache.render(template, { relatedProducts });
            document.getElementById('related-products-list').innerHTML = rendered;

            // Load more button
            document.getElementById('load-more').addEventListener('click', () => {
                // Logic for loading more related products
                console.log('Load more products clicked');
            });
        })
        .catch(error => {
            console.error('Error fetching related products:', error);
        });
}

// Initialize product data fetching
fetchProductData(productId);
