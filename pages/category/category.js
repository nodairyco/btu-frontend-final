const category = new URLSearchParams(window.location.search).get('cat');

const categoryTitle = document.getElementById('category-title');
const productList = document.getElementById('product-list');

if (category) {
    categoryTitle.textContent = category.toUpperCase();
    document.title = category.charAt(0).toUpperCase() + category.slice(1) + ' | Audiophile';
}

fetchProducts()
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
    const imageUrl = getImagePath(product.slug);

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
