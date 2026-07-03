const API_URL = 'https://raw.githubusercontent.com/lomsadze123/audiophile-ecommerce-website/refs/heads/master/public/data.json';

const LOCAL_IMAGES = {
    'yx1-earphones': '../../assets/yx1_main.png',
    'xx59-headphones': '../../assets/akgs.png',
    'xx99-mark-one-headphones': '../../assets/akgs.png',
    'xx99-mark-two-headphones': '../../assets/prod_overview.png',
    'zx7-speaker': '../../assets/zx7.png',
    'zx9-speaker': '../../assets/zx9_quick.png'
};

const category = new URLSearchParams(window.location.search).get('cat');

const categoryTitle = document.getElementById('category-title');
const productList = document.getElementById('product-list');

if (category) {
    categoryTitle.textContent = category.toUpperCase();
    document.title = category.charAt(0).toUpperCase() + category.slice(1) + ' | Audiophile';
}

fetch(API_URL)
    .then(response => response.json())
    .then(products => {
        const filtered = products.filter(p => p.category === category);

        filtered.forEach((product, index) => {
            const isReverse = index % 2 !== 0;
            const card = createProductCard(product, isReverse);
            productList.innerHTML += card;
        });
    })
    .catch(error => {
        console.error('Error fetching products:', error);
        productList.innerHTML = '<p>Error loading products. Please try again later.</p>';
    });

function createProductCard(product, isReverse) {
    const newLabel = product.new ? '<p class="product-label">NEW PRODUCT</p>' : '';
    const reverseClass = isReverse ? ' reverse' : '';
    const imageUrl = LOCAL_IMAGES[product.slug] || '../../assets/akgs.png';

    return `
        <article class="product-card${reverseClass}">
            <div class="product-card-image">
                <img src="${imageUrl}" alt="${product.name}">
            </div>
            <div class="product-card-content">
                ${newLabel}
                <h2 class="product-title">${product.name}</h2>
                <p class="product-description">${product.description}</p>
                <a href="../products/product.html?slug=${product.slug}" class="see-product-btn">SEE PRODUCT</a>
            </div>
        </article>
    `;
}
