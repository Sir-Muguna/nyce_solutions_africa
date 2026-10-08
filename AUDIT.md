# Nyce Solutions Africa — Baseline Audit

This report records the repository as observed on the `audit/baseline` branch. Each claim includes source-file line references; line numbers refer to the repository files, not this report.

## Stack summary

- The customer site is a static GitHub Pages catalogue built with HTML5, CSS3, and vanilla JavaScript. The README describes deployment without a build step and explicitly lists no Node.js, PHP, database, or bundler; no React, Vue, or Next.js application is described. ( `README.md:3`, `README.md:35` )
- No package manager is documented; the repository structure lists no package manifest, and the README identifies no Node.js or bundler tooling. ( `README.md:11-35` )
- The modular page shell is `index.html`; it loads `assets/css/styles.css`, then `assets/js/config.js`, `assets/js/catalogue.js`, and `assets/js/app.js`. ( `index.html:11`, `index.html:84-86` )
- Styling is a plain CSS stylesheet, not Tailwind or CSS modules; runtime views are rendered by JavaScript. ( `index.html:11`, `assets/js/app.js:1-12`, `README.md:35` )
- The documented tracked layout contains root HTML files, `assets/css`, `assets/js`, `assets/images`, `docs`, `standalone`, `tests`, and `tools`; it does not document `pages/`, `app/`, `components/`, or `layouts/`. The header and footer are in `index.html`; the page content is rendered into its `<main>` element. ( `README.md:11-35`, `index.html:18-45`, `assets/js/app.js:559-560` )
- `standalone/nycesolutionssafrica-refactored.html` is a generated single-file copy of the modular sources, produced by `tools/build-standalone.py`. ( `README.md:6`, `README.md:30-32`, `README.md:66` )

## Route inventory

Routes are client-side hash routes interpreted by `assets/js/app.js`; category and subcategory selection are query parameters on the shop route, not separate current category-page routes. ( `assets/js/app.js:225-229`, `assets/js/app.js:559-574` )

| Path or pattern | Page / behavior | Evidence |
|---|---|---|
| `/` (`#/`) | Homepage; the empty route renders `home()`. | `index.html:20`, `assets/js/app.js:564` |
| `#/shop` | Product listing; accepts `category`, `subcategory`, `q`, filter, sort, and page query parameters. | `assets/js/app.js:225-229`, `assets/js/app.js:301-302` |
| `#/product/:id` | Product detail for a catalogue product ID. | `assets/js/app.js:353`, `assets/js/app.js:567` |
| `#/business` | Business and bulk-order page. | `assets/js/app.js:448`, `assets/js/app.js:568` |
| `#/contact` | Contact/enquiry page. | `assets/js/app.js:466`, `assets/js/app.js:569` |
| `#/about` | About page. | `assets/js/app.js:485`, `assets/js/app.js:570` |
| `#/cart` | Cart page. | `assets/js/app.js:501`, `assets/js/app.js:571` |
| `#/checkout` | Enquiry-summary page; routed as “checkout,” but the site states it does not submit an order or payment. | `assets/js/app.js:520`, `assets/js/app.js:572`, `README.md:125` |
| `#/policy/delivery`, `#/policy/returns`, `#/policy/privacy`, `#/policy/terms` | Policy pages, keyed by the four entries in `POLICIES`. | `assets/js/app.js:530-536`, `assets/js/app.js:573`, `index.html:61-64` |
| `#/categories` | Legacy route redirected to `#/shop`. | `assets/js/app.js:546-550` |
| `#/category/:department[/subcategory]` | Legacy category route redirected to a shop filter when IDs are valid; invalid category IDs render a not-found message. | `assets/js/app.js:551-555`, `assets/js/app.js:559-567` |
| `#/guide` | Customer-facing route resolves to not-found content referring to the internal implementation guide. | `assets/js/app.js:574` |
| Other unmatched hash routes | Render the not-found page. | `assets/js/app.js:574-575`, `assets/js/app.js:541-544` |
| `/404.html` | Separate static hosting not-found page. | `404.html:6`, `404.html:20-23` |

The six shop department IDs are `solar`, `agriculture`, `electrical`, `water`, `construction`, and `generators`. ( `assets/js/catalogue.js:26-27`, `assets/js/catalogue.js:75-76`, `assets/js/catalogue.js:120-121`, `assets/js/catalogue.js:169-170`, `assets/js/catalogue.js:218-219`, `assets/js/catalogue.js:267-268` )

## Homepage section order

The current homepage content renders in this order; the global header precedes `<main>` and the global footer follows it. The featured-products section is conditional on there being featured records, and the current data includes a `featured: true` product. ( `index.html:18-45`, `assets/js/app.js:179-180`, `assets/js/app.js:202`, `assets/js/catalogue.js:426` )

1. Hero — headline, description, product-area list, Shop and Request a Quote links, and visual. ( `assets/js/app.js:182-192` )
2. Confidence/trust bar — specialist departments, WhatsApp enquiries, and delivery by enquiry. ( `assets/js/app.js:193-197` )
3. Shop by department — department cards and catalogue link. ( `assets/js/app.js:198-201` )
4. Featured equipment — product cards, shown when `featured.length` is nonzero. ( `assets/js/app.js:180`, `assets/js/app.js:202-205`, `assets/js/catalogue.js:426` )
5. Shop by application. ( `assets/js/app.js:206-209` )
6. Business & bulk orders CTA band. ( `assets/js/app.js:210-213` )
7. Delivery and customer-support cards. ( `assets/js/app.js:214-217` )
8. WhatsApp enquiry CTA band. ( `assets/js/app.js:218-221` )
9. Site footer. ( `index.html:45-75` )

## Navigation tree

- Utility bar: “Equipment for Kenya. Enquiries across Africa.” and a demonstration-catalogue badge. ( `index.html:16` )
- Header: home/logo link; global product search; project contact shortcut; cart/count; mobile-menu button. ( `index.html:18-28` )
- Primary navigation: Home → `#/`; Shop → `#/shop`; Business & Bulk Orders → `#/business`; About Us → `#/about`; Contact → `#/contact`; Cart → `#/cart`; Request a Quote → `#/business`. ( `index.html:30-38` )
- No dropdown or mega-menu is present in the primary navigation markup; it is a flat list of anchor links. ( `index.html:30-38` )
- Categories are linked through the homepage’s “Shop by department” cards; each department card links to `#/shop` with the department ID in a query parameter. There are six departments, each with nested subcategories in the catalogue data. ( `assets/js/app.js:172`, `assets/js/app.js:198-201`, `assets/js/catalogue.js:26-312` )
- Footer navigation includes Explore links and delivery, returns, privacy, and terms links. ( `index.html:51-64` )

## Product data schema

The central records are objects in `window.NYCE_CATALOGUE.products`. These are the observed product-record field names (names only): ( `assets/js/catalogue.js:23-24`, `assets/js/catalogue.js:318-371` )

| Group | Fields |
|---|---|
| Identity | `id`, `sku`, `model`, `name`, `brand`, `brandStatus` |
| Classification | `departments`, `subcategories`, `applications` |
| Media | `image`, `gallery`, `alt`, `photoStatus` |
| Descriptions and specifications | `shortDescription`, `description`, `specs`, `power`, `capacity`, `phase` |
| Price and quotation | `price`, `priceType`, `currency`, `quotationStatus` |
| Evidence/provenance | `evidenceStatus`, `sourceReference`, `sourceChecked`, `sourceClassification` |
| Display and approval | `featured`, `approved`, `dateAdded`, `related` |

`sku` is a product-level field; category membership is stored in `departments[]` and `subcategories[]`. Price is stored in `price` with accompanying `priceType` and `currency`. No `stock`, `stockStatus`, `availability`, or inventory field appears in the documented/sample record shape; product availability is instead described as something confirmed by enquiry/quotation. ( `assets/js/catalogue.js:8-21`, `assets/js/catalogue.js:318-371`, `assets/js/app.js:381` )

## Search status

- A global search form is in the header; it has a search input and submit button. ( `index.html:21-24` )
- Submitting the form navigates to `#/shop?q=...` and carries existing shop filters forward when submitting from the shop page. ( `assets/js/app.js:779` )
- Search runs client-side over product name, model, SKU, brand, descriptions, specification values, applications, and category/subcategory names. ( `assets/js/app.js:237-243` )
- No server search endpoint is wired into this static site: the handler routes to the local shop filter, and the documented stack has no server/database. ( `assets/js/app.js:237-243`, `assets/js/app.js:779`, `README.md:35` )

## Design-token names

The stylesheet defines these CSS custom-property names; color values are intentionally omitted here: `--navy`, `--blue`, `--ink`, `--muted`, `--line`, `--light`, `--green`, `--green-soft`, `--amber`, `--danger`, `--radius`, `--radius-sm`, `--shadow`, `--font`, `--wrap`. ( `assets/css/styles.css:5-20` )

The font token is `--font`; the layout-width token is `--wrap`. There is no named spacing token in the `:root` token list. ( `assets/css/styles.css:5-20` )

Responsive breakpoint names/values in the stylesheet are `max-width: 1049px`, `min-width: 420px`, `min-width: 600px`, `min-width: 800px`, `min-width: 1050px`, and `min-width: 1500px`. ( `assets/css/styles.css:287`, `assets/css/styles.css:390`, `assets/css/styles.css:393`, `assets/css/styles.css:416`, `assets/css/styles.css:438`, `assets/css/styles.css:453` )

## Files to change for a product-heavy, flat, search-driven homepage

This is an implementation-scope inventory only; none of these files has been changed for this audit.

| File | Why it belongs in the change set |
|---|---|
| `index.html` | The current header contains the global search and flat primary navigation, and the file supplies the shared page shell and footer. Change it if the flat homepage requires different shell, search, or navigation markup. ( `index.html:18-43` ) |
| `assets/js/app.js` | Owns the homepage section order, conditional product row, department links, product-card rendering, and shop/search filtering. ( `assets/js/app.js:179-221`, `assets/js/app.js:143-171`, `assets/js/app.js:237-243`, `assets/js/app.js:301-322` ) |
| `assets/js/catalogue.js` | Holds the category definitions and product records used by homepage rows and search. ( `assets/js/catalogue.js:23-24`, `assets/js/catalogue.js:318-371` ) |
| `assets/css/styles.css` | Provides the responsive layout and styles used by the home sections, navigation, search form, and product grids. ( `index.html:11`, `assets/css/styles.css:1-20`, `assets/css/styles.css:287-453` ) |
| `standalone/nycesolutionssafrica-refactored.html` | Regenerate this derived single-file site after changing modular sources, as specified by the repository documentation; it is generated output, not the source of record. ( `README.md:6`, `README.md:30-32`, `README.md:66` ) |
