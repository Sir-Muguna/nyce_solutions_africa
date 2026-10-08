"""Acceptance checks for the NYCE SOLUTIONS catalogue, executed in headless Chromium.

Usage: python3 acceptance.py <url> <label>
Writes a JSON report and screenshots to ./test-output/<label>/."""
import json, sys, os, time, urllib.parse
from playwright.sync_api import sync_playwright

URL, LABEL = sys.argv[1], sys.argv[2]
OUT = f'./test-output/{LABEL}'
os.makedirs(OUT, exist_ok=True)
results = []
console_errors = []

def check(name, ok, detail=''):
    results.append({'check': name, 'result': 'PASS' if ok else 'FAIL', 'detail': str(detail)[:300]})
    print(('PASS ' if ok else 'FAIL ') + name + (f' — {detail}' if detail and not ok else ''))

def go(pg, hash_, wait=250):
    pg.goto(URL + hash_)
    pg.wait_for_timeout(wait)

def no_overflow(pg):
    return pg.evaluate('document.documentElement.scrollWidth <= window.innerWidth + 1')

def shared_card_contract(pg, selector):
    return pg.locator(selector).evaluate_all('''els => els.length > 0 && els.every(e => {
        const p = NYCE.products.find(x => x.id === e.dataset.productId);
        const hasStock = Object.hasOwn(p, "stock") && p.stock !== undefined && p.stock !== null && p.stock !== "";
        const image = e.querySelector(".product-media .photo").getBoundingClientRect();
        return e.className === "product-card"
          && e.querySelector(".product-content h2")
          && e.querySelector(".product-price")
          && e.querySelector(".card-actions a[href^=\\"#/product/\\"]")
          && e.querySelector("[data-general-wa], a[href^=\\"https://wa.me/\\"]")
          && Boolean(e.querySelector(".product-sku")) === Boolean(p.sku)
          && Boolean(e.querySelector(".product-stock")) === hasStock
          && Math.abs(image.width - image.height) < 1;
    })''')

with sync_playwright() as p:
    browser = p.chromium.launch()
    ctx = browser.new_context(viewport={'width': 1440, 'height': 900})
    pg = ctx.new_page()
    pg.on('console', lambda m: console_errors.append(m.text) if m.type == 'error' else None)
    pg.on('pageerror', lambda e: console_errors.append(str(e)))

    # ---------- Navigation & routing ----------
    go(pg, '')
    nav_texts = pg.eval_on_selector_all('#primary-nav a', 'els => els.map(e => e.textContent.trim())')
    check('Nav: no "Shop by Category" tab', 'Shop by Category' not in ' '.join(nav_texts), nav_texts)
    check('Nav: flat Home, Shop, Categories items', nav_texts == ['Home', 'Shop', 'Categories'], nav_texts)
    check('Nav: Categories links to Shop', pg.get_attribute('#primary-nav a[data-nav="categories"]', 'href') == '#/shop')
    check('Header: no promotional banner, carousel, or mega menu', pg.locator('header .utility, header .promo, header .carousel, header .mega-menu').count() == 0)
    check('Header: visible named search input', pg.is_visible('#search-input') and pg.get_attribute('label[for="search-input"]', 'class') == 'sr-only')
    footer_links = pg.eval_on_selector_all('footer a', 'els => els.map(e => e.getAttribute("href"))')
    check('Footer: no category directory or guide links', not any(h and ('#/categories' in h or '#/category/' in h or 'guide' in h) for h in footer_links), footer_links)
    check('Footer: no "Shop by Category" text', 'Shop by Category' not in pg.inner_text('footer'))
    check('Home: catalog-first sections render in required order', pg.eval_on_selector_all('main > *', 'els => els.map(e => e.classList[0])') == ['home-search-strip', 'home-product-section', 'category-quick-links', 'home-product-section', 'home-product-section', 'home-trust-strip', 'home-cta-band'])
    check('Home: cards use shared template and render available data only', shared_card_contract(pg, '.home-product-section .product-card'))
    quick_links = pg.eval_on_selector_all('.category-quick-links a', 'els => els.map(e => [e.textContent.trim(), e.getAttribute("href")])')
    check('Home: all six existing categories link to filtered Shop routes', len(quick_links) == 6 and all(h.startswith('#/shop?category=') for _, h in quick_links), quick_links)
    check('Home: no hero, carousel or auto-playing slider', pg.locator('main .hero, main [aria-roledescription="carousel"], main .carousel, main [autoplay]').count() == 0)

    for href, nav in [('#/shop', 'shop'), ('#/', 'home')]:
        go(pg, href)
        active = pg.get_attribute(f'#primary-nav a[data-nav="{nav}"]', 'aria-current')
        check(f'Nav link works + active state: {href}', pg.locator('main h1').count() >= 1 and active == 'page', f'aria-current={active}')
    for href in ['#/business', '#/about', '#/contact', '#/cart']:
        go(pg, href)
        check(f'Existing route still resolves: {href}', pg.locator('main h1').count() == 1, pg.inner_text('main h1'))

    # legacy routes
    go(pg, '#/categories')
    check('Legacy #/categories → #/shop', pg.evaluate('location.hash') == '#/shop', pg.evaluate('location.hash'))
    go(pg, '#/category/water')
    check('Legacy #/category/water → shop?category=water', pg.evaluate('location.hash') == '#/shop?category=water' and 'Borehole & Water Solutions' in pg.inner_text('main h1'), pg.evaluate('location.hash'))
    go(pg, '#/category/generators/generators-5')
    h = pg.evaluate('location.hash')
    check('Legacy #/category/generators/generators-5 → both filters', 'category=generators' in h and 'subcategory=generators-5' in h and 'Silent Canopy Generators' in pg.inner_text('main h1'), h)
    go(pg, '#/category/does-not-exist')
    check('Legacy unknown department → not found', 'Page not found' in pg.inner_text('main h1'))
    go(pg, '#/nothing/here')
    check('Not-found route renders', 'Page not found' in pg.inner_text('main h1'))
    go(pg, '#/guide')
    check('Build Guide route not customer-facing', 'Page not found' in pg.inner_text('main h1'))

    # back/forward
    go(pg, '#/'); go(pg, '#/shop'); go(pg, '#/shop?category=solar')
    pg.go_back(); pg.wait_for_timeout(250)
    back_ok = pg.evaluate('location.hash') == '#/shop' and pg.inner_text('main h1').strip() == 'Shop'
    pg.go_forward(); pg.wait_for_timeout(250)
    fwd_ok = pg.evaluate('location.hash') == '#/shop?category=solar' and 'Solar' in pg.inner_text('main h1')
    check('Browser back/forward restore views', back_ok and fwd_ok)
    # back after a legacy redirect should not loop
    go(pg, '#/'); go(pg, '#/category/solar'); pg.go_back(); pg.wait_for_timeout(300)
    check('Back after legacy redirect does not loop', pg.evaluate('location.hash') in ('', '#/'), pg.evaluate('location.hash'))

    # product breadcrumbs
    go(pg, '#/product/doyin-solar-pump')
    crumbs = pg.eval_on_selector_all('.breadcrumb a', 'els => els.map(e => e.getAttribute("href"))')
    check('Product breadcrumbs use filtered Shop routes', crumbs[:2] == ['#/', '#/shop'] and crumbs[2].startswith('#/shop?category=') and 'subcategory=' in crumbs[3], crumbs)
    for c in crumbs[2:]:
        go(pg, c)
        check(f'Breadcrumb resolves: {c}', pg.locator('.product-card').count() >= 1)

    # ---------- Catalogue data ----------
    go(pg, '#/shop')
    data = pg.evaluate('({cats: NYCE.categories.length, subs: NYCE.categories.reduce((n,c)=>n+c.subcategories.length,0), products: NYCE.products.length, unique: new Set(NYCE.products.map(p=>p.id)).size, mode: NYCE.mode})')
    check('Catalogue: 6 departments', data['cats'] == 6, data)
    check('Catalogue: 59 subcategories', data['subs'] == 59, data)
    check('Catalogue: 49 unique product records', data['products'] == 49 and data['unique'] == 49, data)
    sub_ids = pg.evaluate('NYCE.categories.flatMap(c => c.subcategories.map(s => [c.id, s.id, s.name]))')
    dept_counts = {}
    for cid, sid, sname in sub_ids:
        go(pg, f'#/shop?category={cid}&subcategory={sid}', 120)
        n = pg.locator('.product-card').count()
        h1 = pg.inner_text('main h1')
        dept_counts.setdefault(cid, 0)
        if n < 1 or h1.strip() != sname:
            check(f'Subcategory listing {sid}', False, f'{n} cards, h1={h1}')
    check('All 59 subcategory routes list ≥1 product with correct heading', all(r['result'] == 'PASS' for r in results if r['check'].startswith('Subcategory listing')) and True)
    # department discoverability via filter radios
    go(pg, '#/shop')
    radios = pg.eval_on_selector_all('input[name="filter-category"]', 'els => els.map(e => e.value)')
    check('Shop filters expose all 6 departments', len([r for r in radios if r]) == 6, radios)
    opts = pg.eval_on_selector_all('#filter-subcategory option', 'els => els.map(e => e.value).filter(Boolean)')
    check('Shop subcategory select lists all 59 (no department selected)', len(opts) == 59, len(opts))

    # ---------- Search ----------
    for q, expect in [('hisaki', 'hisaki-generator'), ('EC 7574-BS', 'tronic-extension'), ('Tronic 4-way surge-protected extension', 'tronic-extension')]:
        go(pg, '#/shop?q=' + urllib.parse.quote(q))
        ids = pg.eval_on_selector_all('.product-card', 'els => els.map(e => e.dataset.productId)')
        check(f'Search "{q}" finds {expect}', expect in ids, ids[:6])
        if q == 'EC 7574-BS':
            check('SKU search uses shared product-card template', shared_card_contract(pg, '.product-card'))
    go(pg, '#/shop?category=electrical')
    check('Category listing uses shared product-card template', shared_card_contract(pg, '.product-card'))
    go(pg, '#/shop?q=' + urllib.parse.quote('HK7000SNA'))
    check('Search excludes model-only terms', pg.locator('.product-card').count() == 0)
    check('Search empty state is factual and includes query/count', 'No products match “HK7000SNA”.' in pg.inner_text('.empty') and '0 products' in pg.inner_text('.search-results-summary'))
    go(pg, '#/shop'); pg.fill('#search-input', 'borehole'); pg.press('#search-input', 'Enter'); pg.wait_for_timeout(250)
    check('Header search submits to #/shop?q= and displays query/count', 'q=borehole' in pg.evaluate('location.hash') and 'borehole' in pg.inner_text('.search-results-summary') and 'products' in pg.inner_text('.search-results-summary'))

    # ---------- Filters ----------
    go(pg, '#/shop?category=generators')
    pg.select_option('#filter-phase', 'Three phase'); pg.wait_for_timeout(250)
    ids = pg.eval_on_selector_all('.product-card', 'els => els.map(e => e.dataset.productId)')
    check('Combined filters (department + phase)', ids == ['pulsar-generator'], ids)
    chips = pg.eval_on_selector_all('.chip', 'els => els.map(e => e.textContent.trim())')
    check('Active filter chips shown', len(chips) == 2, chips)
    pg.click('.chip[data-remove-filter="phase"]'); pg.wait_for_timeout(250)
    check('Individual chip removal', pg.locator('.chip').count() == 1 and 'phase' not in pg.evaluate('location.hash'))
    pg.click('.chips .clear-all'); pg.wait_for_timeout(250)
    check('Clear all filters → #/shop', pg.evaluate('location.hash') == '#/shop' and pg.locator('.chip').count() == 0)
    go(pg, '#/shop?category=solar&page=2'); pg.check('input[name="filter-category"][value="water"]'); pg.wait_for_timeout(250)
    check('Pagination resets after filter change', 'page=' not in pg.evaluate('location.hash') and 'category=water' in pg.evaluate('location.hash'))
    go(pg, '#/shop?q=zzzzqqq')
    check('Empty results display factual query and count', pg.locator('.empty').count() == 1 and 'No products match “zzzzqqq”.' in pg.inner_text('.empty') and '0 products' in pg.inner_text('.search-results-summary'))

    # ---------- Sorting ----------
    go(pg, '#/shop?sort=az')
    names = pg.eval_on_selector_all('.product-card h2', 'els => els.map(e => e.textContent.trim())')
    check('Sort A–Z', names == sorted(names, key=lambda s: s.lower()), names[:4])
    go(pg, '#/shop?sort=price-asc&pricing=demo')
    prices = pg.evaluate("Array.from(document.querySelectorAll('.product-card')).map(e => NYCE.products.find(p=>p.id===e.dataset.productId).price)")
    check('Sort price low→high', prices == sorted(prices), prices)
    go(pg, '#/shop?sort=price-desc')
    prices = pg.evaluate("Array.from(document.querySelectorAll('.product-card')).map(e => NYCE.products.find(p=>p.id===e.dataset.productId).price)")
    check('Sort price high→low (priced first)', prices[:11] == sorted(prices[:11], reverse=True) and prices[11] is None, prices[:12])
    sort_opts = pg.eval_on_selector_all('#sort-products option', 'els => els.map(e=>e.value)')
    check('Sort: "Newest" omitted (no date data)', 'newest' not in sort_opts, sort_opts)
    check('No discount badges / old prices rendered', pg.locator('del, .discount, s').count() == 0 and '%' not in pg.inner_text('#results'))

    # ---------- Grid/list persistence ----------
    go(pg, '#/shop'); pg.click('[data-view="list"]'); pg.wait_for_timeout(100)
    go(pg, '#/'); go(pg, '#/shop')
    check('Grid/list preference persists', pg.get_attribute('[data-view="list"]', 'aria-pressed') == 'true' and 'list' in pg.get_attribute('#results', 'class'))
    pg.click('[data-view="grid"]'); pg.wait_for_timeout(100)
    pagers = pg.eval_on_selector_all('.pagination button', 'els => els.map(e=>e.textContent.trim())')
    check('Pagination accessible (nav + buttons)', pg.get_attribute('.pagination', 'aria-label') is not None and 'Next' in pagers, pagers)
    pg.click('.pagination button[data-page="2"]'); pg.wait_for_timeout(250)
    check('Pagination page 2 works', 'page=2' in pg.evaluate('location.hash') and pg.locator('.product-card').count() == 12)

    # ---------- Product detail ----------
    go(pg, '#/product/hisaki-generator')
    check('Product: tabs present', pg.locator('[role=tab]').count() == 3)
    pg.click('#tab-specifications'); pg.wait_for_timeout(100)
    check('Product: tab switching', pg.is_visible('#panel-specifications') and not pg.is_visible('#panel-description'))
    pg.focus('#tab-specifications'); pg.keyboard.press('ArrowRight'); pg.wait_for_timeout(100)
    check('Product: tab arrow-key navigation', pg.get_attribute('#tab-delivery', 'aria-selected') == 'true')
    pg.click('.thumb[data-gallery="1"]'); pg.wait_for_timeout(100)
    check('Product: gallery thumbnail switch', pg.locator('#gallery-content .technical-card').count() == 1)
    pg.click('#gallery-main'); pg.wait_for_timeout(200)
    check('Product: tap/click enlargement opens dialog', pg.evaluate('document.getElementById("modal").open'))
    pg.keyboard.press('Escape'); pg.wait_for_timeout(100)
    check('Product: Escape closes dialog', not pg.evaluate('document.getElementById("modal").open'))
    pg.click('[data-qty-step="1"]'); pg.click('[data-qty-step="1"]')
    check('Product: quantity controls', pg.input_value('#detail-qty') == '3')
    check('Product: related products link', pg.locator('.section .product-card a[href^="#/product/"]').count() >= 1)
    rel = pg.eval_on_selector_all('.section .product-card', 'els => els.map(e=>e.dataset.productId)')
    check('Product: related excludes self', 'hisaki-generator' not in rel, rel)
    check('Product: no unverified claims', not any(w in pg.inner_text('main').lower() for w in ['in stock', 'warranty included', 'free delivery', 'countrywide delivery', '★', 'rated 5']))
    # add to cart priced
    pg.click('[data-add="hisaki-generator"]'); pg.wait_for_timeout(150)
    check('Cart: add priced product (qty 3)', pg.evaluate('NYCE.getCart()') == {'hisaki-generator': 3} and pg.inner_text('#cart-count') == '3')
    # quote-only product
    go(pg, '#/product/doyin-solar-pump')
    check('Quote-only: no Add to Cart, Request a Quote shown', pg.locator('[data-add]').count() == 0 and pg.locator('[data-quote]').count() >= 1)
    check('Quote-only: cannot enter cart via storage', pg.evaluate("(()=>{try{localStorage.setItem('nyce-demo-cart-v2', JSON.stringify({'doyin-solar-pump':2,'hisaki-generator':3}))}catch(e){};return true})()"))
    pg.reload(); pg.wait_for_timeout(300)
    check('Quote-only: rejected on cart restore', pg.evaluate('NYCE.getCart()') == {'hisaki-generator': 3}, pg.evaluate('NYCE.getCart()'))
    pg.click('[data-quote="doyin-solar-pump"]'); pg.wait_for_timeout(250)
    check('Request a Quote prefills business form', 'product=doyin-solar-pump' in pg.evaluate('location.hash') and 'Doyin' in pg.input_value('#enq-message'))

    # ---------- Cart ----------
    go(pg, '#/product/tolsen-hoist'); pg.click('[data-add="tolsen-hoist"]'); pg.wait_for_timeout(100)
    go(pg, '#/cart')
    subtotal = pg.inner_text('#subtotal')
    check('Cart: subtotal correct', subtotal.replace('\u202f', ',').replace('\xa0', ' ') == 'KES 536,965' or '536,965' in subtotal, subtotal)
    pg.click('[data-cart-id="hisaki-generator"] [data-qty-step="-1"]'); pg.wait_for_timeout(100)
    check('Cart: quantity update recalculates', '368,975' in pg.inner_text('#subtotal'), pg.inner_text('#subtotal'))
    pg.reload(); pg.wait_for_timeout(300)
    check('Cart: persistence across reload', pg.evaluate('NYCE.getCart()') == {'hisaki-generator': 2, 'tolsen-hoist': 1}, pg.evaluate('NYCE.getCart()'))
    txt = pg.inner_text('main').lower()
    check('Cart: prototype statements present', all(x in txt for x in ['no order has been submitted', 'no inventory has been reserved', 'no payment has been processed']))
    go(pg, '#/checkout')
    check('Checkout summary: honest statement + totals', 'no order has been submitted' in pg.inner_text('main').lower() and '368,975' in pg.inner_text('main'))
    pg.click('[data-cart-wa]'); pg.wait_for_timeout(200)
    msg = pg.input_value('#message-preview')
    check('Checkout WhatsApp message lists items', 'Hisaki' in msg and 'Tolsen' in msg and 'This is an enquiry, not an order.' in msg)
    pg.keyboard.press('Escape')
    go(pg, '#/cart'); pg.click('[data-remove="tolsen-hoist"]'); pg.wait_for_timeout(200)
    check('Cart: remove product', pg.evaluate('NYCE.getCart()') == {'hisaki-generator': 2})
    pg.click('[data-clear-cart]'); pg.wait_for_timeout(200)
    check('Cart: clear cart → empty state', pg.evaluate('NYCE.getCart()') == {} and pg.locator('.empty').count() == 1)

    # ---------- WhatsApp ----------
    go(pg, '#/product/tronic-extension'); pg.fill('#detail-qty', '4'); pg.click('[data-wa="tronic-extension"][data-detail]'); pg.wait_for_timeout(200)
    msg = pg.input_value('#message-preview')
    required = ['Product: Tronic 4-way surge-protected extension', 'SKU: EC 7574-BS', 'Quantity: 4', 'Displayed price: KES 1,600', '#/product/tronic-extension', 'availability', 'Delivery', 'final quotation', 'This is an enquiry, not an order.']
    check('WhatsApp message contains required fields', all(r in msg for r in required), [r for r in required if r not in msg])
    configured = pg.evaluate('/^\\d{8,15}$/.test(String(NYCE.config.whatsappNumber||""))')
    if not configured:
        check('WhatsApp missing-number: no wa.me link, copy button + explanation', pg.locator('#modal a[href^="https://wa.me"]').count() == 0 and pg.locator('[data-copy-message]').count() == 1 and 'not been configured' in pg.inner_text('#modal'))
    else:
        href = pg.get_attribute('#modal a[href^="https://wa.me"]', 'href')
        check('WhatsApp link encoded', '%0A' in href and 'wa.me/' in href, href[:80])
    enc = pg.evaluate("encodeURIComponent(document.getElementById('message-preview').value)")
    check('WhatsApp message URL-encodes cleanly', ' ' not in enc and '\n' not in enc and urllib.parse.unquote(enc) == msg)
    modal_text = pg.inner_text('#modal').lower()
    check('WhatsApp modal never claims order/payment success', 'order confirmed' not in modal_text and 'payment' not in modal_text)
    pg.keyboard.press('Escape')
    go(pg, '#/product/starter-solar'); pg.click('[data-wa="starter-solar"][data-detail]'); pg.wait_for_timeout(150)
    check('WhatsApp quote-only message says Request Price', 'Displayed price: Request Price' in pg.input_value('#message-preview'))
    pg.keyboard.press('Escape')

    # ---------- Forms ----------
    go(pg, '#/contact'); pg.click('#enquiry-form button[type=submit]'); pg.wait_for_timeout(150)
    errs = pg.locator('.field.invalid').count()
    check('Contact form: required validation with accessible errors', errs >= 4 and pg.locator('#form-errors .form-errors').count() == 1 and pg.get_attribute('#enq-name', 'aria-invalid') == 'true', errs)
    pg.fill('#enq-name', 'Test User'); pg.fill('#enq-email', 'not-an-email'); pg.fill('#enq-location', 'Nakuru, Kenya'); pg.select_option('#enq-topic', 'Product information'); pg.fill('#enq-message', 'This is a test message about a pump.')
    demo_box = pg.locator('#enq-demo')
    if demo_box.count(): demo_box.check()
    pg.click('#enquiry-form button[type=submit]'); pg.wait_for_timeout(150)
    check('Contact form: email format validated', pg.locator('[data-field="enq-email"].invalid').count() == 1)
    pg.fill('#enq-email', 'test@example.com'); pg.click('#enquiry-form button[type=submit]'); pg.wait_for_timeout(200)
    fb = pg.inner_text('#form-feedback').lower()
    check('Contact form: honest result, no transmission claim', 'nothing has been sent' in fb and 'sent successfully' not in fb and 'we have received' not in fb, fb[:120])
    go(pg, '#/business'); pg.click('#enquiry-form button[type=submit]'); pg.wait_for_timeout(150)
    check('Business form: required validation', pg.locator('.field.invalid').count() >= 4)

    # ---------- Accessibility & responsive ----------
    pg.goto('about:blank'); pg.goto(URL); pg.wait_for_timeout(300)   # cold load, no prior focus management
    check('Skip link present and first in DOM', pg.get_attribute('body > a:first-child', 'class') == 'skip')
    check('Landmarks: header/main/footer/nav', all(pg.locator(s).count() >= 1 for s in ['header', 'main', 'footer', 'nav[aria-label]']))
    imgs_no_alt = pg.evaluate("Array.from(document.querySelectorAll('img')).filter(i => !i.hasAttribute('alt')).length + Array.from(document.querySelectorAll('svg[role=img]')).filter(s => !s.getAttribute('aria-label')).length")
    check('Images have alt / aria-label', imgs_no_alt == 0, imgs_no_alt)
    unnamed = pg.evaluate("Array.from(document.querySelectorAll('button, a')).filter(b => !(b.textContent.trim() || b.getAttribute('aria-label') || b.getAttribute('title'))).length")
    check('All buttons/links have accessible names', unnamed == 0, unnamed)
    hs = pg.evaluate("Array.from(document.querySelectorAll('main h1, main h2, main h3')).map(h => Number(h.tagName[1]))")
    check('Heading structure: one h1, no level skipped', hs.count(1) == 1 and all(b - a <= 1 for a, b in zip(hs, hs[1:])), hs)
    pg.keyboard.press('Tab')
    check('Keyboard: first Tab lands on skip link', pg.evaluate("document.activeElement.classList.contains('skip')"))
    focus_outline = pg.evaluate("getComputedStyle(document.activeElement).outlineStyle !== 'none' && parseFloat(getComputedStyle(document.activeElement).outlineWidth) >= 2")
    check('Keyboard: visible focus outline', focus_outline)
    pg.keyboard.press('Enter'); pg.wait_for_timeout(50)
    check('Skip link moves focus to main', pg.evaluate("document.activeElement.id === 'main'"))
    go(pg, '#/shop'); pg.focus('#search-input')
    for _ in range(40):
        pg.keyboard.press('Tab')
    check('Keyboard: tabbing reaches catalogue controls', pg.evaluate("!!document.activeElement.closest('main')"))

    for w, h in [(375, 740), (768, 1024), (1280, 900)]:
        ctx2 = browser.new_context(viewport={'width': w, 'height': h}, device_scale_factor=1)
        p2 = ctx2.new_page()
        p2.on('console', lambda m: console_errors.append(m.text) if m.type == 'error' else None)
        p2.on('pageerror', lambda e: console_errors.append(str(e)))
        for route, name in [('#/', 'home'), ('#/shop?category=generators', 'shop'), ('#/product/hisaki-generator', 'product'), ('#/business', 'business'), ('#/contact', 'contact'), ('#/cart', 'cart')]:
            p2.goto(URL + route); p2.wait_for_timeout(350)
            check(f'No horizontal overflow @{w}px {route}', no_overflow(p2), p2.evaluate('[document.documentElement.scrollWidth, window.innerWidth]'))
            p2.screenshot(path=f'{OUT}/{name}-{w}.png', full_page=(name != 'shop'))
        p2.goto(URL + '#/'); p2.wait_for_timeout(300)
        check(f'Header search visible without interaction @{w}', p2.is_visible('#search-input'))
        home_search = p2.locator('#home-search-input').bounding_box()
        first_product = p2.locator('.home-product-section .product-card').first.bounding_box()
        check(f'Homepage first product row appears within two viewport heights @{w}', first_product['y'] < h * 2, first_product)
        if w == 375:
            strip_search = p2.locator('.home-search-form').bounding_box()
            browse_link = p2.locator('.home-browse-link').bounding_box()
            check('Homepage search strip uses two rows on mobile', browse_link['y'] > strip_search['y'], [strip_search, browse_link])
        if w == 1280:
            strip_search = p2.locator('.home-search-form').bounding_box()
            browse_link = p2.locator('.home-browse-link').bounding_box()
            check('Homepage search strip uses one row on desktop', abs(strip_search['y'] - browse_link['y']) < 2, [strip_search, browse_link])
        home_query = 'EC 7574-BS'
        p2.fill('#home-search-input', home_query); p2.press('#home-search-input', 'Enter'); p2.wait_for_timeout(250)
        check(f'Homepage search submits name/SKU query @{w}', p2.evaluate('location.hash').startswith('#/shop?q=EC+7574-BS') and 'tronic-extension' in p2.eval_on_selector_all('.product-card', 'els => els.map(e => e.dataset.productId)'), p2.evaluate('location.hash'))
        p2.goto(URL + '#/'); p2.wait_for_timeout(300)
        tap_targets = p2.eval_on_selector_all('#primary-nav a, .header-whatsapp, .cart-link, #search-input, #search-button', 'els => els.map(e => { const r = e.getBoundingClientRect(); return [e.tagName, r.width, r.height] })')
        check(f'Header tap targets at least 44px @{w}', all(width >= 44 and height >= 44 for _, width, height in tap_targets), tap_targets)
        if w == 375:
            logo_box = p2.locator('.logo').bounding_box()
            search_box = p2.locator('#global-search').bounding_box()
            check('Mobile search is a full-width row beneath logo', search_box['width'] >= 340 and search_box['y'] > logo_box['y'], [logo_box, search_box])
        if w == 1280:
            widths = p2.evaluate("Object.fromEntries(['#global-search', '.logo', '.navigation', '.header-whatsapp', '.cart-link'].map(s => [s, document.querySelector(s).getBoundingClientRect().width]))")
            check('Desktop search is the widest header item', widths['#global-search'] > max(widths[s] for s in ['.logo', '.navigation', '.header-whatsapp', '.cart-link']), widths)
        p2.evaluate('window.scrollTo(0, 500)'); p2.wait_for_timeout(150)
        check(f'Scrolling compacts sticky header but keeps search and cart @{w}', 'is-compact' in p2.get_attribute('header', 'class') and p2.is_visible('#search-input') and p2.is_visible('.cart-link'), p2.get_attribute('header', 'class'))
        check(f'Compact header hides nav and WhatsApp action @{w}', not p2.is_visible('#primary-nav') and not p2.is_visible('.header-whatsapp'))
        p2.evaluate('window.scrollTo(0, 0)'); p2.wait_for_timeout(150)
        check(f'Scrolling up restores flat navigation @{w}', p2.is_visible('#primary-nav'))
        p2.click('.header-whatsapp')
        whatsapp_number = p2.evaluate("window.NYCE.config.whatsappNumber.replace(/\\D/g, '')")
        modal_href = p2.get_attribute('#modal a[href^="https://wa.me/"]', 'href') if whatsapp_number else None
        wa_matches_config = f'wa.me/{whatsapp_number}?' in (modal_href or '') if whatsapp_number else 'number has not been configured yet' in p2.inner_text('#modal')
        check(f'Header WhatsApp uses existing configured number @{w}', p2.is_visible('#modal[open]') and 'Hello NYCE SOLUTIONS' in p2.input_value('#message-preview') and wa_matches_config)
        p2.keyboard.press('Escape')
        if w < 1050:
            p2.goto(URL + '#/shop'); p2.wait_for_timeout(300)
            check(f'Filter drawer hidden by default @{w}', not p2.is_visible('#filters'))
            p2.click('#filter-toggle'); p2.wait_for_timeout(300)
            check(f'Filter drawer opens and takes focus @{w}', p2.is_visible('#filters') and p2.evaluate("document.activeElement.id === 'drawer-close'"))
            p2.check('input[name="filter-category"][value="solar"]'); p2.wait_for_timeout(300)
            check(f'Filter change keeps drawer open @{w}', p2.is_visible('#filters') and 'category=solar' in p2.evaluate('location.hash'))
            p2.keyboard.press('Escape'); p2.wait_for_timeout(300)
            check(f'Drawer closes with Escape, focus returns @{w}', not p2.is_visible('#filters') and p2.evaluate("document.activeElement.id === 'filter-toggle'"))
            p2.screenshot(path=f'{OUT}/shop-drawer-{w}.png')
            p2.click('#filter-toggle'); p2.wait_for_timeout(300)
            p2.screenshot(path=f'{OUT}/shop-drawer-open-{w}.png')
        # touch target sizes
        p2.goto(URL + '#/shop'); p2.wait_for_timeout(300)
        small = p2.evaluate("Array.from(document.querySelectorAll('main button, main a.btn, header button, header a')).filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.height < 32; }).map(e => e.textContent.trim().slice(0,20))")
        check(f'Touch targets ≥32px tall @{w}', len(small) == 0, small)
        # fixed widgets overlap: only toast/dialog/drawer are fixed
        fixed = p2.evaluate("Array.from(document.querySelectorAll('body *')).filter(e => getComputedStyle(e).position === 'fixed' && getComputedStyle(e).display !== 'none' && !e.hidden).map(e => e.id || e.className)")
        check(f'No overlapping floating widgets @{w}', all(f in ('toast', 'skip', 'drawer-backdrop', 'filters', 'filter-panel') or 'filter-panel' in str(f) or 'skip' in str(f) for f in fixed), fixed)
        ctx2.close()

    # image fallback
    go(pg, '#/shop')
    pg.evaluate("window.NYCE_ASSETS.equipment = 'assets/images/missing.webp'")
    pg2 = ctx.new_page()
    # Simulate a missing/corrupt equipment image for both http and file:// builds by intercepting the asset map.
    pg2.add_init_script("Object.defineProperty(window,'NYCE_ASSETS',{configurable:true,set(v){this.__a={...v,equipment:'data:image/webp;base64,AAAA'}},get(){return this.__a}})")
    pg2.goto(URL + '#/shop'); pg2.wait_for_timeout(600)
    check('Missing equipment image shows placeholder fallback', pg2.locator('.photo img[src$="placeholder.svg"], .photo img[src^="data:image/svg"]').count() >= 1 and pg2.locator('.photo-fallback').count() >= 1)
    pg2.close()
    pg3 = ctx.new_page()
    pg3.add_init_script("Object.defineProperty(window,'NYCE_ASSETS',{configurable:true,set(v){this.__a={...v,logo:'data:image/webp;base64,AAAA'}},get(){return this.__a}})")
    pg3.goto(URL + '#/'); pg3.wait_for_timeout(600)
    check('Missing logo shows wordmark fallback', pg3.locator('.logo-text').count() >= 1 and pg3.locator('#brand-logo').count() == 0)
    pg3.close()

    # image proportions: card images equal aspect
    go(pg, '#/shop')
    ratios = pg.evaluate("Array.from(document.querySelectorAll('.product-media .photo')).map(e => { const r = e.getBoundingClientRect(); return Math.round(r.width / r.height * 100) / 100; })")
    check('Product card images share one aspect ratio', len(set(ratios)) == 1, set(ratios))

    # relative paths under subpath
    if URL.startswith('http'):
        bad = pg.evaluate("Array.from(document.querySelectorAll('script[src], link[href], img[src]')).map(e => e.src || e.href).filter(u => u && !u.startsWith(location.href.split('#')[0].replace(/index\\.html$/, '')))")
        check('Repository subpath: all asset URLs resolve beneath site root', len(bad) == 0, bad)
        internal = pg.evaluate("Array.from(document.querySelectorAll('a[href]')).map(a=>a.getAttribute('href')).filter(h => h.startsWith('/'))")
        check('No root-absolute internal links', len(internal) == 0, internal)

    check('No JavaScript console errors during tested workflows', len(console_errors) == 0, console_errors[:5])
    browser.close()

report = {'url': URL, 'label': LABEL, 'passed': sum(r['result'] == 'PASS' for r in results), 'failed': sum(r['result'] == 'FAIL' for r in results), 'console_errors': console_errors, 'results': results}
json.dump(report, open(f'{OUT}/report.json', 'w'), indent=2)
print(f"\n{LABEL}: {report['passed']} passed, {report['failed']} failed")
