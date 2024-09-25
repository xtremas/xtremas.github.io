$(document).ready(function() {
  // Load header
  $("#header-placeholder").load("header.html", function(response, status, xhr) {
    if (status == "error") {
      console.error("Error loading header: " + xhr.status + " " + xhr.statusText);
    }
  });

  // Load footer
  $("#footer-placeholder").load("footer.html", function(response, status, xhr) {
    if (status == "error") {
      console.error("Error loading footer: " + xhr.status + " " + xhr.statusText);
    }
  });
});
  document.addEventListener("DOMContentLoaded", function() {
    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector(".nav-menu");

    menuToggle.addEventListener("click", function() {
      navMenu.classList.toggle("active");
    });
  });
const sheetId = '1dRJ72TYn9eBq-VK4sngnZqTCc-1eWNRBuhK6pMrSnt8';
const apiKey = 'AIzaSyCpmFiIHxwX6XhPbvZYTytfpiv_DcA1b2g';
const range = 'Sheet1';

let currentPage = 1;
const productsPerPage = 12;
let totalProducts = 0;
let currentSearchTerm = '';
let currentCategory = '';

function fetchProducts(page, searchTerm = '', category = '') {
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const rows = data.values;
            totalProducts = rows.length - 1; // Adjust for header row
            const filteredRows = rows.slice(1).filter(row =>
                (category === '' || row[8].toLowerCase() === category.toLowerCase()) &&
                row[7].toLowerCase().includes(searchTerm.toLowerCase())
            );
            const start = (page - 1) * productsPerPage;
            const end = Math.min(start + productsPerPage, filteredRows.length);

            const products = filteredRows.slice(start, end);

            renderProducts(products);
            renderPagination(filteredRows.length, page);
        })
        .catch(error => {
            console.error('Error fetching products:', error);
        });
}

function renderProducts(products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    products.forEach(product => {
        const item = document.createElement('div');
        item.className = 'product-item';
        item.innerHTML = `
            <img src="${product[1]}" alt="${product[7]}">
            <div class="product-title"><a href="/p/product.html?productId=${product[0]}">${product[7]}</a></div>
            <div class="product-category">${product[8]}</div>
            <div class="product-price">${product[4]} <span class="discount-price">${product[3]}</span></div>
            <a class="read-more" href="/p/product.html?productId=${product[0]}">Read More</a>
        `;
        productList.appendChild(item);
    });
}

function renderPagination(total, current) {
    const paginationButtons = document.getElementById('pagination-buttons');
    const paginationInfo = document.getElementById('pagination-info');
    paginationButtons.innerHTML = '';
    paginationInfo.innerHTML = '';

    const totalPages = Math.ceil(total / productsPerPage);

    // Create Previous button
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.disabled = current === 1;
    prevButton.onclick = () => {
        if (current > 1) {
            fetchProducts(current - 1, currentSearchTerm, currentCategory);
        }
    };
    paginationButtons.appendChild(prevButton);

    // Create Page number buttons
    const pageButtonCount = 5; // Number of page buttons to display
    const startPage = Math.max(1, current - Math.floor(pageButtonCount / 2));
    const endPage = Math.min(totalPages, startPage + pageButtonCount - 1);

    if (startPage > 1) {
        const firstPageButton = document.createElement('button');
        firstPageButton.textContent = '1';
        firstPageButton.onclick = () => fetchProducts(1, currentSearchTerm, currentCategory);
        paginationButtons.appendChild(firstPageButton);

        if (startPage > 2) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            paginationButtons.appendChild(ellipsis);
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.disabled = i === current;
        button.onclick = () => fetchProducts(i, currentSearchTerm, currentCategory);
        paginationButtons.appendChild(button);
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            paginationButtons.appendChild(ellipsis);
        }

        const lastPageButton = document.createElement('button');
        lastPageButton.textContent = totalPages;
        lastPageButton.onclick = () => fetchProducts(totalPages, currentSearchTerm, currentCategory);
        paginationButtons.appendChild(lastPageButton);
    }

    // Create Next button
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.disabled = current === totalPages;
    nextButton.onclick = () => {
        if (current < totalPages) {
            fetchProducts(current + 1, currentSearchTerm, currentCategory);
        }
    };
    paginationButtons.appendChild(nextButton);

    // Update pagination info
    paginationInfo.textContent = `Page ${current} of ${totalPages}`;
}

// Add event listeners
document.getElementById('search-button').addEventListener('click', () => {
    currentSearchTerm = document.getElementById('search-input').value;
    fetchProducts(1, currentSearchTerm, currentCategory);
});

// Initialize products on page load
fetchProducts(currentPage);
