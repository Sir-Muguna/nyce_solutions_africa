# Shared product cards and search results

## Component and usage

- Shared card renderer: `card(p)` in `assets/js/app.js`.
- The homepage product rows, Shop/category listings, search results, and related-product rows all render through this function.
- Shared card layout and square media styling: `assets/css/styles.css`.
- Search results route: `#/shop?q=<URL-encoded-term>`.

## Field bindings

| Card content | Product/config source |
|---|---|
| Square product image | `image.tile`; accessible image text from `alt` |
| Product name | `name` |
| SKU / internal reference | `sku`; omitted when not supplied |
| Stock status | `stock`; omitted when the field or its value is absent |
| Price | `price`, formatted with `money()` and `NYCE_CONFIG.currency`; `priceType` determines the existing demo-price or quotation note |
| View details destination | `id`, used in `#/product/:id` |
| WhatsApp enquiry | `NYCE_CONFIG.whatsappNumber` and the existing generic `generalMessage()`; no product-specific details are inserted |

The WhatsApp number configured in `assets/js/config.js` is `254720388496`. When configured, the WhatsApp action links to that number with the generic prefilled message; it does not insert product-specific details.

The current catalogue has no `stock` field and only one non-null `sku` (`EC 7574-BS`, for `tronic-extension`). Cards consequently omit stock status and omit the SKU line for products without a supplied SKU. The catalogue has demonstration prices or quote-required values, but no tax-inclusion field; the existing price notes remain in place and do not assert tax-inclusive pricing.

## Search results

- Handler and matching logic: `searchText(p)` and `filtered(sel)` in `assets/js/app.js`; form submission is handled in the same file.
- Search fields: product `name` and `sku` only, case-insensitive. A source comment above `searchText()` documents these fields.
- The results page shows the query and result count above the result grid and uses the same `card(p)` renderer as other product rows.
- An empty search result states that no products match the submitted query; it does not add recommendations.

The single populated SKU can be searched and verified against `tronic-extension`. The current data does not provide five distinct real SKUs, so five unique-SKU manual searches cannot be completed without additional catalogue data.

## Files changed for this implementation

- `assets/js/app.js` — shared card, query matching, query/count summary, and factual empty state.
- `assets/css/styles.css` — shared square card media, field layout, and result summary styles.
- `tests/acceptance.py` — shared-card and search-result acceptance checks.
- `standalone/nycesolutionssafrica-refactored.html` — generated standalone copy.
- `HOMEPAGE.md` — updated to reflect shared cards and removed placeholders.
- `CARDS.md` — this implementation note.
