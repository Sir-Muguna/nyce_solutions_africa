"""Acceptance checks for the NYCE SOLUTIONS catalogue, executed in headless Chromium.

Usage: python3 acceptance.py <url> <label>
Writes a JSON report and screenshots to ./test-output/<label>/."""
import re, json, sys, os, time, urllib.parse, pathlib, subprocess
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

# Same-document navigation: keeps in-page test data (such as TEST_SKU) that a full reload would discard.
def hash_go(pg, hash_, wait=250):
    pg.evaluate('h => { location.hash = h; }', hash_)
    pg.wait_for_timeout(wait)

TEST_SKU = 'NYCE-TEST-001'

def no_overflow(pg):
    return pg.evaluate('document.documentElement.scrollWidth <= window.innerWidth + 1')

def shared_card_contract(pg, selector):
    return pg.locator(selector).evaluate_all('''els => els.length > 0 && els.every(e => {
        const p = NYCE.products.find(x => x.id === e.dataset.productId);
        const hasStock = Object.hasOwn(p, "stock") && p.stock !== undefined && p.stock !== null && p.stock !== "";
        const image = e.querySelector(".product-media .photo").getBoundingClientRect();
        return e.className === "product-card"
          && e.querySelector(".product-content h2, .product-content h3")
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
    nav_texts = pg.eval_on_selector_all('#primary-nav > a, #primary-nav > .nav-menu > .nav-menu-toggle', 'els => els.map(e => e.textContent.trim())')
    check('Nav: no "Shop by Category" tab', 'Shop by Category' not in ' '.join(nav_texts), nav_texts)
    check('Nav: Home, About Us, Categories, Shop, Business & Bulk Order, Contact', nav_texts == ['Home', 'About Us', 'Categories', 'Shop', 'Business & Bulk Order', 'Contact'], nav_texts)
    mobile_nav_texts = pg.eval_on_selector_all('#nav-drawer .drawer-links > li > a, #nav-drawer .drawer-links > li > details > summary', 'els => els.map(e => e.textContent.trim())')
    check('Mobile nav follows the same six-item order', mobile_nav_texts == nav_texts, mobile_nav_texts)
    check('Nav: Categories is a disclosure button controlling the category menu', pg.get_attribute('#categories-toggle', 'aria-controls') == 'category-menu' and pg.get_attribute('#categories-toggle', 'aria-expanded') == 'false' and pg.evaluate("document.getElementById('categories-toggle').tagName") == 'BUTTON')
    check('Nav: Business and Contact links use existing routes', pg.get_attribute('#primary-nav a[data-nav="business"]', 'href') == '#/business' and pg.get_attribute('#primary-nav a[data-nav="contact"]', 'href') == '#/contact')
    check('Header: no promotional banner or carousel', pg.locator('header .utility, header .promo, header .carousel').count() == 0)
    check('Header: visible named search input', pg.is_visible('#search-input') and pg.get_attribute('label[for="search-input"]', 'class') == 'sr-only')
    footer_channels = pg.eval_on_selector('#footer-contact', 'e => ({text:e.innerText, links:Array.from(e.querySelectorAll("a"), a => [a.textContent.trim(), a.getAttribute("href"), a.target, a.rel])})')
    check('Footer shows all four configured contact channels', all(value in footer_channels['text'] for value in ['+254720384496', 'sales@nycesolutionsafrica.com', 'nycesolutionsafrica', 'www.nycesolutionsafrica.com']), footer_channels['text'])
    check('Footer WhatsApp and email links use required destinations', any(link[:2] == ['+254720384496', 'https://wa.me/254720384496'] for link in footer_channels['links']) and any(link[:2] == ['sales@nycesolutionsafrica.com', 'mailto:sales@nycesolutionsafrica.com'] for link in footer_channels['links']), footer_channels['links'])
    facebook_link = next((link for link in footer_channels['links'] if link[0] == 'nycesolutionsafrica'), None)
    check('Footer Facebook link opens safely in a new tab', facebook_link == ['nycesolutionsafrica', 'https://www.facebook.com/nycesolutionsafrica', '_blank', 'noopener noreferrer'], facebook_link)
    check('Footer website links to requested domain', any(link[:2] == ['www.nycesolutionsafrica.com', 'https://www.nycesolutionsafrica.com'] for link in footer_channels['links']), footer_channels['links'])
    footer_links = pg.eval_on_selector_all('footer a', 'els => els.map(e => e.getAttribute("href"))')
    check('Footer: no category directory or guide links', not any(h and ('#/categories' in h or '#/category/' in h or 'guide' in h) for h in footer_links), footer_links)
    check('Footer: no "Shop by Category" text', 'Shop by Category' not in pg.inner_text('footer'))
    check('Footer Help & information contains only the original policy links', pg.locator('nav[aria-labelledby="footer-help"] > a[data-policy-link]').count() == 4 and pg.locator('#footer-business-help, .footer-help-list, .footer-subheading').count() == 0)
    home_classes = pg.eval_on_selector_all('main > *', 'els => els.map(e => e.classList[0])')
    home_middle = home_classes[2:-2]
    check('Home: hero, categories, 1-4 product rows, customer segments, trust strip, CTA render in order', home_classes[:2] == ['home-hero', 'home-categories'] and home_classes[-2:] == ['home-trust-strip', 'home-cta-band'] and 1 <= home_middle.count('home-product-section') <= 4 and home_middle == ['home-product-section'] * home_middle.count('home-product-section') + ['home-segments'], home_classes)
    check('Home: cards use shared template and render available data only', shared_card_contract(pg, '.home-product-section .product-card'))
    check('Home: no carousel or auto-playing slider', pg.locator('main [aria-roledescription="carousel"], main .carousel, main [autoplay]').count() == 0)

    for href, nav in [('#/shop', 'shop'), ('#/', 'home')]:
        go(pg, href)
        active = pg.get_attribute(f'#primary-nav a[data-nav="{nav}"]', 'aria-current')
        check(f'Nav link works + active state: {href}', pg.locator('main h1').count() >= 1 and active == 'page', f'aria-current={active}')
    for href in ['#/business', '#/about', '#/contact', '#/cart']:
        go(pg, href)
        check(f'Existing route still resolves: {href}', pg.locator('main h1').count() == 1, pg.inner_text('main h1'))
    go(pg, '#/contact')
    contact_links = pg.eval_on_selector_all('main .info-list a', 'els => els.map(a => [a.textContent.trim(), a.getAttribute("href")])')
    check('Contact page uses configured WhatsApp and email links', ['+254720384496', 'https://wa.me/254720384496'] in contact_links and ['sales@nycesolutionsafrica.com', 'mailto:sales@nycesolutionsafrica.com'] in contact_links, contact_links)

    # legacy routes
    go(pg, '#/categories')
    check('Legacy #/categories → #/shop', pg.evaluate('location.hash') == '#/shop', pg.evaluate('location.hash'))
    go(pg, '#/category/water')
    check('Legacy #/category/water → shop?category=water', pg.evaluate('location.hash') == '#/shop?category=water' and 'Borehole & Water Solutions' in pg.inner_text('main h1'), pg.evaluate('location.hash'))
    go(pg, '#/category/generators/generators-5')
    h = pg.evaluate('location.hash')
    check('Legacy #/category/generators/generators-5 → both filters', 'category=generators' in h and 'subcategory=generators-5' in h and 'Silent Canopy Generators' in pg.inner_text('main h1'), h)
    go(pg, '#/category/does-not-exist')
    check('Legacy unknown category → not found', 'Page not found' in pg.inner_text('main h1'))
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
    check('Catalogue: 6 categories', data['cats'] == 6, data)
    check('Catalogue: 58 subcategories', data['subs'] == 58, data)
    names = pg.evaluate('({subs: NYCE.categories.flatMap(c => c.subcategories.map(s => s.name.toLowerCase())), clash: NYCE.categories.filter(c => c.subcategories.some(s => s.name.toLowerCase() === c.name.toLowerCase())).map(c => c.id)})')
    check('Taxonomy: subcategory names are unique and none repeats its category name', len(names['subs']) == len(set(names['subs'])) and not names['clash'], names['clash'])
    root = pathlib.Path(__file__).resolve().parent.parent
    val = subprocess.run([sys.executable, str(root / 'tools' / 'validate-catalogue.py'), '--quiet'], capture_output=True, text=True, encoding='utf-8')
    check('Catalogue validator: 0 schema errors', val.returncode == 0 and 'schema errors: 0' in val.stdout, val.stdout[-300:] + val.stderr[-300:])
    tpl = json.loads((root / 'docs' / 'product-template.json').read_text(encoding='utf-8'))
    live_fields = set(pg.evaluate('Object.keys(NYCE.products[0])'))
    check('Product template covers every live field and every subcategory', live_fields <= set(tpl['product']) and set(tpl['requiredSpecsBySubcategory']) == {s for c in pg.evaluate('NYCE.categories.map(c => c.subcategories.map(s => s.id))') for s in c}, sorted(live_fields - set(tpl['product'])))
    pg.evaluate("Object.assign(NYCE.products.find(p => p.id === 'starter-solar'), {evidenceStatus: 'owner-supplied', stock: 'In stock'})")
    hash_go(pg, '#/product/starter-solar')
    check('Owner-supplied records show their specifications and availability', pg.locator('.spec-preview').count() == 1 and 'In stock' in pg.inner_text('.key-facts'))
    pg.reload(); pg.wait_for_timeout(250)
    drafts_file = root / 'data' / 'catalogue-drafts.json'
    if drafts_file.exists():
        dr = json.loads(drafts_file.read_text(encoding='utf-8'))
        live_ids = set(pg.evaluate('NYCE.allProducts.map(p => p.id)'))
        draft_ids = [d['record']['id'] for d in dr['drafts']]
        check('Draft import: no structural errors and every unverified draft lists its publication blockers', all(not d['review']['structuralErrors'] for d in dr['drafts']) and all(d['review']['publicationBlockers'] for d in dr['drafts'] if d['record'].get('verificationStatus') != 'verified'), len(dr['drafts']))
        check('Draft import: drafts are not published and do not collide with live IDs', not (set(draft_ids) & live_ids) and len(draft_ids) == len(set(draft_ids)), sorted(set(draft_ids) & live_ids)[:3])
        hash_go(pg, '#/shop?q=' + urllib.parse.quote('Kukumom'))
        check('Draft import: draft products are not searchable on the site', pg.locator('.product-card').count() == 0)
    dctx = browser.new_context(viewport={'width': 1280, 'height': 900})
    dp = dctx.new_page()
    cat_js = (root / 'assets' / 'js' / 'catalogue.js').read_text(encoding='utf-8').replace('"id": "starter-solar",', '"id": "starter-solar", "verificationStatus": "draft",', 1)
    dp.route('**/assets/js/catalogue.js', lambda route: route.fulfill(body=cat_js, content_type='application/javascript'))
    dp.goto(URL + '#/product/starter-solar'); dp.wait_for_timeout(300)
    check('A record marked verificationStatus "draft" is hidden from every page', dp.locator('main .route-error').count() == 1 and not dp.evaluate("NYCE.products.some(p => p.id === 'starter-solar')"))
    dctx.close()
    for old in ['#/shop?category=water&subcategory=water-2', '#/category/water/water-2']:
        go(pg, old)
        check(f'Retired subcategory link {old} redirects to the merged Solar DC Borehole Pumps', pg.evaluate('location.hash') == '#/shop?category=solar&subcategory=solar-7' and pg.inner_text('main h1') == 'Solar DC Borehole Pumps', pg.evaluate('location.hash'))
    check('Catalogue: 144 unique product records', data['products'] == 144 and data['unique'] == 144, data)
    enquiries = pg.evaluate('NYCE.products.filter(p => p.sourceClassification === "enquiry-only")')
    check('Enquiry publication: exactly 96 approved records with no technical, price or stock claims', len(enquiries) == 96 and all(p['approved'] and p.get('verificationStatus') != 'verified' and p['priceType'] == 'quote' and p['price'] is None and p.get('stock') is None and not p['specs'] and p['brand'] is None and p['model'] is None and p['sku'] is None for p in enquiries))
    check('Enquiry publication: every image is the neutral placeholder', all(p['image']['src'] == 'assets/images/placeholder.svg' and 'unavailable' in p['alt'].lower() for p in enquiries))
    enquiry_errors = []
    for item in enquiries:
        hash_go(pg, '#/product/' + item['id'], 30)
        images = pg.locator('#gallery-content img, .thumb img').evaluate_all('els => els.map(e => e.getAttribute("src"))')
        link = pg.locator('a[data-wa-quote]').get_attribute('href') or ''
        message = urllib.parse.parse_qs(urllib.parse.urlsplit(link).query).get('text', [''])[0]
        if not (pg.locator('main h1').inner_text() == item['name'] and pg.locator('.detail-actions [data-add]').count() == 0 and pg.locator('.detail-actions [data-quote]').count() == 1 and pg.locator('.spec-preview').count() == 0 and len(images) == 2 and all(image == 'assets/images/placeholder.svg' for image in images) and item['name'] in message and 'quotation request' in message.lower()):
            enquiry_errors.append(item['id'])
    check('Enquiry publication: all 96 detail pages have placeholders, quote-only actions and product-specific WhatsApp messages', not enquiry_errors, enquiry_errors)
    sub_ids = pg.evaluate('NYCE.categories.flatMap(c => c.subcategories.map(s => [c.id, s.id, s.name, NYCE.products.filter(p => p.subcategories.includes(s.id)).length]))')
    for cid, sid, sname, expected_n in sub_ids:
        go(pg, f'#/shop?category={cid}&subcategory={sid}', 120)
        n = pg.locator('.product-card').count()
        h1 = pg.inner_text('main h1')
        # Subcategories with no published products must show the empty state, not an error.
        listed = n == min(expected_n, 12) if expected_n else (n == 0 and pg.locator('.empty').count() == 1)
        if not listed or h1.strip() != sname:
            check(f'Subcategory listing {sid}', False, f'{n} cards (expected {expected_n}), h1={h1}')
    check('All 58 subcategory routes list their products (or the empty state) with the correct heading', all(r['result'] == 'PASS' for r in results if r['check'].startswith('Subcategory listing')) and True)
    # the removed product-filter panel stays absent
    go(pg, '#/shop')
    check('Shop filter panel and drawer toggle are removed', pg.locator('#filters, #filter-toggle, #drawer-backdrop').count() == 0)
    check('Category navigation remains available in the shared header', pg.locator('#primary-nav').count() == 1 and pg.locator('#menu-button').count() == 1)
    go(pg, '#/shop?category=solar')
    check('Category routes still filter the product grid without the panel', 'category=solar' in pg.evaluate('location.hash') and pg.locator('.product-card').count() > 0 and pg.locator('#filters').count() == 0)
    check('Category and subcategory navigation has no item-count badges', pg.locator('.nav-count').count() == 0 and pg.locator('.browse-nav a').count() > 0)
    check('Existing equipment graphics are restored with representative labels; imported placeholders remain neutral', pg.locator('.product-media .photo svg').count() > 0 and pg.locator('.product-media .photo-label').count() == pg.locator('.product-media .photo svg').count())

    # ---------- Search ----------
    # No live record carries a SKU yet, so SKU matching is exercised with a test SKU set in the page only.
    go(pg, '#/shop')
    pg.evaluate(f"NYCE.products.find(p => p.id === 'hisaki-generator').sku = '{TEST_SKU}'")
    for q, expect in [('hisaki', 'hisaki-generator'), (TEST_SKU, 'hisaki-generator'), ('Hisaki 8.75 kVA diesel generator', 'hisaki-generator')]:
        hash_go(pg, '#/shop?q=' + urllib.parse.quote(q))
        ids = pg.eval_on_selector_all('.product-card', 'els => els.map(e => e.dataset.productId)')
        check(f'Search "{q}" finds {expect}', expect in ids, ids[:6])
        if q == TEST_SKU:
            check('SKU search uses shared product-card template', shared_card_contract(pg, '.product-card'))
    pg.reload(); pg.wait_for_timeout(250)
    go(pg, '#/shop?category=electrical')
    check('Category listing uses shared product-card template', shared_card_contract(pg, '.product-card'))
    card_wa = pg.evaluate("[...document.querySelectorAll('.product-card')].map(e => [e.dataset.productId, decodeURIComponent((e.querySelector('a[href^=\"https://wa.me/\"]') || {href: ''}).href)])")
    check("Card WhatsApp links carry that product's enquiry", all(f'#/product/{pid}' in href and 'I\u2019m interested in ' in href and 'Quantity required: 1' in href for pid, href in card_wa), card_wa[:1])
    for q, expect in [('Doyin', 'doyin-solar-pump'), ('generators', 'pulsar-generator'), ('Solar DC Borehole Pumps', 'doyin-solar-pump')]:
        go(pg, '#/shop?q=' + urllib.parse.quote(q))
        ids = pg.eval_on_selector_all('.product-card', 'els => els.map(e => e.dataset.productId)')
        for page_number in range(2, -(-data['products'] // 12) + 1):
            if expect in ids:
                break
            go(pg, '#/shop?q=' + urllib.parse.quote(q) + '&page=' + str(page_number))
            ids += pg.eval_on_selector_all('.product-card', 'els => els.map(e => e.dataset.productId)')
        check(f'Search matches brand / category / subcategory names: "{q}"', expect in ids, ids[:6])
    go(pg, '#/shop?category=generators')
    check('Pricing, application, power and phase dropdowns are removed', pg.locator('.filter-bar, #filter-pricing, #filter-application, #filter-power, #filter-phase').count() == 0)
    go(pg, '#/shop?category=generators&power=Diesel')
    powers = pg.evaluate("[...document.querySelectorAll('.product-card')].map(e => NYCE.products.find(p => p.id === e.dataset.productId).power)")
    check('Existing filtered URLs still work without the dropdown bar', pg.locator('.filter-bar').count() == 0 and powers and set(powers) == {'Diesel'}, powers)
    pg.click('.chip[data-remove-filter="power"]'); pg.wait_for_timeout(250)
    check('Existing filter chips can clear URL filters', 'power=' not in pg.evaluate('location.hash'))
    go(pg, '#/shop?category=electrical&subcategory=electrical-8')
    check('No filter bar when nothing can be split', pg.locator('.filter-bar').count() == 0)
    go(pg, '#/shop?q=' + urllib.parse.quote('HK7000SNA'))
    check('Search excludes model-only terms', pg.locator('.product-card').count() == 0)
    check('Search empty state is factual and includes query/count', 'No products match “HK7000SNA”.' in pg.inner_text('.empty') and '0 products' in pg.inner_text('.search-results-summary'))
    go(pg, '#/shop'); pg.fill('#search-input', 'borehole'); pg.press('#search-input', 'Enter'); pg.wait_for_timeout(250)
    check('Header search submits to #/shop?q= and displays query/count', 'q=borehole' in pg.evaluate('location.hash') and 'borehole' in pg.inner_text('.search-results-summary') and 'products' in pg.inner_text('.search-results-summary'))

    # ---------- Filters ----------
    go(pg, '#/shop?category=generators&phase=' + urllib.parse.quote('Three phase'))
    ids = pg.eval_on_selector_all('.product-card', 'els => els.map(e => e.dataset.productId)')
    check('Existing category and phase filtering still applies from route state', ids == ['pulsar-generator'], ids)
    chips = pg.eval_on_selector_all('.chip', 'els => els.map(e => e.textContent.trim())')
    check('Active filter chips shown', len(chips) == 2, chips)
    pg.click('.chip[data-remove-filter="phase"]'); pg.wait_for_timeout(250)
    check('Individual chip removal', pg.locator('.chip').count() == 1 and 'phase' not in pg.evaluate('location.hash'))
    pg.click('.chips .clear-all'); pg.wait_for_timeout(250)
    check('Clear all filters → #/shop', pg.evaluate('location.hash') == '#/shop' and pg.locator('.chip').count() == 0)
    go(pg, '#/shop?category=solar&page=2')
    go(pg, '#/shop?category=water')
    check('Changing category route resets pagination', 'page=' not in pg.evaluate('location.hash') and 'category=water' in pg.evaluate('location.hash'))
    go(pg, '#/shop?q=zzzzqqq')
    check('Empty results display factual query and count', pg.locator('.empty').count() == 1 and 'No products match “zzzzqqq”.' in pg.inner_text('.empty') and '0 products' in pg.inner_text('.search-results-summary'))

    # ---------- Sorting ----------
    go(pg, '#/shop?sort=az')
    names = pg.eval_on_selector_all('.product-card h2', 'els => els.map(e => e.textContent.trim())')
    expected_names = pg.evaluate('NYCE.products.map(p => p.name).sort((a,b) => a.localeCompare(b)).slice(0,12)')
    check('Sort A–Z', names == expected_names, names[:4])
    go(pg, '#/shop?sort=price-asc&pricing=demo')
    prices = pg.evaluate("Array.from(document.querySelectorAll('.product-card')).map(e => NYCE.products.find(p=>p.id===e.dataset.productId).price)")
    check('Sort price low→high', prices == sorted(prices), prices)
    go(pg, '#/shop?sort=price-desc')
    prices = pg.evaluate("Array.from(document.querySelectorAll('.product-card')).map(e => NYCE.products.find(p=>p.id===e.dataset.productId).price)")
    n_priced = sum(p is not None for p in prices)
    check('Sort price high→low (priced first)', n_priced > 0 and prices[:n_priced] == sorted(prices[:n_priced], reverse=True) and all(p is None for p in prices[n_priced:]), prices[:n_priced + 1])
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
    facts = pg.eval_on_selector_all('.key-facts > div', 'els => els.map(e => [e.querySelector("dt").textContent, e.querySelector("dd").textContent])')
    check('Product: key facts show verified brand and To Be Confirmed availability', ['Brand', 'Hisaki'] in facts and ['Availability', 'To Be Confirmed'] in facts and not any(k == 'SKU' for k, _ in facts), facts)
    check('Product: verified record shows its specifications', pg.locator('.spec-preview').count() == 1 and pg.locator('#panel-specifications .spec-table tr').count() >= 1)
    # add to cart priced
    pg.click('[data-add="hisaki-generator"]'); pg.wait_for_timeout(150)
    check('Cart: add priced product (qty 3)', pg.evaluate('NYCE.getCart()') == {'hisaki-generator': 3} and pg.inner_text('#cart-count') == '3')
    hash_go(pg, '#/product/starter-solar')
    il = pg.evaluate("({facts: [...document.querySelectorAll('.key-facts dd')].map(d => d.textContent), preview: document.querySelectorAll('.spec-preview').length, table: document.querySelectorAll('.spec-table').length, specText: document.getElementById('panel-specifications').textContent, tag: document.querySelectorAll('.detail-copy .tag').length})")
    check('Product: unverified record shows To Be Confirmed instead of planning specs or evidence tags', il['facts'][:3] == ['To Be Confirmed'] * 3 and il['preview'] == 0 and il['table'] == 0 and 'To Be Confirmed' in il['specText'] and il['tag'] == 0, il)
    hash_go(pg, '#/product/hisaki-generator')
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

    recovery_cases = [
        ('malformed JSON', '{broken', {}),
        ('null payload', 'null', {}),
        ('array payload', '[]', {}),
        ('stale and invalid items', json.dumps({'missing-product': 2, 'hisaki-generator': -1, 'tolsen-hoist': 0, 'doyin-solar-pump': 1}), {}),
        ('mixed valid and invalid items', json.dumps({'hisaki-generator': 2, 'missing-product': 1, 'tolsen-hoist': 'bad'}), {'hisaki-generator': 2}),
    ]
    for scenario, stored, expected_cart in recovery_cases:
        recovery_context = browser.new_context()
        recovery_page = recovery_context.new_page()
        recovery_page.goto(URL)
        recovery_page.evaluate('(value) => localStorage.setItem("nyce-demo-cart-v2", value)', stored)
        recovery_page.goto(URL + '#/cart')
        recovery_page.reload()
        recovery_page.locator('main h1').wait_for()
        restored = recovery_page.evaluate('NYCE.getCart()')
        check(f'Stored cart recovery: {scenario}', restored == expected_cart, restored)
        recovery_context.close()
    blocked_context = browser.new_context()
    blocked_page = blocked_context.new_page(); blocked_errors = []
    blocked_page.on('pageerror', lambda error: blocked_errors.append(str(error)))
    blocked_page.add_init_script("Object.defineProperty(window, 'localStorage', {get(){throw new DOMException('Storage blocked', 'SecurityError')}})")
    blocked_page.goto(URL + '#/product/hisaki-generator')
    blocked_page.locator('.detail-actions [data-add]').click()
    hash_go(blocked_page, '#/cart')
    check('Blocked browser storage: cart remains usable in memory without crashing', blocked_page.evaluate('NYCE.getCart()') == {'hisaki-generator': 1} and not blocked_errors, blocked_errors)
    blocked_context.close()

    product_link_errors = []
    all_product_ids = pg.evaluate('NYCE.products.map(product => product.id)')
    for identifier in all_product_ids:
        hash_go(pg, '#/product/' + identifier, 30)
        links = pg.locator('main a[href^="#/product/"]').evaluate_all('els => els.map(element => element.getAttribute("href").slice(10))')
        if pg.locator('.route-error').count() or pg.locator('main h1').count() != 1 or any(link not in all_product_ids for link in links):
            product_link_errors.append(identifier)
    check('All 144 product-detail and related-product links resolve to current records', not product_link_errors, product_link_errors)

    # ---------- WhatsApp: "Request a Quote on WhatsApp" from the product page ----------
    # wa.me is answered locally so clicks can be verified without leaving the test machine.
    ctx.route('https://wa.me/**', lambda route: route.fulfill(body='wa', content_type='text/plain'))
    def wa_click(page, selector, action='click'):
        with page.expect_popup() as info:
            getattr(page, action)(selector)
        pop = info.value; url = pop.url; pop.close()
        base, _, text = url.partition('?text=')
        return base, text, urllib.parse.unquote(text)
    go(pg, '#/product/hisaki-generator')
    pg.evaluate(f"NYCE.products.find(p => p.id === 'hisaki-generator').sku = '{TEST_SKU}'")
    hash_go(pg, '#/shop'); hash_go(pg, '#/product/hisaki-generator')
    ctas = pg.eval_on_selector_all('.detail-actions .btn.wa, .detail-actions [data-wa]', 'els => els.map(e => e.textContent.trim())')
    check('Product page has exactly one WhatsApp CTA labelled "Request a Quote on WhatsApp"', ctas == ['Request a Quote on WhatsApp'], ctas)
    pg.fill('#detail-qty', '4')
    base, raw, msg = wa_click(pg, '.detail-actions a[data-wa-quote]')
    required = [f'Hello Nyce Solutions, I\u2019m interested in Hisaki 8.75 kVA diesel generator (SKU {TEST_SKU}, Model HK7000SNA).', 'Please confirm:', '- Current price and availability', '- Delivery options to', '- Installation and warranty options, where applicable', 'Quantity required: 4', 'Product link: ', '#/product/hisaki-generator', 'This is a quotation request, not a confirmed order.']
    check('WhatsApp quote message (product with SKU) contains every required field', all(r in msg for r in required), [r for r in required if r not in msg])
    check('WhatsApp quote uses the configured number', base == 'https://wa.me/254720384496', base)
    check('WhatsApp quote message is URL-encoded correctly', ' ' not in raw and '\n' not in raw and '%0A' in raw and '%E2%80%99' in raw and urllib.parse.unquote(raw) == msg, raw[:80])
    check('WhatsApp quote never claims a confirmed order or payment', 'order confirmed' not in msg.lower() and 'payment' not in msg.lower() and 'Displayed price' not in msg)
    pg.click('[data-qty-step="1"]')
    check('Quantity stepper keeps the WhatsApp link current (long-press / new-tab safe)', 'Quantity%20required%3A%205' in pg.get_attribute('.detail-actions a[data-wa-quote]', 'href'))
    pages_before = len(ctx.pages)
    pg.fill('#detail-qty', '0'); pg.click('.detail-actions a[data-wa-quote]'); pg.wait_for_timeout(300)
    check('An invalid quantity blocks the WhatsApp quote and shows validation', len(ctx.pages) == pages_before and not pg.evaluate("document.getElementById('detail-qty').checkValidity()"))
    go(pg, '#/product/lenhard-welder'); pg.fill('#detail-qty', '2')
    _, _, msg = wa_click(pg, '.detail-actions a[data-wa-quote]')
    check('WhatsApp quote message (no SKU, model only) shows the model', 'I\u2019m interested in Lenhard MM-300 inverter welder (Model MM-300).' in msg and 'Quantity required: 2' in msg and 'SKU' not in msg, msg[:120])
    go(pg, '#/product/starter-solar')
    _, _, msg = wa_click(pg, '.detail-actions a[data-wa-quote]')
    check('WhatsApp quote message (no SKU or model) omits the reference rather than inventing one', 'I\u2019m interested in Starter lithium solar kit.\n' in msg and 'Quantity required: 1' in msg and '()' not in msg, msg[:120])
    check('Quote-only product keeps the online quote form as its second action', pg.locator('.detail-actions [data-quote]').count() == 1 and pg.locator('.detail-actions [data-add]').count() == 0)
    mctx = browser.new_context(viewport={'width': 375, 'height': 812}, is_mobile=True, has_touch=True)
    mctx.route('https://wa.me/**', lambda route: route.fulfill(body='wa', content_type='text/plain'))
    mp = mctx.new_page(); mp.goto(URL + '#/product/hisaki-generator'); mp.wait_for_timeout(300)
    mp.fill('#detail-qty', '3')
    mbase, _, mmsg = wa_click(mp, '.detail-actions a[data-wa-quote]', 'tap')
    check('WhatsApp quote works by touch on mobile', mbase == 'https://wa.me/254720384496' and 'Quantity required: 3' in mmsg and 'Hisaki 8.75 kVA diesel generator (Model HK7000SNA)' in mmsg, mmsg[:100])
    mctx.close()

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

    # ---------- Full purchasing / enquiry journey ----------
    jctx = browser.new_context(viewport={'width': 1280, 'height': 900})
    j = jctx.new_page(); j_errors = []
    j.on('pageerror', lambda e: j_errors.append(str(e)))
    j.goto(URL + '#/'); j.wait_for_timeout(300)
    j.fill('#search-input', 'hisaki'); j.press('#search-input', 'Enter'); j.wait_for_timeout(250)
    j.click('.product-card[data-product-id="hisaki-generator"] .card-actions a[href^="#/product/"]'); j.wait_for_timeout(250)
    check('Journey: search leads to the product page', j.evaluate('location.hash') == '#/product/hisaki-generator' and 'Hisaki' in j.inner_text('main h1'))
    j.fill('#detail-qty', '2'); j.dblclick('[data-add="hisaki-generator"]'); j.wait_for_timeout(200)
    check('Journey: a double click adds the quantity once', j.evaluate('NYCE.getCart()') == {'hisaki-generator': 2}, j.evaluate('NYCE.getCart()'))
    j.fill('#detail-qty', '0'); j.click('[data-add="hisaki-generator"]'); j.wait_for_timeout(150)
    check('Journey: an invalid quantity is rejected', j.evaluate('NYCE.getCart()') == {'hisaki-generator': 2} and j.evaluate("!document.getElementById('detail-qty').checkValidity()"))
    hash_go(j, '#/product/tolsen-hoist'); j.click('[data-add="tolsen-hoist"]'); j.wait_for_timeout(150)
    hash_go(j, '#/cart')
    j.fill('#cart-qty-hisaki-generator', '500'); j.dispatch_event('#cart-qty-hisaki-generator', 'change'); j.wait_for_timeout(150)
    check('Journey: an out-of-range cart quantity is reverted with a message', j.input_value('#cart-qty-hisaki-generator') == '2' and j.evaluate('NYCE.getCart()')['hisaki-generator'] == 2 and 'kept at 2' in j.inner_text('#toast'))
    j.click('[data-remove="tolsen-hoist"]'); j.wait_for_timeout(150); j.click('[data-undo-cart]'); j.wait_for_timeout(150)
    check('Journey: Undo restores a removed cart item', j.evaluate('NYCE.getCart()') == {'hisaki-generator': 2, 'tolsen-hoist': 1} and j.locator('.cart-item').count() == 2)
    other = jctx.new_page(); other.goto(URL + '#/'); other.wait_for_timeout(300)
    check('Journey: cart state is shared with another tab via the existing storage', other.inner_text('#cart-count') == '3')
    hash_go(j, '#/checkout')
    table_total = j.inner_text('.data-table tfoot')
    text = j.inner_text('main')
    check('Journey: checkout separates an enquiry from a confirmed order', j.locator('.order-steps li').count() == 3 and 'Only when you accept the written quotation' in text and not re.search(r'(?i)prototype|demonstration', text))
    j.click('[data-cart-wa]'); j.wait_for_timeout(200)
    msg = j.input_value('#message-preview')
    subtotal = j.evaluate('NYCE.getTotal()')
    check('Journey: WhatsApp list matches the checkout quantities, line totals and subtotal', 'Quantity: 2' in msg and 'Line total: KES 335,980' in msg and 'Line total: KES 32,995' in msg and 'Total quantity: 3' in msg and f"KES {subtotal:,}" in msg and f"KES {subtotal:,}" in table_total and 'This is an enquiry, not an order.' in msg, msg[-260:])
    j.keyboard.press('Escape')
    hash_go(j, '#/business?from=cart')
    check('Journey: quotation request is prefilled with the same list, total quantity and subtotal', 'Line total: KES 335,980' in j.input_value('#enq-message') and f"KES {subtotal:,}" in j.input_value('#enq-message') and j.input_value('#enq-qty') == '3')
    j.fill('#enq-name', 'Test Buyer'); j.fill('#enq-email', 'buyer@example.com'); j.fill('#enq-location', 'Nakuru, Kenya'); j.select_option('#enq-topic', 'Quotation request'); j.fill('#enq-phone', 'abc')
    j.click('#enquiry-form button[type=submit]'); j.wait_for_timeout(150)
    check('Journey: an invalid phone number shows an inline error', j.locator('[data-field="enq-phone"].invalid').count() == 1 and 'country code' in j.inner_text('#enq-phone-error'))
    j.fill('#enq-phone', '+254 712 345 678'); j.click('#enquiry-form button[type=submit]'); j.wait_for_timeout(200)
    fb = j.inner_text('#form-feedback')
    check('Journey: prepared request says it is not sent and not an order', 'ready to send' in fb and 'not an order' in fb and j.locator('#enq-demo').count() == 0)
    j.click('[data-form-preview]'); j.wait_for_timeout(200)
    preview = j.input_value('#message-preview')
    check('Journey: final WhatsApp action carries the full request', j.locator('#modal a[href^="https://wa.me/254720384496"]').count() == 1 and 'Phone: +254 712 345 678' in preview and 'Line total: KES 335,980' in preview and 'This is an enquiry, not an order.' in preview)
    j.keyboard.press('Escape')
    hash_go(j, '#/cart'); j.click('[data-clear-cart]'); j.wait_for_timeout(150)
    cleared = j.evaluate('NYCE.getCart()'); other.wait_for_timeout(150); other_after_clear = other.inner_text('#cart-count')
    j.click('[data-undo-cart]'); j.wait_for_timeout(150)
    check('Journey: Clear cart can be undone', cleared == {} and j.evaluate('NYCE.getCart()') == {'hisaki-generator': 2, 'tolsen-hoist': 1})
    check('Journey: an already-open tab updates live when the cart changes', other_after_clear == '0' and other.inner_text('#cart-count') == '3', [other_after_clear, other.inner_text('#cart-count')])
    check('Journey: no JavaScript errors', not j_errors, j_errors[:2])
    jctx.close()

    # ---------- Business content: About and Contact ----------
    go(pg, '#/about')
    about = pg.evaluate("({h1: document.querySelector('main h1').textContent, intro: document.querySelector('.page-intro p').textContent, sectors: [...document.querySelectorAll('.sector-grid h3')].map(h => h.textContent), sectorLinks: [...document.querySelectorAll('.sector-links a')].map(a => a.getAttribute('href')), facts: Object.fromEntries([...document.querySelectorAll('.company-facts > div')].map(d => [d.querySelector('dt').textContent, d.querySelector('dd').textContent])), text: document.querySelector('main').innerText})")
    check('About: verified company summary', about['h1'] == 'About NYCE SOLUTIONS' and 'Kenyan enterprise' in about['intro'] and 'procurement, retail and distribution' in about['intro'], about['intro'])
    check('About: the five business sectors in order', about['sectors'] == ['Solar and renewable energy', 'Generators and backup systems', 'Water and irrigation solutions', 'Industrial and construction machinery', 'Hardware and hand tools'], about['sectors'])
    check('About: domestic, agricultural, commercial and industrial customers in Kenya and other African markets', all(x in about['text'] for x in ['Domestic households', 'Agricultural operations', 'Commercial organisations', 'Industrial customers', 'Kenya and other African markets']))
    check('About: confirmed address and hours shown; remaining unknown details marked To Be Confirmed', about['facts'].get('Physical address', '').startswith('Spewigo Shopping Complex') and about['facts'].get('Operating hours', '').startswith('Monday to Saturday') and all(about['facts'].get(k, '').startswith('To Be Confirmed') for k in ['Company registration', 'Warranty terms', 'Delivery coverage']), about['facts'])
    no_claims = r'(?i)\b(founded|established in|since \d{4}|certified|certification|kebs|iso ?\d+|partner(s|ship)?|authori[sz]ed dealer|award|years of experience|branches|nationwide|countrywide|guarantee)\b'
    check('About: no invented history, certifications, partnerships or locations', not re.search(no_claims, about['text']), re.findall(no_claims, about['text'])[:3])
    sector_broken = []
    for href in about['sectorLinks']:
        go(pg, href, 150)
        if pg.locator('.route-error').count() or pg.locator('.product-card').count() == 0:
            sector_broken.append(href)
    check(f'About: all {len(about["sectorLinks"])} sector links open catalogue pages with products', len(about['sectorLinks']) >= 8 and not sector_broken, sector_broken)
    go(pg, '#/contact')
    ctext = pg.inner_text('main .info-list')
    check('Contact: confirmed address and hours shown; Facebook and website listed', 'Spewigo Shopping Complex, Basement 1, Shop 5, Price Road, Nairobi, Kenya' in ctext and 'Monday to Saturday, 8:00 a.m. – 5:00 p.m.' in ctext and 'To Be Confirmed' not in ctext and 'To be supplied' not in ctext and 'nycesolutionsafrica' in ctext and 'www.nycesolutionsafrica.com' in ctext, ctext)

    # ---------- Policy page calls to action ----------
    expected_cta = {
        'delivery': ('#/business?topic=Delivery+enquiry', 'Delivery enquiry', 'Delivery town or county and country'),
        'returns': ('#/contact?topic=Support+information', 'Support information', 'Quotation or invoice reference'),
        'privacy': ('#/contact', '', None),
        'terms': ('#/business?topic=Quotation+request', 'Quotation request', 'including payment terms'),
    }
    for key, (href, topic, msg_part) in expected_cta.items():
        go(pg, f'#/policy/{key}')
        cta = pg.evaluate("({title: (document.querySelector('.policy-cta h2') || {}).textContent, links: [...document.querySelectorAll('.policy-cta a')].map(a => a.getAttribute('href')), wa: document.querySelectorAll('.policy-cta [data-policy-wa]').length, reach: (document.querySelector('.policy-reach') || {}).textContent || '', headings: [...document.querySelectorAll('main h1, main h2, main h3')].map(h => Number(h.tagName[1]))})")
        check(f'Policy {key}: page-specific CTA with contact line and correct heading order', cta['title'] and href in cta['links'] and '+254720384496' in cta['reach'] and 'Monday to Saturday' in cta['reach'] and cta['headings'] == [1, 2], cta)
        if msg_part:
            pg.click('.policy-cta [data-policy-wa]'); pg.wait_for_timeout(200)
            msg = pg.input_value('#message-preview')
            check(f'Policy {key}: WhatsApp CTA opens a prefilled, honest enquiry', msg_part in msg and msg.startswith('Hello NYCE SOLUTIONS') and msg.endswith('This is an enquiry, not an order.') and pg.locator('#modal a[href^="https://wa.me/254720384496"]').count() == 1, msg[:120])
            pg.keyboard.press('Escape')
        else:
            check(f'Policy {key}: email CTA uses the configured address', 'mailto:sales@nycesolutionsafrica.com?subject=Privacy%20question' in cta['links'] and cta['wa'] == 0, cta['links'])
        pg.click(f'.policy-cta a[href="{href}"]'); pg.wait_for_timeout(250)
        check(f'Policy {key}: form CTA opens the form with the right topic', pg.evaluate('location.hash') == href and pg.input_value('#enq-topic') == topic, (pg.evaluate('location.hash'), pg.input_value('#enq-topic')))

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
        first_product = p2.locator('.home-product-section .product-card').first.bounding_box()
        check(f'Homepage first product row starts within the first viewport @{w}', first_product['y'] < h, first_product)
        hero_h = p2.locator('.home-hero').bounding_box()['height']
        check(f'Homepage hero stays compact @{w}', hero_h <= (240 if w == 375 else 280), hero_h)
        home_query = TEST_SKU
        p2.evaluate(f"NYCE.products.find(p => p.id === 'hisaki-generator').sku = '{TEST_SKU}'")
        p2.fill('#search-input', home_query); p2.press('#search-input', 'Enter'); p2.wait_for_timeout(250)
        check(f'Header search submits name/SKU query from the homepage @{w}', p2.evaluate('location.hash').startswith('#/shop?q=' + urllib.parse.quote_plus(TEST_SKU)) and 'hisaki-generator' in p2.eval_on_selector_all('.product-card', 'els => els.map(e => e.dataset.productId)'), p2.evaluate('location.hash'))
        p2.goto(URL + '#/'); p2.wait_for_timeout(300)
        tap_targets = p2.eval_on_selector_all('#primary-nav > a, .nav-menu-toggle, .menu-button, .header-whatsapp, .cart-link, #search-input, #search-button', 'els => els.map(e => { const r = e.getBoundingClientRect(); return [e.tagName, r.width, r.height] }).filter(t => t[1] > 0)')
        check(f'Header tap targets at least 44px @{w}', len(tap_targets) >= 5 and all(width >= 44 and height >= 44 for _, width, height in tap_targets), tap_targets)
        if w == 375:
            logo_box = p2.locator('.logo').bounding_box()
            search_box = p2.locator('#global-search').bounding_box()
            check('Mobile search is a full-width row beneath logo', search_box['width'] >= 340 and search_box['y'] > logo_box['y'], [logo_box, search_box])
        if w == 1280:
            widths = p2.evaluate("Object.fromEntries(['#global-search', '.logo', '.header-whatsapp', '.cart-link'].map(s => [s, document.querySelector(s).getBoundingClientRect().width]))")
            check('Desktop search is the widest header-row item', widths['#global-search'] > max(widths[s] for s in ['.logo', '.header-whatsapp', '.cart-link']), widths)
        p2.evaluate('window.scrollTo(0, 500)'); p2.wait_for_timeout(150)
        check(f'Scrolling compacts sticky header but keeps search and cart @{w}', 'is-compact' in p2.get_attribute('header', 'class') and p2.is_visible('#search-input') and p2.is_visible('.cart-link'), p2.get_attribute('header', 'class'))
        check(f'Compact header hides nav and WhatsApp action but keeps the menu button @{w}', not p2.is_visible('#primary-nav') and not p2.is_visible('.header-whatsapp') and p2.is_visible('#menu-button'))
        p2.evaluate('window.scrollTo(0, 0)'); p2.wait_for_timeout(150)
        check(f'Scrolling up restores navigation (bar on desktop, menu button below 1050px) @{w}', p2.is_visible('#primary-nav') if w >= 1050 else p2.is_visible('#menu-button'))
        p2.click('.header-whatsapp')
        whatsapp_number = p2.evaluate("window.NYCE.config.whatsappNumber.replace(/\\D/g, '')")
        modal_href = p2.get_attribute('#modal a[href^="https://wa.me/"]', 'href') if whatsapp_number else None
        wa_matches_config = f'wa.me/{whatsapp_number}?' in (modal_href or '') if whatsapp_number else 'number has not been configured yet' in p2.inner_text('#modal')
        check(f'Header WhatsApp uses existing configured number @{w}', p2.is_visible('#modal[open]') and 'Hello NYCE SOLUTIONS' in p2.input_value('#message-preview') and wa_matches_config)
        p2.keyboard.press('Escape')
        # touch target sizes
        p2.goto(URL + '#/shop'); p2.wait_for_timeout(300)
        check(f'Shop filter panel stays removed @{w}px', p2.locator('#filters, #filter-toggle').count() == 0)
        small = p2.evaluate("Array.from(document.querySelectorAll('main button, main a.btn, header button, header a')).filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.height < 32; }).map(e => e.textContent.trim().slice(0,20))")
        check(f'Touch targets ≥32px tall @{w}', len(small) == 0, small)
        # fixed widgets overlap: only toast/dialog/drawer are fixed
        fixed = p2.evaluate("Array.from(document.querySelectorAll('body *')).filter(e => getComputedStyle(e).position === 'fixed' && getComputedStyle(e).display !== 'none' && !e.hidden).map(e => e.id || e.className)")
        check(f'No overlapping floating widgets @{w}', all(f in ('toast', 'skip') or 'skip' in str(f) for f in fixed), fixed)
        ctx2.close()

    # ---------- Shared shell: category menu, mobile drawer, footer (375 / 768 / 1440) ----------
    shell_errors = []
    def shell_page(width, height, touch=False):
        c = browser.new_context(viewport={'width': width, 'height': height}, has_touch=touch, device_scale_factor=1)
        page = c.new_page()
        page.on('console', lambda m: console_errors.append(m.text) if m.type == 'error' else None)
        page.on('pageerror', lambda e: console_errors.append(str(e)))
        page.goto(URL); page.wait_for_timeout(350)
        return c, page
    cats = pg.evaluate("NYCE.categories.map(c => ({id: c.id, subs: c.subcategories.map(s => s.id)}))")
    expected_menu_hrefs = sorted(['#/shop'] + [f"#/shop?category={c['id']}" for c in cats] + [f"#/shop?category={c['id']}&subcategory={s}" for c in cats for s in c['subs']])
    total_subs = sum(len(c['subs']) for c in cats)
    outline_ok = "getComputedStyle(document.activeElement).outlineStyle !== 'none' && parseFloat(getComputedStyle(document.activeElement).outlineWidth) >= 2"

    ctx_d, d = shell_page(1440, 900)
    check('Shell @1440: logo links home and is named', d.get_attribute('.logo', 'href') == '#/' and d.get_attribute('.logo', 'aria-label') == 'NYCE SOLUTIONS home' and d.is_visible('.logo img, .logo .logo-text'))
    check('Shell @1440: search, WhatsApp, cart and nav bar visible; menu button hidden', all(d.is_visible(s) for s in ['#search-input', '.header-whatsapp', '.cart-link', '#primary-nav']) and not d.is_visible('#menu-button'))
    check('Shell @1440: category menu closed by default', not d.is_visible('#category-menu') and d.get_attribute('#categories-toggle', 'aria-expanded') == 'false')
    d.focus('#categories-toggle')
    check('Shell @1440: focused nav control has a visible outline', d.evaluate(outline_ok))
    d.keyboard.press('Enter'); d.wait_for_timeout(150)
    check('Category menu opens from the keyboard (Enter)', d.get_attribute('#categories-toggle', 'aria-expanded') == 'true' and d.is_visible('#category-menu'))
    menu = d.evaluate("""(() => { const m = document.getElementById('category-menu'), r = m.getBoundingClientRect();
        return {left: r.left, right: r.right, bottom: r.bottom, vw: innerWidth, vh: innerHeight, groups: m.querySelectorAll('.category-group').length, subs: m.querySelectorAll('.category-group li a').length,
                hrefs: [...m.querySelectorAll('a')].map(a => a.getAttribute('href')).sort(), noScrollX: m.scrollWidth <= m.clientWidth + 1, pageOverflow: document.documentElement.scrollWidth > innerWidth + 1}; })()""")
    check('Category menu groups 6 categories and 58 subcategories', menu['groups'] == 6 and menu['subs'] == total_subs == 58, menu['groups'])
    check('Category menu links are exactly the existing shop filter routes', menu['hrefs'] == expected_menu_hrefs, [h for h in menu['hrefs'] if h not in expected_menu_hrefs][:3])
    check('Category menu stays inside the viewport @1440', menu['left'] >= 0 and menu['right'] <= menu['vw'] and menu['bottom'] <= menu['vh'] and menu['noScrollX'] and not menu['pageOverflow'], menu)
    d.keyboard.press('Tab')
    check('Tab moves focus into the open menu with a visible outline', d.evaluate("!!document.activeElement.closest('#category-menu')") and d.evaluate(outline_ok))
    d.keyboard.press('Escape'); d.wait_for_timeout(100)
    check('Escape closes the category menu and returns focus to Categories', not d.is_visible('#category-menu') and d.get_attribute('#categories-toggle', 'aria-expanded') == 'false' and d.evaluate("document.activeElement.id === 'categories-toggle'"))
    d.click('#categories-toggle'); d.wait_for_timeout(100)
    d.mouse.click(20, 850); d.wait_for_timeout(100)
    check('Clicking outside closes the category menu', not d.is_visible('#category-menu'))
    d.click('#categories-toggle'); d.focus('#primary-nav a[data-nav="contact"]'); d.wait_for_timeout(100)
    check('Tabbing out of the category menu closes it', not d.is_visible('#category-menu'))
    d.click('#categories-toggle'); d.click('#category-menu a[data-menu-sub="solar-1"]'); d.wait_for_timeout(300)
    check('Subcategory link navigates, closes the menu and marks Categories active', d.evaluate('location.hash') == '#/shop?category=solar&subcategory=solar-1' and 'Lithium Starter Solar Kits' in d.inner_text('main h1') and not d.is_visible('#category-menu') and 'active' in d.get_attribute('#categories-toggle', 'class') and d.get_attribute('#primary-nav a[data-nav="shop"]', 'aria-current') is None)
    d.click('#categories-toggle'); d.wait_for_timeout(100)
    check('Current subcategory is marked aria-current in the menu', d.get_attribute('#category-menu a[data-menu-sub="solar-1"]', 'aria-current') == 'page' and d.locator('#category-menu [aria-current="page"]').count() == 1)
    d.keyboard.press('Escape')
    for route, nav, heading in [('#/business', 'business', 'Business & Bulk Orders'), ('#/contact', 'contact', 'Contact NYCE SOLUTIONS')]:
        d.click(f'#primary-nav a[data-nav="{nav}"]'); d.wait_for_timeout(250)
        check(f'Nav {route}: navigates and is the active link', d.evaluate('location.hash') == route and heading in d.inner_text('main h1') and d.get_attribute(f'#primary-nav a[data-nav="{nav}"]', 'aria-current') == 'page')
    d.click('.cart-link'); d.wait_for_timeout(250)
    check('Cart link navigates and shows an active state', d.evaluate('location.hash') == '#/cart' and 'active' in d.get_attribute('.cart-link', 'class') and d.get_attribute('.cart-link', 'aria-current') == 'page')
    d.goto(URL); d.wait_for_timeout(300); d.evaluate('window.scrollTo(0, 600)'); d.wait_for_timeout(200)
    check('Compact header @1440 shows the menu button and opens the drawer', d.is_visible('#menu-button'))
    d.click('#menu-button'); d.wait_for_timeout(200)
    check('Drawer opens on desktop from the compact header and Escape closes it', d.evaluate("document.getElementById('nav-drawer').open") and d.evaluate("document.activeElement.classList.contains('nav-drawer-close')"))
    d.keyboard.press('Escape'); d.wait_for_timeout(150)
    check('Escape closes the drawer and focus returns to the menu button', not d.evaluate("document.getElementById('nav-drawer').open") and d.evaluate("document.activeElement.id === 'menu-button'") and d.get_attribute('#menu-button', 'aria-expanded') == 'false')
    ctx_d.close()

    for w, h in [(375, 812), (768, 1024)]:
        ctx_t, t = shell_page(w, h, touch=True)
        hdr = t.evaluate("document.querySelector('header').getBoundingClientRect().height")
        check(f'Shell @{w}: menu button, logo, search and cart visible; desktop bar hidden', all(t.is_visible(s) for s in ['#menu-button', '.logo', '#search-input', '.cart-link']) and not t.is_visible('#primary-nav') and not t.is_visible('#categories-toggle'))
        if w == 375:
            strip_h = t.evaluate("document.getElementById('category-strip').getBoundingClientRect().height")
            check('Shell @375: header (excluding the category strip) is at most 120px tall', hdr - strip_h <= 120, [hdr, strip_h])
            check('Shell @375: category strip is a single row of at most 64px', 0 < strip_h <= 64, strip_h)
        t.tap('#menu-button'); t.wait_for_timeout(250)
        drawer = t.evaluate("""(() => { const d = document.getElementById('nav-drawer'), r = d.getBoundingClientRect();
            return {open: d.open, left: r.left, right: r.right, top: r.top, bottom: r.bottom, vw: innerWidth, vh: innerHeight, details: d.querySelectorAll('details').length,
                    focus: document.activeElement.classList.contains('nav-drawer-close'), overflow: document.documentElement.scrollWidth > innerWidth + 1, expanded: document.getElementById('menu-button').getAttribute('aria-expanded'),
                    name: d.getAttribute('aria-label')}; })()""")
        check(f'Drawer opens by touch @{w}, takes focus and is named', drawer['open'] and drawer['focus'] and drawer['expanded'] == 'true' and drawer['name'] == 'Site menu', drawer)
        check(f'Drawer fits the viewport @{w}', drawer['left'] >= 0 and drawer['right'] <= drawer['vw'] and drawer['top'] >= 0 and drawer['bottom'] <= drawer['vh'] and not drawer['overflow'], drawer)
        check(f'Drawer lists six categories as accordions @{w}', t.locator('#nav-drawer .drawer-accordion > details[data-menu-category]').count() == 6)
        t.tap('#drawer-category-toggle')
        t.tap('#nav-drawer details[data-menu-category="solar"] > summary'); t.wait_for_timeout(150)
        solar_links = t.eval_on_selector_all('#nav-drawer details[data-menu-category="solar"] a', 'els => els.map(a => a.getAttribute("href"))')
        check(f'Category accordion expands to All + subcategories @{w}', t.evaluate("document.querySelector('#nav-drawer details[data-menu-category=solar]').open") and len(solar_links) == 1 + len(cats[0]['subs']) and solar_links[0] == '#/shop?category=solar', solar_links[:2])
        t.focus('#nav-drawer details[data-menu-category="water"] > summary'); t.keyboard.press('Enter'); t.wait_for_timeout(100)
        check(f'Accordion toggles from the keyboard @{w}', t.evaluate("document.querySelector('#nav-drawer details[data-menu-category=water]').open"))
        small = t.evaluate("[...document.querySelectorAll('#nav-drawer a, #nav-drawer summary, #nav-drawer button')].filter(e => e.getBoundingClientRect().width > 0 && e.getBoundingClientRect().height < 44).map(e => e.textContent.trim().slice(0, 24))")
        check(f'Drawer controls are at least 44px tall @{w}', len(small) == 0, small)
        for _ in range(60):
            t.keyboard.press('Tab')
        check(f'Focus stays out of the page behind the open drawer @{w}', t.evaluate("!document.activeElement.closest('header, main, footer')"), t.evaluate('document.activeElement.outerHTML.slice(0, 80)'))
        t.keyboard.press('Escape'); t.wait_for_timeout(150)
        check(f'Escape closes the drawer and focus returns to the menu button @{w}', not t.evaluate("document.getElementById('nav-drawer').open") and t.evaluate("document.activeElement.id === 'menu-button'") and t.get_attribute('#menu-button', 'aria-expanded') == 'false')
        t.tap('#menu-button'); t.wait_for_timeout(200)
        t.mouse.click(w - 4, h // 2); t.wait_for_timeout(150)
        check(f'Tapping the backdrop closes the drawer @{w}', not t.evaluate("document.getElementById('nav-drawer').open"))
        t.tap('#menu-button'); t.tap('#nav-drawer a[data-nav-drawer="business"]'); t.wait_for_timeout(300)
        check(f'Drawer link navigates and closes the drawer @{w}', t.evaluate('location.hash') == '#/business' and not t.evaluate("document.getElementById('nav-drawer').open") and 'Business' in t.inner_text('main h1'))
        t.tap('#menu-button'); t.tap('#drawer-category-toggle'); t.tap('#nav-drawer details[data-menu-category="generators"] > summary'); t.tap('#nav-drawer a[data-menu-sub="generators-5"]'); t.wait_for_timeout(300)
        check(f'Drawer subcategory link applies the existing filter route @{w}', t.evaluate('location.hash') == '#/shop?category=generators&subcategory=generators-5' and 'Silent Canopy Generators' in t.inner_text('main h1') and not t.evaluate("document.getElementById('nav-drawer').open"))
        t.tap('#menu-button'); t.wait_for_timeout(200)
        check(f'Drawer opens on the current category with aria-current @{w}', t.evaluate("document.querySelector('#nav-drawer details[data-menu-category=generators]').open") and t.get_attribute('#nav-drawer a[data-menu-sub="generators-5"]', 'aria-current') == 'page')
        t.tap('#nav-drawer [data-general-wa]'); t.wait_for_timeout(250)
        check(f'Drawer WhatsApp action closes the drawer and opens the enquiry preview @{w}', not t.evaluate("document.getElementById('nav-drawer').open") and t.evaluate("document.getElementById('modal').open") and 'Hello NYCE SOLUTIONS' in t.input_value('#message-preview'))
        t.keyboard.press('Escape')
        t.goto(URL + '#/'); t.wait_for_timeout(300); t.evaluate('window.scrollTo(0, 600)'); t.wait_for_timeout(200)
        check(f'Compact header keeps menu button and search reachable @{w}', t.is_visible('#menu-button') and t.is_visible('#search-input') and t.is_visible('.cart-link') and t.evaluate("document.querySelector('header').getBoundingClientRect().height") <= 64)
        t.screenshot(path=f'{OUT}/shell-compact-{w}.png')
        t.evaluate('window.scrollTo(0, 0)'); t.tap('#menu-button'); t.wait_for_timeout(200)
        t.screenshot(path=f'{OUT}/shell-drawer-{w}.png')
        ctx_t.close()

    for w, h in [(375, 812), (768, 1024), (1440, 900)]:
        ctx_f, f = shell_page(w, h)
        f.goto(URL + '#/shop'); f.wait_for_timeout(300)
        foot = f.evaluate("""(() => { const links = [...document.querySelectorAll('footer a[href]')].map(a => ({href: a.getAttribute('href'), h: a.getBoundingClientRect().height, target: a.target, rel: a.rel, text: a.textContent.trim()}));
            return {links, text: document.querySelector('footer').innerText, contact: [...document.querySelectorAll('#footer-contact li')].map(li => li.textContent.trim()), notes: document.querySelectorAll('footer .link-note').length,
                    navs: [...document.querySelectorAll('footer nav')].map(n => n.getAttribute('aria-labelledby') && document.getElementById(n.getAttribute('aria-labelledby')).textContent), overflow: document.documentElement.scrollWidth > innerWidth + 1}; })()""")
        internal = sorted({l['href'] for l in foot['links'] if l['href'].startswith('#/')})
        footer_hrefs = [l['href'] for l in foot['links']]
        check(f'Footer @{w}: no repeated destinations', len(footer_hrefs) == len(set(footer_hrefs)), footer_hrefs)
        broken = []
        for href in internal:
            f.goto(URL + href); f.wait_for_timeout(120)
            if f.locator('.route-error').count() or f.locator('main h1').count() != 1:
                broken.append(href)
        check(f'Footer @{w}: every internal link resolves to a real page ({len(internal)} links)', len(internal) >= 9 and not broken, broken)
        external = [l for l in foot['links'] if not l['href'].startswith('#/')]
        check(f'Footer @{w}: external links are https/mailto/tel, new-tab links use noopener', all(l['href'].startswith(('https://', 'mailto:', 'tel:')) and (l['target'] != '_blank' or 'noopener' in l['rel']) for l in external), external)
        check(f'Footer @{w}: shows only configured contact channels, no placeholders', len(foot['contact']) == 7 and 'To be supplied' not in foot['text'] and 'To Be Confirmed' not in ' '.join(foot['contact']) and any(c.startswith('Phone') for c in foot['contact']) and any(c.startswith('Address') and 'Price Road' in c for c in foot['contact']) and any(c.startswith('Hours') for c in foot['contact']), foot['contact'])
        check(f'Footer @{w}: policy links carry no Draft labels', foot['notes'] == 0, foot['notes'])
        check(f'Footer @{w}: link groups are named navigation landmarks', foot['navs'] == ['Explore', 'Categories', 'Help & information'], foot['navs'])
        min_h = 44 if w < 800 else 32
        check(f'Footer @{w}: link targets at least {min_h}px tall', all(l['h'] >= min_h for l in foot['links'] if l['text']), [l['text'] for l in foot['links'] if l['h'] < min_h])
        check(f'Footer @{w}: no horizontal overflow', not foot['overflow'])
        f.evaluate('window.scrollTo(0, document.body.scrollHeight)'); f.wait_for_timeout(150)
        f.screenshot(path=f'{OUT}/shell-footer-{w}.png')
        ctx_f.close()

    # ---------- Shop and category discovery ----------
    def hash_now(page_):
        return page_.evaluate('location.hash')
    def card_ids(page_):
        return page_.eval_on_selector_all('.product-card', 'els => els.map(e => e.dataset.productId)')
    def shop(page_, route, wait=200):
        page_.goto(URL + route); page_.wait_for_timeout(wait)
    def shop_data(page_):
        return page_.evaluate("({products: NYCE.products.map(p => ({id: p.id, name: p.name, price: p.price, priceType: p.priceType, power: p.power, apps: p.applications, depts: p.categories, subs: p.subcategories, featured: !!p.featured})), cats: NYCE.categories.map(c => ({id: c.id, name: c.name, subs: c.subcategories.map(s => ({id: s.id, name: s.name}))}))})")
    sd = shop_data(pg)
    P = {p['id']: p for p in sd['products']}

    # breadcrumbs
    shop(pg, '#/shop?category=solar&subcategory=solar-1')
    crumbs = pg.eval_on_selector_all('.breadcrumb a', 'els => els.map(e => e.getAttribute("href"))')
    check('Breadcrumbs: Home / Shop / Category / current subcategory', crumbs == ['#/', '#/shop', '#/shop?category=solar'] and 'Lithium Starter Solar Kits' in pg.inner_text('.breadcrumb [aria-current="page"]'), crumbs)
    shop(pg, '#/shop?category=solar&q=kit')
    crumbs = pg.eval_on_selector_all('.breadcrumb a', 'els => els.map(e => e.getAttribute("href"))')
    check('Breadcrumbs: search inside a category ends with the current Search results crumb', crumbs == ['#/', '#/shop', '#/shop?category=solar'] and pg.inner_text('.breadcrumb [aria-current="page"]') == 'Search results', crumbs)

    # category and subcategory URL discovery
    shop(pg, '#/shop?category=water')
    water = next(c for c in sd['cats'] if c['id'] == 'water')
    expected_water3 = sorted(p['id'] for p in sd['products'] if 'water-3' in p['subs'])
    shop(pg, '#/shop?category=water&subcategory=water-3')
    check('Subcategory URL filters results and updates the heading', hash_now(pg) == '#/shop?category=water&subcategory=water-3' and 'AC DC Borehole Pumps' in pg.inner_text('main h1') and sorted(card_ids(pg)) == expected_water3, hash_now(pg))
    shop(pg, '#/shop?category=solar')
    check('Category route changes independently of the removed panel', hash_now(pg) == '#/shop?category=solar' and pg.locator('#filters').count() == 0, hash_now(pg))
    all_subcategories = [s['id'] for c in sd['cats'] for s in c['subs']]
    empty_subs = [sid for sid in all_subcategories if not any(sid in p['subs'] for p in sd['products'])]
    # electrical-5 (Extension Cords) and electrical-8 (Power Strips) await owner products after the Tronic record was removed.
    check('All 58 catalogue subcategories have products, except those awaiting owner stock', len(set(all_subcategories)) == 58 and set(empty_subs) <= {'electrical-5', 'electrical-8'}, empty_subs)

    # combined filters, sorting and state
    shop(pg, '#/shop?category=generators&power=Diesel&pricing=quote&sort=az')
    names = pg.eval_on_selector_all('.product-card h2', 'els => els.map(e => e.textContent.trim())')
    expected = sorted([p['name'] for p in sd['products'] if 'generators' in p['depts'] and p['power'] == 'Diesel' and p['priceType'] == 'quote'], key=lambda s: s.lower())
    check('Combined category + power + pricing + sort', sorted(names, key=str.lower) == expected and names == sorted(names, key=lambda s: s.lower()) and len(names) > 0, names)
    check('Combined state is shown as chips and the count', pg.locator('.chip').count() == 3 and f'{len(expected)} product' in pg.inner_text('.result-count'), pg.inner_text('.result-count'))
    shop(pg, '#/shop?category=agriculture')
    check('Category route filters the catalogue with the panel removed', hash_now(pg) == '#/shop?category=agriculture' and pg.locator('.product-card').count() == min(12, len([p for p in sd['products'] if 'agriculture' in p['depts']])), hash_now(pg))
    shop(pg, '#/shop?category=electrical&power=Electric')
    shop(pg, '#/shop?category=construction&power=Electric')
    check('Switching category keeps a filter that still applies', hash_now(pg) == '#/shop?category=construction&power=Electric' and pg.locator('.product-card').count() == len([p for p in sd['products'] if 'construction' in p['depts'] and p['power'] == 'Electric']), hash_now(pg))
    shop(pg, '#/shop?category=solar&pricing=priced')
    states = pg.eval_on_selector_all('.product-card .product-price', 'els => els.map(e => e.dataset.priceState)')
    check('Pricing filter returns only priced products and shows a chip', set(states) == {'priced'} and len(states) == len([p for p in sd['products'] if 'solar' in p['depts'] and p['priceType'] != 'quote']) and 'pricing=priced' in hash_now(pg), states)
    shop(pg, '#/shop?pricing=demo')
    check('Legacy pricing=demo URL is corrected to pricing=priced', hash_now(pg) == '#/shop?pricing=priced' and pg.locator('.product-card').count() > 0, hash_now(pg))

    # search keeps its state and is ranked
    shop(pg, '#/shop?q=pump')
    opts = pg.eval_on_selector_all('#sort-products option', 'els => els.map(e => [e.value, e.textContent])')
    check('Search results default to "Best match"; the option exists only while searching', pg.input_value('#sort-products') == 'relevance' and opts[0] == ['relevance', 'Best match'], opts[:2])
    shop(pg, '#/shop')
    check('Best match is not offered without a search', 'relevance' not in pg.eval_on_selector_all('#sort-products option', 'els => els.map(e => e.value)') and pg.input_value('#sort-products') == 'featured')
    shop(pg, '#/shop?sort=relevance')
    check('Invalid sort for the context is corrected in the URL', hash_now(pg) == '#/shop', hash_now(pg))
    first_word = pg.evaluate("NYCE.products.find(p => p.name.toLowerCase().startsWith('hybrid')) ? 'hybrid' : ''")
    if first_word:
        shop(pg, f'#/shop?q={first_word}')
        check('Best match puts names starting with the query first', pg.locator('.product-card h2').first.inner_text().lower().startswith(first_word))
    shop(pg, '#/shop?q=pump')
    pg.select_option('#sort-products', 'az'); pg.wait_for_timeout(250)
    check('Changing sort keeps the search', 'q=pump' in hash_now(pg) and 'sort=az' in hash_now(pg), hash_now(pg))
    shop(pg, '#/shop?q=pump&sort=az&category=water')
    check('Changing category keeps search and sort', 'q=pump' in hash_now(pg) and 'sort=az' in hash_now(pg) and 'category=water' in hash_now(pg), hash_now(pg))
    names = pg.eval_on_selector_all('.product-card h2', 'els => els.map(e => e.textContent.trim())')
    search_matches = pg.evaluate("[...document.querySelectorAll('.product-card')].every(e => { const p = NYCE.products.find(p => p.id === e.dataset.productId); return p.categories.includes('water') && [p.name, p.brand || '', p.sku || '', ...NYCE.categories.filter(c => p.categories.includes(c.id)).map(c => c.name), ...NYCE.categories.flatMap(c => c.subcategories).filter(s => p.subcategories.includes(s.id)).map(s => s.name)].join(' ').toLowerCase().includes('pump'); })")
    check('Search + category + sort results all match the search', len(names) > 0 and search_matches, names[:3])
    shop(pg, '#/shop?q=a&page=2')
    check('Broad search paginates', 'page=2' in hash_now(pg) and pg.locator('.product-card').count() > 0, hash_now(pg))
    pg.fill('#search-input', 'kit'); pg.press('#search-input', 'Enter'); pg.wait_for_timeout(250)
    check('A new search resets pagination and replaces the query', 'page=' not in hash_now(pg) and 'q=kit' in hash_now(pg), hash_now(pg))
    shop(pg, '#/shop?category=solar&power=Solar&sort=az')
    pg.fill('#search-input', 'kit'); pg.press('#search-input', 'Enter'); pg.wait_for_timeout(250)
    check('Header search keeps the active filters and sort', 'q=kit' in hash_now(pg) and 'category=solar' in hash_now(pg) and 'power=Solar' in hash_now(pg) and 'sort=az' in hash_now(pg), hash_now(pg))
    check('Search results show query and result count', 'kit' in pg.inner_text('.search-results-summary h1') and 'product' in pg.inner_text('.search-results-summary'))

    # sorting
    def prices_on_page(page_):
        return page_.evaluate("Array.from(document.querySelectorAll('.product-card')).map(e => { const p = NYCE.products.find(x => x.id === e.dataset.productId); return p.price; })")
    shop(pg, '#/shop?sort=price-asc&page=1'); first = prices_on_page(pg)
    check('Price low to high lists priced products ascending, then Request Price', [x for x in first if x is not None] == sorted(x for x in first if x is not None) and (None not in first or first.index(None) >= len([x for x in first if x is not None])), first)
    check('Price sort explains where Request Price products appear', 'appear after priced products' in pg.inner_text('main'))
    shop(pg, '#/shop?sort=za'); names = pg.eval_on_selector_all('.product-card h2', 'els => els.map(e => e.textContent.trim())')
    check('Sort Z to A', names == sorted(names, key=lambda s: s.lower(), reverse=True), names[:3])
    shop(pg, '#/shop?sort=bogus&category=solar')
    check('Unknown sort values are removed from the URL', hash_now(pg) == '#/shop?category=solar', hash_now(pg))

    # pagination and refresh
    shop(pg, '#/shop?page=99')
    total = pg.evaluate('NYCE.products.length'); last_page = -(-total // 12)
    check('Out-of-range page is corrected to the last page', hash_now(pg) == f'#/shop?page={last_page}' and pg.locator('.product-card').count() == total - (last_page - 1) * 12, hash_now(pg))
    shop(pg, '#/shop?page=abc&category=nope&subcategory=nope')
    check('Invalid page, category and subcategory values are removed from the URL', hash_now(pg) == '#/shop', hash_now(pg))
    shop(pg, '#/shop?category=water&subcategory=solar-1')
    check('A subcategory from another category corrects the category', hash_now(pg) == '#/shop?category=solar&subcategory=solar-1', hash_now(pg))
    shop(pg, '#/shop?category=construction&power=Electric&sort=price-asc')
    before = (hash_now(pg), card_ids(pg), pg.input_value('#sort-products'))
    pg.reload(); pg.wait_for_timeout(400)
    check('Refresh restores category, filter, sort and results', (hash_now(pg), card_ids(pg), pg.input_value('#sort-products')) == before and pg.locator('.chip').count() == 2, (hash_now(pg), before[0]))
    shop(pg, '#/shop')
    pg.evaluate("location.hash = '#/shop?category=solar'"); pg.wait_for_timeout(250)
    pg.select_option('#sort-products', 'za'); pg.wait_for_timeout(200)
    states_seen = hash_now(pg)
    pg.go_back(); pg.wait_for_timeout(250)
    back_one = hash_now(pg)
    pg.go_back(); pg.wait_for_timeout(250)
    back_two = hash_now(pg)
    check('Back restores each earlier combination of filters and sort', states_seen == '#/shop?category=solar&sort=za' and back_one == '#/shop?category=solar' and back_two == '#/shop', (states_seen, back_one, back_two))
    pg.go_forward(); pg.wait_for_timeout(250); pg.go_forward(); pg.wait_for_timeout(250)
    check('Forward restores the latest state', hash_now(pg) == states_seen and pg.input_value('#sort-products') == 'za')

    # product cards: priced, quote-only and unavailable-data states
    shop(pg, '#/shop?sort=price-asc')
    card_states = pg.evaluate("Array.from(document.querySelectorAll('.product-card')).map(e => { const p = NYCE.products.find(x => x.id === e.dataset.productId); const el = e.querySelector('.product-price'); return {state: el.dataset.priceState, text: el.firstChild.textContent.trim(), priced: p.price !== null && p.priceType !== 'quote'}; })")
    check('Cards mark priced and quote-only products with distinct states and wording', all((c['state'] == 'priced' and c['text'].startswith('KES')) if c['priced'] else (c['state'] == 'quote' and c['text'] == 'Request Price') for c in card_states), card_states[:3])
    ctx_u = browser.new_context(viewport={'width': 1440, 'height': 900})
    up = ctx_u.new_page(); up.goto(URL); up.wait_for_timeout(300)
    unavailable_id = up.evaluate("(() => { const p = NYCE.products.find(x => x.priceType === 'fixed'); delete p.price; return p.id; })()")
    shop(up, '#/shop?q=' + urllib.parse.quote(up.evaluate('(id) => NYCE.products.find(p => p.id === id).name', unavailable_id)))
    un = up.evaluate("(id) => { const e = document.querySelector(`.product-card[data-product-id=\"${id}\"] .product-price`); return e ? {state: e.dataset.priceState, text: e.firstChild.textContent.trim(), note: e.querySelector('.price-note').textContent} : null; }", unavailable_id)
    check('A record with no usable price is labelled "Price not available", not a price or a quote', un is not None and un['state'] == 'unavailable' and un['text'] == 'Price not available' and 'Contact us' in un['note'], un)
    ctx_u.close()

    # empty and no-match states
    shop(pg, '#/shop?q=zzzzqqq')
    empty = pg.inner_text('.empty')
    check('No-match state: factual message, count, search hint and next steps', 'No products match “zzzzqqq”.' in empty and 'product names, brands, SKUs and category names' in empty and '0 products' in pg.inner_text('.search-results-summary') and pg.locator('.empty [data-remove-filter="q"]').count() == 1 and pg.locator('.empty a[href="#/shop"]').count() == 1, empty[:160])
    check('No-match state links to every category, a quote and WhatsApp', pg.locator('.empty-links a').count() == 6 and pg.locator('.empty a[href="#/business"]').count() == 1 and pg.locator('.empty [data-general-wa]').count() == 1)
    pg.click('.empty [data-remove-filter="q"]'); pg.wait_for_timeout(250)
    check('"Clear search" returns to the full catalogue', hash_now(pg) == '#/shop' and pg.locator('.product-card').count() == 12, hash_now(pg))
    shop(pg, '#/shop?category=solar&power=Gas')
    check('Filter-only empty state names the filters, not a search', 'No products match the selected filters.' in pg.inner_text('.empty') and pg.locator('.empty [data-remove-filter="q"]').count() == 0 and pg.locator('.empty [data-clear-filters-keep-search]').count() == 1)
    pg.click('.empty [data-clear-filters-keep-search]'); pg.wait_for_timeout(250)
    check('"Clear filters" resets filters', hash_now(pg) == '#/shop' and pg.locator('.chip').count() == 0, hash_now(pg))
    shop(pg, '#/shop?q=pump&category=generators')
    check('Search + filter empty state offers both resets', 'with the selected filters' in pg.inner_text('.empty') and pg.locator('.empty [data-remove-filter="q"]').count() == 1 and pg.locator('.empty [data-clear-filters-keep-search]').count() == 1)
    pg.click('.empty [data-clear-filters-keep-search]'); pg.wait_for_timeout(250)
    check('"Clear filters" keeps the search term', hash_now(pg) == '#/shop?q=pump' and pg.locator('.product-card').count() > 0, hash_now(pg))
    shop(pg, '#/shop?category=solar&power=Gas')
    empty_toolbar = pg.inner_text('.result-count')
    check('Empty results show "0 products" and no pagination', empty_toolbar.startswith('0 products') and pg.locator('.pagination').count() == 0, empty_toolbar)

    # keyboard use and labelling
    shop(pg, '#/shop')
    check('Shop filter panel remains absent and sort stays labelled', pg.locator('#filters').count() == 0 and pg.locator('label[for="sort-products"]').count() == 1)
    pg.focus('#sort-products'); pg.keyboard.press('ArrowDown'); pg.wait_for_timeout(250)
    check('Keyboard changes the sort select', 'sort=' in hash_now(pg), hash_now(pg))
    shop(pg, '#/shop?category=solar&power=Solar')
    pg.focus('.chip'); pg.keyboard.press('Enter'); pg.wait_for_timeout(250)
    check('Active filter chips remain removable with the keyboard', hash_now(pg) != '#/shop?category=solar&power=Solar' and pg.locator('.chip').count() == 1)

    # responsive grid
    for w, h, cols in [(375, 812, 2), (768, 1024, 2), (1440, 900, 3)]:
        ctx_g, gp = shell_page(w, h, touch=(w < 1050))
        shop(gp, '#/shop?category=construction')
        grid = gp.evaluate("(() => { const main = document.querySelector('.catalog-main').getBoundingClientRect(), layout = document.querySelector('.catalog-layout').getBoundingClientRect(); return {cols: getComputedStyle(document.getElementById('results')).gridTemplateColumns.split(' ').length, overflow: document.documentElement.scrollWidth > innerWidth + 1, sq: [...document.querySelectorAll('.product-media .photo')].every(e => Math.abs(e.getBoundingClientRect().width - e.getBoundingClientRect().height) < 1), panelAbsent: !document.getElementById('filters') && !document.getElementById('filter-toggle'), fullWidth: Math.abs(main.width - layout.width) < 1}; })()")
        check(f'Shop grid @{w}: {cols} columns, panel absent, full width, square images, no overflow', grid['cols'] == cols and grid['sq'] and not grid['overflow'] and grid['panelAbsent'] and grid['fullWidth'], grid)
        shop(gp, '#/shop?category=solar&power=Solar')
        check(f'URL filters remain active without a drawer @{w}', 'category=solar' in hash_now(gp) and 'power=Solar' in hash_now(gp) and gp.locator('.chip').count() == 2 and gp.locator('#filters').count() == 0)
        gp.screenshot(path=f'{OUT}/shop-discovery-{w}.png')
        ctx_g.close()
    # large catalogues: pagination is windowed and keeps state
    if URL.startswith('http'):
        ctx_w = browser.new_context(viewport={'width': 1440, 'height': 900})
        wp = ctx_w.new_page(); cfg = pg.evaluate("fetch('assets/js/config.js').then(r => r.text())")
        wp.route('**/assets/js/config.js', lambda route: route.fulfill(body=cfg.replace('cataloguePageSize: 12', 'cataloguePageSize: 3'), content_type='application/javascript'))
        wp.goto(URL + '#/shop?page=9&sort=az'); wp.wait_for_timeout(400)
        labels = wp.eval_on_selector_all('.pagination > *', 'els => els.map(e => e.textContent.trim())')
        many = -(-wp.evaluate('NYCE.products.length') // 3)
        check('Pagination is windowed with ellipses for many pages', labels == ['Previous', '1', '…', '8', '9', '10', '…', str(many), 'Next'], labels)
        check('Current page is marked and announced', wp.get_attribute('.pagination [aria-current="page"]', 'aria-label') == 'Page 9' and f'page 9 of {many}' in wp.inner_text('.result-count'))
        wp.click('.pagination button[aria-label="Next page"]'); wp.wait_for_timeout(250)
        check('Next keeps filters and sort and moves one page', hash_now(wp) == '#/shop?sort=az&page=10', hash_now(wp))
        wp.goto(URL + f'#/shop?page={many + 10}'); wp.wait_for_timeout(300)
        check('Out-of-range page is corrected with many pages', hash_now(wp) == f'#/shop?page={many}', hash_now(wp))
        ctx_w.close()
        ctx_e = browser.new_context(viewport={'width': 1440, 'height': 900})
        ep = ctx_e.new_page(); ep.on('pageerror', lambda e: console_errors.append(str(e)))
        ep.route('**/assets/js/config.js', lambda route: route.fulfill(body=cfg.replace('siteMode: "demo"', 'siteMode: "production"'), content_type='application/javascript'))
        ep.route('**/assets/js/catalogue.js', lambda route: route.fulfill(body=(root / 'assets/js/catalogue.js').read_text(encoding='utf-8').replace('"approved": true', '"approved": false'), content_type='application/javascript'))
        ep.goto(URL + '#/shop'); ep.wait_for_timeout(400)
        check('Production mode with no published products shows a customer-facing empty catalogue, not owner instructions', 'The catalogue is being prepared' in ep.inner_text('main') and 'config.js' not in ep.inner_text('main') and ep.locator('.empty a[href="#/business"]').count() == 1)
        ctx_e.close()

    # ---------- Focused homepage (375 / 768 / 1440) ----------
    allowed_trust = [r'^\d+ categories and \d+ subcategories in one catalogue$', r'^Send product enquiries on WhatsApp$', r'^Prices, availability and taxes are confirmed by quotation$', r'^Delivery details are confirmed per enquiry$']
    unsupported = r'(?i)\b(in stock|out of stock|sold out|stock status|reviews?|rated|rating|stars?|certified|certification|kebs|iso ?\d+|warranty|guarantee|discount|\d+ ?% ?off|limited (time|offer)|hurry|last chance|only \d+ left|free (shipping|delivery)|same[- ]day|next[- ]day|24 ?/ ?7|nationwide|countrywide|best price|lowest price)\b'
    cats_home = pg.evaluate("NYCE.categories.map(c => ({id: c.id, name: c.name, subs: c.subcategories.length, n: NYCE.products.filter(p => p.categories.includes(c.id)).length}))")
    for w, h in [(375, 812), (768, 1024), (1440, 900)]:
        ctx_h, hp = shell_page(w, h, touch=(w < 1050))
        info = hp.evaluate("""(() => {
            const text = s => [...document.querySelectorAll(s)].map(e => e.textContent.trim().replace(/\\s+/g, ' '));
            const cards = [...document.querySelectorAll('main .product-card')];
            const rows = [...document.querySelectorAll('.home-product-section')].map(s => ({title: s.querySelector('h2').textContent.trim(), ids: [...s.querySelectorAll('.product-card')].map(c => c.dataset.productId), more: s.querySelector('.home-section-head a').getAttribute('href'), moreText: s.querySelector('.home-section-head a').textContent.trim(),
                priceTops: [...s.querySelectorAll('.product-price')].map(e => Math.round(e.getBoundingClientRect().top)), actionTops: [...s.querySelectorAll('.card-actions')].map(e => Math.round(e.getBoundingClientRect().top)), titleH: [...s.querySelectorAll('.product-content h3')].map(e => Math.round(e.getBoundingClientRect().height)),
                cols: getComputedStyle(s.querySelector('.product-grid')).gridTemplateColumns.split(' ').length}));
            const outside = [...document.querySelectorAll('main *')].filter(e => { if (e.closest('svg') && e.tagName !== 'svg') return false; const r = e.getBoundingClientRect(); return r.width > 0 && (r.right > innerWidth + 1 || r.left < -1); }).map(e => String(e.getAttribute('class') || e.tagName)).slice(0, 5);
            const empties = [...document.querySelectorAll('main section')].filter(s => !s.textContent.trim() || s.getBoundingClientRect().height < 20).map(s => s.className);
            return {rows, ids: cards.map(c => c.dataset.productId), outside, empties, heroLinks: [...document.querySelectorAll('.home-hero-actions a')].map(a => [a.textContent.trim(), a.getAttribute('href')]),
                h1: text('main h1'), heroText: text('.home-hero')[0], depts: [...document.querySelectorAll('.home-categories .category-card')].map(a => ({href: a.getAttribute('href'), name: a.querySelector('h3').textContent.trim(), meta: a.querySelector('div > div > span') ? a.querySelector('div > div > span').textContent.trim() : ''})),
                trust: text('.home-trust-strip > div'), cta: [...document.querySelectorAll('.home-cta-band a, .home-cta-band button')].map(e => [e.textContent.trim(), e.getAttribute('href'), e.hasAttribute('data-general-wa')]), ctaText: text('.home-cta-band')[0],
                imgs: cards.map(c => { const r = c.querySelector('.product-media .photo').getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; }),
                unnamedImg: document.querySelectorAll('main svg[role=img]:not([aria-label]), main img:not([alt])').length, brokenImg: [...document.querySelectorAll('main img')].filter(i => i.complete && i.naturalWidth === 0).length,
                cardData: cards.map(c => { const p = NYCE.products.find(x => x.id === c.dataset.productId); return {ok: !!p && c.querySelector('.product-content h3 a').textContent.trim() === p.name, price: c.querySelector('.product-price').textContent, expected: p && p.price !== null ? 'KES ' + p.price.toLocaleString('en-KE') : 'Request Price'}; }),
                cardsText: cards.map(c => c.textContent).join(' '), headings: [...document.querySelectorAll('main h1, main h2, main h3')].map(e => Number(e.tagName[1])), overflow: document.documentElement.scrollWidth > innerWidth + 1}; })()""")
        check(f'Homepage @{w}: one h1 (the hero) and a sensible heading outline', info['h1'] == ['Power your home. Equip your business.'] and info['headings'][0] == 1 and all(b - a <= 1 for a, b in zip(info['headings'], info['headings'][1:])), info['headings'][:8])
        check(f'Homepage @{w}: hero has exactly one primary and one secondary action', info['heroLinks'] == [['Shop products', '#/shop'], ['Request a quote', '#/business']], info['heroLinks'])
        check(f'Homepage @{w}: no empty or collapsed sections', not info['empties'] and len(info['rows']) >= 1, info['empties'])
        check(f'Homepage @{w}: at most four product rows, each with 2-4 products', 1 <= len(info['rows']) <= 4 and all(2 <= len(r['ids']) <= 4 for r in info['rows']), [(r['title'], len(r['ids'])) for r in info['rows']])
        check(f'Homepage @{w}: every product appears once on the page', len(info['ids']) == len(set(info['ids'])), info['ids'])
        check(f'Homepage @{w}: product rows use real catalogue records, names and price states', all(c['ok'] and c['price'].startswith(c['expected']) for c in info['cardData']), [c for c in info['cardData'] if not c['ok'] or not c['price'].startswith(c['expected'])][:2])
        check(f'Homepage @{w}: row "view all" links use existing shop routes', all(r['more'] == '#/shop' or r['more'].startswith('#/shop?category=') for r in info['rows']), [r['more'] for r in info['rows']])
        check(f'Homepage @{w}: category cards match the catalogue and shop routes', [d['href'] for d in info['depts']] == [f"#/shop?category={c['id']}" for c in cats_home] and [d['name'] for d in info['depts']] == [c['name'] for c in cats_home], info['depts'][:2])
        check(f'Homepage @{w}: category cards have no item-count numbers', all(not d['meta'] for d in info['depts']), [d['meta'] for d in info['depts']][:2])
        check(f'Homepage @{w}: trust statements are limited to verified wording', len(info['trust']) in (2, 3) and all(any(re.match(rx, t) for rx in allowed_trust) for t in info['trust']), info['trust'])
        check(f'Homepage @{w}: no category/subcategory count statement', not any('subcategories in one catalogue' in t for t in info['trust']), info['trust'])
        check(f'Homepage @{w}: no discounts, urgency, stock, reviews, certification or delivery-coverage claims', not re.search(unsupported, info['heroText'] + ' ' + ' '.join(info['trust']) + ' ' + info['ctaText'] + ' ' + info['cardsText']), re.findall(unsupported, info['heroText'] + ' '.join(info['trust']) + info['ctaText'] + info['cardsText'])[:3])
        check(f'Homepage @{w}: CTA offers quote, WhatsApp and contact', [c[1] for c in info['cta'] if c[1]] == ['#/business', '#/contact'] and any(c[2] for c in info['cta']), info['cta'])
        check(f'Homepage @{w}: product images are square and identical in size', len({tuple(i) for i in info['imgs']}) == 1 and abs(info['imgs'][0][0] - info['imgs'][0][1]) <= 1, sorted({tuple(i) for i in info['imgs']}))
        check(f'Homepage @{w}: images have text alternatives and none are broken', info['unnamedImg'] == 0 and info['brokenImg'] == 0, info)
        def aligned(r):
            step = r['cols']
            return all(len(set(r[k][i:i + step])) == 1 for k in ('priceTops', 'actionTops', 'titleH') for i in range(0, len(r[k]), step))
        check(f'Homepage @{w}: price, title and action positions align across each visual row of cards', all(aligned(r) for r in info['rows']), [(r['title'], r['priceTops'], r['actionTops']) for r in info['rows']][:2])
        check(f'Homepage @{w}: product grid uses {2 if w < 720 else 4} columns', all(r['cols'] == (2 if w < 720 else 4) for r in info['rows']), [r['cols'] for r in info['rows']])
        check(f'Homepage @{w}: no horizontal overflow and nothing outside the viewport', not info['overflow'] and not info['outside'], info['outside'])
        # every link and action on the page resolves
        links = hp.evaluate("[...new Set([...document.querySelectorAll('main a[href]')].map(a => a.getAttribute('href')))]")
        internal = [l for l in links if l.startswith('#/')]
        broken = []
        for l in internal:
            hp.goto(URL + l); hp.wait_for_timeout(100)
            if hp.locator('.route-error').count() or hp.locator('main h1').count() != 1:
                broken.append(l)
        check(f'Homepage @{w}: all {len(internal)} internal links resolve', len(internal) >= 20 and not broken, broken)
        hp.goto(URL); hp.wait_for_timeout(300)
        wa = hp.eval_on_selector_all('main a[href^="https://wa.me/"]', 'els => els.map(a => [a.target, a.rel])')
        check(f'Homepage @{w}: card WhatsApp links open safely in a new tab', len(wa) == sum(len(r['ids']) for r in info['rows']) and all(t == '_blank' and 'noopener' in rel for t, rel in wa), wa[:2])
        # keyboard: hero actions are reachable in order and activate with Enter
        hp.focus('.home-hero-actions a:first-child')
        check(f'Homepage @{w}: hero primary action takes a visible focus outline', hp.evaluate(outline_ok))
        hp.keyboard.press('Tab')
        check(f'Homepage @{w}: Tab moves from the primary to the secondary hero action', hp.evaluate("document.activeElement.getAttribute('href') === '#/business'"))
        hp.keyboard.press('Tab'); hp.keyboard.press('Tab')
        check(f'Homepage @{w}: Tab then reaches the category cards', hp.evaluate("!!document.activeElement.closest('.home-categories')"))
        hp.focus('.home-hero-actions a:first-child'); hp.keyboard.press('Enter'); hp.wait_for_timeout(250)
        check(f'Homepage @{w}: Enter on the hero primary action opens the shop', hp.evaluate('location.hash') == '#/shop')
        hp.goto(URL); hp.wait_for_timeout(300)
        # cart state and enquiry behaviour are untouched
        priced = hp.evaluate("NYCE.products.find(p => p.price !== null).id")
        hp.goto(URL + f'#/product/{priced}'); hp.wait_for_timeout(250)
        hp.click('[data-add]'); hp.wait_for_timeout(150)
        hp.goto(URL); hp.wait_for_timeout(300)
        check(f'Homepage @{w}: cart count survives visiting the homepage', hp.inner_text('#cart-count') == '1')
        first_id = info['rows'][0]['ids'][0]
        (hp.tap if w < 1050 else hp.click)(f'.product-card[data-product-id="{first_id}"] .card-actions a:first-child'); hp.wait_for_timeout(250)
        check(f'Homepage @{w}: "View details" opens the product page', hp.evaluate('location.hash') == f'#/product/{first_id}' and hp.locator('main h1').count() == 1)
        hp.goto(URL); hp.wait_for_timeout(300)
        (hp.tap if w < 1050 else hp.click)('.home-cta-band [data-general-wa]'); hp.wait_for_timeout(250)
        check(f'Homepage @{w}: CTA WhatsApp opens the enquiry preview', hp.evaluate("document.getElementById('modal').open") and 'Hello NYCE SOLUTIONS' in hp.input_value('#message-preview') and 'not an order' in hp.input_value('#message-preview'))
        hp.keyboard.press('Escape')
        hp.goto(URL); hp.wait_for_timeout(300)
        hp.evaluate('window.scrollTo(0, document.body.scrollHeight)'); hp.wait_for_timeout(150)
        hp.screenshot(path=f'{OUT}/home-bottom-{w}.png')
        hp.evaluate('window.scrollTo(0, 0)'); hp.wait_for_timeout(100)
        hp.screenshot(path=f'{OUT}/home-top-{w}.png')
        ctx_h.close()

    # Missing images and incomplete records degrade gracefully (console resource errors for the deliberately missing file are expected here).
    ctx_m = browser.new_context(viewport={'width': 1440, 'height': 900})
    hm = ctx_m.new_page(); hm_errors = []
    hm.on('pageerror', lambda e: hm_errors.append(str(e)))
    hm.goto(URL); hm.wait_for_timeout(300)
    ids = hm.evaluate("[...document.querySelectorAll('main .product-card')].map(c => c.dataset.productId)")
    hm.evaluate("""(ids) => { const P = id => NYCE.products.find(p => p.id === id);
        P(ids[0]).image = { src: 'assets/images/equipment.webp' }; P(ids[1]).image = undefined; P(ids[2]).image = { tile: 99 }; P(ids[3]).image = { src: 'assets/images/does-not-exist.jpg' };
        delete P(ids[4]).price; P(ids[5]).alt = ''; P(ids[6]).categories = undefined; P(ids[9]).image = { src: 'assets/images/equipment.webp' }; }""", ids)
    hm.goto(URL + '#/about'); hm.wait_for_timeout(200); hm.goto(URL + '#/'); hm.wait_for_timeout(700)
    inc = hm.evaluate("""(ids) => ({cards: ids.slice(0, 10).map(id => { const c = document.querySelector(`.product-card[data-product-id="${id}"]`); return c ? {fallback: !!c.querySelector('.photo-fallback'), img: c.querySelector('img[data-photo-src]') ? {loading: c.querySelector('img[data-photo-src]').getAttribute('loading'), w: c.querySelector('img').getAttribute('width'), h: c.querySelector('img').getAttribute('height'), loaded: c.querySelector('img').naturalWidth > 0} : null, price: c.querySelector('.product-price').textContent.slice(0, 13), sq: Math.abs(c.querySelector('.photo').getBoundingClientRect().width - c.querySelector('.photo').getBoundingClientRect().height) < 1} : null; }),
        sections: document.querySelectorAll('.home-product-section').length, overflow: document.documentElement.scrollWidth > innerWidth + 1})""", ids)
    cs = inc['cards']
    check('Incomplete data: no image / unusable tile / missing file all show the placeholder', all(cs[i] and cs[i]['fallback'] for i in (1, 2, 3)), cs[1:4])
    check('Incomplete data: a record without a price shows Request Price', cs[4] and cs[4]['price'].startswith('Request Price'), cs[4])
    check('Incomplete data: a record without categories does not break the homepage', inc['sections'] >= 1 and not hm_errors, hm_errors[:2])
    check('Incomplete data: placeholder and photo cards stay square and the page does not overflow', len([c for c in cs if c]) >= 8 and all(c['sq'] for c in cs if c) and not inc['overflow'], cs)
    if URL.startswith('http'):
        check('Real photographs: first row loads eagerly, lower rows lazily, with intrinsic size', cs[0] and cs[0]['img'] and cs[0]['img']['loading'] is None and cs[0]['img']['w'] == '600' and cs[0]['img']['loaded'] and cs[9] and cs[9]['img'] and cs[9]['img']['loading'] == 'lazy', [cs[0], cs[9]])
    else:
        check('Standalone build: photo paths that cannot load fall back to the placeholder', cs[0] and cs[0]['fallback'] and cs[9] and cs[9]['fallback'], [cs[0], cs[9]])
    ctx_m.close()
    if URL.startswith('http'):
        ctx_p = browser.new_context(viewport={'width': 1440, 'height': 900})
        pp = ctx_p.new_page(); pp_errors = []
        pp.on('pageerror', lambda e: pp_errors.append(str(e)))
        cfg = pg.evaluate("fetch('assets/js/config.js').then(r => r.text())")
        pp.route('**/assets/js/config.js', lambda route: route.fulfill(body=cfg.replace('siteMode: "demo"', 'siteMode: "production"'), content_type='application/javascript'))
        pp.route('**/assets/js/catalogue.js', lambda route: route.fulfill(body=(root / 'assets/js/catalogue.js').read_text(encoding='utf-8').replace('"approved": true', '"approved": false'), content_type='application/javascript'))
        pp.goto(URL); pp.wait_for_timeout(400)
        pc = pp.evaluate("({rows: document.querySelectorAll('.home-product-section').length, depts: document.querySelectorAll('.home-categories .category-card').length, metas: [...document.querySelectorAll('.home-categories .category-card')].map(a => a.textContent), empty: [...document.querySelectorAll('main section')].filter(s => !s.textContent.trim()).length, words: /demonstration|illustrative|representative/i.test(document.querySelector('main').innerText)})")
        check('Production mode with no approved products: no product rows, no empty sections, no demo wording', pc['rows'] == 0 and pc['depts'] == 6 and pc['empty'] == 0 and not pc['words'] and not pp_errors and all('0 products' not in m for m in pc['metas']), pc)
        ctx_p.close()

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
        bad = pg.evaluate("Array.from(document.querySelectorAll('script[src], link[rel=stylesheet][href], link[rel=icon][href], img[src]')).map(e => e.src || e.href).filter(u => u && !u.startsWith(location.href.split('#')[0].replace(/index\\.html$/, '')))")
        check('Repository subpath: all asset URLs resolve beneath site root', len(bad) == 0, bad)
        internal = pg.evaluate("Array.from(document.querySelectorAll('a[href]')).map(a=>a.getAttribute('href')).filter(h => h.startsWith('/'))")
        check('No root-absolute internal links', len(internal) == 0, internal)

    check('No JavaScript console errors during tested workflows', len(console_errors) == 0, console_errors[:5])
    browser.close()

report = {'url': URL, 'label': LABEL, 'passed': sum(r['result'] == 'PASS' for r in results), 'failed': sum(r['result'] == 'FAIL' for r in results), 'console_errors': console_errors, 'results': results}
json.dump(report, open(f'{OUT}/report.json', 'w'), indent=2)
print(f"\n{LABEL}: {report['passed']} passed, {report['failed']} failed")
