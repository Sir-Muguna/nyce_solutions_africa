# Header implementation note

## Files changed

- `index.html` — replaced the utility/header markup with the flat search-first header and visible Home, Shop, and Categories links.
- `assets/css/styles.css` — added responsive header layout, 44px minimum controls, sticky positioning, and compact-on-scroll styling using existing tokens.
- `assets/js/app.js` — limited search matching to product name and SKU, connected the sticky compact state, and removed obsolete mobile-menu behavior.
- `tests/acceptance.py` — updated navigation assertions and added header layout, accessibility target-size, compact scroll, search, and WhatsApp configuration checks.
- `standalone/nycesolutionssafrica-refactored.html` — regenerated from the modular site sources.
- `HEADER.md` — this implementation note.

## Search query signature

The search form submits a client-side hash route of the form `#/shop?q=<URL-encoded-term>`. `q` is the sole search parameter; matching is case-insensitive against product `name` and internal reference `sku` fields. It does not call a server endpoint. The same signature and matching fields are documented in the comment immediately above the search form in `index.html`.

The header WhatsApp button calls the existing enquiry-preview flow, which uses the shared `NYCE_CONFIG.whatsappNumber` value. It does not define a separate number. The current configured value is blank in `assets/js/config.js`.

## Breakpoint behavior

| Viewport | Header layout |
|---|---|
| 375px | Logo, WhatsApp, and cart occupy the first row; the expanded, full-width search row remains visible directly beneath the logo; Home, Shop, and Categories form a flat third row. |
| 768px | Logo, expanded search, WhatsApp, and cart share the first row; Home, Shop, and Categories sit in a flat second row. |
| 1280px | One horizontal row: logo, widest/flexible search field, flat Home/Shop/Categories navigation, WhatsApp, and cart. |

The header is sticky at the top. Once the page is scrolled beyond 80px, it collapses to one compact row with the logo, search input, and cart still visible; the navigation and WhatsApp button are hidden in this compact state. All visible header controls and navigation links have a minimum 44px tap height.
