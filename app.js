/* ========================================
   MORGUE V3 — Core App Data & Shared Logic
   ======================================== */

// ---- PLACEHOLDER IMAGE UTIL ----
const IMG = (w, h, label, seed) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

// ---- CRYPTO ADDRESSES (PLACEHOLDER) ----
const CRYPTO = {
  xmr: 'x_XMR_ADDRESS_PLACEHOLDER_REPLACE_LATER',
  btc: 'y_BTC_ADDRESS_PLACEHOLDER_REPLACE_LATER'
};

// ---- CATEGORIES ----
const CATEGORIES = [
  { id: 'cat1', name: 'TACTICAL GEAR', slug: 'tactical', icon: '⬡', color: '#c8102e', desc: 'Field-grade equipment. Sourced from decommissioned military and private security contracts.' },
  { id: 'cat2', name: 'DIGITAL ASSETS', slug: 'digital',  icon: '◈', color: '#00c8a0', desc: 'Software, licenses, access tokens, and digital tools. Unboxed. Activated. Ready.' },
  { id: 'cat3', name: 'APPARELS', slug: 'apparel',  icon: '◉', color: '#c9a84c', desc: 'Underground threads. Limited runs. No restocks. No refunds. No questions.' },
  { id: 'cat4', name: 'ELECTRONICS', slug: 'electronics', icon: '◐', color: '#ff6b00', desc: 'Reconditioned tech. Grey-market hardware. Each unit tested and verified operational.' },
];

// ---- PRODUCT GENERATOR ----
// Price ranges: some items $65-$100 (discounted from higher), rest up to $100,000
// Cat1: 4 items have discounts (fixed). Cats 2,3,4: random 3-4 items discounted.

function makeProduct(catIdx, itemIdx, opts = {}) {
  const id = `${CATEGORIES[catIdx].id}_item${itemIdx + 1}`;
  const seed = `morgue${catIdx}${itemIdx}`;
  const hasDiscount = opts.discount || false;
  // Discounted items: sale price $60-$100, original $110-$180
  // Regular items: $65 to $100,000
  let price, originalPrice;
  if (hasDiscount) {
    price = Math.floor(Math.random() * 40 + 60); // $60-$100
    originalPrice = Math.floor(price * (1.4 + Math.random() * 0.5));
  } else {
    // Varied price distribution: low, mid, high, very high
    const tier = opts.tier || Math.floor(Math.random() * 4);
    const ranges = [[65, 200], [200, 2000], [2000, 15000], [15000, 100000]];
    const [lo, hi] = ranges[tier];
    price = Math.floor(Math.random() * (hi - lo) + lo);
    originalPrice = null;
  }
  return {
    id,
    catId: CATEGORIES[catIdx].id,
    catSlug: CATEGORIES[catIdx].slug,
    name: opts.name,
    desc: opts.desc || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Specification data pending update from supplier. Item verified and in stock.',
    price,
    originalPrice,
    discount: hasDiscount,
    image: IMG(400, 300, opts.name, seed),
    imageSquare: IMG(500, 500, opts.name, seed + 'sq'),
    sku: `MGV3-${catIdx + 1}${String(itemIdx + 1).padStart(3, '0')}`,
    stock: Math.floor(Math.random() * 40 + 1),
    rating: (3.5 + Math.random() * 1.5).toFixed(1),
    origin: opts.origin || 'UNDISCLOSED',
    condition: opts.condition || 'NEW',
    weight: opts.weight || `${(Math.random() * 4 + 0.2).toFixed(1)} KG`,
  };
}

// ---- CAT 1: TACTICAL GEAR (4 discounts fixed: items 2,5,9,13) ----
const tacticalNames = [
  ['COMBAT VEST MK-IV', 'Modular plate carrier. MOLLE compatible. Adjustable for all body types. NIJ Level III rated panels included.'],
  ['NIGHT OPS GOGGLES', 'Gen-3 image intensifier. 40° FOV. Auto-gated power supply. Head-mount kit included.'], // DISC
  ['BREACH KIT ALPHA', 'Entry toolkit. Hardened steel components. Serialized and delisted. Carry pouch included.'],
  ['RADIO SCRAMBLER X7', 'Portable frequency jammer. 315–915 MHz. Pocket-sized. Rechargeable via USB-C.'],
  ['GHILLIE SUIT PRO', 'Full body concealment. 3D leafy design. Fits M–XL. Adjustable elastic harness.'], // DISC
  ['TACTICAL BOOTS V2', 'Gore-Tex lined. Steel toe cap. Anti-slip Vibram sole. Sizes 40–47 available.'],
  ['FIELD MEDIC KIT', 'Trauma-grade supplies. Tourniquet, chest seal, Israeli bandage, hemostatic gauze x2.'],
  ['LASER SIGHT TL-5', 'IR + visible laser. Picatinny rail mount. 500m effective range. Class IIIA.'],
  ['BALLISTIC HELMET', 'UHMWPE shell. ACH profile. Rail system. Fits liner pads included. MICH compatible.'], // DISC
  ['THERMAL MONOCULAR', 'FLIR Lepton core. 320×240 resolution. USB-C charge. 8hr battery.'],
  ['COMMS HEADSET PRO', 'Active noise suppression. Dual-comm capable. Waterproof to 1m. Mil-spec connector.'],
  ['ASSAULT PACK 45L', 'Cordura 1000D. 45L main, 3 accessory pouches. Hydration sleeve. Internal frame.'],
  ['SMOKE CANISTER SET', 'Inert training grade. 4 colors included. 60-second burn. Non-toxic formula.'], // DISC
  ['MULTI-TOOL OMEGA', 'Titanium handles. 22 functions. Including saw, awl, crimper, wire cutter. Lockable blades.'],
  ['GPS TRACKER UNIT', 'Global coverage. 5-year battery. IP68 waterproof. Real-time ping every 30 seconds.'],
  ['BODY ARMOR INSERT', 'Level IV polyethylene plate. Single curve. 25cm × 30cm. Rifle-rated. NIJ certified.'],
];

// ---- CAT 2: DIGITAL ASSETS (random 3 discounts: items 0,4,11) ----
const digitalNames = [
  ['ENTERPRISE VPN STACK', 'Lifetime license. 5-device coverage. No-log policy. AES-256-GCM. Killswitch enabled.'], // DISC
  ['OSINT FRAMEWORK PRO', 'Intelligence aggregation toolkit. 200+ source connectors. Automated reporting. 1yr license.'],
  ['SECURE MAIL RELAY', 'Encrypted SMTP relay. PGP native. Unlimited aliases. Custom domain support.'],
  ['DARKNET CRAWLER LIB', 'Python library. Tor-native. Parser modules. Documentation and example scripts included.'],
  ['OPSEC HANDBOOK v9', 'Operational security manual. 600 pages. Digital PDF. Updated Q3 2024.'], // DISC
  ['CRYPTO WALLET SUITE', 'Air-gapped wallet software. Multi-coin. HD seed generation. Hardware key support.'],
  ['LINUX HARDENING KIT', 'Bash script collection. Systemd hardening, UFW config, auditd rules, SELinux policies.'],
  ['METADATA STRIPPER PRO', 'Batch EXIF wipe. Image, audio, document. GUI + CLI. Mac/Win/Linux.'],
  ['SIGNAL PROTOCOL SDK', 'End-to-end encryption library. C++/Python bindings. Fully documented. Royalty-free.'],
  ['BREACH MONITOR FEED', '12-month credential leak feed. Real-time alerts. API integration. JSON export.'],
  ['PROXY CHAIN MANAGER', 'Multi-hop proxy routing GUI. SOCKS5/HTTP. Auto-rotate. Country filter. Log-free.'],
  ['PASSWORD VAULT ULTRA', 'Zero-knowledge vault. Biometric unlock. 2FA enforced. Unlimited entries. Offline mode.'], // DISC
  ['NETWORK AUDIT SUITE', 'Port scanner + banner grab + vuln lookup. Cross-platform. Includes 1yr signature updates.'],
  ['STEGANOGRAPHY ENGINE', 'Hide data inside images, audio, video. AES encrypted payloads. GUI + CLI.'],
  ['DOMAIN RECON TOOL', 'Passive DNS, WHOIS, cert transparency, ASN lookup. API access. 12-month license.'],
  ['COUNTER-TRACK KIT', 'Anti-surveillance software bundle. Location spoofer, browser cleaner, traffic obfuscator.'],
];

// ---- CAT 3: APPAREL (random 4 discounts: items 1,6,10,14) ----
const apparelNames = [
  ['BLACKOUT HOODIE', 'Heavyweight 450gsm cotton blend. Triple-stitched seams. Hidden inner pocket. S–3XL.'],
  ['CARGO PANT OMEGA', 'Ripstop fabric. 8 pockets. Articulated knee. Adjustable hem. Black / Olive / Ranger green.'], // DISC
  ['STEALTH SNAPBACK', 'Structured 6-panel. Embroidered logo. Adjustable snap. One size fits most.'],
  ['TACTICAL GLOVES V3', 'Touchscreen compatible. Knuckle protection. Anti-slip palm. Sizes S–XL.'],
  ['OPERATOR JACKET', 'Softshell. Wind/water resistant. YKK zippers. Internal holster pockets. M–3XL.'],
  ['COMPRESSION BASE', 'Moisture-wicking. Anti-odor silver-fiber lining. Flatlock seams. S–XXL.'],
  ['FIELD SHIRT MK-II', 'Button-down. Vented back. Roll-up sleeves. Two chest pockets. Poplin weave.'], // DISC
  ['SKULL BALACLAVA', 'Merino wool. Full face coverage. Laser-cut skull graphic. One size fits all.'],
  ['BOOT SOCKS 3-PACK', 'Wool-blend. Cushioned heel + toe. Arch support. Boot height. Sizes 38–47.'],
  ['URBAN VEST LIGHT', 'Lightweight mesh. 4 zippered pockets. Packable. Black. S–XL.'],
  ['RECON SHORTS', 'Stretch fabric. Zip pockets. 11in inseam. Internal mesh liner. Quick-dry.'], // DISC
  ['OPERATOR BDU SET', 'Top + pants. Rip-stop. Pre-washed. FR fabric optional. Sizes XS–4XL.'],
  ['RAIN PONCHO PRO', 'Military cut. Grommets. Hood + drawstring. Packs to 1L. Olive drab.'],
  ['MULE CARRY BELT', 'Leather + nylon hybrid. Quick-release buckle. Hidden zip pouch. Fits 28"–44".'],
  ['LONG RANGE PARKA', 'Primaloft insulation. Durable water repellent. Drop hem. Oversized fit. S–3XL.'], // DISC
  ['CHEST RIG SHIRT', 'Integrated MOLLE webbing on chest. Moisture-wick. Slim fit. M–XXL.'],
];

// ---- CAT 4: ELECTRONICS (random 3 discounts: items 3,8,12) ----
const electronicsNames = [
  ['MICRO SDR RECEIVER', 'RTL-SDR v4. 500kHz–1.75GHz. 8-bit ADC. USB 3.0. SMA antenna port. Aluminum case.'],
  ['FARADAY CAGE BAG', '40dB attenuation. RF/EMI shielded. Triple-seal zipper. Tablet size. RFID block.'],
  ['RF SPECTRUM ANALYZER', 'Handheld. 1Hz–6.8GHz sweep. TFT display. Li-ion battery 6hr. USB data export.'],
  ['SIGNAL BOOSTER PRO', 'Cellular + WiFi dual-band amp. 72dB gain. Omni antenna. Indoor/outdoor. FCC-grade.'], // DISC
  ['BURNER PHONE KIT', 'Unlocked Android. Stripped firmware. No Google. 3x SIM slots. 3000mAh. 32GB.'],
  ['PORTABLE CHARGER 4X', '50,000mAh. 4 USB-A + 2 USB-C. 65W PD. Solar panel. Rugged shell. IP65.'],
  ['ENCRYPTED USB DRIVE', '256GB. AES-256 hardware encryption. PIN keypad. Self-destruct after 10 attempts.'],
  ['WIFI AUDIT STICK', 'Dual-band 2.4/5GHz. Kali-compatible. Monitor + inject mode. Range up to 2km.'],
  ['THERMAL CAMERA CORE', 'Plugs into USB-C. 160×120 FLIR. 0.1°C sensitivity. Works with iOS + Android.'], // DISC
  ['SIGNAL DETECTOR V2', 'Wideband RF bug detector. Laser pointer. LED array. 1MHz–10GHz. Pocket size.'],
  ['MESH RADIO NODE', 'Meshtastic-compatible. LoRa 915MHz. Off-grid comms. 20km range. Solar charge port.'],
  ['LOCKPICK TRAINER KIT', 'Transparent practice locks x3. Progressive difficulty. Full pick set. Carry pouch.'],
  ['GPS SPOOFER MODULE', 'GNSS signal simulation. SMA output. USB controlled. Frequency configurable.'], // DISC
  ['COUNTER-DRONE UNIT', 'RF detection array. 433/868/915MHz/2.4/5.8GHz monitoring. Alert buzzer. Portable.'],
  ['PI ZERO W KIT', 'Raspberry Pi Zero 2W. 16GB preloaded. Headers soldered. Case + USB adapter bundle.'],
  ['NIGHTVISION WEBCAM', '940nm IR illuminator built-in. 1080p. USB plug-n-play. 15m night range. Clip mount.'],
];

// ---- BUILD ALL PRODUCTS ----
function buildProducts() {
  const all = [];
  const nameSets = [tacticalNames, digitalNames, apparelNames, electronicsNames];
  // Discount indices per category
  const discountSets = [
    [1, 4, 8, 12],    // cat1: exactly 4
    [0, 4, 11],       // cat2: 3 random
    [1, 6, 10, 14],   // cat3: 4 random
    [3, 8, 12],       // cat4: 3 random
  ];
  // Price tiers per category item (for variety)
  const tierSets = [
    [2,3,1,2,0,1,2,3,2,3,2,2,1,1,3,2],
    [1,2,2,1,0,2,1,1,2,3,1,0,3,2,2,1],
    [0,0,0,0,1,0,0,0,0,0,0,1,0,0,1,0],
    [2,1,3,0,0,1,2,1,0,1,2,1,0,3,1,2],
  ];
  for (let c = 0; c < 4; c++) {
    for (let i = 0; i < 16; i++) {
      const isDisc = discountSets[c].includes(i);
      const [name, desc] = nameSets[c][i];
      all.push(makeProduct(c, i, {
        name, desc,
        discount: isDisc,
        tier: isDisc ? 0 : tierSets[c][i],
      }));
    }
  }
  return all;
}

const PRODUCTS = buildProducts();

// ---- CART ----
let cart = JSON.parse(sessionStorage.getItem('mgv3_cart') || '[]');

function saveCart() { sessionStorage.setItem('mgv3_cart', JSON.stringify(cart)); }

function addToCart(productId, qty = 1) {
  const existing = cart.find(i => i.productId === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ productId, qty });
  }
  saveCart();
  updateCartUI();
  showToast(`ITEM ADDED TO CART`);
}

function removeFromCart(productId) {
  cart = cart.filter(i => i.productId !== productId);
  saveCart();
  updateCartUI();
}

function updateCartQty(productId, qty) {
  const item = cart.find(i => i.productId === productId);
  if (item) { item.qty = qty; if (qty <= 0) removeFromCart(productId); }
  saveCart();
  updateCartUI();
}

function getCartTotal() {
  return cart.reduce((sum, i) => {
    const p = PRODUCTS.find(p => p.id === i.productId);
    return sum + (p ? p.price * i.qty : 0);
  }, 0);
}

function getCartCount() {
  return cart.reduce((sum, i) => sum + i.qty, 0);
}

function updateCartUI() {
  const countEls = document.querySelectorAll('.cart-count');
  const n = getCartCount();
  countEls.forEach(el => {
    el.textContent = n;
    el.style.display = n > 0 ? 'flex' : 'none';
  });
}

// ---- TOAST ----
function showToast(msg, type = 'default') {
  let toast = document.getElementById('global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'global-toast';
    toast.className = 'copy-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.background = type === 'error' ? 'var(--accent)' : type === 'gold' ? 'var(--gold)' : 'var(--accent3)';
  toast.style.color = type === 'error' ? '#fff' : '#000';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// ---- COPY TO CLIPBOARD ----
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => showToast('ADDRESS COPIED'));
}

// ---- FORMAT PRICE ----
function fmtPrice(n) {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 0 });
}

// ---- RENDER NAV ----
function renderNav(activePage) {
  const pages = [
    { href: 'index.html', label: 'HOME' },
    { href: 'products.html', label: 'PRODUCTS' },
    { href: 'specials.html', label: 'SPECIALS' },
    { href: 'contact.html', label: 'CONTACT' },
  ];
  const nav = document.querySelector('nav');
  if (!nav) return;
  nav.innerHTML = `
    <a class="nav-logo" href="index.html">MORGUE<span> V3</span></a>
    <ul class="nav-links">
      ${pages.map(p => `<li><a href="${p.href}" class="${activePage === p.label ? 'active' : ''}">${p.label}</a></li>`).join('')}
    </ul>
    <a href="cart.html" class="btn cart-btn-nav">
      CART
      <span class="cart-count" style="display:none">0</span>
    </a>
  `;
  updateCartUI();
}

// ---- RENDER FOOTER ----
function renderFooter() {
  const footer = document.querySelector('footer');
  if (!footer) return;
  footer.innerHTML = `
    <div class="footer-grid">
      <div class="footer-brand">
        <a class="nav-logo" href="index.html">MORGUE<span> V3</span></a>
        <p>A private marketplace for discrete individuals. All transactions are final. All communications encrypted. Operate accordingly.</p>
      </div>
      <div class="footer-col">
        <h4>Navigation</h4>
        <ul>
          <li><a href="index.html">Home</a></li>
          <li><a href="products.html">Products</a></li>
          <li><a href="specials.html">Specials</a></li>
          <li><a href="cart.html">Cart</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Policies</h4>
        <ul>
          <li><a href="#">No Refunds</a></li>
          <li><a href="#">Crypto Only</a></li>
          <li><a href="#">PGP Comms</a></li>
          <li><a href="#">No Logs</a></li>
          <li><a href="#">Escrow Available</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© ${new Date().getFullYear()} MORGUE V3 — ALL RIGHTS RESERVED</p>
      <p>SIMULATION ENVIRONMENT — LOCALHOST ONLY</p>
    </div>
  `;
}

// ---- INIT SHARED ----
document.addEventListener('DOMContentLoaded', () => {
  updateCartUI();
  renderFooter();
});
