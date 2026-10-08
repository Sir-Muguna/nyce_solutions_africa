# Catalog-first homepage

## Section order

1. Existing sticky header.
2. Compact search-and-shop strip with product search and a `#/shop` link.
3. Featured Products.
4. Existing category quick-links row, linked to the six current filtered Shop routes.
5. New Arrivals.
6. Best Sellers.
7. Trust strip.
8. Single `#/shop` CTA band.
9. Existing footer.

New Arrivals has no cards because no product has a populated `dateAdded`; Best Sellers has no cards because no product has `bestSeller: true`. No empty-state placeholder copy is displayed in those rows. The homepage has no hero carousel or lifestyle-image hero.

## Shared product-card fields

The homepage uses the shared card renderer documented in [CARDS.md](./CARDS.md).

## Changed files

- `assets/js/app.js` — homepage sections and shared product-card rendering.
- `assets/css/styles.css` — homepage and shared product-card layout.
- `tests/acceptance.py` — homepage, shared-card, search, and responsive checks.
- `standalone/nycesolutionssafrica-refactored.html` — generated standalone copy.
- `CARDS.md` — shared product-card and search-result implementation details.
- `HOMEPAGE.md` — this implementation note.

The shared header and footer were not changed by the homepage update.
