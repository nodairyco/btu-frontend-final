const API_URL = 'https://raw.githubusercontent.com/lomsadze123/audiophile-ecommerce-website/refs/heads/master/public/data.json';

let productsPromise = null;

function fetchProducts() {
    if (!productsPromise) {
        productsPromise = fetch(API_URL).then(response => response.json());
    }
    return productsPromise;
}
