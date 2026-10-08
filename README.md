# NYCE SOLUTIONS — static equipment catalogue

A responsive, WhatsApp-first product catalogue for **NYCE SOLUTIONS** (solar and backup power, borehole and water solutions, electricals, agricultural equipment, construction and workshop tools). It deploys to GitHub Pages with no build step and doubles as the design/data reference for recreating the store in Odoo.

- **Live catalogue**: `index.html` (+ `assets/`) — deploy this folder.
- **Standalone copy**: `standalone/nycesolutionssafrica-refactored.html` — one file, opens directly in a browser, generated from the same sources.
- **Internal docs**: `docs/implementation-guide.html` (Odoo guide), `docs/source-register.md` (evidence register), `docs/CHANGELOG.md`, `docs/TESTING-REPORT.md`. These are not linked from the customer-facing site.

> The site starts in **demo mode**: every record is labelled as a reference or illustrative product, prices are demonstration values, forms only prepare text, and the cart is a prototype. Nothing is sold, reserved or paid for. See *Demo-to-production checklist* before publishing it as a real store.

## Repository structure

```
nyce-solutions-africa/
├── index.html                  app shell (header, footer, dialog, script tags)
├── 404.html                    self-contained not-found page for GitHub Pages
├── .nojekyll                   stops GitHub Pages running Jekyll
├── README.md
├── assets/
│   ├── css/styles.css          mobile-first stylesheet (brand tokens at the top)
│   ├── js/config.js            ← the only file an owner normally edits
│   ├── js/catalogue.js         central catalogue data: 6 departments, 59 subcategories, 49 products
│   ├── js/app.js               routing, filters, cart, WhatsApp, forms
│   └── images/                 logo.webp, equipment.webp (department sprite), placeholder.svg
├── docs/
│   ├── implementation-guide.html
│   ├── source-register.md
│   ├── CHANGELOG.md
│   └── TESTING-REPORT.md
├── standalone/nycesolutionssafrica-refactored.html   generated — do not edit by hand
├── tests/acceptance.py         Playwright acceptance suite (not deployed content)
└── tools/build-standalone.py   regenerates the standalone file (Python 3, standard library only)
```

HTML5, CSS3 and vanilla JavaScript only. No Node.js, PHP, database, bundler, tracking scripts or third-party libraries.

## Local preview

The modular site must be served over HTTP (browsers block `file://` script/asset loading differently across engines):

```bash
cd nyce-solutions-africa
python3 -m http.server 8000
# open http://localhost:8000/
```

To emulate a GitHub Pages project subpath, serve the *parent* folder and open `http://localhost:8000/nyce-solutions-africa/`.

### Direct-file limitations
`index.html` opened via `file://` may work in some browsers but is not supported. Use the **standalone** file instead — it inlines CSS, JavaScript, data and images and is tested via `file://`. In standalone mode WhatsApp messages contain a local file reference until `publicBaseUrl` is set.

## Business configuration (`assets/js/config.js`)

| Field | What to enter |
|---|---|
| `businessName` | Display name used in titles and messages |
| `siteMode` | `"demo"` (default) or `"production"` — see below |
| `whatsappNumber` | **International digits only**, e.g. Kenya `+254 7XX XXX XXX` → `"2547XXXXXXXX"`. No `+`, spaces or dashes. Leave `""` until the real number is known; the site then shows a message preview + Copy button instead of a broken link |
| `phoneNumber`, `emailAddress`, `physicalAddress`, `operatingHours` | Display text; placeholders appear while empty |
| `publicBaseUrl` | The address the site is served from, e.g. `"https://USER.github.io/nyce-solutions-africa/"` (trailing slash). Used to build product links in WhatsApp messages |
| `currency`, `locale` | `KES`, `en-KE` |
| `cataloguePageSize`, `maxQuantity` | 12 products per page, 99 units per line |
| `approvedProductIds` | Catalogue IDs the owner has verified; **only these appear in production mode** |
| `placeholders` | Contact-pending text, delivery statement, policy-pending tag |

After editing `config.js`, run `python3 tools/build-standalone.py` so the standalone file matches.

### Site modes
- **demo** — shows all 49 records with evidence tags (“Reference product” / “Illustrative product”), demonstration-price notices, the evidence filter, the “Demonstration catalogue” badge and training disclaimers.
- **production** — shows only `approvedProductIds` (or records with `approved: true`), hides competitor source references and evidence filters, removes training language, and labels prices as confirmed by quotation. Policy pages still show “Owner approval required” until their text is replaced in `app.js` (`POLICIES`). Production mode with an empty approval list renders an honest empty catalogue.

## Product data update process

1. Edit `assets/js/catalogue.js`. One object per product; a product in several categories lists all of them in `departments` / `subcategories` — **never duplicate a record**.
2. Fields to keep honest: `sku`/`model`/`brand` only when verified (`brandStatus: "retailer-listed"` or `"owner-verified"`); `price: null` + `priceType: "quote"` for Request Price; `evidenceStatus`, `sourceReference`, `sourceClassification` (`sourced` | `owner-supplied` | `illustrative`); `dateAdded` as `YYYY-MM-DD` (the **Newest** sort appears automatically once any product has a date); `related` IDs (derived from shared subcategory when empty).
3. Record the evidence and open questions in `docs/source-register.md`.
4. Run `python3 tools/build-standalone.py`, open the site, check the product, run the tests (below).

### Product-approval workflow
Owner reviews each record in `docs/source-register.md` → confirms name, spec, price, image rights, category → set `approved: true` and add the ID to `approvedProductIds` → mark `sourceClassification: "owner-supplied"` where the data now comes from the business.

### Image replacement
- `assets/images/equipment.webp` is a 1536×1024 sprite of six 512×512 department tiles (row 1: solar, agriculture, electrical; row 2: water, construction, generators). Products reference a tile via `image.tile` (0–5).
- To use real product photos: add files under `assets/images/`, then either extend the sprite or change `photo()` in `app.js` to render `<img src>` for records with `image.src`. Keep alt text meaningful.
- `assets/images/placeholder.svg` is shown automatically when the sprite fails to load; the logo falls back to a text wordmark.
- Replace the logo with the same filename or update `window.NYCE_ASSETS` in `index.html`.

## Demo-to-production checklist

- [ ] Owner has approved products; `approvedProductIds` filled; demo prices replaced or set to `null`.
- [ ] Verified SKUs/models; unverified brands removed.
- [ ] Licensed product photography in place; `alt` and `photoStatus` updated.
- [ ] `whatsappNumber`, `phoneNumber`, `emailAddress`, `physicalAddress`, `operatingHours`, `publicBaseUrl` set.
- [ ] Policy texts in `app.js` → `POLICIES` replaced with approved copy; delivery statement updated.
- [ ] `siteMode: "production"`.
- [ ] `python3 tools/build-standalone.py` run; acceptance tests re-run; manual check that no “demonstration”/“illustrative” wording remains.
- [ ] `docs/` kept out of any public navigation (it is already unlinked; optionally exclude it from the deployed branch).

## GitHub Pages deployment

1. Create a repository (e.g. `nyce-solutions-africa`) and push this folder's contents to its root (`index.html` must be at the repository root).
2. Settings → Pages → *Deploy from a branch* → `main` / `/ (root)`.
3. Wait for the Pages build; the site appears at `https://USER.github.io/nyce-solutions-africa/`.
4. Put that URL in `config.js` → `publicBaseUrl`, commit, rebuild the standalone.
5. `.nojekyll` is included so files and folders are served as-is. `404.html` links back to the detected site root.

## Odoo migration notes

The standalone HTML **cannot be imported into Odoo** as a functioning store. `docs/implementation-guide.html` maps every page and block to Odoo Website/eCommerce building blocks, lists native vs custom work, documents the data model and import considerations, and records that Odoo 20 verification is pending (Odoo 19.0 documentation was the verified reference).

## Testing

Automated acceptance suite (Playwright, headless Chromium): `tests/acceptance.py` (see `tests/README.md`). Results: `docs/TESTING-REPORT.md`. To re-run manually:

```bash
pip install playwright && python3 -m playwright install chromium
python3 tests/acceptance.py http://localhost:8000/nyce-solutions-africa/ repo
python3 tests/acceptance.py file:///ABS/PATH/standalone/nycesolutionssafrica-refactored.html standalone
```

Manual smoke test: open every main navigation link; open a department card; combine two filters and remove one chip; search `HK7000SNA`; open a priced product, add 2 to the cart, change quantity, remove; open a Request Price product and request a quote; submit an empty form; resize to 375 / 768 / 1440 px.

## Known limitations

- Static site: no server-side checkout, payment, stock, accounts, secure form processing, CRM or order records. Forms prepare text only; the cart is a local enquiry list.
- Product images are representative department visuals, not exact-model photographs.
- `Newest` sort is hidden until `dateAdded` values exist.
- The 404 page detects the project root by the first path segment on `*.github.io`; custom domains resolve to `/`.
- Tested in Chromium only; Firefox/Safari and screen-reader testing not yet performed.

## Remaining production blockers

1. WhatsApp number, contact details and `publicBaseUrl`.
2. Owner approval of products, real prices, SKUs and brand authorisation.
3. Licensed product photography.
4. Approved policy texts (delivery, returns/warranty, privacy, terms).
5. Decisions on overlapping category labels (see implementation guide).
6. Odoo 20 verification in the target environment.
