# Shop filter and contact-channel update

## Files changed

- `assets/js/app.js` — simplified the shop filter sidebar and rendered the supplied contact links in the footer and contact page.
- `assets/js/config.js` — configured the supplied WhatsApp number, email, Facebook page, and website.
- `tests/acceptance.py` — updated sidebar checks and added category, contact-link, and responsive assertions.
- `standalone/nycesolutionssafrica-refactored.html` — regenerated from the modular site sources.
- `HEADER.md` — updated the documented shared WhatsApp configuration.
- `CARDS.md` — updated the documented WhatsApp card link behavior.
- `SHOP_FILTER_UPDATE.md` — this implementation note.

## Sidebar labels and panels

| Existing wording | Updated wording |
|---|---|
| Filter products | Filter products (unchanged) |
| Department | Categories |
| All departments | All Categories |

Removed from the sidebar UI: Subcategory, Power source, Electrical phase, Price type, Application, and Product evidence. The category records and product attributes remain in the repository.

The remaining category options are the six existing categories: Solar & Renewable Energy, Agriculture & Irrigation, Electricals & Wiring, Borehole & Water Solutions, Construction & Tools, and Petrol & Diesel Generators. The existing product counts remain unchanged: 10, 8, 8, 9, 11, and 6 respectively; All Categories remains 49 products. “Filter products”, “Clear all filters”, and the existing quote helper remain.

## Contact channels

| Channel | Value | Rendered in |
|---|---|---|
| WhatsApp | `+254720388496` (`https://wa.me/254720388496`) | Footer and contact page; shared number also powers the header enquiry |
| Email | `sales@nycesolutionsafrica.com` (`mailto:sales@nycesolutionsafrica.com`) | Footer and contact page |
| Facebook | `nycesolutionsafrica` → `https://www.facebook.com/nycesolutionsafrica` | Footer, opens in a new tab with `rel="noopener noreferrer"` |
| Website | `www.nycesolutionsafrica.com` → `https://www.nycesolutionsafrica.com` | Footer |

The number was blank in the repository before this update, so it could not be independently matched against an external business record; the configured number is the one supplied in the request. The Facebook URL responded with HTTP 200 when checked.

## Verification

- The category sidebar and radio list render at 375px and 1280px.
- Selecting Solar filters the product grid; all category counts match the existing catalogue counts.
- The acceptance suite passed: 174 passed, 0 failed.
- JavaScript/Python syntax and `git diff --check` passed.
