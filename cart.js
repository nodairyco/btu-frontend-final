const LOCAL_IMAGES = {
    'yx1-earphones': 'assets/yx1_main.png',
    'xx59-headphones': 'assets/akgs.png',
    'xx99-mark-one-headphones': 'assets/akgs.png',
    'xx99-mark-two-headphones': 'assets/prod_overview.png',
    'zx7-speaker': 'assets/zx7.png',
    'zx9-speaker': 'assets/zx9_quick.png'
};

function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(product, quantity = 1) {
    const cart = getCart();
    const existing = cart.find(item => item.slug === product.slug);
    
    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({
            slug: product.slug,
            name: product.name,
            price: product.price,
            quantity: quantity
        });
    }
    
    saveCart(cart);
    updateCartUI();
}

function removeFromCart(slug) {
    let cart = getCart();
    cart = cart.filter(item => item.slug !== slug);
    saveCart(cart);
    updateCartUI();
}

function updateQuantity(slug, change) {
    const cart = getCart();
    const item = cart.find(item => item.slug === slug);
    
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(slug);
            return;
        }
        saveCart(cart);
        updateCartUI();
    }
}

function clearCart() {
    localStorage.removeItem('cart');
    updateCartUI();
}

function getCartTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function getCartCount() {
    const cart = getCart();
    return cart.reduce((count, item) => count + item.quantity, 0);
}

function getImagePath(slug) {
    const basePath = document.body.dataset.basePath || '';
    const imagePath = LOCAL_IMAGES[slug] || 'assets/akgs.png';
    return basePath + imagePath;
}

function updateCartUI() {
    const cart = getCart();
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartCountModal = document.getElementById('cart-count-modal');
    const cartTotal = document.getElementById('cart-total');
    
    const count = getCartCount();
    
    if (cartCount) {
        cartCount.textContent = count;
        cartCount.style.display = count > 0 ? 'flex' : 'none';
    }
    
    if (cartCountModal) {
        cartCountModal.textContent = count;
    }
    
    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="cart-empty">Your cart is empty</p>';
        } else {
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <img src="${getImagePath(item.slug)}" alt="${item.name}">
                    <div class="cart-item-details">
                        <p class="cart-item-name">${item.name.split(' ').slice(0, 2).join(' ')}</p>
                        <p class="cart-item-price">$ ${item.price.toLocaleString()}</p>
                    </div>
                    <div class="cart-item-quantity">
                        <button onclick="updateQuantity('${item.slug}', -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity('${item.slug}', 1)">+</button>
                    </div>
                </div>
            `).join('');
        }
    }
    
    if (cartTotal) {
        cartTotal.textContent = '$ ' + getCartTotal().toLocaleString();
    }
}

function toggleCart() {
    const cartModal = document.getElementById('cart-modal');
    const cartOverlay = document.getElementById('cart-overlay');
    
    if (cartModal && cartOverlay) {
        const isOpen = cartModal.classList.contains('open');
        cartModal.classList.toggle('open');
        cartOverlay.classList.toggle('open');
        document.body.style.overflow = isOpen ? '' : 'hidden';
    }
}

function setActiveNav() {
    const currentUrl = window.location.href;
    const navLinks = document.querySelectorAll('.header-category');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        
        const href = link.getAttribute('href');
        
        if (currentUrl.includes('index.html') || currentUrl.endsWith('/')) {
            if (href.includes('index.html') || href === '/') {
                link.classList.add('active');
            }
        } else if (currentUrl.includes('cat=headphones') && href.includes('cat=headphones')) {
            link.classList.add('active');
        } else if (currentUrl.includes('cat=speakers') && href.includes('cat=speakers')) {
            link.classList.add('active');
        } else if (currentUrl.includes('cat=earphones') && href.includes('cat=earphones')) {
            link.classList.add('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    updateCartUI();
    setActiveNav();
    
    const cartButton = document.querySelector('.header-cart-button');
    if (cartButton) {
        cartButton.addEventListener('click', function(e) {
            e.preventDefault();
            toggleCart();
        });
    }
    
    const cartOverlay = document.getElementById('cart-overlay');
    if (cartOverlay) {
        cartOverlay.addEventListener('click', toggleCart);
    }
});
