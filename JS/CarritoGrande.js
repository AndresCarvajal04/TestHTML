const CART_KEY = 'fashion_cart';

document.addEventListener('DOMContentLoaded', () => {
    renderCartLarge();
});

window.addEventListener('cartChanged', (e) => {
    if (e.detail.key === CART_KEY) renderCartLarge();
});

function renderCartLarge() {
    const container = document.getElementById('cart-large-items');
    const subtotalElem = document.getElementById('cart-subtotal');
    const ivaElem = document.getElementById('cart-iva');
    const totalElem = document.getElementById('cart-total');
    if (!container) return;

    const items = CartUtils.get(CART_KEY);
    if (!items || items.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding:40px; color:#666;">Tu carrito está vacío</p>';
        subtotalElem.textContent = '$0';
        ivaElem.textContent = '$0';
        totalElem.textContent = '$0';
        return;
    }

    container.innerHTML = items.map(i => {
        const price = Number(String(i.precio || 0).replace(/[^0-9.-]/g, '')) || 0;
        const rowSubtotal = price * (i.quantity || 1);
        return `
            <div class="cart-row" data-id="${i.id}">
                <img src="../${i.imagen || i.img}" alt="${i.nombre}">
                <div class="cart-row-info">
                    <div class="cart-row-name">${i.nombre}</div>
                    <div class="cart-row-price">$${price.toLocaleString('es-CO')}</div>
                </div>
                <div class="cart-row-qty">
                    <button class="qty-decrease" data-id="${i.id}">-</button>
                    <span class="qty">${i.quantity}</span>
                    <button class="qty-increase" data-id="${i.id}">+</button>
                </div>
                <div class="cart-row-sub">$${rowSubtotal.toLocaleString('es-CO')}</div>
                <button class="remove-item" data-id="${i.id}">Eliminar</button>
            </div>`;
    }).join('');

    const subtotal = CartUtils.getTotal(CART_KEY);
    const iva = +(subtotal * 0.13);
    const total = subtotal + iva;

    subtotalElem.textContent = `$${subtotal.toLocaleString('es-CO')}`;
    ivaElem.textContent = `$${iva.toLocaleString('es-CO')}`;
    totalElem.textContent = `$${total.toLocaleString('es-CO')}`;
}

document.addEventListener('click', (e) => {
    const dec = e.target.closest('.qty-decrease');
    const inc = e.target.closest('.qty-increase');
    const rem = e.target.closest('.remove-item');
    if (dec) {
        const id = Number(dec.dataset.id);
        CartUtils.updateQuantity(CART_KEY, id, -1);
        return;
    }
    if (inc) {
        const id = Number(inc.dataset.id);
        CartUtils.updateQuantity(CART_KEY, id, 1);
        return;
    }
    if (rem) {
        const id = Number(rem.dataset.id);
        if (confirm('¿Eliminar este producto?')) CartUtils.removeItem(CART_KEY, id);
        return;
    }
    if (e.target && e.target.id === 'clear-cart') {
        if (confirm('¿Vaciar carrito?')) CartUtils.clear(CART_KEY);
    }
});

// Expose for debugging
window.renderCartLarge = renderCartLarge;
