/* ========================================
   MORGUE V3 — Cart Page Logic
   ======================================== */

'use strict';

const CHECKOUT_ADDRESSES = {
  xmr: 'x_XMR_ADDRESS_PLACEHOLDER_REPLACE_LATER',
  btc: 'y_BTC_ADDRESS_PLACEHOLDER_REPLACE_LATER'
};

let checkoutCoin = 'xmr';

function renderCartPage() {
  const count = getCartCount();

  document.getElementById('cart-layout').style.display = count === 0 ? 'none' : 'grid';
  document.getElementById('empty-cart-state').style.display = count === 0 ? 'block' : 'none';

  if (count === 0) return;

  renderCartItems();
  renderSummary();
  updateAddressDisplay();
}

// ---- CART ITEMS LIST ----
function renderCartItems() {
  const list = document.getElementById('cart-items-list');
  list.innerHTML = '';

  cart.forEach(({ productId, qty }) => {
    const p = PRODUCTS.find(x => x.id === productId);
    if (!p) return;

    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <div class="cart-item-img">
        <img src="${p.image}" alt="${p.name}" loading="lazy" />
      </div>
      <div class="cart-item-info">
        <div class="cart-item-name">${p.name}</div>
        <div class="cart-item-sku">SKU: ${p.sku}</div>
        <div class="cart-item-price-each">${fmtPrice(p.price)} each</div>
      </div>
      <div class="cart-item-controls">
        <div class="cart-item-total">${fmtPrice(p.price * qty)}</div>
        <div class="cart-item-qty">
          <button class="cart-qty-btn" data-action="minus" data-id="${p.id}">−</button>
          <span class="cart-qty-val">${qty}</span>
          <button class="cart-qty-btn" data-action="plus" data-id="${p.id}">+</button>
        </div>
        <button class="cart-item-remove" data-id="${p.id}">✕ REMOVE</button>
      </div>
    `;

    row.querySelectorAll('.cart-qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        const item = cart.find(i => i.productId === p.id);
        if (!item) return;
        if (action === 'plus') item.qty++;
        if (action === 'minus') item.qty--;
        if (item.qty <= 0) { removeFromCart(p.id); }
        else { saveCart(); updateCartUI(); }
        renderCartPage();
      });
    });

    row.querySelector('.cart-item-remove').addEventListener('click', () => {
      removeFromCart(p.id);
      renderCartPage();
    });

    list.appendChild(row);
  });
}

// ---- ORDER SUMMARY ----
function renderSummary() {
  const lines = document.getElementById('summary-lines');
  lines.innerHTML = '';

  cart.forEach(({ productId, qty }) => {
    const p = PRODUCTS.find(x => x.id === productId);
    if (!p) return;
    const line = document.createElement('div');
    line.className = 'summary-line';
    line.innerHTML = `
      <span class="item-name">${p.name} × ${qty}</span>
      <span>${fmtPrice(p.price * qty)}</span>
    `;
    lines.appendChild(line);
  });

  const total = getCartTotal();
  document.getElementById('summary-total-val').textContent = fmtPrice(total);
  document.getElementById('addr-total-inline').textContent = fmtPrice(total);
}

// ---- ADDRESS DISPLAY ----
function updateAddressDisplay() {
  const addr = CHECKOUT_ADDRESSES[checkoutCoin];
  const el = document.getElementById('checkout-addr-display');
  if (el) {
    el.textContent = addr;
    el.dataset.addr = addr;
  }
}

// ---- COIN SELECTOR ----
function initCoinSelector() {
  document.getElementById('checkout-coin-selector').addEventListener('click', (e) => {
    const btn = e.target.closest('.coin-btn');
    if (!btn) return;
    document.querySelectorAll('#checkout-coin-selector .coin-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    checkoutCoin = btn.dataset.coin;
    updateAddressDisplay();
  });
}

// ---- CHECKOUT SUBMIT ----
function initCheckoutSubmit() {
  document.getElementById('checkout-submit-btn').addEventListener('click', () => {
    const email = document.getElementById('checkout-email').value.trim();
    if (!email || !email.includes('@')) {
      showToast('PLEASE ENTER A VALID EMAIL', 'error');
      return;
    }
    if (getCartCount() === 0) {
      showToast('CART IS EMPTY', 'error');
      return;
    }

    // Generate a fake order ref
    const ref = 'MGV3-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();

    document.getElementById('order-confirm-email').textContent = `Confirmation → ${email}`;
    document.getElementById('order-confirm-id').textContent = `Order ref: ${ref}`;
    document.getElementById('order-confirm-modal').classList.add('active');

    // Simulate backend call (fake delay + log)
    simulateBackendOrderSubmit({ email, ref, coin: checkoutCoin, total: getCartTotal(), items: [...cart] });
  });

  document.getElementById('order-confirm-close').addEventListener('click', () => {
    document.getElementById('order-confirm-modal').classList.remove('active');
    // Clear cart after confirmed
    cart = [];
    saveCart();
    updateCartUI();
    renderCartPage();
  });
}

// ---- FAKE BACKEND SIMULATE ----
function simulateBackendOrderSubmit(orderData) {
  console.log('[MORGUE V3] Order submission simulated:', orderData);
  // In a real backend this would POST to an API endpoint
  // Here we just log and store in sessionStorage for demo
  const orders = JSON.parse(sessionStorage.getItem('mgv3_orders') || '[]');
  orders.push({ ...orderData, timestamp: new Date().toISOString() });
  sessionStorage.setItem('mgv3_orders', JSON.stringify(orders));
}

// ---- CLEAR CART ----
function initClearCart() {
  document.getElementById('clear-cart-btn').addEventListener('click', () => {
    if (cart.length === 0) return;
    if (confirm('Clear all items from cart?')) {
      cart = [];
      saveCart();
      updateCartUI();
      renderCartPage();
    }
  });
}

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  renderNav('');
  renderCartPage();
  initCoinSelector();
  initCheckoutSubmit();
  initClearCart();
});
