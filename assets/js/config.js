/* =============================================================================
   NYCE SOLUTIONS — central site configuration
   -----------------------------------------------------------------------------
   This is the ONLY file a business owner needs to edit to configure the store.
   Every value below is read by assets/js/app.js at start-up.

   RULES
   - whatsappNumber: international format, digits only. No "+", spaces or dashes.
     Example: Kenya +254 7XX XXX XXX  ->  "2547XXXXXXXX"
     Leave it empty ("") until the real NYCE SOLUTIONS business number is known.
     While it is empty the site shows a message preview + copy button instead of
     opening a broken WhatsApp link.
   - siteMode: "demo" shows every catalogue record with evidence labels and
     demonstration-price notices. "production" shows ONLY the product IDs listed
     in approvedProductIds and hides competitor source references.
   - publicBaseUrl: the address the site is served from, used to build product
     links inside WhatsApp messages. For GitHub Pages this is normally
     https://<user>.github.io/<repository>/   (keep the trailing slash).
   ============================================================================ */
window.NYCE_CONFIG = {
  businessName: "NYCE SOLUTIONS",
  websiteName: "www.nycesolutionsafrica.com",
  websiteUrl: "https://www.nycesolutionsafrica.com",
  facebookName: "nycesolutionsafrica",
  facebookUrl: "https://www.facebook.com/nycesolutionsafrica",

  // "demo" | "production"
  siteMode: "demo",

  // Contact details
  whatsappNumber: "254720388496", // international format, digits only
  phoneNumber: "",               // display format, e.g. "+254 7XX XXX XXX"
  emailAddress: "sales@nycesolutionsafrica.com",
  physicalAddress: "",           // e.g. "Street, Building, Town, Kenya"
  operatingHours: "",            // e.g. "Mon–Fri 8:00–17:00, Sat 9:00–13:00"

  // Deployment
  publicBaseUrl: "",             // e.g. "https://username.github.io/nyce-solutions-africa/"

  // Commerce defaults
  currency: "KES",
  locale: "en-KE",
  cataloguePageSize: 12,
  maxQuantity: 99,

  // Product approval (used in production mode). Add catalogue IDs only after the
  // owner has verified name, specification, price and image rights for each.
  approvedProductIds: [],

  // Policy and contact placeholders shown until approved text exists.
  placeholders: {
    contactPending: "To be supplied by NYCE SOLUTIONS",
    deliveryStatement: "Delivery coverage, charges and lead times are confirmed per enquiry. Requests from other African countries are assessed individually.",
    policyPending: "Owner approval required before launch"
  },

  // Internal: set automatically by tools/build-standalone.py for the standalone file.
  build: "repository"
};
