document.addEventListener('DOMContentLoaded', function() {
    setupPaymentToggle();
    populateSummary();
    setupCheckoutButton();
});

function setupPaymentToggle() {
    const paymentRadios = document.querySelectorAll('input[name="payment"]');
    const emoneyFields = document.getElementById('emoney-fields');
    const codMessage = document.getElementById('cod-message');
    const paymentCards = document.querySelectorAll('.payment-card');

    paymentRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            paymentCards.forEach(card => card.classList.remove('selected'));
            this.closest('.payment-card').classList.add('selected');

            if (this.value === 'emoney') {
                emoneyFields.style.display = 'grid';
                codMessage.style.display = 'none';
            } else {
                emoneyFields.style.display = 'none';
                codMessage.style.display = 'flex';
            }
        });
    });
}

function populateSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const summaryCard = document.querySelector('.summary-card');
    const summaryTotals = document.querySelector('.summary-totals');
    
    if (cart.length === 0) {
        summaryCard.innerHTML = '<p style="text-align: center; color: #808080;">Your cart is empty</p>';
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 50;
    const vat = Math.round(total * 0.2);
    const grandTotal = total + shipping;

    summaryCard.innerHTML = cart.map(item => `
        <div class="summary-item">
            <img src="${getImagePath(item.slug)}" alt="${item.name}">
            <div class="item-details">
                <p class="item-name">${item.name.split(' ').slice(0, 2).join(' ')}</p>
                <p class="item-price">$ ${item.price.toLocaleString()}</p>
            </div>
            <p class="item-quantity">x${item.quantity}</p>
        </div>
    `).join('');

    summaryTotals.innerHTML = `
        <div>
            <span>TOTAL</span>
            <span>$ ${total.toLocaleString()}</span>
        </div>
        <div>
            <span>SHIPPING</span>
            <span>$ ${shipping}</span>
        </div>
        <div>
            <span>VAT (INCLUDED)</span>
            <span>$ ${vat.toLocaleString()}</span>
        </div>
        <div class="summary-grand-total">
            <span>GRAND TOTAL</span>
            <span>$ ${grandTotal.toLocaleString()}</span>
        </div>
    `;
}

function setupCheckoutButton() {
    const continueBtn = document.querySelector('.continue-btn');
    const confirmationModal = document.getElementById('confirmation-modal');
    const confirmationOverlay = document.getElementById('confirmation-overlay');
    
    if (continueBtn) {
        continueBtn.addEventListener('click', function() {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            
            populateConfirmation(cart);
            confirmationModal.classList.add('open');
            confirmationOverlay.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    }
}

function populateConfirmation(cart) {
    const confirmationItems = document.getElementById('confirmation-items');
    const confirmationGrandTotal = document.getElementById('confirmation-grand-total');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 50;
    const grandTotal = total + shipping;
    
    const firstItem = cart[0];
    const otherCount = cart.length - 1;
    
    let itemsHTML = `
        <div class="confirmation-item">
            <img src="${getImagePath(firstItem.slug)}" alt="${firstItem.name}">
            <div class="confirmation-item-details">
                <p class="confirmation-item-name">${firstItem.name.split(' ').slice(0, 2).join(' ')}</p>
                <p class="confirmation-item-price">$ ${firstItem.price.toLocaleString()}</p>
            </div>
            <span class="confirmation-item-qty">x${firstItem.quantity}</span>
        </div>
    `;
    
    if (otherCount > 0) {
        itemsHTML += `<p class="confirmation-other-items">and ${otherCount} other item(s)</p>`;
    }
    
    confirmationItems.innerHTML = itemsHTML;
    confirmationGrandTotal.textContent = '$ ' + grandTotal.toLocaleString();
}
