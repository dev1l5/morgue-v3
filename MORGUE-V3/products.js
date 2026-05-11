/* ========================================
   MORGUE V3 — Products Page Logic
   ======================================== */

'use strict';

let activeFilter = 'all';
let activeSort = 'default';
let modalProduct = null;
let modalQty = 1;

// ---- RENDER EVERYTHING ----
function renderProducts() {
  const container = document.getElementById('products-container');
  if (!container) return;

  let filtered = [...PRODUCTS];

  // Filter
  if (activeFilter === 'discounts') {
    filtered = filtered.filter(p => p.discount);
  } else if (activeFilter !== 'all') {
    filtered = filtered.filter(p => p.catId === activeFilter);
  }

  // Sort
  if (activeSort === 'price-asc')  filtered.sort((a,b) => a.price - b.price);
  if (activeSort === 'price-desc') filtered.sort((a,b) => b.price - a.price);
  if (activeSort === 'discount')   filtered.sort((a,b) => (b.discount ? 1 : 0) - (a.discount ? 1 : 0));

  container.innerHTML = '';

  if (filtered.length === 0) {
    container.innerHTML = '<div class="empty-state">// NO ITEMS MATCH CURRENT FILTER</div>';
    return;
  }

  // Group by category when showing all
  if (activeFilter === 'all') {
    CATEGORIES.forEach(cat => {
      const catItems = filtered.filter(p => p.catId === cat.id);
      if (catItems.length === 0) return;
      container.appendChild(buildCategoryBlock(cat, catItems));
    });
  } else if (activeFilter === 'discounts') {
    // Show discounts grouped by cat
    CATEGORIES.forEach(cat => {
      const catItems = filtered.filter(p => p.catId === cat.id);
      if (catItems.length === 0) return;
      container.appendChild(buildCategoryBlock(cat, catItems));
    });
  } else {
    const cat = CATEGORIES.find(c => c.id === activeFilter);
    container.appendChild(buildCategoryBlock(cat, filtered));
  }
}

function buildCategoryBlock(cat, items) {
  const block = document.createElement('section');
  block.className = 'category-block';
  block.id = cat.slug;
  block.style.setProperty('--cat-color', cat.color);

  block.innerHTML = `
    <div class="cat-header">
      <div class="cat-header-left">
        <span class="cat-header-icon">${cat.icon}</span>
        <div>
          <h2 class="cat-header-name">${cat.name}</h2>
          <span class="cat-header-count">${items.length} ITEM${items.length !== 1 ? 'S' : ''}</span>
        </div>
      </div>
      <p class="cat-header-desc">${cat.desc}</p>
    </div>
    <div class="products-grid" id="grid-${cat.id}"></div>
  `;

  const grid = block.querySelector(`#grid-${cat.id}`);
  items.forEach(p => {
    grid.appendChild(buildProductCard(p, cat.color));
  });

  return block;
}

function buildProductCard(p, catColor) {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.style.setProperty('--card-color', catColor);

  const savePct = p.originalPrice
    ? Math.round((1 - p.price / p.originalPrice) * 100)
    : 0;

  card.innerHTML = `
    <div class="product-card-img">
      <img src="${p.image}" alt="${p.name}" loading="lazy" />
      <div class="product-badges">
        ${p.discount ? `<span class="badge badge-sale">SALE −${savePct}%</span>` : ''}
        ${p.price > 10000 ? `<span class="badge badge-hot">HIGH VALUE</span>` : ''}
        ${p.stock <= 5 ? `<span class="badge badge-new">LOW STOCK</span>` : ''}
      </div>
    </div>
    <div class="product-card-body">
      <div class="product-card-name">${p.name}</div>
      <div class="product-card-sku">SKU: ${p.sku}</div>
      <div class="product-card-desc">${p.desc}</div>
      <div class="product-card-price">
        <span class="pc-price">${fmtPrice(p.price)}</span>
        ${p.originalPrice ? `<span class="pc-original">${fmtPrice(p.originalPrice)}</span><span class="pc-save">SAVE ${savePct}%</span>` : ''}
      </div>
      <div class="product-card-footer">
        <button class="btn-add-cart" data-id="${p.id}">+ CART</button>
        <button class="btn-view-detail" data-id="${p.id}">DETAILS</button>
      </div>
    </div>
  `;

  card.querySelector('.btn-add-cart').addEventListener('click', (e) => {
    e.stopPropagation();
    addToCart(p.id, 1);
  });

  card.querySelector('.btn-view-detail').addEventListener('click', (e) => {
    e.stopPropagation();
    openProductModal(p.id);
  });

  card.addEventListener('click', () => openProductModal(p.id));

  return card;
}

// ---- PRODUCT MODAL ----
function openProductModal(productId) {
  const p = PRODUCTS.find(x => x.id === productId);
  if (!p) return;
  modalProduct = p;
  modalQty = 1;

  const savePct = p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;

  document.getElementById('modal-product-name').textContent = p.name;
  document.getElementById('modal-img').src = p.imageSquare;
  document.getElementById('modal-img').alt = p.name;
  document.getElementById('modal-desc').textContent = p.desc;
  document.getElementById('qty-val').textContent = '1';

  document.getElementById('modal-price').innerHTML = `
    <span class="price-current">${fmtPrice(p.price)}</span>
    ${p.originalPrice ? `<span class="price-original">${fmtPrice(p.originalPrice)}</span><span class="price-save">SAVE ${savePct}%</span>` : ''}
  `;

  document.getElementById('modal-meta').innerHTML = `
    <span><span>SKU</span><b>${p.sku}</b></span>
    <span><span>CONDITION</span><b>${p.condition}</b></span>
    <span><span>ORIGIN</span><b>${p.origin}</b></span>
    <span><span>WEIGHT</span><b>${p.weight}</b></span>
    <span><span>STOCK</span><b>${p.stock} UNITS</b></span>
    <span><span>RATING</span><b>${p.rating} / 5.0</b></span>
  `;

  document.getElementById('product-modal').classList.add('active');
}

function closeProductModal() {
  document.getElementById('product-modal').classList.remove('active');
  modalProduct = null;
}

// ---- FILTER TABS ----
function initFilterTabs() {
  document.getElementById('filter-tabs').addEventListener('click', (e) => {
    const tab = e.target.closest('.filter-tab');
    if (!tab) return;
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    activeFilter = tab.dataset.cat;
    renderProducts();
    window.scrollTo({ top: document.querySelector('.filter-bar').offsetTop - 60, behavior: 'smooth' });
  });
}

// ---- SORT ----
function initSort() {
  document.getElementById('sort-select').addEventListener('change', (e) => {
    activeSort = e.target.value;
    renderProducts();
  });
}

// ---- MODAL CONTROLS ----
function initModalControls() {
  document.getElementById('modal-close-btn').addEventListener('click', closeProductModal);

  document.getElementById('product-modal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('product-modal')) closeProductModal();
  });

  document.getElementById('qty-minus').addEventListener('click', () => {
    if (modalQty > 1) modalQty--;
    document.getElementById('qty-val').textContent = modalQty;
  });

  document.getElementById('qty-plus').addEventListener('click', () => {
    if (modalProduct && modalQty < modalProduct.stock) modalQty++;
    document.getElementById('qty-val').textContent = modalQty;
  });

  document.getElementById('modal-add-btn').addEventListener('click', () => {
    if (!modalProduct) return;
    addToCart(modalProduct.id, modalQty);
    closeProductModal();
  });
}

// ---- HASH NAVIGATION (jump to category from homepage) ----
function handleHash() {
  const hash = window.location.hash.replace('#', '');
  if (!hash) return;
  const cat = CATEGORIES.find(c => c.slug === hash);
  if (cat) {
    activeFilter = cat.id;
    document.querySelectorAll('.filter-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.cat === cat.id);
    });
    renderProducts();
    setTimeout(() => {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }
}

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  renderNav('PRODUCTS');
  renderProducts();
  initFilterTabs();
  initSort();
  initModalControls();
  handleHash();
});
