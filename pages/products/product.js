const API_URL = 'https://raw.githubusercontent.com/lomsadze123/audiophile-ecommerce-website/refs/heads/master/public/data.json';

const LOCAL_IMAGES = {
    'yx1-earphones': '../../assets/yx1_main.png',
    'xx59-headphones': '../../assets/akgs.png',
    'xx99-mark-one-headphones': '../../assets/akgs.png',
    'xx99-mark-two-headphones': '../../assets/prod_overview.png',
    'zx7-speaker': '../../assets/zx7.png',
    'zx9-speaker': '../../assets/zx9_quick.png'
};

const slug = new URLSearchParams(window.location.search).get('slug');

fetch(API_URL)
    .then(response => response.json())
    .then(products => {
        const product = products.find(p => p.slug === slug);
        if (product) {
            populateProduct(product);
        }
    })
    .catch(error => {
        console.error('Error fetching product:', error);
    });

function populateProduct(product) {
    document.title = product.name + ' | Audiophile';

    const productImage = document.getElementById('product-image');
    const productLabel = document.getElementById('product-label');
    const productTitle = document.getElementById('product-title');
    const productDescription = document.getElementById('product-description');
    const productPrice = document.getElementById('product-price');
    const featuresContent = document.getElementById('features-content');
    const inTheBoxList = document.getElementById('in-the-box-list');
    const relatedProductsGrid = document.getElementById('related-products-grid');

    productImage.src = LOCAL_IMAGES[product.slug] || '../../assets/prod_overview.png';
    productImage.alt = product.name;

    if (product.new) {
        productLabel.style.display = 'block';
    } else {
        productLabel.style.display = 'none';
    }

    productTitle.textContent = product.name;
    productDescription.textContent = product.description;
    productPrice.textContent = '$ ' + product.price.toLocaleString();

    const featuresParagraphs = product.features.split('\n\n');
    featuresContent.innerHTML = featuresParagraphs.map(p => `<p>${p}</p>`).join('');

    inTheBoxList.innerHTML = product.includes.map(item => 
        `<li><span class="qty-tag">${item.quantity}x</span> ${item.item}</li>`
    ).join('');

    relatedProductsGrid.innerHTML = product.others.map(other => `
        <div class="related-product">
            <div class="related-product-image">
                <img src="${LOCAL_IMAGES[other.slug] || '../../assets/akgs.png'}" alt="${other.name}">
            </div>
            <h3 class="related-product-name">${other.name.toUpperCase()}</h3>
            <a href="product.html?slug=${other.slug}" class="related-product-btn">SEE PRODUCT</a>
        </div>
    `).join('');

    const gallery1 = document.getElementById('gallery-1');
    const gallery2 = document.getElementById('gallery-2');
    const gallery3 = document.getElementById('gallery-3');
    
    gallery1.src = LOCAL_IMAGES[product.slug] || '../../assets/prod_overview.png';
    gallery2.src = LOCAL_IMAGES[product.slug] || '../../assets/prod_overview.png';
    gallery3.src = LOCAL_IMAGES[product.slug] || '../../assets/prod_overview.png';
}
