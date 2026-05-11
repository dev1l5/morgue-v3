# MORGUE V3 — Localhost Simulation
## Setup & File Reference

---

### FILE STRUCTURE

```
morgue-v3/
│
├── index.html          ← Landing page (hero, about, category showcase, specials teaser)
├── products.html       ← Full product listing (all 4 categories, 64 items, filter + sort)
├── specials.html       ← Room VII content access page ($50 BTC/XMR)
├── cart.html           ← Cart, order summary, checkout with crypto payment
├── contact.html        ← Contact form (dispatches to x@proton.me via mailto)
│
├── styles.css          ← Global styles (nav, footer, buttons, modals, shared components)
├── home.css            ← Landing page specific styles
├── products.css        ← Products page specific styles
├── specials.css        ← Specials page specific styles
├── cart.css            ← Cart page specific styles
├── contact.css         ← Contact page specific styles
│
├── app.js              ← Core: all product data, cart logic, shared functions (load on ALL pages)
├── products.js         ← Products page rendering + filter/sort/modal logic
├── specials.js         ← Specials page logic (coin selector, payment modal)
├── cart.js             ← Cart rendering, checkout, order submission simulation
├── contact.js          ← Contact form logic + mailto dispatch simulation
│
└── README.md           ← This file
```

---

### RUNNING LOCALLY

Open with any local server. Recommended options:

**VS Code Live Server** (easiest)
- Install the "Live Server" extension
- Right-click `index.html` → Open with Live Server

**Python** (no install needed if Python is present)
```bash
cd morgue-v3
python3 -m http.server 8080
# Visit: http://localhost:8080
```

**Node http-server**
```bash
npm install -g http-server
cd morgue-v3
http-server -p 8080
# Visit: http://localhost:8080
```

> Do NOT open HTML files directly via `file://` — some browsers block sessionStorage on file:// protocol.

---

### CUSTOMISATION CHECKLIST

#### 1. CRYPTO ADDRESSES
Replace placeholder addresses in **two** files:

**`app.js`** — lines near top:
```js
const CRYPTO = {
  xmr: 'x_XMR_ADDRESS_PLACEHOLDER_REPLACE_LATER',   // ← your XMR address
  btc: 'y_BTC_ADDRESS_PLACEHOLDER_REPLACE_LATER'    // ← your BTC address
};
```

**`cart.js`** — near top:
```js
const CHECKOUT_ADDRESSES = {
  xmr: 'x_XMR_ADDRESS_PLACEHOLDER_REPLACE_LATER',   // ← your XMR address
  btc: 'y_BTC_ADDRESS_PLACEHOLDER_REPLACE_LATER'    // ← your BTC address
};
```

**`specials.js`** — near top:
```js
const ROOM_ADDRESSES = {
  xmr: 'x_XMR_ADDRESS_PLACEHOLDER_REPLACE_LATER',   // ← your XMR address
  btc: 'y_BTC_ADDRESS_PLACEHOLDER_REPLACE_LATER'    // ← your BTC address
};
```

Also update the default value in `specials.html` inside the `#room-addr-display` div.

#### 2. CONTACT EMAIL
Currently set to `x@proton.me`. Change in:
- `contact.html` (display link + mailto href)
- `contact.js` (mailto construction + log)

#### 3. PRODUCT IMAGES
All images pull from `https://picsum.photos` (random placeholder photos).
To use real images, update the `IMG()` function in `app.js` or swap URLs per product in `buildProducts()`.

#### 4. PRODUCT NAMES / DESCRIPTIONS
All 64 product names and descriptions are defined in `app.js`:
- `tacticalNames[]` — 16 items
- `digitalNames[]`  — 16 items
- `apparelNames[]`  — 16 items
- `electronicsNames[]` — 16 items

Each entry is a `[name, description]` pair. Edit freely.

#### 5. PRODUCT PRICES
Prices are auto-generated based on tier ranges in `buildProducts()`:
```js
const ranges = [[65, 200], [200, 2000], [2000, 15000], [15000, 100000]];
```
Tier per item is controlled by `tierSets[][]` in the same function.
To hard-code a price, set `opts.price` directly in `makeProduct()`.

#### 6. DISCOUNT ITEMS
Controlled by `discountSets[][]` in `buildProducts()`:
```js
const discountSets = [
  [1, 4, 8, 12],    // cat1 TACTICAL — 4 items (indices)
  [0, 4, 11],       // cat2 DIGITAL  — 3 items
  [1, 6, 10, 14],   // cat3 APPAREL  — 4 items
  [3, 8, 12],       // cat4 ELECTRONICS — 3 items
];
```
Discounted items get sale price $60–$100 with a generated original price.

#### 7. SITE NAME / DESCRIPTION
- Site name `MORGUE V3` appears in `nav` (rendered by `renderNav()` in `app.js`)
- Footer description in `renderFooter()` in `app.js`
- Page `<title>` tags in each HTML file

---

### SIMULATED BACKEND BEHAVIOUR

Since there is no backend, these actions are simulated client-side:

| Action | Simulation |
|---|---|
| Add to cart | `sessionStorage` via `mgv3_cart` key |
| Cart persists across pages | `sessionStorage` (same tab/session) |
| Order submission | Logged to `sessionStorage['mgv3_orders']` + console |
| Contact form | Opens `mailto:` + logs to `sessionStorage['mgv3_contact_log']` |
| Specials payment | Shows address + confirmation modal |
| Copy address | `navigator.clipboard` API |

Cart resets when the browser tab is closed (sessionStorage scope).
To persist across sessions, change `sessionStorage` → `localStorage` in `app.js`.

---

### PRODUCT COUNT SUMMARY

| Category | Total Items | Discounted Items |
|---|---|---|
| Tactical Gear | 16 | 4 (fixed: indices 1,4,8,12) |
| Digital Assets | 16 | 3 (indices 0,4,11) |
| Apparel | 16 | 4 (indices 1,6,10,14) |
| Electronics | 16 | 3 (indices 3,8,12) |
| **TOTAL** | **64** | **14** |

---

### PRICE RANGE REFERENCE

| Tier | Range | Note |
|---|---|---|
| 0 (Discount) | $60–$100 | Discounted sale items only |
| 1 (Low) | $65–$200 | Everyday carry, apparel |
| 2 (Mid) | $200–$2,000 | Specialist gear |
| 3 (High) | $2,000–$15,000 | Premium hardware |
| 4 (Ultra) | $15,000–$100,000 | High-value specialty items |

---

### SPECIALS — ROOM VII

- Access fee: **$50** (BTC or XMR)
- Located at `specials.html`
- Thumbnail is blurred with CSS `filter: blur()`
- Payment modal shows address for selected coin
- On confirmation: shows a submitted screen (no real backend)
- Edit Room VII price display in `specials.html` (search `$50`)

---

*MORGUE V3 — Simulation Environment — Localhost Only*
