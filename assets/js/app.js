/* =============================================================================
   NYCE SOLUTIONS — catalogue application
   -----------------------------------------------------------------------------
   Vanilla JavaScript, hash-based routing, no build step.
   Reads window.NYCE_CONFIG (config.js), window.NYCE_CATALOGUE (catalogue.js)
   and window.NYCE_ASSETS (asset map in index.html or inlined in the standalone).

   Sections
     1. Bootstrap & helpers        5. Product detail
     2. Cart state                 6. Business, Contact, About, Cart, Checkout, Policies
     3. Shared components (3b: shell) 7. Router & legacy redirects
     4. Home & Shop (listing)      8. WhatsApp, modal, forms, events
   ============================================================================ */
(function () {
'use strict';

/* ---------------------------------------------------------------- 1. Bootstrap */
const CONFIG = window.NYCE_CONFIG || {};
const ASSETS = window.NYCE_ASSETS || {};
const DATA = window.NYCE_CATALOGUE || { categories: [], products: [] };
const PROD = CONFIG.siteMode === 'production';
const PAGE_SIZE = Number(CONFIG.cataloguePageSize) > 0 ? Number(CONFIG.cataloguePageSize) : 12;
const MAX_QTY = Number(CONFIG.maxQuantity) > 0 ? Number(CONFIG.maxQuantity) : 99;
const CURRENCY = CONFIG.currency || 'KES';
const LOCALE = CONFIG.locale || 'en-KE';
const BUSINESS = CONFIG.businessName || 'NYCE SOLUTIONS';
const WHATSAPP = String(CONFIG.whatsappNumber || '').replace(/\D/g, '');
const APPROVED = new Set(Array.isArray(CONFIG.approvedProductIds) ? CONFIG.approvedProductIds : []);

const CATEGORIES = DATA.categories;
const ALL_PRODUCTS = DATA.products;
// Production mode shows only owner-approved products. Demo mode shows every record.
const PRODUCTS = PROD ? ALL_PRODUCTS.filter(p => APPROVED.has(p.id) || p.approved === true) : ALL_PRODUCTS;
const HAS_DATES = PRODUCTS.some(p => p.dateAdded);

const APPLICATIONS = [
  ['Home Backup Power', 'Solar, storage, inverters and generators for essential household loads.', 'home'],
  ['Farm & Irrigation', 'Pumps, pipes, tillers and processing equipment for growing and watering.', 'leaf'],
  ['Construction & Workshop', 'Tools, site machinery, welding and electrical project supplies.', 'tool']
];

const ICONS = {
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
  cart: '<path d="M3 3h2l3 12h11l2-9H6"/><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  message: '<path d="M20 11a8 8 0 0 1-8 8H5l-3 3v-10a9 9 0 0 1 18-1Z"/><path d="M7 10h9M7 14h6"/>',
  wa: '<path d="M21 11.5a9 9 0 0 1-13.5 8L3 21l1.5-4.5A9 9 0 1 1 21 11.5Z"/><path d="M8 7c-3 2 4 9 7 7l1-2-3-1-1 1-2-2 1-1-1-3Z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.4 1.4m11.2 11.2L19 19M5 19l1.4-1.4M17.6 6.4 19 5"/>',
  truck: '<path d="M2 5h12v12H2zm12 5h4l4 4v3h-8"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="19" r="2"/>',
  check: '<path d="m5 12 4 4L20 5"/>',
  layers: '<path d="m12 3 10 5-10 5L2 8Zm-10 9 10 5 10-5M2 17l10 5 10-5"/>',
  home: '<path d="m2 11 10-9 10 9M5 9v12h14V9M9 21v-8h6v8"/>',
  leaf: '<path d="M21 3C8 1 1 8 5 15c7 8 17-1 16-12Z"/><path d="M3 22 16 9"/>',
  tool: '<path d="M21 3a6 6 0 0 1-8 8L5 20a2 2 0 0 1-3-3l9-8a6 6 0 0 1 8-8l-4 4 4 2Z"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  filter: '<path d="M3 5h18M6 12h12M9 19h6"/>',
  zoom: '<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6M10 7v6M7 10h6"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 5 10 8L22 5"/>',
  pin: '<path d="M19 9c0 5-7 12-7 12S5 14 5 9a7 7 0 0 1 14 0Z"/><circle cx="12" cy="9" r="2"/>',
  phone: '<path d="M5 3h4l2 5-3 2a11 11 0 0 0 6 6l2-3 5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2Z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7Z"/>',
  drop: '<path d="M12 3s7 7 7 12a7 7 0 0 1-14 0c0-5 7-12 7-12Z"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.2"/>'
};
const icon = n => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ICONS.layers}</svg>`;
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const money = n => `${CURRENCY} ${Number(n).toLocaleString(LOCALE, { maximumFractionDigits: 0 })}`;
const cat = id => CATEGORIES.find(c => c.id === id);
const subOf = id => { for (const c of CATEGORIES) { const s = c.subcategories.find(x => x.id === id); if (s) return { ...s, category: c }; } return null; };
const product = id => PRODUCTS.find(p => p.id === id);
const inDept = (p, c) => !c || (p.categories || []).includes(c);
const inSub = (p, s) => !s || (p.subcategories || []).includes(s);
const countDept = id => PRODUCTS.filter(p => inDept(p, id)).length;
const countSub = id => PRODUCTS.filter(p => inSub(p, id)).length;
const primaryCat = p => cat(p.categories[0]);
const primarySub = p => subOf(p.subcategories[0]);
const makeUrl = (path, params = {}) => {
  const isDefault = (k, v) => k === 'page' && Number(v) === 1;
  const q = new URLSearchParams(Object.entries(params).filter(([k, v]) => v !== '' && v !== null && v !== undefined && !isDefault(k, v)));
  const s = q.toString();
  return '#/' + path + (s ? '?' + s : '');
};
const shopUrl = (category, subcategory) => makeUrl('shop', { category, subcategory });
// Price states: priced (a usable number), quote (quotation only) and unavailable (the record has no usable price data).
const hasPrice = p => typeof p.price === 'number' && Number.isFinite(p.price) && p.price >= 0 && p.priceType !== 'quote';
const priceState = p => hasPrice(p) ? 'priced' : (p.price === null || p.priceType === 'quote') ? 'quote' : 'unavailable';
const isDemoPrice = p => hasPrice(p) && p.priceType === 'demo' && !PROD;

/* ---------------------------------------------------------------- Storage helpers */
function store(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; } }
function load(key, fallback) { try { const v = JSON.parse(localStorage.getItem(key)); return v === null || v === undefined ? fallback : v; } catch { return fallback; } }

/* ---------------------------------------------------------------- 2. Cart state */
const CART_KEY = 'nyce-demo-cart-v2';
let cart = {}, canStore = true, toastTimer, previousHash = '', activeTab = 'description', galleryIndex = 0;
let imageFailed = false, focusAfterRoute = null, formPreview = '';
let viewMode = load('nyce-view-mode', 'grid') === 'list' ? 'list' : 'grid';
(function restoreCart() {
  const data = load(CART_KEY, {});
  if (!data || typeof data !== 'object' || Array.isArray(data)) return;
  Object.entries(data).forEach(([id, q]) => { const p = product(id); if (p && hasPrice(p) && Number.isInteger(q) && q > 0) cart[id] = Math.min(q, MAX_QTY); });
  try { localStorage.getItem(CART_KEY); } catch { canStore = false; }
})();
function saveCart() { canStore = store(CART_KEY, cart) && canStore; updateCount(); }
function cartCount() { return Object.values(cart).reduce((a, b) => a + b, 0); }
function cartTotal() { return Object.entries(cart).reduce((sum, [id, q]) => sum + product(id).price * q, 0); }
function updateCount() {
  const n = cartCount();
  document.getElementById('cart-count').textContent = n;
  document.querySelector('.cart-link').setAttribute('aria-label', `Cart, ${n} ${n === 1 ? 'item' : 'items'}`);
}
function addCart(id, q) {
  const p = product(id);
  if (!p || !hasPrice(p) || !Number.isInteger(q) || q < 1 || q > MAX_QTY) return false;
  const next = (cart[id] || 0) + q;
  if (next > MAX_QTY) { notify(`Maximum ${MAX_QTY} units per product in this cart.`); return false; }
  cart[id] = next; saveCart(); notify(`${q} × ${p.name} added to the cart.`, true); return true;
}
function notify(message, link = false) {
  const el = document.getElementById('toast');
  clearTimeout(toastTimer);
  el.innerHTML = `<span>${esc(message)}</span>${link ? '<a href="#/cart">View cart</a>' : ''}`;
  el.classList.add('visible');
  toastTimer = setTimeout(() => el.classList.remove('visible'), 5000);
}

/* ---------------------------------------------------------------- 3. Shared components */
const photoPlaceholder = alt => `<span class="photo"><img src="${esc(ASSETS.placeholder || '')}" alt="${esc(alt)}" loading="lazy"><span class="photo-fallback" aria-hidden="true">Image unavailable</span></span>`;
function photo(tile, alt, opts = {}) {
  const { label = !PROD, mode = 'meet' } = opts;
  // A missing sprite, a failed sprite load or a record without a usable tile shows the placeholder instead of a broken image.
  if (imageFailed || !ASSETS.equipment || !Number.isInteger(tile) || tile < 0 || tile > 5) return photoPlaceholder(alt);
  const x = (tile % 3) * 512, y = Math.floor(tile / 3) * 512;
  return `<span class="photo"><svg viewBox="${x} ${y} 512 512" role="img" aria-label="${esc(alt)}" preserveAspectRatio="xMidYMid ${mode}"><image width="1536" height="1024" href="${esc(ASSETS.equipment)}"/></svg>${label ? '<span class="photo-label">Representative image</span>' : ''}</span>`;
}
const crumb = items => `<nav class="breadcrumb" aria-label="Breadcrumb"><a href="#/">Home</a>${items.map(([n, u]) => `<span aria-hidden="true">/</span>${u ? `<a href="${u}">${esc(n)}</a>` : `<span aria-current="page">${esc(n)}</span>`}`).join('')}</nav>`;
const notice = (html, type = '') => `<div class="notice ${type}">${html}</div>`;
const demoNotice = html => PROD ? '' : notice(html);

function priceBlock(p, size = 'card') {
  const state = priceState(p);
  if (state === 'quote') {
    return `<div class="product-price" data-price-state="quote">Request Price<span class="price-note">Quotation required · availability to confirm</span></div>`;
  }
  if (state === 'unavailable') {
    return `<div class="product-price" data-price-state="unavailable">Price not available<span class="price-note">Contact us to confirm price and availability</span></div>`;
  }
  const note = isDemoPrice(p) ? 'Demonstration price · not a sales offer' : 'Taxes and delivery confirmed by quotation';
  return `<div class="product-price" data-price-state="priced">${money(p.price)}<span class="price-note">${note}</span></div>`;
}
function recordTag(p) {
  if (PROD) return '';
  return p.evidenceStatus === 'sourced'
    ? `<span class="tag sourced record-tag">Reference product</span>`
    : `<span class="tag illustrative record-tag">Illustrative product</span>`;
}
// Real photographs (image.src) are used when a record has one; otherwise the category sprite tile; otherwise a placeholder.
const PHOTO_SRC = /^(assets\/|https:\/\/)[\w\-./%]+$/i;
function productPhoto(p, alt, opts = {}) {
  const img = p.image || {};
  if (typeof img.src === 'string' && PHOTO_SRC.test(img.src)) {
    return `<span class="photo"><img src="${esc(img.src)}" alt="${esc(alt)}" width="600" height="600" decoding="async" ${opts.eager ? '' : 'loading="lazy"'} data-photo-src></span>`;
  }
  return photo(img.tile, alt, { label: false, mode: 'slice' });
}
function card(p, opts) {
  const { heading = 'h2', eager = false } = opts && typeof opts === 'object' ? opts : {};
  const h = heading === 'h3' ? 'h3' : 'h2', name = p.name || 'Product';
  const stock = Object.prototype.hasOwnProperty.call(p, 'stock') && p.stock !== undefined && p.stock !== null && p.stock !== '';
  const whatsapp = validNumber()
    ? `<a class="btn wa sm" href="https://wa.me/${WHATSAPP}?text=${encodeURIComponent(generalMessage())}" target="_blank" rel="noopener noreferrer">${icon('wa')} WhatsApp</a>`
    : `<button type="button" class="btn wa sm" data-general-wa>${icon('wa')} WhatsApp</button>`;
  return `<article class="product-card" data-product-id="${p.id}">
    <a href="#/product/${p.id}" class="product-media" aria-label="View ${esc(name)}">${productPhoto(p, p.alt || name, { eager })}${recordTag(p)}</a>
    <div class="product-content">
      <${h}><a href="#/product/${p.id}">${esc(name)}</a></${h}>
      ${p.sku ? `<p class="product-sku">SKU: ${esc(p.sku)}</p>` : ''}
      ${stock ? `<p class="product-stock">Stock status: ${esc(p.stock)}</p>` : ''}
      ${priceBlock(p)}
      <div class="card-actions">
        <a class="btn sm" href="#/product/${p.id}">View details</a>
        ${whatsapp}
      </div>
    </div>
  </article>`;
}
function categoryCard(c) {
  const n = countDept(c.id), subs = c.subcategories.length;
  return `<a href="${shopUrl(c.id)}" class="category-card">${photo(c.imageTile, `${c.name} equipment`, { label: false, mode: 'slice' })}<div class="category-caption"><div><h3>${esc(c.name)}</h3><span>${subs} ${subs === 1 ? 'subcategory' : 'subcategories'}${n ? ` · ${n} ${n === 1 ? 'product' : 'products'}` : ''}</span></div><span class="round-arrow">${icon('arrow')}</span></div></a>`;
}
function contactLine(value, pending) { return value ? esc(value) : `<span class="muted">${esc(pending)}</span>`; }
const PENDING = (CONFIG.placeholders && CONFIG.placeholders.contactPending) || 'To be supplied';

/* ---------------------------------------------------------------- 3b. Shell: category menu, mobile drawer, footer */
const NAV_LINKS = [['#/', 'Home', 'home'], ['#/about', 'About Us', 'about'], ['#/shop', 'Shop', 'shop'], ['#/business', 'Business & Bulk Order', 'business'], ['#/contact', 'Contact', 'contact']];
const safeUrl = u => /^https:\/\/[^\s"'<>]+$/i.test(String(u || ''));
const menuLink = (c, s, cls = '', label = '') => `<a href="${shopUrl(c.id, s ? s.id : '')}"${cls ? ` class="${cls}"` : ''} data-menu-category="${c.id}"${s ? ` data-menu-sub="${s.id}"` : ''}>${esc(label || (s ? s.name : c.name))}</a>`;
function categoryMenuHTML() {
  return `<div class="category-menu-head"><a href="#/shop" class="menu-all">Browse all products ${icon('arrow')}</a></div>
  <div class="category-columns">${CATEGORIES.map(c => `<div class="category-group">${menuLink(c, null, 'category-title')}<ul aria-label="${esc(c.name)} subcategories">${c.subcategories.map(sc => `<li>${menuLink(c, sc)}</li>`).join('')}</ul></div>`).join('')}</div>`;
}
function drawerHTML() {
  return `<div class="nav-drawer-head"><span class="nav-drawer-title">Menu</span><button type="button" class="nav-drawer-close" aria-label="Close menu">${icon('close')}</button></div>
  <div class="nav-drawer-body"><nav aria-label="Mobile navigation">
    <ul class="drawer-links">
      ${NAV_LINKS.slice(0, 2).map(([href, name, key]) => `<li><a href="${href}" data-nav-drawer="${key}">${name}</a></li>`).join('')}
      <li><details class="drawer-category-nav"><summary id="drawer-category-toggle" data-nav-drawer="categories">Categories</summary><div class="drawer-accordion" role="group" aria-label="Product categories">${CATEGORIES.map(c => `<details data-menu-category="${c.id}"><summary>${esc(c.name)}</summary><ul><li>${menuLink(c, null, 'drawer-all', `All ${c.name}`)}</li>${c.subcategories.map(sc => `<li>${menuLink(c, sc)}</li>`).join('')}</ul></details>`).join('')}</div></details></li>
      ${NAV_LINKS.slice(2).map(([href, name, key]) => `<li><a href="${href}" data-nav-drawer="${key}">${name}</a></li>`).join('')}
    </ul>
  </nav></div>
  <div class="nav-drawer-foot"><button type="button" class="btn wa solid block" data-general-wa>${icon('wa')} Enquire on WhatsApp</button></div>`;
}
function buildFooter() {
  const list = document.getElementById('footer-contact');
  if (list) {
    const items = [];
    if (validNumber()) items.push(['WhatsApp', `<a href="https://wa.me/${WHATSAPP}">+${esc(WHATSAPP)}</a>`]);
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(CONFIG.emailAddress || '')) items.push(['Email', `<a href="mailto:${esc(CONFIG.emailAddress)}">${esc(CONFIG.emailAddress)}</a>`]);
    if (CONFIG.phoneNumber) items.push(['Phone', esc(CONFIG.phoneNumber)]);
    if (safeUrl(CONFIG.facebookUrl)) items.push(['Facebook', `<a href="${esc(CONFIG.facebookUrl)}" target="_blank" rel="noopener noreferrer">${esc(CONFIG.facebookName || CONFIG.facebookUrl)}</a>`]);
    if (safeUrl(CONFIG.websiteUrl)) items.push(['Website', `<a href="${esc(CONFIG.websiteUrl)}">${esc(CONFIG.websiteName || CONFIG.websiteUrl)}</a>`]);
    if (CONFIG.physicalAddress) items.push(['Address', esc(CONFIG.physicalAddress)]);
    if (CONFIG.operatingHours) items.push(['Hours', esc(CONFIG.operatingHours)]);
    list.innerHTML = items.map(([label, value]) => `<li><span class="footer-contact-label">${label}</span>${value}</li>`).join('');
    list.hidden = !items.length;
  }
  // Policy pages still carry the owner-approval placeholder, so say so wherever they are linked.
  if ((CONFIG.placeholders || {}).policyPending) document.querySelectorAll('[data-policy-link]').forEach(a => a.insertAdjacentHTML('beforeend', ' <span class="link-note">Draft</span>'));
}
function buildShell() {
  const menu = document.getElementById('category-menu'); if (menu) menu.innerHTML = categoryMenuHTML();
  const drawer = document.getElementById('nav-drawer'); if (drawer) drawer.innerHTML = drawerHTML();
  buildFooter();
}
const deptPanel = () => document.getElementById('category-menu');
const deptMenuOpen = () => { const p = deptPanel(); return !!p && !p.hidden; };
// Keep the dropdown inside the viewport: it scrolls internally instead of running off the page.
function fitDeptMenu() {
  const p = deptPanel(); if (!p || p.hidden) return;
  p.style.maxHeight = '';
  p.style.maxHeight = Math.max(160, innerHeight - p.getBoundingClientRect().top - 16) + 'px';
}
function setDeptMenu(open, returnFocus = false) {
  const p = deptPanel(), toggle = document.getElementById('categories-toggle');
  if (!p || !toggle) return;
  p.hidden = !open; toggle.setAttribute('aria-expanded', String(open));
  if (open) fitDeptMenu(); else p.style.maxHeight = '';
  if (!open && returnFocus) toggle.focus();
}
function openNav() {
  const d = document.getElementById('nav-drawer'); if (!d || d.open) return;
  setDeptMenu(false);
  d.showModal();
  document.getElementById('menu-button').setAttribute('aria-expanded', 'true');
}
function closeNav() { const d = document.getElementById('nav-drawer'); if (d && d.open) d.close(); }
// Mark the current page/category in both menus.
function syncNav(route) {
  const sel = route.parts[0] === 'shop' ? selection(route) : { category: '', subcategory: '' };
  const drawerCategories = document.querySelector('#drawer-category-toggle')?.closest('details');
  if (drawerCategories) drawerCategories.open = !!sel.category;
  document.querySelectorAll('[data-menu-category]').forEach(el => {
    if (el.tagName === 'DETAILS') { el.open = !!sel.category && el.dataset.menuCategory === sel.category; return; }
    const on = !!sel.category && el.dataset.menuCategory === sel.category && (el.dataset.menuSub || '') === (sel.subcategory || '');
    if (on) el.setAttribute('aria-current', 'page'); else el.removeAttribute('aria-current');
  });
}

/* ---------------------------------------------------------------- 4. Home */
// Product rows come only from real catalogue data: featured, best-seller and dated records when present, then category rows.
// A product appears once on the page, a row needs at least two products, and there are never more than four rows.
const HOME_MAX_ROWS = 4, HOME_ROW_SIZE = 4;
function homeRows() {
  const shown = new Set(), rows = [];
  const usable = PRODUCTS.filter(p => p && p.id && p.name);
  const add = (id, title, list, href, more) => {
    if (rows.length >= HOME_MAX_ROWS) return;
    const items = list.filter(p => !shown.has(p.id)).slice(0, HOME_ROW_SIZE);
    if (items.length < 2) return;
    items.forEach(p => shown.add(p.id));
    rows.push({ id, title, items, href, more });
  };
  add('home-featured', 'Featured Products', usable.filter(p => p.featured), '#/shop', 'Browse all products');
  add('home-best-sellers', 'Best Sellers', usable.filter(p => p.bestSeller === true), '#/shop', 'Browse all products');
  add('home-arrivals', 'New Arrivals', usable.filter(p => p.dateAdded).sort((a, b) => String(b.dateAdded).localeCompare(String(a.dateAdded))), '#/shop', 'Browse all products');
  CATEGORIES.forEach(c => add(`home-dept-${c.id}`, c.name, usable.filter(p => inDept(p, c.id)), shopUrl(c.id), 'View all'));
  return rows;
}
function home() {
  const rows = homeRows();
  const subCount = CATEGORIES.reduce((n, c) => n + c.subcategories.length, 0);
  // Every statement below is stated elsewhere in this site's own copy or computed from the catalogue; nothing is promised beyond that.
  const trust = [
    ['grid', `${CATEGORIES.length} categories and ${subCount} subcategories in one catalogue`],
    validNumber() ? ['wa', 'Send product enquiries on WhatsApp'] : null,
    ['message', 'Prices, availability and taxes are confirmed by quotation'],
    ['truck', 'Delivery details are confirmed per enquiry']
  ].filter(Boolean);
  const productRow = (row, index) => `<section class="home-product-section" aria-labelledby="${row.id}">
    <div class="home-section-head"><h2 id="${row.id}">${esc(row.title)}</h2><a href="${row.href}">${row.more}${row.more === 'View all' ? `<span class="sr-only"> ${esc(row.title)}</span>` : ''}</a></div>
    <div class="product-grid home-product-grid">${row.items.map(p => card(p, { heading: 'h3', eager: index === 0 })).join('')}</div>
  </section>`;
  return `
  <section class="home-hero" aria-labelledby="home-title">
    <h1 id="home-title">Power your home. Equip your business.</h1>
    <p>Solar and backup power, water solutions, electricals, farm equipment, construction and workshop tools.</p>
    <div class="home-hero-actions"><a class="btn light" href="#/shop">Shop products</a><a class="btn outline-light" href="#/business">Request a quote</a></div>
  </section>
  <section class="home-categories" aria-labelledby="home-categories-title">
    <div class="home-section-head"><h2 id="home-categories-title">shop by category</h2></div>
    <div class="category-grid">${CATEGORIES.map(categoryCard).join('')}</div>
  </section>
  ${rows.map(productRow).join('')}
  <section class="home-trust-strip" aria-label="Service information">
    ${trust.map(([ic, text]) => `<div>${icon(ic)}<span>${esc(text)}</span></div>`).join('')}
  </section>
  <section class="home-cta-band band" aria-labelledby="home-cta-title">
    <div><h2 id="home-cta-title">Need a quotation or a bulk order?</h2><p>Send your equipment list, quantities and destination. Pricing, delivery and payment terms are confirmed in writing; an enquiry is not an order.</p></div>
    <div class="band-actions"><a class="btn light" href="#/business">Request a quote ${icon('arrow')}</a><button type="button" class="btn wa solid" data-general-wa>${icon('wa')} ${validNumber() ? 'Enquire on WhatsApp' : 'Prepare a WhatsApp enquiry'}</button><a class="btn outline-light" href="#/contact">Contact us</a></div>
  </section>`;
}

/* ---------------------------------------------------------------- 4b. Shop listing */
function current() {
  const raw = location.hash.replace(/^#\/?/, '') || '';
  const [path, query = ''] = raw.split('?');
  return { parts: path.split('/').filter(Boolean), params: new URLSearchParams(query), path };
}
const SORTS = ['relevance', 'featured', 'newest', 'az', 'za', 'price-asc', 'price-desc'];
const validSort = (s, q) => SORTS.includes(s) && !(s === 'relevance' && !q) && !(s === 'newest' && !HAS_DATES);
const defaultSort = sel => sel.q ? 'relevance' : 'featured';
const sortOf = sel => sel.sort || defaultSort(sel);
// Filters come only from fields present in the catalogue records. A filter is offered only when it can separate the current results.
const FACETS = [
  { key: 'pricing', legend: 'Pricing', values: p => { const s = priceState(p); return s === 'priced' ? ['priced'] : s === 'quote' ? ['quote'] : []; }, label: v => v === 'priced' ? (PROD ? 'Priced products' : 'Priced (demonstration prices)') : 'Request Price' },
  { key: 'application', legend: 'Application', values: p => Array.isArray(p.applications) ? p.applications.filter(Boolean) : [], label: v => v },
  { key: 'power', legend: 'Power source', values: p => p.power ? [p.power] : [], label: v => v }
];
function selection(route) {
  const g = k => route.params.get(k) || '';
  let category = g('category'), subcategory = g('subcategory');
  if (subcategory) { const s = subOf(subcategory); if (s) category = s.category.id; else subcategory = ''; }
  if (category && !cat(category)) category = '';
  const q = g('q'), pricing = g('pricing') === 'demo' ? 'priced' : g('pricing');
  return { category, subcategory, q, power: g('power'), phase: g('phase'), pricing, source: PROD ? '' : g('source'), application: g('application'), sort: validSort(g('sort'), q) ? g('sort') : '', page: Math.max(1, Math.floor(Number(g('page')) || 1)) };
}
// Search results must match only product name and internal SKU.
function searchText(p) {
  return [p.name, p.sku].join(' ').toLowerCase();
}
const queryTerms = q => { const s = String(q || '').trim().toLowerCase(); return s ? s.split(/\s+/) : []; };
// Products matching the selection. `skip` ignores one control ('category', 'subcategory' or a filter key) so that
// option counts show what choosing that option would return.
function scoped(sel, skip = '') {
  const terms = queryTerms(sel.q);
  return PRODUCTS.filter(p => (skip === 'category' || inDept(p, sel.category)) && (skip === 'category' || skip === 'subcategory' || inSub(p, sel.subcategory))
    && (!terms.length || terms.every(t => searchText(p).includes(t)))
    && FACETS.every(f => skip === f.key || !sel[f.key] || f.values(p).includes(sel[f.key]))
    && (!sel.phase || p.phase === sel.phase) && (!sel.source || p.evidenceStatus === sel.source));
}
function relevance(p, query, terms) {
  const name = String(p.name || '').toLowerCase(), sku = String(p.sku || '').toLowerCase();
  let score = 0;
  if (sku && sku === query) score += 100;
  if (name === query) score += 90;
  if (name.startsWith(query)) score += 60; else if (name.includes(query)) score += 40;
  if (sku && sku.includes(query)) score += 30;
  terms.forEach(t => { if (new RegExp(`(^|[^a-z0-9])${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(name)) score += 5; });
  return score + (p.featured ? 1 : 0);
}
function filtered(sel) {
  const rows = scoped(sel), sort = sortOf(sel), name = p => String(p.name || '');
  const byName = (a, b) => name(a).localeCompare(name(b));
  const byPrice = dir => (a, b) => { const x = hasPrice(a), y = hasPrice(b); return x ? (y ? dir * (a.price - b.price) || byName(a, b) : -1) : (y ? 1 : byName(a, b)); };
  if (sort === 'az') rows.sort(byName);
  else if (sort === 'za') rows.sort((a, b) => byName(b, a));
  else if (sort === 'price-asc') rows.sort(byPrice(1));
  else if (sort === 'price-desc') rows.sort(byPrice(-1));
  else if (sort === 'newest' && HAS_DATES) rows.sort((a, b) => String(b.dateAdded || '').localeCompare(String(a.dateAdded || '')) || byName(a, b));
  else if (sort === 'relevance' && sel.q) { const query = String(sel.q).trim().toLowerCase(), terms = queryTerms(sel.q); rows.sort((a, b) => relevance(b, query, terms) - relevance(a, query, terms) || byName(a, b)); }
  else rows.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  return rows;
}
// Drop a filter value that would return nothing after the category or subcategory changed.
function dropEmptyFilters(sel) {
  FACETS.forEach(f => { if (sel[f.key] && !scoped(sel, f.key).some(p => f.values(p).includes(sel[f.key]))) sel[f.key] = ''; });
  if (sel.phase && !scoped(sel, 'phase-none').some(p => p.phase === sel.phase)) sel.phase = '';
}
const activeFilterCount = sel => ['category', 'subcategory', 'power', 'phase', 'pricing', 'application', 'source'].filter(k => sel[k]).length - (sel.category && sel.subcategory ? 1 : 0);
function pageList(page, pages) {
  if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
  const keep = new Set([1, pages, page - 1, page, page + 1]);
  if (page <= 3) [2, 3, 4].forEach(n => keep.add(n));
  if (page >= pages - 2) [pages - 1, pages - 2, pages - 3].forEach(n => keep.add(n));
  const list = [...keep].filter(n => n >= 1 && n <= pages).sort((a, b) => a - b), out = [];
  list.forEach((n, i) => { if (i && n - list[i - 1] > 1) out.push('…'); out.push(n); });
  return out;
}
// The URL a shop route should have: invalid, mismatched or out-of-range values are corrected so the page and its URL agree.
function canonicalShop(route) {
  const sel = selection(route), pages = Math.max(1, Math.ceil(filtered(sel).length / PAGE_SIZE));
  sel.page = Math.min(pages, sel.page);
  const url = makeUrl('shop', sel), want = new URLSearchParams(url.split('?')[1] || '');
  return ['category', 'subcategory', 'q', 'power', 'phase', 'pricing', 'source', 'application', 'sort', 'page'].some(k => (route.params.get(k) || '') !== (want.get(k) || '')) ? url : '';
}
function chips(sel) {
  const list = [];
  const c = cat(sel.category), s = subOf(sel.subcategory);
  if (sel.q) list.push(['q', `Search: “${sel.q}”`]);
  if (c) list.push(['category', c.name]);
  if (s) list.push(['subcategory', s.name]);
  if (sel.power) list.push(['power', sel.power]);
  if (sel.phase) list.push(['phase', sel.phase]);
  if (sel.pricing) list.push(['pricing', sel.pricing === 'priced' ? (PROD ? 'Priced products' : 'Demonstration prices') : 'Request Price']);
  if (sel.application) list.push(['application', sel.application]);
  if (sel.source) list.push(['source', sel.source === 'sourced' ? 'Reference products' : 'Illustrative products']);
  if (!list.length) return '';
  return `<div class="chips" aria-label="Active filters">${list.map(([k, n]) => `<button type="button" class="chip" data-remove-filter="${k}" aria-label="Remove filter ${esc(n)}"><span>${esc(n)}</span>${icon('close')}</button>`).join('')}<button type="button" class="clear-all" data-clear-filters>Clear all</button></div>`;
}
function emptyState(sel) {
  if (!PRODUCTS.length) return `<div class="empty"><h2>The catalogue is being prepared</h2><p>No products are published yet. Send an enquiry and describe the equipment you need.</p><div class="actions"><a class="btn" href="#/business">Request a quote</a><a class="btn secondary" href="#/contact">Contact us</a></div></div>`;
  const filtersOn = activeFilterCount(sel) > 0;
  const msg = sel.q ? `No products match “${esc(sel.q)}”${filtersOn ? ' with the selected filters' : ''}.` : 'No products match the selected filters.';
  const depts = CATEGORIES.filter(cc => PRODUCTS.some(p => inDept(p, cc.id)));
  return `<div class="empty"><h2>No matching products</h2><p>${msg}</p>${sel.q ? '<p class="small">Search looks at product names and SKUs. Check the spelling or try a shorter term.</p>' : ''}
    <div class="actions">${sel.q ? '<button type="button" class="btn secondary" data-remove-filter="q">Clear search</button>' : ''}${filtersOn ? '<button type="button" class="btn secondary" data-clear-filters-keep-search>Clear filters</button>' : ''}<a class="btn" href="#/shop">Browse all products</a></div>
    <nav class="empty-links" aria-label="Browse by category"><span>Browse by category:</span>${depts.map(cc => `<a href="${shopUrl(cc.id)}">${esc(cc.name)}</a>`).join('')}</nav>
    <p class="small">Cannot find what you need? <a href="#/business">Request a quote</a> or <button type="button" class="link-button" data-general-wa>ask on WhatsApp</button>.</p></div>`;
}
function listing(route) {
  const sel = selection(route), c = cat(sel.category), s = subOf(sel.subcategory);
  const rows = filtered(sel), pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const page = Math.min(pages, sel.page), start = (page - 1) * PAGE_SIZE, sort = sortOf(sel);
  const facetOnly = !c && !s && !sel.q && sel.application;
  const title = sel.q ? 'Search results' : s ? s.name : c ? c.name : facetOnly ? sel.application : 'Shop';
  const breadcrumbs = [['Shop', (c || s || sel.q) ? '#/shop' : null]];
  if (c) breadcrumbs.push([c.name, (s || sel.q) ? shopUrl(c.id) : null]);
  if (s) breadcrumbs.push([s.name, sel.q ? shopUrl(c.id, s.id) : null]);
  if (sel.q) breadcrumbs.push(['Search results']);
  if (facetOnly) breadcrumbs.push([sel.application]);
  const intro = s ? `Products in ${s.name}, part of ${c.name}.` : c ? `${c.intro} ${c.advice}` : 'Browse the full catalogue or search by product name or SKU.';
  const sortOptions = [...(sel.q ? [['relevance', 'Best match']] : []), ['featured', 'Featured'], ...(HAS_DATES ? [['newest', 'Newest']] : []), ['az', 'Name: A–Z'], ['za', 'Name: Z–A'], ['price-asc', 'Price: low to high'], ['price-desc', 'Price: high to low']];
  const summary = rows.length
    ? `<span class="result-count" role="status">${rows.length} ${rows.length === 1 ? 'product' : 'products'} <small>· showing ${start + 1}–${Math.min(start + PAGE_SIZE, rows.length)}${pages > 1 ? ` · page ${page} of ${pages}` : ''}</small></span>`
    : `<span class="result-count" role="status">0 products</span>`;
  const grid = rows.length ? rows.slice(start, start + PAGE_SIZE).map(p => card(p)).join('') : emptyState(sel);
  const pagination = pages > 1 ? `<nav class="pagination" aria-label="Catalogue pages"><button type="button" data-page="${page - 1}" aria-label="Previous page" ${page === 1 ? 'disabled' : ''}>Previous</button>${pageList(page, pages).map(n => n === '…' ? '<span aria-hidden="true">…</span>' : `<button type="button" data-page="${n}" ${page === n ? 'aria-current="page"' : ''} aria-label="Page ${n}">${n}</button>`).join('')}<button type="button" data-page="${page + 1}" aria-label="Next page" ${page === pages ? 'disabled' : ''}>Next</button></nav>` : '';
  return crumb(breadcrumbs) + `
  ${sel.q ? `<section class="search-results-summary" aria-labelledby="search-results-title"><h1 id="search-results-title">Search results for “${esc(sel.q)}”</h1>${summary}</section>` : `<section class="page-intro"><h1>${esc(title)}</h1><p>${esc(intro)}</p></section>`}
  ${demoNotice('Demonstration catalogue: reference products come from cited retailer listings and illustrative products are unverified examples. Images are representative category visuals, not exact-model photographs.')}
  <div class="catalog-layout">
    <div class="catalog-main">
      <div class="toolbar">
        <div class="toolbar-left">${sel.q ? '' : summary}</div>
        <div class="toolbar-right">
          <label for="sort-products">Sort <select id="sort-products" data-filter="sort">${sortOptions.map(([v, n]) => `<option value="${v}" ${v === sort ? 'selected' : ''}>${n}</option>`).join('')}</select></label>
          <div class="view-toggle" role="group" aria-label="View"><button type="button" data-view="grid" aria-pressed="${viewMode === 'grid'}" aria-label="Grid view">${icon('grid')}</button><button type="button" data-view="list" aria-pressed="${viewMode === 'list'}" aria-label="List view">${icon('list')}</button></div>
        </div>
      </div>
      ${chips(sel)}
      <div class="product-grid ${viewMode === 'list' ? 'list' : ''}" id="results">${grid}</div>
      ${pagination}
      ${['price-asc', 'price-desc'].includes(sort) && rows.some(p => !hasPrice(p)) ? '<p class="small muted">Products without a listed price (Request Price) appear after priced products.</p>' : ''}
    </div>
  </div>`;
}

/* ---------------------------------------------------------------- 5. Product detail */
function specTable(p) { return `<table class="spec-table"><tbody>${Object.entries(p.specs).map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')}</tbody></table>`; }
function technical(p) { return `<div class="technical-card">${icon('layers')}<h3>${esc(p.name)}</h3><p>${esc(Object.entries(p.specs).slice(0, 3).map(([k, v]) => `${k}: ${v}`).join(' · '))}</p><span class="tag">Specification overview · not a photograph</span></div>`; }
function galleryItem(p, i) { const g = p.gallery[i] || p.gallery[0]; return g.type === 'spec' ? technical(p) : photo(g.tile, p.alt); }
function relatedTo(p) {
  const explicit = (p.related || []).map(product).filter(Boolean);
  if (explicit.length) return explicit.slice(0, 4);
  const sameSub = PRODUCTS.filter(x => x.id !== p.id && x.subcategories.some(s => p.subcategories.includes(s)));
  const sameDept = PRODUCTS.filter(x => x.id !== p.id && !sameSub.includes(x) && x.categories.some(d => p.categories.includes(d)));
  return [...sameSub, ...sameDept].slice(0, 4);
}
function detail(p) {
  activeTab = 'description'; galleryIndex = 0;
  const c = primaryCat(p), s = primarySub(p), related = relatedTo(p);
  const otherAssignments = p.subcategories.slice(1).map(subOf).filter(Boolean);
  const ident = [p.model ? `<strong>Model:</strong> ${esc(p.model)}` : '', p.sku ? `<strong>SKU:</strong> ${esc(p.sku)}` : '', p.brand ? `<strong>Brand:</strong> ${esc(p.brand)}${PROD ? '' : ' <span class="small">(retailer-listed)</span>'}` : ''].filter(Boolean);
  return crumb([['Shop', '#/shop'], [c.name, shopUrl(c.id)], [s.name, shopUrl(c.id, s.id)], [p.name]]) + `
  <div class="product-detail">
    <div>
      <button type="button" class="gallery-main" id="gallery-main" data-enlarge="${p.id}" aria-label="Enlarge image of ${esc(p.name)}"><span class="zoom-hint">${icon('zoom')}</span><span id="gallery-content">${galleryItem(p, 0)}</span></button>
      <p class="gallery-caption">${PROD ? 'Tap or click the image to enlarge.' : 'Representative category image; exact product photography is pending. Tap or click to enlarge.'}</p>
      <div class="thumbnails" role="group" aria-label="Product gallery">${p.gallery.map((g, i) => `<button type="button" class="thumb" data-gallery="${i}" data-id="${p.id}" aria-pressed="${i === 0}" aria-label="Show ${esc(g.label)}">${g.type === 'spec' ? '<span>Spec<br>overview</span>' : photo(g.tile, p.alt, { label: false })}</button>`).join('')}</div>
    </div>
    <div class="detail-copy">
      <span class="cat-name"><a href="${shopUrl(c.id)}">${esc(c.name)}</a> · <a href="${shopUrl(c.id, s.id)}">${esc(s.name)}</a></span>
      <h1>${esc(p.name)}</h1>
      <p class="model">${ident.length ? ident.join(' · ') : (PROD ? 'Model confirmed on enquiry' : 'Supplier SKU: pending verification')}</p>
      ${PROD ? '' : `<span class="tag ${p.evidenceStatus}">${p.evidenceStatus === 'sourced' ? 'Reference product · retailer-listed' : 'Illustrative product · not a verified offer'}</span>`}
      ${priceBlock(p, 'detail')}
      ${hasPrice(p) && !PROD ? notice('Demonstration price only. It is not a NYCE SOLUTIONS sales price; request a quotation for a confirmed amount.', 'warn') : ''}
      <p>${esc(p.shortDescription)}</p>
      <div class="spec-preview">${Object.entries(p.specs).slice(0, 4).map(([k, v]) => `<div><small>${esc(k)}</small><strong>${esc(v)}</strong></div>`).join('')}</div>
      <h3 class="small" style="font-size:13px;margin:0">Intended applications</h3>
      <ul class="applications-inline">${p.applications.map(a => `<li><a href="${makeUrl('shop', { application: a })}">${esc(a)}</a></li>`).join('')}</ul>
      <div class="qty-line"><label for="detail-qty">Quantity</label>${quantity(1, 'detail-qty')}</div>
      <div class="detail-actions">
        ${hasPrice(p) ? `<button type="button" class="btn" data-add="${p.id}">${icon('cart')} Add to Cart</button>` : `<button type="button" class="btn" data-quote="${p.id}">Request a Quote ${icon('arrow')}</button>`}
        <button type="button" class="btn wa solid" data-wa="${p.id}" data-detail="true">${icon('wa')} Enquire on WhatsApp</button>
      </div>
      <p class="small muted" style="margin-top:12px">Availability, taxes, transport and support scope are confirmed by quotation. An enquiry is not an order.</p>
      ${otherAssignments.length ? `<p class="small muted">Also listed under: ${otherAssignments.map(o => `<a href="${shopUrl(o.category.id, o.id)}">${esc(o.name)}</a>`).join(', ')}</p>` : ''}
    </div>
  </div>
  <div class="tabs" role="tablist" aria-label="Product information">
    <button type="button" id="tab-description" role="tab" aria-selected="true" aria-controls="panel-description" data-tab="description">Description</button>
    <button type="button" id="tab-specifications" role="tab" aria-selected="false" aria-controls="panel-specifications" tabindex="-1" data-tab="specifications">Specifications</button>
    <button type="button" id="tab-delivery" role="tab" aria-selected="false" aria-controls="panel-delivery" tabindex="-1" data-tab="delivery">Delivery &amp; Support</button>
  </div>
  <section class="tab-panel" role="tabpanel" id="panel-description" aria-labelledby="tab-description" tabindex="0">
    <h2>About this product</h2><p>${esc(p.description)}</p>
    <h3>Intended applications</h3><ul>${p.applications.map(a => `<li>${esc(a)} — final suitability depends on your requirements and the selected specification.</li>`).join('')}</ul>
    ${PROD ? '' : p.evidenceStatus === 'sourced'
      ? `<p>Product identity and the listed fields were checked against a retailer listing${p.sourceChecked ? ` on ${esc(p.sourceChecked)}` : ''}. This is not manufacturer certification or evidence of NYCE SOLUTIONS stock. The source reference is recorded in the internal source register.</p>`
      : '<p>This unbranded example illustrates the category. Specifications and pricing are illustrative and need owner approval before publication.</p>'}
  </section>
  <section class="tab-panel" role="tabpanel" id="panel-specifications" aria-labelledby="tab-specifications" tabindex="0" hidden>
    <h2>Key specifications</h2>${specTable(p)}
    ${PROD ? '' : notice(p.evidenceStatus === 'sourced' ? 'Retailer-listed fields only. Confirm against the manufacturer datasheet before purchase.' : 'Illustrative planning fields, not a verified model specification.')}
  </section>
  <section class="tab-panel" role="tabpanel" id="panel-delivery" aria-labelledby="tab-delivery" tabindex="0" hidden>
    <h2>Delivery &amp; support</h2>
    <p>${esc((CONFIG.placeholders && CONFIG.placeholders.deliveryStatement) || 'Delivery is confirmed per enquiry.')} Share your quantity, town or county and required timing in your enquiry.</p>
    <p>Warranty terms, installation and after-sales support are confirmed in writing for the specific product. Request the applicable terms with your quotation.</p>
    <button type="button" class="btn secondary" data-quote="${p.id}">Ask for a quotation</button>
  </section>
  ${related.length ? `<section class="section"><div class="section-head"><div><h2>Related equipment</h2><p>More from ${esc(c.name)}.</p></div><a class="text-link" href="${shopUrl(c.id)}">View category ${icon('arrow')}</a></div><div class="product-grid">${related.map(card).join('')}</div></section>` : ''}`;
}
function quantity(value, id, kind = 'detail') {
  const label = kind.startsWith('cart:') ? ` for ${esc(product(kind.slice(5)).name)}` : '';
  return `<div class="qty-control"><button type="button" data-qty-step="-1" data-for="${id}" aria-label="Decrease quantity${label}">−</button><input id="${id}" data-qty-kind="${kind}" type="number" inputmode="numeric" min="1" max="${MAX_QTY}" step="1" value="${value}" aria-label="Quantity${label}"><button type="button" data-qty-step="1" data-for="${id}" aria-label="Increase quantity${label}">+</button></div>`;
}
function validQty(input) {
  const v = Number(input.value);
  if (!Number.isInteger(v) || v < 1 || v > MAX_QTY) { input.setCustomValidity(`Enter a whole number from 1 to ${MAX_QTY}.`); input.reportValidity(); return null; }
  input.setCustomValidity(''); return v;
}

/* ---------------------------------------------------------------- 6. Business, Contact, About, Cart, Checkout, Policies */
const TOPICS = ['Product information', 'Quotation request', 'Home Backup Power', 'Farm & Irrigation', 'Construction & Workshop', 'Business / institutional purchase', 'Delivery enquiry', 'Support information'];
function field(id, label, control, hint = '', full = false) {
  return `<div class="field ${full ? 'full' : ''}" data-field="${id}"><label for="${id}">${label}</label>${control}${hint ? `<small>${hint}</small>` : ''}<span class="error" id="${id}-error" aria-live="polite"></span></div>`;
}
function enquiryForm(type, params) {
  const p = product(params.get('product')), isBusiness = type === 'business';
  let equipment = p ? `${p.name}${p.model ? ` · Model ${p.model}` : ''}${p.sku ? ` · SKU ${p.sku}` : ''}\nProduct link: ${productURL(p)}` : '';
  if (params.get('from') === 'cart' && cartCount()) equipment = cartSummary();
  let q = Number(params.get('qty') || 1); if (!Number.isInteger(q) || q < 1) q = 1;
  const topic = params.get('topic') || (isBusiness ? 'Quotation request' : '');
  return `<form id="enquiry-form" data-type="${type}" novalidate>
    <div id="form-errors" role="alert" aria-live="assertive"></div>
    <div class="form-grid">
      ${field('enq-name', 'Full name *', '<input id="enq-name" name="name" required autocomplete="name" maxlength="100" aria-describedby="enq-name-error">')}
      ${field('enq-email', 'Email address *', '<input id="enq-email" name="email" type="email" required autocomplete="email" maxlength="150" aria-describedby="enq-email-error">')}
      ${field('enq-company', 'Business / organisation', '<input id="enq-company" name="company" autocomplete="organization" maxlength="150">', 'Optional')}
      ${field('enq-phone', 'Phone / WhatsApp', '<input id="enq-phone" name="phone" type="tel" autocomplete="tel" maxlength="30">', 'Optional, include your country code')}
      ${field('enq-location', 'Town / county and country *', '<input id="enq-location" name="location" required maxlength="150" placeholder="e.g. Nakuru, Kenya" aria-describedby="enq-location-error">', '', !isBusiness)}
      ${isBusiness ? field('enq-qty', 'Quantity *', `<input id="enq-qty" name="quantity" type="number" inputmode="numeric" min="1" max="9999" step="1" required value="${q}" aria-describedby="enq-qty-error">`, 'For several items, list quantities in the equipment list below.') : ''}
      ${field('enq-topic', `${isBusiness ? 'Project / application' : 'Enquiry topic'} *`, `<select id="enq-topic" name="topic" required aria-describedby="enq-topic-error"><option value="">Select a topic</option>${TOPICS.map(t => `<option ${t === topic ? 'selected' : ''}>${t}</option>`).join('')}</select>`, '', true)}
      ${field('enq-message', `${isBusiness ? 'Equipment list and requirements' : 'Your message'} *`, `<textarea id="enq-message" name="message" required minlength="10" maxlength="4000" placeholder="Include equipment, quantities, specifications and your preferred timing." aria-describedby="enq-message-error">${esc(equipment)}</textarea>`, '', true)}
    </div>
    ${PROD ? '' : '<label class="check-label"><input type="checkbox" name="demo" required id="enq-demo"> <span>I understand this is a demonstration: the form prepares a preview and does not send a message.</span></label><span class="error" id="enq-demo-error" style="display:none;color:var(--danger);font-size:12px"></span>'}
    <button class="btn" type="submit">${PROD ? 'Prepare enquiry' : `Preview ${isBusiness ? 'quotation request' : 'enquiry'}`} ${icon('arrow')}</button>
    <p class="small muted" style="margin:12px 0 0">Required fields are marked *. Nothing is sent or saved to a server from this page — the prepared text can be copied or sent on WhatsApp.</p>
    <div id="form-feedback" role="status" aria-live="polite"></div>
  </form>`;
}
function business(params) {
  return crumb([['Business & Bulk Orders']]) + `
  <section class="page-intro"><h1>Business &amp; Bulk Orders</h1><p>Prepare a quotation request for a business, contractor, farm, school, hotel or institutional project. A clear brief gets a faster, more accurate quotation.</p></section>
  <div class="two-col">
    <div>
      <h2>Tell us what the job needs</h2>
      <p class="muted">A useful quotation starts with the equipment, quantities, specifications and destination. Include your preferred timing and any procurement requirements such as proforma invoices or tender documents.</p>
      <ul class="info-list">
        <li>${icon('layers')}<div><strong>Your equipment list</strong><small>Names, models, quantities and acceptable alternatives.</small></div></li>
        <li>${icon('tool')}<div><strong>Your technical requirements</strong><small>Power, capacity, dimensions or a short description of the application.</small></div></li>
        <li>${icon('pin')}<div><strong>Your destination</strong><small>Town, country and site access details where relevant.</small></div></li>
      </ul>
      ${notice('Pricing, delivery, payment terms and any service scope are confirmed in writing. No minimum order or bulk discount is implied.')}
      <div class="actions"><a class="btn secondary" href="#/shop">Browse the catalogue first</a><button type="button" class="btn wa" data-general-wa>${icon('wa')} Ask on WhatsApp</button></div>
    </div>
    <div class="content-panel" id="quote"><h2>Request a quote</h2>${PROD ? '' : '<p class="muted small">Demonstration form · preview and copy only</p>'}${enquiryForm('business', params)}</div>
  </div>`;
}
function contact(params) {
  return crumb([['Contact']]) + `
  <section class="page-intro"><h1>Contact NYCE SOLUTIONS</h1><p>Ask about a product, a delivery destination or the details needed for a quotation.</p></section>
  <div class="two-col">
    <div>
      <h2>How to reach us</h2>
      <ul class="info-list">
        <li>${icon('wa')}<div><strong>WhatsApp</strong><small>${WHATSAPP ? `<a href="https://wa.me/${WHATSAPP}">+${esc(WHATSAPP)}</a>` : `<span class="muted">${esc(PENDING)}</span>`}</small></div></li>
        <li>${icon('phone')}<div><strong>Phone</strong><small>${contactLine(CONFIG.phoneNumber, PENDING)}</small></div></li>
        <li>${icon('mail')}<div><strong>Email</strong><small>${CONFIG.emailAddress ? `<a href="mailto:${esc(CONFIG.emailAddress)}">${esc(CONFIG.emailAddress)}</a>` : contactLine(CONFIG.emailAddress, PENDING)}</small></div></li>
        <li>${icon('pin')}<div><strong>Address</strong><small>${contactLine(CONFIG.physicalAddress, PENDING)}</small></div></li>
        <li>${icon('clock')}<div><strong>Operating hours</strong><small>${contactLine(CONFIG.operatingHours, PENDING)}</small></div></li>
      </ul>
      <button type="button" class="btn wa solid" data-general-wa>${icon('wa')} ${WHATSAPP ? 'Open a WhatsApp enquiry' : 'Preview a WhatsApp enquiry'}</button>
      ${notice('Kenya delivery and enquiries from other African countries are confirmed per enquiry. Cross-border delivery remains an enquiry until coverage and terms are confirmed.')}
    </div>
    <div class="content-panel"><h2>Send an enquiry</h2>${PROD ? '' : '<p class="muted small">Demonstration form · nothing is transmitted</p>'}${enquiryForm('contact', params)}</div>
  </div>`;
}
function about() {
  return crumb([['About Us']]) + `
  <section class="page-intro"><h1>Equipment for the way you live and work</h1><p>NYCE SOLUTIONS brings power, water and practical equipment into one catalogue for homes, farms, businesses and institutions.</p></section>
  <section class="about-grid">${photo(4, 'Workshop tools on a workbench', { mode: 'slice' })}<div>
    <h2>Start with the right questions</h2>
    <p>Whether you are planning home backup power, improving water supply on a farm or equipping a workshop, the details matter: loads, flow and head, cable sizes, fuel and phase.</p>
    <p>Browse six categories, compare the specifications that matter and send an enquiry built around your application. The catalogue serves individual consumers, businesses, electrical contractors, construction companies, farms, schools, hotels and government and institutional buyers in Kenya, with enquiries welcome from other African countries.</p>
    <div class="actions"><a class="btn" href="#/shop">View Full Catalogue ${icon('arrow')}</a><a class="btn secondary" href="#/business">Business &amp; Bulk Orders</a></div>
  </div></section>
  <section class="section"><div class="application-grid">
    <div class="application">${icon('search')}<h3>Find your starting point</h3><p>Browse six categories or search by name and model to find the right equipment.</p></div>
    <div class="application">${icon('layers')}<h3>Compare the essentials</h3><p>Review power, capacity, phase and other relevant details before you ask for a quotation.</p></div>
    <div class="application">${icon('wa')}<h3>Enquire on WhatsApp</h3><p>Every product prepares a message with the product, quantity and link so the conversation starts with the right details.</p></div>
  </div></section>
  ${demoNotice('Company history, legal details, team information and service capabilities have not been supplied. This page makes no claims about those details until the owner provides approved content.')}`;
}
function cartPage() {
  const items = Object.entries(cart);
  return crumb([['Cart']]) + `
  <section class="page-intro"><h1>Cart</h1><p>Adjust quantities and review the subtotal, then send the list as an enquiry. ${PROD ? 'This cart does not reserve stock or place an order; a quotation confirms the final amount.' : 'This is a prototype cart: no order is submitted, no inventory is reserved and no payment is processed.'}</p></section>
  ${items.length ? `<div class="cart-layout">
    <div>${items.map(([id, q]) => { const p = product(id); return `<article class="cart-item" data-cart-id="${id}"><a href="#/product/${id}" aria-label="View ${esc(p.name)}">${photo(p.image.tile, p.alt, { label: false })}</a><div><h3><a href="#/product/${id}">${esc(p.name)}</a></h3><span class="price-note">${money(p.price)} each${isDemoPrice(p) ? ' · demonstration price' : ''}</span><div class="actions" style="gap:8px;align-items:center">${quantity(q, 'cart-qty-' + id, 'cart:' + id)}<button type="button" class="remove" data-remove="${id}">Remove</button></div></div><div class="cart-line-total" data-line-total="${id}">${money(p.price * q)}</div></article>`; }).join('')}
      <div class="actions" style="margin-top:16px"><a class="btn secondary" href="#/shop">Continue shopping</a><button type="button" class="btn secondary" data-clear-cart>Clear cart</button></div>
    </div>
    <aside class="summary" aria-labelledby="summary-heading">
      <h2 id="summary-heading">Summary</h2>
      <p>Items: <strong id="summary-count">${cartCount()}</strong></p>
      <div class="total"><span>Subtotal</span><span id="subtotal">${money(cartTotal())}</span></div>
      <p>Taxes, delivery and other charges are not calculated. This is not a final amount payable.</p>
      <a class="btn" href="#/checkout">Review enquiry summary ${icon('arrow')}</a>
      <a class="btn secondary" href="#/business?from=cart">Request a quotation</a>
      <p style="margin-top:14px">${canStore ? 'Cart items are stored in this browser only.' : 'Browser storage is unavailable; the cart lasts for this open page only.'} No order has been submitted, no inventory has been reserved and no payment has been processed.</p>
    </aside>
  </div>` : `<div class="empty">${icon('cart')}<h2 style="margin-top:12px">Your cart is empty</h2><p>Add a priced product to build an enquiry list, or request a quote for any product.</p><div class="actions"><a class="btn" href="${makeUrl('shop', { pricing: 'demo' })}">Browse priced products ${icon('arrow')}</a><a class="btn secondary" href="#/shop">View Full Catalogue</a></div></div>`}`;
}
function checkoutPage() {
  const items = Object.entries(cart);
  if (!items.length) return crumb([['Cart', '#/cart'], ['Enquiry summary']]) + `<section class="page-intro"><h1>Enquiry summary</h1></section><div class="empty"><h2>Nothing to summarise yet</h2><p>Your cart is empty. Add priced products first.</p><div class="actions"><a class="btn" href="#/shop">View Full Catalogue</a></div></div>`;
  return crumb([['Cart', '#/cart'], ['Enquiry summary']]) + `
  <section class="page-intro"><h1>Enquiry summary</h1><p>This is the prototype checkout step. It prepares an enquiry — it does not place an order, reserve stock or take payment.</p></section>
  ${notice('<strong>No order has been submitted.</strong> No inventory has been reserved and no payment has been processed. Send the list as a WhatsApp enquiry or a quotation request to continue.', 'warn')}
  <div class="data-table-wrap"><table class="data-table"><thead><tr><th scope="col">Item</th><th scope="col">Model / SKU</th><th scope="col">Quantity</th><th scope="col">Unit price</th><th scope="col">Line total</th></tr></thead><tbody>${items.map(([id, q]) => { const p = product(id); return `<tr><td><a href="#/product/${id}">${esc(p.name)}</a></td><td>${esc(p.model || p.sku || '—')}</td><td>${q}</td><td>${money(p.price)}</td><td>${money(p.price * q)}</td></tr>`; }).join('')}</tbody><tfoot><tr><th scope="row" colspan="4">Subtotal${PROD ? '' : ' (demonstration prices)'}</th><td><strong>${money(cartTotal())}</strong></td></tr></tfoot></table></div>
  <p class="muted small">Taxes, delivery and other charges are not calculated. A written quotation confirms the final amount.</p>
  <div class="actions"><button type="button" class="btn wa solid" data-cart-wa>${icon('wa')} Send list on WhatsApp</button><a class="btn" href="#/business?from=cart">Request a quotation</a><a class="btn secondary" href="#/cart">Back to cart</a></div>`;
}
const POLICIES = {
  delivery: ['Delivery information', 'Delivery coverage, transport costs, collection options and lead times are confirmed per enquiry. Send your destination and equipment list to receive delivery details. Cross-border supply remains an enquiry until coverage and terms are confirmed.', 'Coverage areas, carrier arrangements, charges, order cut-offs, collection details, exclusions and cross-border responsibilities.'],
  returns: ['Returns & warranty', 'Returns and warranty terms are confirmed in writing for the specific product. Request the applicable terms before purchase.', 'Eligibility, time limits, exclusions, inspection process, contact channel, refund method and manufacturer warranty documentation.'],
  privacy: ['Privacy policy', 'This site does not submit forms to a server or use analytics or tracking scripts. The cart uses local browser storage where available. Enquiry text you prepare stays in your browser until you copy or send it.', 'Data-controller details, purposes, retention, contact channel, hosting, processors and cookie choices for the production site.'],
  terms: ['Terms of sale', 'No transaction can be completed on this site. Prices shown are indicative; availability, taxes, payment terms and supply conditions are confirmed by written quotation.', 'Legal entity details, approved sales terms, price and tax treatment, payment methods, order acceptance rules and product conditions.']
};
function policyPage(key) {
  const p = POLICIES[key]; if (!p) return notFound();
  const pending = (CONFIG.placeholders && CONFIG.placeholders.policyPending) || 'Owner approval required';
  return crumb([[p[0]]]) + `<section class="page-intro"><h1>${p[0]}</h1></section><div class="policy-card"><span class="tag illustrative">${esc(pending)}</span><p style="margin-top:14px">${p[1]}</p><h3>Still to be confirmed by the business</h3><p class="muted">${p[2]}</p><a class="btn secondary" href="#/contact">Send an enquiry</a></div>`;
}
function notFound(message = 'The address you opened does not exist in this catalogue.') {
  return `<section class="route-error"><h1>Page not found</h1><p class="muted">${esc(message)}</p><div class="actions"><a class="btn" href="#/shop">View Full Catalogue ${icon('arrow')}</a><a class="btn secondary" href="#/">Go to the homepage</a></div></section>`;
}

/* ---------------------------------------------------------------- 7. Router */
const LEGACY = {
  // Old category-directory journey → filtered Shop routes (replaces history entry, so Back works).
  resolve(parts) {
    const [page, dept, sub] = parts;
    if (page === 'categories') return '#/shop';
    if (page === 'category') {
      const c = cat(dept); if (!c) return null;
      if (sub && !c.subcategories.some(s => s.id === sub)) return null;
      return shopUrl(dept, sub || '');
    }
    return undefined;
  }
};
function render() {
  const r = current(), [page, id] = r.parts;
  const legacy = LEGACY.resolve(r.parts);
  if (legacy) { location.replace(legacy); return; }
  if (page === 'shop') { const fix = canonicalShop(r); if (fix) { location.replace(fix); return; } }
  let html = '', active = page || 'home';
  if (!page) html = home();
  else if (page === 'shop') { html = listing(r); const s = selection(r); if (s.category || s.subcategory) active = 'categories'; }
  else if (legacy === null) { html = notFound('That category does not exist. Browse the full catalogue instead.'); active = 'shop'; }
  else if (page === 'product') { const p = product(id); html = p ? detail(p) : notFound(PROD && ALL_PRODUCTS.some(x => x.id === id) ? 'This product is not published yet.' : 'That product does not exist in the catalogue.'); active = 'shop'; }
  else if (page === 'business') html = business(r.params);
  else if (page === 'contact') html = contact(r.params);
  else if (page === 'about') html = about();
  else if (page === 'cart') html = cartPage();
  else if (page === 'checkout') { html = checkoutPage(); active = 'cart'; }
  else if (page === 'policy') html = policyPage(id);
  else if (page === 'guide') html = notFound('The implementation guide has moved out of the customer-facing site. Open docs/implementation-guide.html from the repository.');
  else html = notFound();

  const main = document.getElementById('main');
  main.innerHTML = html;
  document.querySelectorAll('[data-nav], [data-nav-drawer]').forEach(a => { const on = (a.dataset.nav || a.dataset.navDrawer) === active; a.classList.toggle('active', on); if (on && a.tagName === 'A') a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  syncNav(r);
  document.getElementById('search-input').value = r.params.get('q') || '';
  const heading = main.querySelector('h1');
  document.title = `${(heading ? (heading.innerText || heading.textContent) : 'Catalogue').replace(/\s+/g, ' ').trim()} | ${BUSINESS}`;

  const target = focusAfterRoute && document.getElementById(focusAfterRoute);
  if (target) {
    target.focus({ preventScroll: true });
  } else if (previousHash !== '' && previousHash !== location.hash) {
    // Route change: move focus to the new content and return to the top. On first load the
    // browser's natural focus order is kept so the skip link is the first Tab stop.
    main.focus({ preventScroll: true }); window.scrollTo(0, 0);
  }
  focusAfterRoute = null; previousHash = location.hash || '#/'; updateCount();
}
function navigate(url) {
  if (location.hash === url) { render(); document.getElementById('main').focus({ preventScroll: true }); window.scrollTo(0, 0); }
  else location.hash = url;
}
function setFilter(key, value, focusID) {
  const sel = selection(current());
  if (key === 'sort' && value === defaultSort(sel)) value = '';
  sel[key] = value; sel.page = 1;
  if (key === 'category') sel.subcategory = '';
  if (key === 'subcategory' && value) { const s = subOf(value); sel.category = s ? s.category.id : sel.category; }
  if (key === 'category' || key === 'subcategory') dropEmptyFilters(sel);
  focusAfterRoute = focusID || null;
  navigate(makeUrl('shop', sel));
}
function removeFilter(key) {
  const sel = selection(current());
  if (key === 'category') { sel.category = ''; sel.subcategory = ''; } else sel[key] = '';
  if (key === 'category' || key === 'subcategory') dropEmptyFilters(sel);
  sel.page = 1; navigate(makeUrl('shop', sel));
}
function selectTab(name, focus = false) {
  activeTab = name;
  document.querySelectorAll('[role=tab]').forEach(t => { const on = t.dataset.tab === name; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; if (on && focus) t.focus(); });
  document.querySelectorAll('[role=tabpanel]').forEach(p => { p.hidden = p.id !== 'panel-' + name; });
}

/* ---------------------------------------------------------------- 8. WhatsApp, modal, forms */
function productURL(p) {
  const configured = String(CONFIG.publicBaseUrl || '').trim();
  const base = configured || location.href.split('#')[0];
  return base.replace(/#.*$/, '') + '#/product/' + p.id;
}
function priceLine(p) { return !hasPrice(p) ? 'Request Price' : `${money(p.price)}${isDemoPrice(p) ? ' (demonstration price shown on the website)' : ''}`; }
function messageFor(p, q) {
  const localNote = CONFIG.publicBaseUrl ? '' : (location.protocol === 'file:' ? ' (local file reference; configure publicBaseUrl for a public link)' : '');
  return `Hello ${BUSINESS},
I would like to enquire about the following item:
Product: ${p.name}${p.model ? `\nModel: ${p.model}` : ''}${p.sku ? `\nSKU: ${p.sku}` : ''}
Quantity: ${q}
Displayed price: ${priceLine(p)}
Product link${localNote}: ${productURL(p)}
Please confirm:
1. Current availability
2. Delivery options and cost to my location: ________
3. A final quotation including any applicable taxes
This is an enquiry, not an order.`;
}
function cartSummary() {
  return Object.entries(cart).map(([id, q]) => { const p = product(id); return `${p.name}${p.model ? ` · Model ${p.model}` : ''}${p.sku ? ` · SKU ${p.sku}` : ''}\nQuantity: ${q}\nDisplayed price: ${priceLine(p)}\nProduct link: ${productURL(p)}`; }).join('\n\n');
}
function cartMessage() {
  return `Hello ${BUSINESS},
I would like to enquire about the following items:

${cartSummary()}

Subtotal shown on the website: ${money(cartTotal())}${PROD ? '' : ' (demonstration prices)'}
Please confirm:
1. Current availability of each item
2. Delivery options and cost to my location: ________
3. A final quotation including any applicable taxes
This is an enquiry, not an order.`;
}
function generalMessage() {
  return `Hello ${BUSINESS},
I would like to enquire about equipment for my project.
Equipment / model: ________
Quantity: ________
Delivery location and country: ________
Please confirm availability, delivery options and a final quotation.
This is an enquiry, not an order.`;
}
const validNumber = () => /^\d{8,15}$/.test(WHATSAPP);
function openModal(title, body, className = '') {
  const m = document.getElementById('modal');
  m.className = className;
  document.getElementById('modal-content').innerHTML = `<h2 id="modal-title">${title}</h2>${body}`;
  if (!m.open) m.showModal();
  m.querySelector('.close').focus();
}
function messageModal(text, title = 'WhatsApp enquiry') {
  const ok = validNumber();
  openModal(title, `<p>${ok ? 'Review the message, then open WhatsApp to send it. Opening WhatsApp starts an enquiry; it does not place an order.' : `The ${esc(BUSINESS)} WhatsApp number has not been configured yet, so WhatsApp cannot be opened from here. You can copy the prepared message below; nothing has been sent.`}</p>
    <label for="message-preview" class="sr-only">Enquiry message</label><textarea id="message-preview" readonly>${esc(text)}</textarea>
    <div class="actions">${ok ? `<a class="btn wa solid" href="https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}" target="_blank" rel="noopener noreferrer">${icon('wa')} Open WhatsApp</a>` : ''}<button type="button" class="btn ${ok ? 'secondary' : ''}" data-copy-message>Copy message</button><button type="button" class="btn secondary" data-close-modal>Close</button></div>
    <p class="copy-status" id="copy-status" role="status"></p>${ok ? '' : `<p class="small muted">Site owner: set <code>whatsappNumber</code> in <code>assets/js/config.js</code> (international digits only) to enable the WhatsApp button.</p>`}`);
}
async function copyMessage() {
  const el = document.getElementById('message-preview'), text = el.value; let ok = false;
  try { await navigator.clipboard.writeText(text); ok = true; } catch { el.focus(); el.select(); try { ok = document.execCommand('copy'); } catch { /* unsupported */ } }
  document.getElementById('copy-status').textContent = ok ? 'Message copied. Nothing has been sent.' : 'Copy is unavailable in this browser. The message is selected — use your browser’s Copy command.';
}
function updateCartDisplay() {
  updateCount();
  const sub = document.getElementById('subtotal'); if (sub) sub.textContent = money(cartTotal());
  const cnt = document.getElementById('summary-count'); if (cnt) cnt.textContent = cartCount();
  Object.entries(cart).forEach(([id, q]) => { const el = document.querySelector(`[data-line-total="${id}"]`); if (el) el.textContent = money(product(id).price * q); });
}
function validateForm(form) {
  const errors = [];
  const setError = (id, msg) => { const wrap = form.querySelector(`[data-field="${id}"]`), err = document.getElementById(`${id}-error`), ctl = document.getElementById(id); if (wrap) wrap.classList.toggle('invalid', !!msg); if (err) err.textContent = msg || ''; if (ctl) ctl.setAttribute('aria-invalid', msg ? 'true' : 'false'); if (msg) errors.push({ id, msg }); };
  const v = id => (document.getElementById(id) || { value: '' }).value.trim();
  setError('enq-name', v('enq-name') ? '' : 'Enter your full name.');
  setError('enq-email', !v('enq-email') ? 'Enter your email address.' : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v('enq-email')) ? '' : 'Enter a valid email address, for example name@example.com.');
  setError('enq-location', v('enq-location') ? '' : 'Enter your town or county and country.');
  if (document.getElementById('enq-qty')) { const n = Number(v('enq-qty')); setError('enq-qty', Number.isInteger(n) && n >= 1 && n <= 9999 ? '' : 'Enter a whole number from 1 to 9999.'); }
  setError('enq-topic', v('enq-topic') ? '' : 'Select a topic.');
  setError('enq-message', !v('enq-message') ? 'Enter your message.' : v('enq-message').length < 10 ? 'Enter at least 10 characters.' : '');
  const demo = document.getElementById('enq-demo');
  if (demo) { const err = document.getElementById('enq-demo-error'); if (!demo.checked) { err.textContent = 'Tick the box to confirm you understand this is a demonstration.'; err.style.display = 'block'; demo.setAttribute('aria-invalid', 'true'); errors.push({ id: 'enq-demo', msg: err.textContent }); } else { err.textContent = ''; err.style.display = 'none'; demo.setAttribute('aria-invalid', 'false'); } }
  const box = document.getElementById('form-errors');
  box.innerHTML = errors.length ? `<div class="form-errors"><strong>Please correct ${errors.length} ${errors.length === 1 ? 'field' : 'fields'}:</strong><ul>${errors.map(e => `<li><a href="#${e.id}" data-focus-field="${e.id}">${esc(e.msg)}</a></li>`).join('')}</ul></div>` : '';
  return errors;
}

/* ---------------------------------------------------------------- Events */
document.addEventListener('click', e => {
  const el = e.target.closest('button, a');
  if (!el) return;
  if (el.classList.contains('skip')) { e.preventDefault(); document.getElementById('main').focus(); return; }
  if (el.id === 'menu-button') { openNav(); return; }
  if (el.classList.contains('nav-drawer-close')) { closeNav(); return; }
  if (el.id === 'categories-toggle') { setDeptMenu(!deptMenuOpen()); return; }
  if (el.closest('#nav-drawer')) closeNav();
  if (el.closest('#category-menu')) setDeptMenu(false);
  if (el.dataset.focusField) { e.preventDefault(); const f = document.getElementById(el.dataset.focusField); if (f) f.focus(); return; }
  if (el.hasAttribute('data-clear-filters-keep-search')) { focusAfterRoute = null; navigate(makeUrl('shop', { q: selection(current()).q })); return; }
  if (el.hasAttribute('data-clear-filters')) { focusAfterRoute = null; navigate('#/shop'); return; }
  if (el.dataset.removeFilter) { removeFilter(el.dataset.removeFilter); return; }
  if (el.dataset.view) { viewMode = el.dataset.view === 'list' ? 'list' : 'grid'; store('nyce-view-mode', viewMode); document.getElementById('results').classList.toggle('list', viewMode === 'list'); document.querySelectorAll('[data-view]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.view === viewMode))); return; }
  if (el.dataset.page) { const sel = selection(current()); sel.page = Number(el.dataset.page); navigate(makeUrl('shop', sel)); return; }
  if (el.dataset.qtyStep) {
    const input = document.getElementById(el.dataset.for); let q = Number(input.value) || 1;
    q = Math.max(1, Math.min(MAX_QTY, Math.round(q) + Number(el.dataset.qtyStep))); input.value = q; input.setCustomValidity('');
    if (input.dataset.qtyKind.startsWith('cart:')) { cart[input.dataset.qtyKind.slice(5)] = q; saveCart(); updateCartDisplay(); }
    return;
  }
  if (el.dataset.add) { const q = validQty(document.getElementById('detail-qty')); if (q !== null) addCart(el.dataset.add, q); return; }
  if (el.dataset.remove) { delete cart[el.dataset.remove]; saveCart(); render(); notify('Item removed from the cart.'); return; }
  if (el.hasAttribute('data-clear-cart')) { cart = {}; saveCart(); render(); notify('Cart cleared.'); return; }
  if (el.dataset.wa) { const p = product(el.dataset.wa); let q = 1; if (el.dataset.detail) { q = validQty(document.getElementById('detail-qty')); if (q === null) return; } messageModal(messageFor(p, q)); return; }
  if (el.hasAttribute('data-general-wa')) { messageModal(generalMessage()); return; }
  if (el.hasAttribute('data-cart-wa')) { if (!cartCount()) { notify('Your cart is empty.'); return; } messageModal(cartMessage(), 'WhatsApp enquiry · cart list'); return; }
  if (el.dataset.quote) { let q = 1; const input = document.getElementById('detail-qty'); if (input) { q = validQty(input); if (q === null) return; } navigate(makeUrl('business', { product: el.dataset.quote, qty: q })); return; }
  if (el.dataset.tab) { selectTab(el.dataset.tab); return; }
  if (el.dataset.gallery !== undefined) {
    const p = product(el.dataset.id); galleryIndex = Number(el.dataset.gallery) || 0;
    document.getElementById('gallery-content').innerHTML = galleryItem(p, galleryIndex);
    document.querySelectorAll('[data-gallery]').forEach(t => t.setAttribute('aria-pressed', String(Number(t.dataset.gallery) === galleryIndex)));
    document.getElementById('gallery-main').setAttribute('aria-label', `Enlarge ${(p.gallery[galleryIndex] || {}).label || 'image'} for ${p.name}`);
    return;
  }
  if (el.dataset.enlarge) { const p = product(el.dataset.enlarge); openModal(esc(p.name), galleryItem(p, galleryIndex) + (PROD ? '' : '<p style="margin-top:12px">Representative category image; exact product photography is pending.</p>'), 'lightbox'); return; }
  if (el.hasAttribute('data-copy-message')) { copyMessage(); return; }
  if (el.hasAttribute('data-form-preview')) { messageModal(formPreview, PROD ? 'Prepared enquiry' : 'Prepared enquiry · demonstration'); return; }
  if (el.classList.contains('close') || el.hasAttribute('data-close-modal')) { document.getElementById('modal').close(); return; }
});
document.addEventListener('change', e => {
  const el = e.target;
  if (el.dataset.filter) { setFilter(el.dataset.filter, el.value, el.id || (el.name ? `${el.name}-${el.value}` : null)); return; }
  if (el.dataset.qtyKind && el.dataset.qtyKind.startsWith('cart:')) { const q = validQty(el); if (q !== null) { cart[el.dataset.qtyKind.slice(5)] = q; saveCart(); updateCartDisplay(); } }
});
document.addEventListener('input', e => { if (e.target.setCustomValidity) e.target.setCustomValidity(''); });
document.addEventListener('keydown', e => {
  if (e.target.matches && e.target.matches('[role=tab]')) {
    const names = ['description', 'specifications', 'delivery'], i = names.indexOf(e.target.dataset.tab);
    if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) { e.preventDefault(); const j = e.key === 'Home' ? 0 : e.key === 'End' ? 2 : (i + (e.key === 'ArrowRight' ? 1 : 2)) % 3; selectTab(names[j], true); }
  }
  if (e.key === 'Escape' && deptMenuOpen()) { e.preventDefault(); setDeptMenu(false, true); return; }
});
document.addEventListener('click', e => { if (deptMenuOpen() && !e.target.closest('#nav-menu')) setDeptMenu(false); });
// Tabbing out of the open category menu closes it without stealing focus.
document.getElementById('nav-menu').addEventListener('focusout', e => { if (deptMenuOpen() && e.relatedTarget && !e.currentTarget.contains(e.relatedTarget)) setDeptMenu(false); });
(function bindDrawer() {
  const d = document.getElementById('nav-drawer');
  d.addEventListener('close', () => document.getElementById('menu-button').setAttribute('aria-expanded', 'false'));
  d.addEventListener('click', e => {
    if (e.target !== d) return;
    const r = d.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) d.close();
  });
})();
document.addEventListener('submit', e => {
  if (e.target.id === 'global-search') {
    e.preventDefault();
    const q = document.getElementById('search-input').value.trim();
    const route = current(), sel = route.parts[0] === 'shop' ? selection(route) : {};
    navigate(makeUrl('shop', { ...sel, q, page: 1 }));
    return;
  }
  if (e.target.id !== 'enquiry-form') return;
  e.preventDefault();
  const form = e.target, errors = validateForm(form);
  if (errors.length) { const first = document.getElementById(errors[0].id); if (first) first.focus(); return; }
  const d = Object.fromEntries(new FormData(form));
  formPreview = `Enquiry for ${BUSINESS}\nName: ${d.name.trim()}\nEmail: ${d.email.trim()}${d.company ? `\nOrganisation: ${d.company.trim()}` : ''}${d.phone ? `\nPhone: ${d.phone.trim()}` : ''}\nDestination: ${d.location.trim()}\nTopic: ${d.topic}${d.quantity ? `\nQuantity: ${d.quantity}` : ''}\n\n${d.message.trim()}\n\nThis is an enquiry, not an order.`;
  document.getElementById('form-feedback').innerHTML = `<div class="form-success"><h3>Your enquiry is prepared${PROD ? '' : ' (demonstration)'}.</h3><p>Nothing has been sent or saved to a server. Review the text, then copy it${validNumber() ? ' or open WhatsApp' : ''} to send it to ${esc(BUSINESS)}.</p><button type="button" class="btn secondary sm" data-form-preview>Review &amp; ${validNumber() ? 'send' : 'copy'} enquiry</button></div>`;
  document.getElementById('form-feedback').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});
document.getElementById('modal').addEventListener('click', e => {
  if (e.target.id === 'modal') { const r = e.target.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) e.target.close(); }
});
// A real product photo that fails to load is replaced by the placeholder, so cards never show a broken image.
document.addEventListener('error', e => {
  const img = e.target;
  if (img && img.tagName === 'IMG' && img.hasAttribute('data-photo-src') && img.parentElement) img.parentElement.outerHTML = photoPlaceholder(img.alt);
}, true);
window.addEventListener('hashchange', () => { const m = document.getElementById('modal'); if (m.open) m.close(); closeNav(); setDeptMenu(false); render(); });
window.addEventListener('resize', () => { if (innerWidth < 1050) setDeptMenu(false); else fitDeptMenu(); });
function updateHeaderOnScroll() {
  const compact = window.scrollY > 80;
  document.querySelector('header').classList.toggle('is-compact', compact);
  if (compact && deptMenuOpen()) setDeptMenu(false);
}
window.addEventListener('scroll', updateHeaderOnScroll, { passive: true });

/* ---------------------------------------------------------------- Boot */
(function boot() {
  // Mode indicators and footer text driven by config.
  buildShell();
  const year = document.getElementById('footer-year'); if (year) year.textContent = new Date().getFullYear();
  const note = document.getElementById('footer-note'); if (note) note.textContent = PROD ? 'Prices and availability are confirmed by quotation. No online payment.' : 'Demonstration catalogue · indicative prices · no live checkout or payment.';

  // Logo with wordmark fallback.
  for (const id of ['brand-logo', 'footer-logo']) {
    const img = document.getElementById(id); if (!img) continue;
    img.onerror = () => { const mark = document.createElement('strong'); mark.className = 'logo-text'; mark.textContent = BUSINESS; img.replaceWith(mark); };
    img.src = ASSETS.logo || '';
  }
  // Equipment sprite with placeholder fallback.
  const check = new Image();
  check.onerror = () => { imageFailed = true; render(); };
  check.src = ASSETS.equipment || '';
  if (!ASSETS.equipment) imageFailed = true;

  document.querySelectorAll('[data-icon]').forEach(el => { el.innerHTML = icon(el.dataset.icon); });
  const sb = document.getElementById('search-button'); if (sb) sb.innerHTML = `${icon('search')}<span>Search</span>`;
  render();
  updateHeaderOnScroll();
})();

// Read-only hooks for testing and training. Never a server API.
window.NYCE = { config: CONFIG, categories: CATEGORIES, products: PRODUCTS, allProducts: ALL_PRODUCTS, filtered, selection, current, getCart: () => ({ ...cart }), getTotal: cartTotal, messageFor, productURL, mode: PROD ? 'production' : 'demo' };
})();
