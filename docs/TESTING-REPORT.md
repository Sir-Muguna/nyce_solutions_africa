# Testing report — NYCE SOLUTIONS catalogue

Executed 2026-10-07 in headless **Chromium (Playwright 1.56, Python)** by `tests/acceptance.py`. Two targets:

| Target | How served | Checks | Passed | Failed |
|---|---|---|---|---|
| Modular repository | `python3 -m http.server` serving the parent folder → `http://localhost:8765/nyce-solutions-africa/` (emulates a GitHub Pages project subpath) | 138 | 138 | 0 |
| Standalone HTML | `file://…/standalone/nycesolutionssafrica-refactored.html` | 136 | 136 | 0 |

Console errors captured during all workflows: **0** on both targets. Screenshots at 375, 768 and 1440 px (home, shop with drawer closed/open, product, business, contact, cart) were captured for both targets and the 1440 homepage and 375 home/shop/drawer/product views were visually reviewed.

The standalone target runs two fewer checks because the subpath/asset-URL checks only apply to an HTTP deployment.

## Navigation and routing

| Check | Repository | Standalone |
|---|---|---|
| Nav: no "Shop by Category" tab | PASS | PASS |
| Nav: required items present | PASS | PASS |
| Footer: no category directory or guide links | PASS | PASS |
| Footer: no "Shop by Category" text | PASS | PASS |
| Home: "View Full Catalogue" link present | PASS | PASS |
| Home: no "All Categories" link | PASS | PASS |
| Home: 6 department cards open filtered Shop routes | PASS | PASS |
| Home: hero headline | PASS | PASS |
| Legacy #/categories → #/shop | PASS | PASS |
| Legacy #/category/water → shop?category=water | PASS | PASS |
| Legacy #/category/generators/generators-5 → both filters | PASS | PASS |
| Legacy unknown department → not found | PASS | PASS |
| Not-found route renders | PASS | PASS |
| Build Guide route not customer-facing | PASS | PASS |
| Browser back/forward restore views | PASS | PASS |
| Back after legacy redirect does not loop | PASS | PASS |
| Product breadcrumbs use filtered Shop routes | PASS | PASS |
| Breadcrumb resolves: #/shop?category=solar | PASS | PASS |
| Breadcrumb resolves: #/shop?category=solar&subcategory=solar-7 | PASS | PASS |
| Repository subpath: all asset URLs resolve beneath site root | PASS | n/a |
| No root-absolute internal links | PASS | n/a |

## Catalogue

| Check | Repository | Standalone |
|---|---|---|
| Catalogue: 6 departments | PASS | PASS |
| Catalogue: 59 subcategories | PASS | PASS |
| Catalogue: 49 unique product records | PASS | PASS |
| All 59 subcategory routes list ≥1 product with correct heading | PASS | PASS |
| Shop filters expose all 6 departments | PASS | PASS |
| Shop subcategory select lists all 59 (no department selected) | PASS | PASS |
| Search "hisaki" finds hisaki-generator | PASS | PASS |
| Search "HK7000SNA" finds hisaki-generator | PASS | PASS |
| Search "EC 7574-BS" finds tronic-extension | PASS | PASS |
| Search "Welding" finds lenhard-welder | PASS | PASS |
| Search "Incubators" finds incubator | PASS | PASS |
| Search "generators" finds pulsar-generator | PASS | PASS |
| Header search submits to #/shop?q= | PASS | PASS |
| Combined filters (department + phase) | PASS | PASS |
| Active filter chips shown | PASS | PASS |
| Individual chip removal | PASS | PASS |
| Clear all filters → #/shop | PASS | PASS |
| Pagination resets after filter change | PASS | PASS |
| Empty results recovery | PASS | PASS |
| Empty-state clear returns full catalogue | PASS | PASS |
| Sort A–Z | PASS | PASS |
| Sort price low→high | PASS | PASS |
| Sort price high→low (priced first) | PASS | PASS |
| Sort: "Newest" omitted (no date data) | PASS | PASS |
| No discount badges / old prices rendered | PASS | PASS |
| Grid/list preference persists | PASS | PASS |
| Pagination accessible (nav + buttons) | PASS | PASS |
| Pagination page 2 works | PASS | PASS |

## Product and cart

| Check | Repository | Standalone |
|---|---|---|
| Product: tabs present | PASS | PASS |
| Product: tab switching | PASS | PASS |
| Product: tab arrow-key navigation | PASS | PASS |
| Product: gallery thumbnail switch | PASS | PASS |
| Product: tap/click enlargement opens dialog | PASS | PASS |
| Product: Escape closes dialog | PASS | PASS |
| Product: quantity controls | PASS | PASS |
| Product: related products link | PASS | PASS |
| Product: related excludes self | PASS | PASS |
| Product: no unverified claims | PASS | PASS |
| Cart: add priced product (qty 3) | PASS | PASS |
| Quote-only: no Add to Cart, Request a Quote shown | PASS | PASS |
| Quote-only: cannot enter cart via storage | PASS | PASS |
| Quote-only: rejected on cart restore | PASS | PASS |
| Request a Quote prefills business form | PASS | PASS |
| Cart: subtotal correct | PASS | PASS |
| Cart: quantity update recalculates | PASS | PASS |
| Cart: persistence across reload | PASS | PASS |
| Cart: prototype statements present | PASS | PASS |
| Checkout summary: honest statement + totals | PASS | PASS |
| Checkout WhatsApp message lists items | PASS | PASS |
| Cart: remove product | PASS | PASS |
| Cart: clear cart → empty state | PASS | PASS |

## WhatsApp and forms

| Check | Repository | Standalone |
|---|---|---|
| WhatsApp message contains required fields | PASS | PASS |
| WhatsApp missing-number: no wa.me link, copy button + explanation | PASS | PASS |
| WhatsApp message URL-encodes cleanly | PASS | PASS |
| WhatsApp modal never claims order/payment success | PASS | PASS |
| WhatsApp quote-only message says Request Price | PASS | PASS |
| Contact form: required validation with accessible errors | PASS | PASS |
| Contact form: email format validated | PASS | PASS |
| Contact form: honest result, no transmission claim | PASS | PASS |
| Business form: required validation | PASS | PASS |

## Accessibility and responsive

| Check | Repository | Standalone |
|---|---|---|
| Skip link present and first in DOM | PASS | PASS |
| Landmarks: header/main/footer/nav | PASS | PASS |
| Images have alt / aria-label | PASS | PASS |
| All buttons/links have accessible names | PASS | PASS |
| Heading structure: one h1, no level skipped | PASS | PASS |
| Keyboard: first Tab lands on skip link | PASS | PASS |
| Keyboard: visible focus outline | PASS | PASS |
| Skip link moves focus to main | PASS | PASS |
| Keyboard: tabbing reaches catalogue controls | PASS | PASS |
| No horizontal overflow @375px #/ | PASS | PASS |
| No horizontal overflow @375px #/shop?category=generators | PASS | PASS |
| No horizontal overflow @375px #/product/hisaki-generator | PASS | PASS |
| No horizontal overflow @375px #/business | PASS | PASS |
| No horizontal overflow @375px #/contact | PASS | PASS |
| No horizontal overflow @375px #/cart | PASS | PASS |
| Mobile menu toggle visible @375 | PASS | PASS |
| Mobile menu opens @375 | PASS | PASS |
| Mobile menu closes with Escape @375 | PASS | PASS |
| Filter drawer hidden by default @375 | PASS | PASS |
| Filter drawer opens and takes focus @375 | PASS | PASS |
| Filter change keeps drawer open @375 | PASS | PASS |
| Drawer closes with Escape, focus returns @375 | PASS | PASS |
| Touch targets ≥32px tall @375 | PASS | PASS |
| No overlapping floating widgets @375 | PASS | PASS |
| No horizontal overflow @768px #/ | PASS | PASS |
| No horizontal overflow @768px #/shop?category=generators | PASS | PASS |
| No horizontal overflow @768px #/product/hisaki-generator | PASS | PASS |
| No horizontal overflow @768px #/business | PASS | PASS |
| No horizontal overflow @768px #/contact | PASS | PASS |
| No horizontal overflow @768px #/cart | PASS | PASS |
| Mobile menu toggle visible @768 | PASS | PASS |
| Mobile menu opens @768 | PASS | PASS |
| Mobile menu closes with Escape @768 | PASS | PASS |
| Filter drawer hidden by default @768 | PASS | PASS |
| Filter drawer opens and takes focus @768 | PASS | PASS |
| Filter change keeps drawer open @768 | PASS | PASS |
| Drawer closes with Escape, focus returns @768 | PASS | PASS |
| Touch targets ≥32px tall @768 | PASS | PASS |
| No overlapping floating widgets @768 | PASS | PASS |
| No horizontal overflow @1440px #/ | PASS | PASS |
| No horizontal overflow @1440px #/shop?category=generators | PASS | PASS |
| No horizontal overflow @1440px #/product/hisaki-generator | PASS | PASS |
| No horizontal overflow @1440px #/business | PASS | PASS |
| No horizontal overflow @1440px #/contact | PASS | PASS |
| No horizontal overflow @1440px #/cart | PASS | PASS |
| Touch targets ≥32px tall @1440 | PASS | PASS |
| No overlapping floating widgets @1440 | PASS | PASS |
| Missing equipment image shows placeholder fallback | PASS | PASS |
| Missing logo shows wordmark fallback | PASS | PASS |
| Product card images share one aspect ratio | PASS | PASS |

## Technical

| Check | Repository | Standalone |
|---|---|---|
| No JavaScript console errors during tested workflows | PASS | PASS |

## Other

| Check | Repository | Standalone |
|---|---|---|
| Nav link works + active state: #/shop | PASS | PASS |
| Nav link works + active state: #/business | PASS | PASS |
| Nav link works + active state: #/about | PASS | PASS |
| Nav link works + active state: #/contact | PASS | PASS |
| Nav link works + active state: #/cart | PASS | PASS |
| Nav link works + active state: #/ | PASS | PASS |

## Checks that could not be completed, and why

| Check | Status | Reason |
|---|---|---|
| Screen-reader behaviour (NVDA / VoiceOver / TalkBack) | Not performed | No assistive technology in the test environment. ARIA structure was verified programmatically only. |
| Firefox / Safari / real iOS and Android devices | Not performed | Only Chromium is available; 375 / 768 / 1440 px were emulated viewports. |
| Live GitHub Pages deployment | Not performed | No repository/hosting access; subpath behaviour emulated with a local static server and relative-path assertions. |
| WhatsApp hand-off with a configured number | Not performed | No business number exists. The configured-number branch (wa.me link, URL encoding) is implemented and unit-checked via `encodeURIComponent`, but not clicked through to WhatsApp. |
| Clipboard permission prompt in a real browser | Not performed | Headless clipboard behaviour differs; the fallback (select + instruction) is implemented. |
| Colour-contrast measurement | Not measured | Palette designed to WCAG AA (navy/blue on white, white on navy/green, muted #596777 on white ≈ 5.9:1 by calculation) but no automated contrast tool was run. |
| Odoo 20 UI / documentation verification | Pending | Odoo 20 docs not retrievable; Odoo 19.0 "Prices" page retrieved and read. |
| ZIP root check | Performed separately | See delivery summary (`unzip -l`). |

## How to re-run

```bash
pip install playwright && python3 -m playwright install chromium
python3 tests/acceptance.py http://localhost:8000/nyce-solutions-africa/ repo
python3 tests/acceptance.py file:///ABS/PATH/standalone/nycesolutionssafrica-refactored.html standalone
```
