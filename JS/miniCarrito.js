
const CART_KEY = 'fashion_cart';

/**
 * Logic for the mini cart UI and interaction.
 */
document.addEventListener('DOMContentLoaded', () => {
    initMiniCart();
    renderMiniCart();
});

function initMiniCart() {
    // Inject Mini Cart HTML if not exists
    if (!document.getElementById('mini-cart')) {
        const cartHTML = `
            <div id="mini-cart" class="mini-cart-container">
                <div class="mini-cart-header">
                    <span>Tu Carrito</span>
                    <button id="close-cart" style="background:none; border:none; cursor:pointer; font-size: 1.5rem; line-height: 1;">&times;</button>
                </div>
                <div id="mini-cart-items" class="mini-cart-items">
                    <!-- Items dynamically injected here -->
                </div>
                <div class="mini-cart-footer">
                    <div class="mini-cart-total">
                        <span>Total:</span>
                        <span id="mini-cart-total-price">$0</span>
                    </div>
                    <a href="CarritoGrande.html" class="btn-checkout">Tu Carrito</a>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', cartHTML);
    }

    // Toggle logic
    const cartBtn = document.querySelector('.btn-carrito');
    const miniCart = document.getElementById('mini-cart');
    const closeBtn = document.getElementById('close-cart');

    if (cartBtn) {
        cartBtn.addEventListener('click', (e) => {
            // Only toggle if we are not already on the checkout page
            if (!window.location.pathname.includes('CarritoIngresoDePago.html')) {
                e.preventDefault();
                miniCart.classList.toggle('active');
            }
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            miniCart.classList.remove('active');
        });
    }

    // Close on click outside
    document.addEventListener('click', (e) => {
        if (miniCart && miniCart.classList.contains('active')) {
            if (!miniCart.contains(e.target) && !cartBtn.contains(e.target)) {
                miniCart.classList.remove('active');
            }
        }
    });

    // Listen for storage changes
    window.addEventListener('cartChanged', (e) => {
        if (e.detail.key === CART_KEY) {
            renderMiniCart();
        }
    });
}

function renderMiniCart() {
    const itemsContainer = document.getElementById('mini-cart-items');
    const totalPriceElem = document.getElementById('mini-cart-total-price');
    const cartBtn = document.querySelector('.btn-carrito');
    
    if (!itemsContainer) return;

    const items = CartUtils.get(CART_KEY);
    const total = CartUtils.getTotal(CART_KEY);
    const count = CartUtils.getCount(CART_KEY);

    // Update Badge
    if (cartBtn) {
        let badge = cartBtn.querySelector('.cart-badge');
        if (count > 0) {
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'cart-badge';
                cartBtn.appendChild(badge);
            }
            badge.textContent = count;
        } else if (badge) {
            badge.remove();
        }
    }

    if (items.length === 0) {
        itemsContainer.innerHTML = '<p style="text-align:center; padding: 30px; color: #999;">Tu carrito está vacío</p>';
        totalPriceElem.textContent = '$0';
        return;
    }

    itemsContainer.innerHTML = items.map(item => `
        <div class="mini-cart-item">
            <img src="../${item.imagen || item.img}" alt="${item.nombre}">
            <div class="mini-cart-item-info">
                <div class="mini-cart-item-name">${item.nombre}</div>
                <div class="mini-cart-item-price">${item.quantity} x ${item.precio}</div>
            </div>
            <button onclick="CartUtils.removeItem('${CART_KEY}', ${item.id})" style="background:none; border:none; cursor:pointer; color:#ff4d4d; font-size: 1.1rem;" title="Eliminar">&times;</button>
        </div>
    `).join('');

    totalPriceElem.textContent = `$${total.toLocaleString('es-CO')}`;
}

// Make it global for inline onclick
window.renderMiniCart = renderMiniCart;
