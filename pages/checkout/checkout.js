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
            
            if (!validateForm()) {
                return;
            }
            
            populateConfirmation(cart);
            confirmationModal.classList.add('open');
            confirmationOverlay.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    }
}

function validateForm() {
    let isValid = true;
    
    clearErrors();
    
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const address = document.getElementById('address');
    const zip = document.getElementById('zip');
    const city = document.getElementById('city');
    const country = document.getElementById('country');
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    
    if (!name.value.trim()) {
        showError('name', "Can't be empty");
        isValid = false;
    }
    
    if (!email.value.trim()) {
        showError('email', "Can't be empty");
        isValid = false;
    } else if (!isValidEmail(email.value)) {
        showError('email', 'Wrong format');
        isValid = false;
    }
    
    if (!phone.value.trim()) {
        showError('phone', "Can't be empty");
        isValid = false;
    }
    
    if (!address.value.trim()) {
        showError('address', "Can't be empty");
        isValid = false;
    }
    
    if (!zip.value.trim()) {
        showError('zip', "Can't be empty");
        isValid = false;
    }
    
    if (!city.value.trim()) {
        showError('city', "Can't be empty");
        isValid = false;
    }
    
    if (!country.value.trim()) {
        showError('country', "Can't be empty");
        isValid = false;
    }
    
    if (paymentMethod === 'emoney') {
        const emoneyNumber = document.getElementById('emoney-number');
        const emoneyPin = document.getElementById('emoney-pin');
        
        if (!emoneyNumber.value.trim()) {
            showError('emoney-number', "Can't be empty");
            isValid = false;
        } else if (!/^\d{9}$/.test(emoneyNumber.value.trim())) {
            showError('emoney-number', 'Must be 9 digits');
            isValid = false;
        }
        
        if (!emoneyPin.value.trim()) {
            showError('emoney-pin', "Can't be empty");
            isValid = false;
        } else if (!/^\d{4}$/.test(emoneyPin.value.trim())) {
            showError('emoney-pin', 'Must be 4 digits');
            isValid = false;
        }
    }
    
    return isValid;
}

function showError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const errorSpan = document.getElementById(fieldId + '-error');
    const labelRow = errorSpan ? errorSpan.closest('.label-row') : null;
    
    if (input) {
        input.classList.add('error');
    }
    
    if (errorSpan) {
        errorSpan.textContent = message;
        errorSpan.classList.add('visible');
    }
    
    if (labelRow) {
        labelRow.classList.add('has-error');
    }
}

function clearErrors() {
    const inputs = document.querySelectorAll('input.error');
    const errorMsgs = document.querySelectorAll('.error-msg.visible');
    const labelRows = document.querySelectorAll('.label-row.has-error');
    
    inputs.forEach(input => input.classList.remove('error'));
    errorMsgs.forEach(msg => {
        msg.classList.remove('visible');
        msg.textContent = '';
    });
    labelRows.forEach(row => row.classList.remove('has-error'));
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
