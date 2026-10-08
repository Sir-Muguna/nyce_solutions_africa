# Change log — NYCE SOLUTIONS catalogue refactor (2026-10-07)

Source: `nycesolutionssafrica.html` (530 KB single file). Result: modular repository `nyce-solutions-africa/` + generated standalone file.

## Removed
- **Shop by Category** tab from the main navigation and the customer-facing footer.
- The category-directory page (`directory()`), department landing page (`categoryPage()`) and `subLink()` helper, after confirming no remaining link targets them (grep of generated HTML + automated link checks).
- The Build Guide from the utility bar, footer and `#/guide` route (now `docs/implementation-guide.html`; the route shows a not-found message).
- "All categories" links (replaced by **View Full Catalogue**).
- Competitor source links from product pages (now in `docs/source-register.md`; never rendered in production mode).
- All-caps "eyebrow" labels and hover-lift animations; the `#/business` modal-only checkout review (replaced by a `#/checkout` route).

## Retained
- All 49 product records (unique IDs, identical names, specs, descriptions, prices, evidence status, source URLs and review dates), 6 departments, 59 subcategory labels — verbatim.
- Hash routing, global search, filters, sort, pagination, product-detail tabs/gallery/quantity, LocalStorage cart, WhatsApp preview + copy fallback, enquiry forms with truthful results, embedded logo and department sprite, policy placeholders, toast, native `<dialog>` lightbox, skip link, reduced-motion support, print styles.

## Refactored
- One file → `index.html`, `assets/css/styles.css`, `assets/js/config.js`, `assets/js/catalogue.js`, `assets/js/app.js`, `assets/images/*`. Standalone file is now **generated** by `tools/build-standalone.py` from those sources.
- Data model: `assignments[]` → `departments[]` + `subcategories[]`; added `brand`/`brandStatus`, `gallery[]`, `shortDescription`, `capacity`, `phase`, `priceType`, `currency`, `quotationStatus`, `evidenceStatus`, `sourceReference`, `sourceChecked`, `sourceClassification`, `featured`, `approved`, `dateAdded`, `related[]`. Brand filled only for the 15 sourced records as *retailer-listed*; everything else null/false — nothing invented.
- CSS rewritten mobile-first (min-width breakpoints 420/600/800/1050) on the same brand tokens; system font stack.
- Department cards, subcategory links, product breadcrumbs, About-page and CTA links now target filtered Shop routes.
- Legacy routes: `#/categories` → `#/shop`; `#/category/{dept}[/{sub}]` → `#/shop?category=…[&subcategory=…]` via `location.replace` (Back does not loop); unknown department → not found.
- Focus management: first load keeps natural tab order (skip link first); route changes focus `<main>`.
- Config moved from two constants to a complete `window.NYCE_CONFIG` object with production gating.

## New functionality
- Shop: breadcrumb Home/Shop/Department/Subcategory; result count + search summary; department & subcategory radio lists with counts; 59-subcategory grouped select when no department is chosen; active-filter chips with individual removal; Clear all; grid/list toggle persisted in LocalStorage; mobile filter drawer with backdrop, focus trap entry/exit and Escape; empty-state recovery with department fallback.
- Sorting: `Newest` option auto-enabled only when `dateAdded` data exists (currently none → hidden).
- Product cards: View details + WhatsApp actions, model/SKU line, department · subcategory, Request Price state.
- Product detail: "Also listed under" cross-links, application chips linking to filtered Shop, delivery statement from config, related products derived from shared subcategory.
- `#/checkout` enquiry-summary page with table, honest no-order statement and cart-level WhatsApp message.
- Cart: Clear cart action; quote-only IDs rejected on restore (tested).
- WhatsApp messages now include displayed price / Request Price and the three confirmation requests (availability, delivery, final quotation); cart-list and general variants.
- Forms: custom validation with inline `aria-invalid`/`aria-live` messages and a focusable error summary; email format check.
- Production mode (`siteMode: "production"`): approved-only products, no source references, no evidence filter/tags, no training badge, honest empty state when nothing is approved.
- Image fallbacks: placeholder SVG for the sprite, text wordmark for the logo.
- `404.html` with GitHub Pages root detection; `.nojekyll`.
- `tools/build-standalone.py`; `docs/implementation-guide.html`; `docs/source-register.md`; `README.md`.

## Catalogue additions / changed assignments
- **No new product records** — the existing 49 already covered all 59 subcategories.
- No assignment changes. Multi-category records unchanged: doyin-solar-pump (solar-7, water-2, water-6), irrigation-kit (agriculture-1, agriculture-9, water-10), single-core (electrical-1, electrical-4), tronic-extension (electrical-5, electrical-8), hisaki-generator (generators-2/3/5/10), pulsar-generator (generators-4/6), tlac-welding (generators-9, construction-3).
- Featured set extended from 4 to 8 records (alps-6kw, hisaki-generator, doyin-solar-pump, tolsen-hoist, jiadi-tractor, lenhard-welder, tronic-extension, cordless-drill) — a `featured` flag, not a data claim.

## Accessibility improvements
- Native radio groups in `<fieldset>/<legend>` for department/subcategory filters; all controls labelled; icon-only buttons have `aria-label`.
- Drawer: `aria-expanded`, focus moves to Close on open and back to the toggle on close; Escape closes drawer and mobile menu.
- Forms: `novalidate` + custom messages tied by `aria-describedby`, `aria-invalid`, `role="alert"` summary with links that focus the field.
- Tab panels focusable (`tabindex="0"`); arrow/Home/End key handling kept.
- Pagination buttons carry `aria-label="Page n"` and `aria-current`; result count is `role="status"`.
- Visible 3 px amber focus ring on every interactive element; ≥40 px touch targets; no horizontal overflow at 375/768/1440 (tested); `prefers-reduced-motion` honoured; hero `<br>` no longer corrupts `document.title`.

## Remaining production blockers
WhatsApp number and contact details; `publicBaseUrl`; owner approval of products, prices, SKUs, brands; licensed photography; approved policy copy; category-overlap decisions; Odoo 20 verification; screen-reader and cross-browser testing.
