/* =============================================================================
   NYCE SOLUTIONS — central catalogue data
   -----------------------------------------------------------------------------
   One record per product. A product that belongs to several categories is NOT
   duplicated: it lists every category and subcategory it is assigned to.

   Field reference (validated by tools/validate-catalogue.py; blank record in docs/product-template.json):
   id                 unique internal ID (never shown as a supplier SKU)
   sku / model        verified supplier SKU or listed model; null when unknown
   brand              verified brand; null otherwise (shown as "To Be Confirmed")
   categories[]      parent category IDs           subcategories[]  child IDs (first one = breadcrumb)
   applications[]     Home Backup Power | Farm & Irrigation | Construction & Workshop
   image / gallery    image.src = licensed product photo path or https URL; else sprite tile (assets/images/equipment.webp)
   price / priceType  number + "fixed" (owner-confirmed) | number + "demo" | null + "quote"   currency  KES
   quotationStatus    "priced" | "demo-price" | "quote-required"
   stock              optional availability text, e.g. "In stock"; omit or null when unknown
   specs              object of spec name -> value; use the names listed per subcategory in docs/product-template.json
   evidenceStatus     "owner-supplied" | "sourced" (retailer-listed) | "illustrative" (unverified: specs hidden)
   sourceReference    internal competitor URL — never shown in production mode
   sourceClassification  "sourced" | "owner-supplied" | "illustrative"
   featured           boolean   approved  boolean (owner sign-off, production gate)
   dateAdded          null until real catalogue dates exist (enables "Newest" sort)
   related[]          explicit related IDs; empty = derived from shared subcategory
   ============================================================================ */
window.NYCE_CATALOGUE = {
  "categories": [
    {
      "id": "solar",
      "name": "Solar & Renewable Energy",
      "intro": "Solar generation, energy storage and water heating.",
      "advice": "Plan around your daily energy use, essential loads and available installation space.",
      "imageTile": 0,
      "subcategories": [
        {
          "id": "solar-1",
          "name": "Lithium Starter Solar Kits"
        },
        {
          "id": "solar-2",
          "name": "Lithium Family & Home Solar Kits"
        },
        {
          "id": "solar-3",
          "name": "Lithium Premium Home & Business Kits"
        },
        {
          "id": "solar-4",
          "name": "Lithium Commercial & Industrial Solar"
        },
        {
          "id": "solar-5",
          "name": "Hybrid Solar Inverters"
        },
        {
          "id": "solar-6",
          "name": "Lithium Batteries"
        },
        {
          "id": "solar-7",
          "name": "Solar DC Borehole Pumps"
        },
        {
          "id": "solar-8",
          "name": "Solar Water Heaters"
        },
        {
          "id": "solar-9",
          "name": "Solar Accessories"
        },
        {
          "id": "solar-10",
          "name": "Solar Pumping Inverter"
        }
      ]
    },
    {
      "id": "agriculture",
      "name": "Agriculture & Irrigation",
      "intro": "Equipment for growing, watering and processing.",
      "advice": "Start with your acreage, water source and the work you need to get done.",
      "imageTile": 1,
      "subcategories": [
        {
          "id": "agriculture-1",
          "name": "Irrigation Water Kits"
        },
        {
          "id": "agriculture-2",
          "name": "Walking Tractor"
        },
        {
          "id": "agriculture-3",
          "name": "Bee Keeping Equipment"
        },
        {
          "id": "agriculture-4",
          "name": "Incubators"
        },
        {
          "id": "agriculture-5",
          "name": "Posho Mill"
        },
        {
          "id": "agriculture-6",
          "name": "Irrigation Pipes"
        },
        {
          "id": "agriculture-7",
          "name": "Agricultural Diesel Engines"
        },
        {
          "id": "agriculture-8",
          "name": "Knapsack Sprayers"
        },
        {
          "id": "agriculture-9",
          "name": "Farm Irrigation Equipment"
        }
      ]
    },
    {
      "id": "electrical",
      "name": "Electricals & Wiring",
      "intro": "Connections and controls for everyday projects.",
      "advice": "Compare cable sizes, outlet arrangements and protection requirements for your project.",
      "imageTile": 2,
      "subcategories": [
        {
          "id": "electrical-1",
          "name": "Electrical Cables"
        },
        {
          "id": "electrical-2",
          "name": "Switches & Sockets"
        },
        {
          "id": "electrical-3",
          "name": "Changeover Switches"
        },
        {
          "id": "electrical-4",
          "name": "Single Core Cables"
        },
        {
          "id": "electrical-5",
          "name": "Extension Cords"
        },
        {
          "id": "electrical-6",
          "name": "Voltage Stabilizers"
        },
        {
          "id": "electrical-7",
          "name": "Panel Boxes"
        },
        {
          "id": "electrical-8",
          "name": "Power Strips & Surge Protectors"
        },
        {
          "id": "electrical-9",
          "name": "Twin & Earth Cables"
        },
        {
          "id": "electrical-10",
          "name": "Distribution Boards"
        }
      ]
    },
    {
      "id": "water",
      "name": "Borehole & Water Solutions",
      "intro": "Move, manage and treat your water.",
      "advice": "Share your required flow, pumping head and water source to narrow your selection.",
      "imageTile": 3,
      "subcategories": [
        {
          "id": "water-1",
          "name": "Electric Borehole Pumps"
        },
        {
          "id": "water-3",
          "name": "AC DC Borehole Pumps"
        },
        {
          "id": "water-4",
          "name": "Borehole Cables & Accessories"
        },
        {
          "id": "water-5",
          "name": "Automatic Pump Control Switch"
        },
        {
          "id": "water-6",
          "name": "Borehole Pumps Systems"
        },
        {
          "id": "water-7",
          "name": "Booster Centrifugal Water Pumps"
        },
        {
          "id": "water-8",
          "name": "Swimming Pools Pumps & Accessories"
        },
        {
          "id": "water-9",
          "name": "Water Treatment"
        },
        {
          "id": "water-10",
          "name": "Water & Irrigation Equipment"
        }
      ]
    },
    {
      "id": "construction",
      "name": "Construction & Tools",
      "intro": "Tools and machinery for the work ahead.",
      "advice": "Find equipment for site preparation, fabrication, maintenance and finishing.",
      "imageTile": 4,
      "subcategories": [
        {
          "id": "construction-1",
          "name": "Building Equipment"
        },
        {
          "id": "construction-2",
          "name": "Construction Machinery"
        },
        {
          "id": "construction-3",
          "name": "Welding Machines & Accessories"
        },
        {
          "id": "construction-4",
          "name": "Wood Working & Carpentry"
        },
        {
          "id": "construction-5",
          "name": "Power & Hand Tools"
        },
        {
          "id": "construction-6",
          "name": "Plumbing & Sewage Pumps"
        },
        {
          "id": "construction-7",
          "name": "Security"
        },
        {
          "id": "construction-8",
          "name": "Ladders"
        },
        {
          "id": "construction-9",
          "name": "Fire Safety Equipment"
        },
        {
          "id": "construction-10",
          "name": "Gardening & Lawn Mowers"
        }
      ]
    },
    {
      "id": "generators",
      "name": "Petrol & Diesel Generators",
      "intro": "Backup and working power, sized to your needs.",
      "advice": "Match fuel type and electrical phase to your loads before selecting a generator.",
      "imageTile": 5,
      "subcategories": [
        {
          "id": "generators-1",
          "name": "Petrol Generators"
        },
        {
          "id": "generators-2",
          "name": "Diesel Generators"
        },
        {
          "id": "generators-3",
          "name": "Single Phase Diesel Generators"
        },
        {
          "id": "generators-4",
          "name": "Three Phase Diesel Generators"
        },
        {
          "id": "generators-5",
          "name": "Silent Canopy Generators"
        },
        {
          "id": "generators-6",
          "name": "Industrial Water Cooled Generators"
        },
        {
          "id": "generators-7",
          "name": "Alternators"
        },
        {
          "id": "generators-8",
          "name": "Biogas LPG Generators"
        },
        {
          "id": "generators-9",
          "name": "Diesel Welding Generators"
        },
        {
          "id": "generators-10",
          "name": "Home Backup Generators"
        }
      ]
    }
  ],
  "products": [
    {
      "id": "starter-solar",
      "sku": null,
      "model": null,
      "name": "Starter lithium solar kit",
      "brand": null,
      "brandStatus": "unverified",
      "categories": [
        "solar"
      ],
      "subcategories": [
        "solar-1"
      ],
      "applications": [
        "Home Backup Power"
      ],
      "image": {
        "asset": "equipment",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "asset": "equipment",
          "tile": 0,
          "label": "Representative image"
        },
        {
          "type": "spec",
          "label": "Specification overview"
        }
      ],
      "alt": "Illustrative solar & renewable energy equipment; not an exact model photograph",
      "photoStatus": "Illustrative category visual; exact product photography pending",
      "shortDescription": "A starting point for lighting, connectivity and selected essential loads.",
      "description": "A starting point for lighting, connectivity and selected essential loads. Final components require a load schedule.",
      "specs": {
        "Package": "Solar + inverter + lithium storage",
        "Sizing": "Load assessment required"
      },
      "power": "Solar",
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "evidenceStatus": "illustrative",
      "sourceReference": null,
      "sourceChecked": null,
      "sourceClassification": "illustrative",
      "featured": false,
      "approved": false,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "alps-6kw",
      "sku": null,
      "model": "PULSE S3 (inverter)",
      "name": "ALPS Essential 6 kW solar kit",
      "brand": "ALPS",
      "brandStatus": "retailer-listed",
      "categories": [
        "solar"
      ],
      "subcategories": [
        "solar-2"
      ],
      "applications": [
        "Home Backup Power"
      ],
      "image": {
        "asset": "equipment",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "asset": "equipment",
          "tile": 0,
          "label": "Representative image"
        },
        {
          "type": "spec",
          "label": "Specification overview"
        }
      ],
      "alt": "Illustrative solar & renewable energy equipment; not an exact model photograph",
      "photoStatus": "Illustrative category visual; exact product photography pending",
      "shortDescription": "A reference solar-and-storage package for planning essential household circuits.",
      "description": "A reference solar-and-storage package for planning essential household circuits. Final battery selection and usable energy require confirmation.",
      "specs": {
        "Inverter power": "6 kW",
        "Battery platform": "48 V",
        "Storage designation": "5 kWh",
        "Proposed panels": "6 × 620 W (3.72 kWp)"
      },
      "power": "Solar",
      "capacity": "6 kW",
      "phase": null,
      "price": 298000,
      "priceType": "fixed",
      "currency": "KES",
      "quotationStatus": "priced",
      "evidenceStatus": "sourced",
      "sourceReference": "https://macire.co.ke/product/6kw-alps-essential-with-5kwh-storage-solar-kit/",
      "sourceChecked": "2026-10-07",
      "sourceClassification": "sourced",
      "featured": true,
      "approved": false,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "srne-home",
      "sku": null,
      "model": null,
      "name": "SRNE 10 kW lithium solar system",
      "brand": "SRNE",
      "brandStatus": "retailer-listed",
      "categories": [
        "solar"
      ],
      "subcategories": [
        "solar-3"
      ],
      "applications": [
        "Home Backup Power"
      ],
      "image": {
        "asset": "equipment",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "asset": "equipment",
          "tile": 0,
          "label": "Representative image"
        },
        {
          "type": "spec",
          "label": "Specification overview"
        }
      ],
      "alt": "Illustrative solar & renewable energy equipment; not an exact model photograph",
      "photoStatus": "Illustrative category visual; exact product photography pending",
      "shortDescription": "A larger reference package for a home or business energy assessment.",
      "description": "A larger reference package for a home or business energy assessment. Equipment scope and compatibility must be confirmed.",
      "specs": {
        "Inverter power": "10 kW",
        "Nominal storage": "16.07 kWh",
        "Solar panels": "12 × 620 W"
      },
      "power": "Solar",
      "capacity": "10 kW",
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "evidenceStatus": "sourced",
      "sourceReference": "https://macire.co.ke/product/10kw-srne-hybrid-solar-system-with-16-07kwh-battery-all-inclusive/",
      "sourceChecked": "2026-10-07",
      "sourceClassification": "sourced",
      "featured": false,
      "approved": false,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "commercial-solar",
      "sku": null,
      "model": null,
      "name": "Commercial lithium solar package",
      "brand": null,
      "brandStatus": "unverified",
      "categories": [
        "solar"
      ],
      "subcategories": [
        "solar-4"
      ],
      "applications": [
        "Construction & Workshop"
      ],
      "image": {
        "asset": "equipment",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "asset": "equipment",
          "tile": 0,
          "label": "Representative image"
        },
        {
          "type": "spec",
          "label": "Specification overview"
        }
      ],
      "alt": "Illustrative solar & renewable energy equipment; not an exact model photograph",
      "photoStatus": "Illustrative category visual; exact product photography pending",
      "shortDescription": "Build a quotation around operating hours, peak demand and priority circuits.",
      "description": "Build a quotation around operating hours, peak demand and priority circuits. Capacity is defined after reviewing your requirements.",
      "specs": {
        "Package": "Commercial solar + storage",
        "Sizing": "Site-specific design"
      },
      "power": "Solar",
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "evidenceStatus": "illustrative",
      "sourceReference": null,
      "sourceChecked": null,
      "sourceClassification": "illustrative",
      "featured": false,
      "approved": false,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "must-inverter",
      "sku": null,
      "model": null,
      "name": "MUST 5.5 kW hybrid inverter",
      "brand": "MUST",
      "brandStatus": "retailer-listed",
      "categories": [
        "solar"
      ],
      "subcategories": [
        "solar-5"
      ],
      "applications": [
        "Home Backup Power"
      ],
      "image": {
        "asset": "equipment",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "asset": "equipment",
          "tile": 0,
          "label": "Representative image"
        },
        {
          "type": "spec",
          "label": "Specification overview"
        }
      ],
      "alt": "Illustrative solar & renewable energy equipment; not an exact model photograph",
      "photoStatus": "Illustrative category visual; exact product photography pending",
      "shortDescription": "A reference hybrid inverter for solar and battery power planning.",
      "description": "A reference hybrid inverter for solar and battery power planning. Confirm the final model and compatible battery before purchase.",
      "specs": {
        "Output power": "5.5 kW",
        "Battery platform": "48 V",
        "MPPT charger": "100 A"
      },
      "power": "Solar",
      "capacity": "5.5 kW",
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "evidenceStatus": "sourced",
      "sourceReference": "https://macire.co.ke/product/5-5kw-48v-must-hybrid-solar-inverter-100a-built-in-mppt/",
      "sourceChecked": "2026-10-07",
      "sourceClassification": "sourced",
      "featured": false,
      "approved": false,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "srne-battery",
      "sku": null,
      "model": null,
      "name": "SRNE 2.56 kWh lithium battery",
      "brand": "SRNE",
      "brandStatus": "retailer-listed",
      "categories": [
        "solar"
      ],
      "subcategories": [
        "solar-6"
      ],
      "applications": [
        "Home Backup Power"
      ],
      "image": {
        "asset": "equipment",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "asset": "equipment",
          "tile": 0,
          "label": "Representative image"
        },
        {
          "type": "spec",
          "label": "Specification overview"
        }
      ],
      "alt": "Illustrative solar & renewable energy equipment; not an exact model photograph",
      "photoStatus": "Illustrative category visual; exact product photography pending",
      "shortDescription": "Reference lithium storage for a compatible low-voltage solar system.",
      "description": "Reference lithium storage for a compatible low-voltage solar system. Check actual nominal voltage and charging limits with the supplier.",
      "specs": {
        "Nominal energy": "2.56 kWh",
        "Capacity": "200 Ah",
        "System class": "12 V"
      },
      "power": "Battery",
      "capacity": "2.56 kWh",
      "phase": null,
      "price": 57999,
      "priceType": "fixed",
      "currency": "KES",
      "quotationStatus": "priced",
      "evidenceStatus": "sourced",
      "sourceReference": "https://macire.co.ke/product/2-56kwh-srne-12v-200ah-lithium-battery-compact-storage-for-12v-solar-systems/",
      "sourceChecked": "2026-10-07",
      "sourceClassification": "sourced",
      "featured": false,
      "approved": false,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "doyin-solar-pump",
      "sku": null,
      "model": "4SDS5-1100W",
      "name": "Doyin 1.5 HP solar borehole pump kit",
      "brand": "Doyin",
      "brandStatus": "retailer-listed",
      "categories": [
        "solar",
        "water"
      ],
      "subcategories": [
        "solar-7",
        "water-6"
      ],
      "applications": [
        "Farm & Irrigation"
      ],
      "image": {
        "asset": "equipment",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "asset": "equipment",
          "tile": 0,
          "label": "Representative image"
        },
        {
          "type": "spec",
          "label": "Specification overview"
        }
      ],
      "alt": "Illustrative solar & renewable energy equipment; not an exact model photograph",
      "photoStatus": "Illustrative category visual; exact product photography pending",
      "shortDescription": "A sourced pump-system example for borehole and tank-filling enquiries.",
      "description": "A sourced pump-system example for borehole and tank-filling enquiries. Maximum flow and maximum head are separate operating points; request the pump curve.",
      "specs": {
        "Motor power": "1.5 HP",
        "Maximum head": "120 m",
        "Maximum flow": "5 m³/h",
        "Proposed array": "3 × 590 W"
      },
      "power": "Solar",
      "capacity": "1.5 HP",
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "evidenceStatus": "sourced",
      "sourceReference": "https://macire.co.ke/product/5-m%C2%B3-120m-doyin-1-5hp-dc-solar-borehole-pump-system-kit-4sds5-1100w/",
      "sourceChecked": "2026-10-07",
      "sourceClassification": "sourced",
      "featured": true,
      "approved": false,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "solar-heater",
      "sku": null,
      "model": null,
      "name": "Seven Stars 300 L solar water heater",
      "brand": "Seven Stars",
      "brandStatus": "retailer-listed",
      "categories": [
        "solar"
      ],
      "subcategories": [
        "solar-8"
      ],
      "applications": [
        "Home Backup Power"
      ],
      "image": {
        "asset": "equipment",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "asset": "equipment",
          "tile": 0,
          "label": "Representative image"
        },
        {
          "type": "spec",
          "label": "Specification overview"
        }
      ],
      "alt": "Illustrative solar & renewable energy equipment; not an exact model photograph",
      "photoStatus": "Illustrative category visual; exact product photography pending",
      "shortDescription": "A reference solar hot-water system.",
      "description": "A reference solar hot-water system. Confirm water pressure, mounting space and the final equipment specification.",
      "specs": {
        "Tank capacity": "300 L",
        "System type": "Pressurized",
        "Material description": "Stainless steel"
      },
      "power": "Solar",
      "capacity": "300 L",
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "evidenceStatus": "sourced",
      "sourceReference": "https://macire.co.ke/product/300l-seven-stars-stainless-pressurized-solar-water-heater/",
      "sourceChecked": "2026-10-07",
      "sourceClassification": "sourced",
      "featured": false,
      "approved": false,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "solar-connectors",
      "sku": null,
      "model": null,
      "name": "Solar cable connector pair",
      "brand": null,
      "brandStatus": "unverified",
      "categories": [
        "solar"
      ],
      "subcategories": [
        "solar-9"
      ],
      "applications": [
        "Home Backup Power"
      ],
      "image": {
        "asset": "equipment",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "asset": "equipment",
          "tile": 0,
          "label": "Representative image"
        },
        {
          "type": "spec",
          "label": "Specification overview"
        }
      ],
      "alt": "Illustrative solar & renewable energy equipment; not an exact model photograph",
      "photoStatus": "Illustrative category visual; exact product photography pending",
      "shortDescription": "Illustrative connectors for a solar wiring quotation.",
      "description": "Illustrative connectors for a solar wiring quotation. Match the exact connector family and cable dimensions.",
      "specs": {
        "Component": "PV cable connectors",
        "Cable compatibility": "To be confirmed"
      },
      "power": "Passive",
      "capacity": null,
      "phase": null,
      "price": 650,
      "priceType": "fixed",
      "currency": "KES",
      "quotationStatus": "priced",
      "evidenceStatus": "illustrative",
      "sourceReference": null,
      "sourceChecked": null,
      "sourceClassification": "illustrative",
      "featured": false,
      "approved": false,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "pump-inverter",
      "sku": null,
      "model": null,
      "name": "Solar pumping inverter",
      "brand": null,
      "brandStatus": "unverified",
      "categories": [
        "solar"
      ],
      "subcategories": [
        "solar-10"
      ],
      "applications": [
        "Farm & Irrigation"
      ],
      "image": {
        "asset": "equipment",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "asset": "equipment",
          "tile": 0,
          "label": "Representative image"
        },
        {
          "type": "spec",
          "label": "Specification overview"
        }
      ],
      "alt": "Illustrative solar & renewable energy equipment; not an exact model photograph",
      "photoStatus": "Illustrative category visual; exact product photography pending",
      "shortDescription": "An illustrative controller for solar pumping projects.",
      "description": "An illustrative controller for solar pumping projects. Share the motor rating and water demand with your enquiry.",
      "specs": {
        "Function": "Pump motor control",
        "Power rating": "To be sized",
        "Motor compatibility": "To be confirmed"
      },
      "power": "Solar",
      "capacity": "To be sized",
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "evidenceStatus": "illustrative",
      "sourceReference": null,
      "sourceChecked": null,
      "sourceClassification": "illustrative",
      "featured": false,
      "approved": false,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "irrigation-kit",
      "sku": null,
      "model": null,
      "name": "Drip irrigation starter kit",
      "brand": null,
      "brandStatus": "unverified",
      "categories": [
        "agriculture",
        "water"
      ],
      "subcategories": [
        "agriculture-1",
        "agriculture-9",
        "water-10"
      ],
      "applications": [
        "Farm & Irrigation"
      ],
      "image": {
        "asset": "equipment",
        "tile": 1
      },
      "gallery": [
        {
          "type": "photo",
          "asset": "equipment",
          "tile": 1,
          "label": "Representative image"
        },
        {
          "type": "spec",
          "label": "Specification overview"
        }
      ],
      "alt": "Illustrative agriculture & irrigation equipment; not an exact model photograph",
      "photoStatus": "Illustrative category visual; exact product photography pending",
      "shortDescription": "Plan a drip-irrigation layout around your crop, plot dimensions and available water pressure.",
      "description": "Plan a drip-irrigation layout around your crop, plot dimensions and available water pressure. Kit contents require confirmation.",
      "specs": {
        "Irrigation type": "Drip",
        "Layout": "Plot-specific",
        "Water source": "To be confirmed"
      },
      "power": "Passive",
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "evidenceStatus": "illustrative",
      "sourceReference": null,
      "sourceChecked": null,
      "sourceClassification": "illustrative",
      "featured": false,
      "approved": false,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "jiadi-tractor",
      "sku": null,
      "model": "JD10L",
      "name": "JIADI 10 HP walking diesel tractor",
      "brand": "JIADI",
      "brandStatus": "retailer-listed",
      "categories": [
        "agriculture"
      ],
      "subcategories": [
        "agriculture-2"
      ],
      "applications": [
        "Farm & Irrigation"
      ],
      "image": {
        "asset": "equipment",
        "tile": 1
      },
      "gallery": [
        {
          "type": "photo",
          "asset": "equipment",
          "tile": 1,
          "label": "Representative image"
        },
        {
          "type": "spec",
          "label": "Specification overview"
        }
      ],
      "alt": "Illustrative agriculture & irrigation equipment; not an exact model photograph",
      "photoStatus": "Illustrative category visual; exact product photography pending",
      "shortDescription": "A sourced walking-tractor example for land-preparation enquiries.",
      "description": "A sourced walking-tractor example for land-preparation enquiries. Request confirmation of the included implements.",
      "specs": {
        "Engine power": "10 HP",
        "Fuel": "Diesel",
        "Equipment type": "Walking tractor"
      },
      "power": "Diesel",
      "capacity": "10 HP",
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "evidenceStatus": "sourced",
      "sourceReference": "https://macire.co.ke/product/10hp-jd10l-jiadi-walking-diesel-tractor-with-implements-multi-purpose-farm-power-tiller/",
      "sourceChecked": "2026-10-07",
      "sourceClassification": "sourced",
      "featured": true,
      "approved": false,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "beehive",
      "sku": null,
      "model": null,
      "name": "Timber beehive with frames",
      "brand": null,
      "brandStatus": "unverified",
      "categories": [
        "agriculture"
      ],
      "subcategories": [
        "agriculture-3"
      ],
      "applications": [
        "Farm & Irrigation"
      ],
      "image": {
        "asset": "equipment",
        "tile": 1
      },
      "gallery": [
        {
          "type": "photo",
          "asset": "equipment",
          "tile": 1,
          "label": "Representative image"
        },
        {
          "type": "spec",
          "label": "Specification overview"
        }
      ],
      "alt": "Illustrative agriculture & irrigation equipment; not an exact model photograph",
      "photoStatus": "Illustrative category visual; exact product photography pending",
      "shortDescription": "An illustrative beekeeping equipment example.",
      "description": "An illustrative beekeeping equipment example. Specify your preferred hive configuration and number of units.",
      "specs": {
        "Hive material": "Timber",
        "Frame configuration": "To be confirmed"
      },
      "power": "Manual",
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "evidenceStatus": "illustrative",
      "sourceReference": null,
      "sourceChecked": null,
      "sourceClassification": "illustrative",
      "featured": false,
      "approved": false,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "incubator",
      "sku": null,
      "model": null,
      "name": "Automatic egg incubator",
      "brand": null,
      "brandStatus": "unverified",
      "categories": [
        "agriculture"
      ],
      "subcategories": [
        "agriculture-4"
      ],
      "applications": [
        "Farm & Irrigation"
      ],
      "image": {
        "asset": "equipment",
        "tile": 1
      },
      "gallery": [
        {
          "type": "photo",
          "asset": "equipment",
          "tile": 1,
          "label": "Representative image"
        },
        {
          "type": "spec",
          "label": "Specification overview"
        }
      ],
      "alt": "Illustrative agriculture & irrigation equipment; not an exact model photograph",
      "photoStatus": "Illustrative category visual; exact product photography pending",
      "shortDescription": "Compare incubators around flock size and available power.",
      "description": "Compare incubators around flock size and available power. Capacity and control functions require product verification.",
      "specs": {
        "Turning": "Automatic (illustrative)",
        "Egg capacity": "To be selected",
        "Power supply": "To be confirmed"
      },
      "power": "Electric",
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "evidenceStatus": "illustrative",
      "sourceReference": null,
      "sourceChecked": null,
      "sourceClassification": "illustrative",
      "featured": false,
      "approved": false,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "posho-mill",
      "sku": null,
      "model": null,
      "name": "Maize milling machine",
      "brand": null,
      "brandStatus": "unverified",
      "categories": [
        "agriculture"
      ],
      "subcategories": [
        "agriculture-5"
      ],
      "applications": [
        "Farm & Irrigation"
      ],
      "image": {
        "asset": "equipment",
        "tile": 1
      },
      "gallery": [
        {
          "type": "photo",
          "asset": "equipment",
          "tile": 1,
          "label": "Representative image"
        },
        {
          "type": "spec",
          "label": "Specification overview"
        }
      ],
      "alt": "Illustrative agriculture & irrigation equipment; not an exact model photograph",
      "photoStatus": "Illustrative category visual; exact product photography pending",
      "shortDescription": "An illustrative posho-mill enquiry item.",
      "description": "An illustrative posho-mill enquiry item. Share your target output and available power source.",
      "specs": {
        "Use": "Maize milling",
        "Drive": "To be selected",
        "Throughput": "To be confirmed"
      },
      "power": "Electric",
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "evidenceStatus": "illustrative",
      "sourceReference": null,
      "sourceChecked": null,
      "sourceClassification": "illustrative",
      "featured": false,
      "approved": false,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "irrigation-pipe",
      "sku": null,
      "model": null,
      "name": "Irrigation HDPE pipe coil",
      "brand": null,
      "brandStatus": "unverified",
      "categories": [
        "agriculture"
      ],
      "subcategories": [
        "agriculture-6"
      ],
      "applications": [
        "Farm & Irrigation"
      ],
      "image": {
        "asset": "equipment",
        "tile": 1
      },
      "gallery": [
        {
          "type": "photo",
          "asset": "equipment",
          "tile": 1,
          "label": "Representative image"
        },
        {
          "type": "spec",
          "label": "Specification overview"
        }
      ],
      "alt": "Illustrative agriculture & irrigation equipment; not an exact model photograph",
      "photoStatus": "Illustrative category visual; exact product photography pending",
      "shortDescription": "Plan pipe lengths and fittings around your field layout.",
      "description": "Plan pipe lengths and fittings around your field layout. Diameter, pressure class and coil length need confirmation.",
      "specs": {
        "Material": "HDPE (illustrative)",
        "Diameter": "To be specified",
        "Pressure class": "To be specified"
      },
      "power": "Passive",
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "evidenceStatus": "illustrative",
      "sourceReference": null,
      "sourceChecked": null,
      "sourceClassification": "illustrative",
      "featured": false,
      "approved": false,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "diesel-engine",
      "sku": null,
      "model": null,
      "name": "Agricultural diesel engine",
      "brand": null,
      "brandStatus": "unverified",
      "categories": [
        "agriculture"
      ],
      "subcategories": [
        "agriculture-7"
      ],
      "applications": [
        "Farm & Irrigation"
      ],
      "image": {
        "asset": "equipment",
        "tile": 1
      },
      "gallery": [
        {
          "type": "photo",
          "asset": "equipment",
          "tile": 1,
          "label": "Representative image"
        },
        {
          "type": "spec",
          "label": "Specification overview"
        }
      ],
      "alt": "Illustrative agriculture & irrigation equipment; not an exact model photograph",
      "photoStatus": "Illustrative category visual; exact product photography pending",
      "shortDescription": "An illustrative engine for agricultural equipment selection.",
      "description": "An illustrative engine for agricultural equipment selection. Match shaft type, speed and power to the driven equipment.",
      "specs": {
        "Fuel": "Diesel",
        "Drive arrangement": "To be confirmed",
        "Power rating": "To be sized"
      },
      "power": "Diesel",
      "capacity": "To be sized",
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "evidenceStatus": "illustrative",
      "sourceReference": null,
      "sourceChecked": null,
      "sourceClassification": "illustrative",
      "featured": false,
      "approved": false,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "sprayer",
      "sku": null,
      "model": null,
      "name": "Manual knapsack sprayer · 16 L example",
      "brand": null,
      "brandStatus": "unverified",
      "categories": [
        "agriculture"
      ],
      "subcategories": [
        "agriculture-8"
      ],
      "applications": [
        "Farm & Irrigation"
      ],
      "image": {
        "asset": "equipment",
        "tile": 1
      },
      "gallery": [
        {
          "type": "photo",
          "asset": "equipment",
          "tile": 1,
          "label": "Representative image"
        },
        {
          "type": "spec",
          "label": "Specification overview"
        }
      ],
      "alt": "Illustrative agriculture & irrigation equipment; not an exact model photograph",
      "photoStatus": "Illustrative category visual; exact product photography pending",
      "shortDescription": "A training example of a backpack sprayer.",
      "description": "A training example of a backpack sprayer. Confirm application compatibility and follow the chosen product instructions.",
      "specs": {
        "Tank capacity": "16 L (illustrative)",
        "Operation": "Manual",
        "Wear style": "Backpack"
      },
      "power": "Manual",
      "capacity": "16 L (illustrative)",
      "phase": null,
      "price": 3200,
      "priceType": "fixed",
      "currency": "KES",
      "quotationStatus": "priced",
      "evidenceStatus": "illustrative",
      "sourceReference": null,
      "sourceChecked": null,
      "sourceClassification": "illustrative",
      "featured": false,
      "approved": false,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "single-core",
      "sku": null,
      "model": null,
      "name": "Single-core cable · 2.5 mm² example",
      "brand": null,
      "brandStatus": "unverified",
      "categories": [
        "electrical"
      ],
      "subcategories": [
        "electrical-1",
        "electrical-4"
      ],
      "applications": [
        "Construction & Workshop"
      ],
      "image": {
        "asset": "equipment",
        "tile": 2
      },
      "gallery": [
        {
          "type": "photo",
          "asset": "equipment",
          "tile": 2,
          "label": "Representative image"
        },
        {
          "type": "spec",
          "label": "Specification overview"
        }
      ],
      "alt": "Illustrative electricals & wiring equipment; not an exact model photograph",
      "photoStatus": "Illustrative category visual; exact product photography pending",
      "shortDescription": "An illustrative single-core wiring cable.",
      "description": "An illustrative single-core wiring cable. Conductor, insulation and installation suitability need supplier confirmation.",
      "specs": {
        "Cross-section": "2.5 mm² (illustrative)",
        "Core count": "1",
        "Sale unit": "100 m coil (demo)"
      },
      "power": "Passive",
      "capacity": "2.5 mm² (illustrative)",
      "phase": null,
      "price": 12500,
      "priceType": "fixed",
      "currency": "KES",
      "quotationStatus": "priced",
      "evidenceStatus": "illustrative",
      "sourceReference": null,
      "sourceChecked": null,
      "sourceClassification": "illustrative",
      "featured": false,
      "approved": false,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "wall-socket",
      "sku": null,
      "model": null,
      "name": "Switched double wall socket",
      "brand": null,
      "brandStatus": "unverified",
      "categories": [
        "electrical"
      ],
      "subcategories": [
        "electrical-2"
      ],
      "applications": [
        "Construction & Workshop"
      ],
      "image": {
        "asset": "equipment",
        "tile": 2
      },
      "gallery": [
        {
          "type": "photo",
          "asset": "equipment",
          "tile": 2,
          "label": "Representative image"
        },
        {
          "type": "spec",
          "label": "Specification overview"
        }
      ],
      "alt": "Illustrative electricals & wiring equipment; not an exact model photograph",
      "photoStatus": "Illustrative category visual; exact product photography pending",
      "shortDescription": "An illustrative switched socket for project planning.",
      "description": "An illustrative switched socket for project planning. Confirm the rating and mounting box before ordering.",
      "specs": {
        "Outlets": "2 (illustrative)",
        "Mounting": "Wall",
        "Electrical rating": "To be confirmed"
      },
      "power": "Electric",
      "capacity": null,
      "phase": null,
      "price": 850,
      "priceType": "fixed",
      "currency": "KES",
      "quotationStatus": "priced",
      "evidenceStatus": "illustrative",
      "sourceReference": null,
      "sourceChecked": null,
      "sourceClassification": "illustrative",
      "featured": false,
      "approved": false,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "changeover",
      "sku": null,
      "model": null,
      "name": "Manual changeover switch",
      "brand": null,
      "brandStatus": "unverified",
      "categories": [
        "electrical"
      ],
      "subcategories": [
        "electrical-3"
      ],
      "applications": [
        "Home Backup Power"
      ],
      "image": {
        "asset": "equipment",
        "tile": 2
      },
      "gallery": [
        {
          "type": "photo",
          "asset": "equipment",
          "tile": 2,
          "label": "Representative image"
        },
        {
          "type": "spec",
          "label": "Specification overview"
        }
      ],
      "alt": "Illustrative electricals & wiring equipment; not an exact model photograph",
      "photoStatus": "Illustrative category visual; exact product photography pending",
      "shortDescription": "Compare changeover requirements for alternative power sources with your electrician.",
      "description": "Compare changeover requirements for alternative power sources with your electrician.",
      "specs": {
        "Operation": "Manual",
        "Pole count": "To be selected",
        "Current rating": "To be sized"
      },
      "power": "Electric",
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "evidenceStatus": "illustrative",
      "sourceReference": null,
      "sourceChecked": null,
      "sourceClassification": "illustrative",
      "featured": false,
      "approved": false,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "voltage-stabilizer",
      "sku": null,
      "model": null,
      "name": "Automatic voltage stabilizer",
      "brand": null,
      "brandStatus": "unverified",
      "categories": [
        "electrical"
      ],
      "subcategories": [
        "electrical-6"
      ],
      "applications": [
        "Home Backup Power"
      ],
      "image": {
        "asset": "equipment",
        "tile": 2
      },
      "gallery": [
        {
          "type": "photo",
          "asset": "equipment",
          "tile": 2,
          "label": "Representative image"
        },
        {
          "type": "spec",
          "label": "Specification overview"
        }
      ],
      "alt": "Illustrative electricals & wiring equipment; not an exact model photograph",
      "photoStatus": "Illustrative category visual; exact product photography pending",
      "shortDescription": "An illustrative stabilizer for load-specific enquiries.",
      "description": "An illustrative stabilizer for load-specific enquiries. Share connected equipment and the required capacity.",
      "specs": {
        "Control": "Automatic (illustrative)",
        "Capacity": "To be sized",
        "Input range": "To be confirmed"
      },
      "power": "Electric",
      "capacity": "To be sized",
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "evidenceStatus": "illustrative",
      "sourceReference": null,
      "sourceChecked": null,
      "sourceClassification": "illustrative",
      "featured": false,
      "approved": false,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "panel-box",
      "sku": null,
      "model": null,
      "name": "Metal electrical panel enclosure",
      "brand": null,
      "brandStatus": "unverified",
      "categories": [
        "electrical"
      ],
      "subcategories": [
        "electrical-7"
      ],
      "applications": [
        "Construction & Workshop"
      ],
      "image": {
        "asset": "equipment",
        "tile": 2
      },
      "gallery": [
        {
          "type": "photo",
          "asset": "equipment",
          "tile": 2,
          "label": "Representative image"
        },
        {
          "type": "spec",
          "label": "Specification overview"
        }
      ],
      "alt": "Illustrative electricals & wiring equipment; not an exact model photograph",
      "photoStatus": "Illustrative category visual; exact product photography pending",
      "shortDescription": "A planning example for housing electrical controls.",
      "description": "A planning example for housing electrical controls. Confirm dimensions, mounting and protection requirements.",
      "specs": {
        "Enclosure": "Metal (illustrative)",
        "Dimensions": "To be specified",
        "Protection rating": "Not verified"
      },
      "power": "Passive",
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "evidenceStatus": "illustrative",
      "sourceReference": null,
      "sourceChecked": null,
      "sourceClassification": "illustrative",
      "featured": false,
      "approved": false,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "twin-earth",
      "sku": null,
      "model": null,
      "name": "Twin & earth cable",
      "brand": null,
      "brandStatus": "unverified",
      "categories": [
        "electrical"
      ],
      "subcategories": [
        "electrical-9"
      ],
      "applications": [
        "Construction & Workshop"
      ],
      "image": {
        "asset": "equipment",
        "tile": 2
      },
      "gallery": [
        {
          "type": "photo",
          "asset": "equipment",
          "tile": 2,
          "label": "Representative image"
        },
        {
          "type": "spec",
          "label": "Specification overview"
        }
      ],
      "alt": "Illustrative electricals & wiring equipment; not an exact model photograph",
      "photoStatus": "Illustrative category visual; exact product photography pending",
      "shortDescription": "An illustrative wiring cable for a materials quotation.",
      "description": "An illustrative wiring cable for a materials quotation. Confirm conductor size and intended installation.",
      "specs": {
        "Construction": "Twin conductors + earth",
        "Cross-section": "To be specified",
        "Length": "To be specified"
      },
      "power": "Passive",
      "capacity": "To be specified",
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "evidenceStatus": "illustrative",
      "sourceReference": null,
      "sourceChecked": null,
      "sourceClassification": "illustrative",
      "featured": false,
      "approved": false,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "distribution-board",
      "sku": null,
      "model": null,
      "name": "Distribution board · 8-way example",
      "brand": null,
      "brandStatus": "unverified",
      "categories": [
        "electrical"
      ],
      "subcategories": [
        "electrical-10"
      ],
      "applications": [
        "Construction & Workshop"
      ],
      "image": {
        "asset": "equipment",
        "tile": 2
      },
      "gallery": [
        {
          "type": "photo",
          "asset": "equipment",
          "tile": 2,
          "label": "Representative image"
        },
        {
          "type": "spec",
          "label": "Specification overview"
        }
      ],
      "alt": "Illustrative electricals & wiring equipment; not an exact model photograph",
      "photoStatus": "Illustrative category visual; exact product photography pending",
      "shortDescription": "A training example of a distribution enclosure.",
      "description": "A training example of a distribution enclosure. Protective devices and ratings must be specified separately.",
      "specs": {
        "Ways": "8 (illustrative)",
        "Mounting": "To be confirmed",
        "Breakers included": "Not confirmed"
      },
      "power": "Electric",
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "evidenceStatus": "illustrative",
      "sourceReference": null,
      "sourceChecked": null,
      "sourceClassification": "illustrative",
      "featured": false,
      "approved": false,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "electric-borehole",
      "sku": null,
      "model": null,
      "name": "Electric submersible borehole pump",
      "brand": null,
      "brandStatus": "unverified",
      "categories": [
        "water"
      ],
      "subcategories": [
        "water-1"
      ],
      "applications": [
        "Farm & Irrigation"
      ],
      "image": {
        "asset": "equipment",
        "tile": 3
      },
      "gallery": [
        {
          "type": "photo",
          "asset": "equipment",
          "tile": 3,
          "label": "Representative image"
        },
        {
          "type": "spec",
          "label": "Specification overview"
        }
      ],
      "alt": "Illustrative borehole & water solutions equipment; not an exact model photograph",
      "photoStatus": "Illustrative category visual; exact product photography pending",
      "shortDescription": "An illustrative borehole pump.",
      "description": "An illustrative borehole pump. Send total dynamic head, water demand and borehole details for selection.",
      "specs": {
        "Power source": "AC electric",
        "Head & flow": "To be sized",
        "Borehole diameter": "To be confirmed"
      },
      "power": "Electric",
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "evidenceStatus": "illustrative",
      "sourceReference": null,
      "sourceChecked": null,
      "sourceClassification": "illustrative",
      "featured": false,
      "approved": false,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "hybrid-borehole",
      "sku": null,
      "model": "4SDS7 1500W",
      "name": "Doyin 1.5 kW AC/DC borehole pump",
      "brand": "Doyin",
      "brandStatus": "retailer-listed",
      "categories": [
        "water"
      ],
      "subcategories": [
        "water-3"
      ],
      "applications": [
        "Farm & Irrigation"
      ],
      "image": {
        "asset": "equipment",
        "tile": 3
      },
      "gallery": [
        {
          "type": "photo",
          "asset": "equipment",
          "tile": 3,
          "label": "Representative image"
        },
        {
          "type": "spec",
          "label": "Specification overview"
        }
      ],
      "alt": "Illustrative borehole & water solutions equipment; not an exact model photograph",
      "photoStatus": "Illustrative category visual; exact product photography pending",
      "shortDescription": "A sourced hybrid borehole pump example.",
      "description": "A sourced hybrid borehole pump example. Maximum head and flow are separate limits, not simultaneous performance; confirm the duty point.",
      "specs": {
        "Motor power": "1.5 kW",
        "Maximum flow": "7 m³/h",
        "Maximum head": "138 m",
        "Power source": "AC/DC hybrid"
      },
      "power": "Hybrid",
      "capacity": "1.5 kW",
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "evidenceStatus": "sourced",
      "sourceReference": "https://macire.co.ke/product/1-5kw-7m%C2%B3-138m-doyin-dc-ac-dc-hybrid-borehole-submersible-water-pump-4sds7-1500w-2hp-7000l-h/",
      "sourceChecked": "2026-10-07",
      "sourceClassification": "sourced",
      "featured": false,
      "approved": false,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "borehole-cable",
      "sku": null,
      "model": null,
      "name": "Submersible pump cable",
      "brand": null,
      "brandStatus": "unverified",
      "categories": [
        "water"
      ],
      "subcategories": [
        "water-4"
      ],
      "applications": [
        "Farm & Irrigation"
      ],
      "image": {
        "asset": "equipment",
        "tile": 3
      },
      "gallery": [
        {
          "type": "photo",
          "asset": "equipment",
          "tile": 3,
          "label": "Representative image"
        },
        {
          "type": "spec",
          "label": "Specification overview"
        }
      ],
      "alt": "Illustrative borehole & water solutions equipment; not an exact model photograph",
      "photoStatus": "Illustrative category visual; exact product photography pending",
      "shortDescription": "An illustrative cable for a borehole project.",
      "description": "An illustrative cable for a borehole project. Confirm voltage drop, connection and underwater suitability.",
      "specs": {
        "Use": "Submersible pump supply",
        "Cores & cross-section": "To be specified",
        "Length": "To be measured"
      },
      "power": "Passive",
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "evidenceStatus": "illustrative",
      "sourceReference": null,
      "sourceChecked": null,
      "sourceClassification": "illustrative",
      "featured": false,
      "approved": false,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "pump-control",
      "sku": null,
      "model": null,
      "name": "Automatic pump control switch",
      "brand": null,
      "brandStatus": "unverified",
      "categories": [
        "water"
      ],
      "subcategories": [
        "water-5"
      ],
      "applications": [
        "Farm & Irrigation"
      ],
      "image": {
        "asset": "equipment",
        "tile": 3
      },
      "gallery": [
        {
          "type": "photo",
          "asset": "equipment",
          "tile": 3,
          "label": "Representative image"
        },
        {
          "type": "spec",
          "label": "Specification overview"
        }
      ],
      "alt": "Illustrative borehole & water solutions equipment; not an exact model photograph",
      "photoStatus": "Illustrative category visual; exact product photography pending",
      "shortDescription": "A planning example for pump automation.",
      "description": "A planning example for pump automation. Match the controller to the pump and water system.",
      "specs": {
        "Function": "Pump start/stop control",
        "Pressure setting": "To be confirmed"
      },
      "power": "Electric",
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "evidenceStatus": "illustrative",
      "sourceReference": null,
      "sourceChecked": null,
      "sourceClassification": "illustrative",
      "featured": false,
      "approved": false,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "booster-pump",
      "sku": null,
      "model": null,
      "name": "Pedrollo 0.5 HP booster pump",
      "brand": "Pedrollo",
      "brandStatus": "retailer-listed",
      "categories": [
        "water"
      ],
      "subcategories": [
        "water-7"
      ],
      "applications": [
        "Farm & Irrigation"
      ],
      "image": {
        "asset": "equipment",
        "tile": 3
      },
      "gallery": [
        {
          "type": "photo",
          "asset": "equipment",
          "tile": 3,
          "label": "Representative image"
        },
        {
          "type": "spec",
          "label": "Specification overview"
        }
      ],
      "alt": "Illustrative borehole & water solutions equipment; not an exact model photograph",
      "photoStatus": "Illustrative category visual; exact product photography pending",
      "shortDescription": "A sourced booster-pump reference for tank-to-house supply enquiries.",
      "description": "A sourced booster-pump reference for tank-to-house supply enquiries. Confirm the pump curve and installation conditions.",
      "specs": {
        "Motor power": "0.5 HP",
        "Function": "Water pressure boosting"
      },
      "power": "Electric",
      "capacity": "0.5 HP",
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "evidenceStatus": "sourced",
      "sourceReference": "https://macire.co.ke/product/0-5hp-pedrollo-booster-pump-home-water-pressure-pump/",
      "sourceChecked": "2026-10-07",
      "sourceClassification": "sourced",
      "featured": false,
      "approved": false,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "pool-pump",
      "sku": null,
      "model": null,
      "name": "Swimming pool circulation pump",
      "brand": null,
      "brandStatus": "unverified",
      "categories": [
        "water"
      ],
      "subcategories": [
        "water-8"
      ],
      "applications": [
        "Farm & Irrigation"
      ],
      "image": {
        "asset": "equipment",
        "tile": 3
      },
      "gallery": [
        {
          "type": "photo",
          "asset": "equipment",
          "tile": 3,
          "label": "Representative image"
        },
        {
          "type": "spec",
          "label": "Specification overview"
        }
      ],
      "alt": "Illustrative borehole & water solutions equipment; not an exact model photograph",
      "photoStatus": "Illustrative category visual; exact product photography pending",
      "shortDescription": "An illustrative pool pump.",
      "description": "An illustrative pool pump. Compare flow requirements with your filtration system.",
      "specs": {
        "Use": "Pool circulation",
        "Pool volume": "Required for sizing",
        "Connections": "To be confirmed"
      },
      "power": "Electric",
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "evidenceStatus": "illustrative",
      "sourceReference": null,
      "sourceChecked": null,
      "sourceClassification": "illustrative",
      "featured": false,
      "approved": false,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "water-filter",
      "sku": null,
      "model": null,
      "name": "Water filtration housing set",
      "brand": null,
      "brandStatus": "unverified",
      "categories": [
        "water"
      ],
      "subcategories": [
        "water-9"
      ],
      "applications": [
        "Farm & Irrigation"
      ],
      "image": {
        "asset": "equipment",
        "tile": 3
      },
      "gallery": [
        {
          "type": "photo",
          "asset": "equipment",
          "tile": 3,
          "label": "Representative image"
        },
        {
          "type": "spec",
          "label": "Specification overview"
        }
      ],
      "alt": "Illustrative borehole & water solutions equipment; not an exact model photograph",
      "photoStatus": "Illustrative category visual; exact product photography pending",
      "shortDescription": "A planning example for water treatment enquiries.",
      "description": "A planning example for water treatment enquiries. A water test is needed to define a suitable process; no potability claim is made.",
      "specs": {
        "Treatment": "Filtration (illustrative)",
        "Cartridges": "To be selected",
        "Water quality": "Test required"
      },
      "power": "Passive",
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "evidenceStatus": "illustrative",
      "sourceReference": null,
      "sourceChecked": null,
      "sourceClassification": "illustrative",
      "featured": false,
      "approved": false,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "tolsen-hoist",
      "sku": null,
      "model": "62491",
      "name": "Tolsen electric hoist · 0.5 tonne",
      "brand": "Tolsen",
      "brandStatus": "retailer-listed",
      "categories": [
        "construction"
      ],
      "subcategories": [
        "construction-1"
      ],
      "applications": [
        "Construction & Workshop"
      ],
      "image": {
        "asset": "equipment",
        "tile": 4
      },
      "gallery": [
        {
          "type": "photo",
          "asset": "equipment",
          "tile": 4,
          "label": "Representative image"
        },
        {
          "type": "spec",
          "label": "Specification overview"
        }
      ],
      "alt": "Illustrative construction & tools equipment; not an exact model photograph",
      "photoStatus": "Illustrative category visual; exact product photography pending",
      "shortDescription": "A sourced equipment reference for lifting enquiries.",
      "description": "A sourced equipment reference for lifting enquiries. Confirm the rated configuration, mounting and duty limits.",
      "specs": {
        "Listed capacity": "0.5 tonne",
        "Operation": "Electric"
      },
      "power": "Electric",
      "capacity": "0.5 tonne",
      "phase": null,
      "price": 32995,
      "priceType": "fixed",
      "currency": "KES",
      "quotationStatus": "priced",
      "evidenceStatus": "sourced",
      "sourceReference": "https://macire.co.ke/product/0-5-ton-tolsen-62491-electric-hoist-lifting-workshop-hoist/",
      "sourceChecked": "2026-10-07",
      "sourceClassification": "sourced",
      "featured": true,
      "approved": false,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "concrete-mixer",
      "sku": null,
      "model": null,
      "name": "Site concrete mixer",
      "brand": null,
      "brandStatus": "unverified",
      "categories": [
        "construction"
      ],
      "subcategories": [
        "construction-2"
      ],
      "applications": [
        "Construction & Workshop"
      ],
      "image": {
        "asset": "equipment",
        "tile": 4
      },
      "gallery": [
        {
          "type": "photo",
          "asset": "equipment",
          "tile": 4,
          "label": "Representative image"
        },
        {
          "type": "spec",
          "label": "Specification overview"
        }
      ],
      "alt": "Illustrative construction & tools equipment; not an exact model photograph",
      "photoStatus": "Illustrative category visual; exact product photography pending",
      "shortDescription": "An illustrative concrete mixer for planning site work.",
      "description": "An illustrative concrete mixer for planning site work. Share batch size and available power.",
      "specs": {
        "Drum capacity": "To be specified",
        "Drive": "To be selected"
      },
      "power": "Diesel",
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "evidenceStatus": "illustrative",
      "sourceReference": null,
      "sourceChecked": null,
      "sourceClassification": "illustrative",
      "featured": false,
      "approved": false,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "lenhard-welder",
      "sku": null,
      "model": "MM-300",
      "name": "Lenhard MM-300 inverter welder",
      "brand": "Lenhard",
      "brandStatus": "retailer-listed",
      "categories": [
        "construction"
      ],
      "subcategories": [
        "construction-3"
      ],
      "applications": [
        "Construction & Workshop"
      ],
      "image": {
        "asset": "equipment",
        "tile": 4
      },
      "gallery": [
        {
          "type": "photo",
          "asset": "equipment",
          "tile": 4,
          "label": "Representative image"
        },
        {
          "type": "spec",
          "label": "Specification overview"
        }
      ],
      "alt": "Illustrative construction & tools equipment; not an exact model photograph",
      "photoStatus": "Illustrative category visual; exact product photography pending",
      "shortDescription": "A sourced welding-machine example for fabrication and repair enquiries.",
      "description": "A sourced welding-machine example for fabrication and repair enquiries. The model name is not a verified output-current rating.",
      "specs": {
        "Type": "Inverter welding machine",
        "Model": "MM-300",
        "Output rating": "Confirm from datasheet"
      },
      "power": "Electric",
      "capacity": null,
      "phase": null,
      "price": 19500,
      "priceType": "fixed",
      "currency": "KES",
      "quotationStatus": "priced",
      "evidenceStatus": "sourced",
      "sourceReference": "https://macire.co.ke/product/lenhard-germany-mm-300-inverter-welding-machine-metal-fabrication-repair/",
      "sourceChecked": "2026-10-07",
      "sourceClassification": "sourced",
      "featured": true,
      "approved": false,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "circular-saw",
      "sku": null,
      "model": null,
      "name": "Workshop circular saw",
      "brand": null,
      "brandStatus": "unverified",
      "categories": [
        "construction"
      ],
      "subcategories": [
        "construction-4"
      ],
      "applications": [
        "Construction & Workshop"
      ],
      "image": {
        "asset": "equipment",
        "tile": 4
      },
      "gallery": [
        {
          "type": "photo",
          "asset": "equipment",
          "tile": 4,
          "label": "Representative image"
        },
        {
          "type": "spec",
          "label": "Specification overview"
        }
      ],
      "alt": "Illustrative construction & tools equipment; not an exact model photograph",
      "photoStatus": "Illustrative category visual; exact product photography pending",
      "shortDescription": "An illustrative saw for timber-work planning.",
      "description": "An illustrative saw for timber-work planning. Match cutting depth and blade to the material.",
      "specs": {
        "Tool type": "Circular saw",
        "Blade diameter": "To be selected",
        "Supply": "To be confirmed"
      },
      "power": "Electric",
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "evidenceStatus": "illustrative",
      "sourceReference": null,
      "sourceChecked": null,
      "sourceClassification": "illustrative",
      "featured": false,
      "approved": false,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "cordless-drill",
      "sku": null,
      "model": null,
      "name": "Cordless drill & driver kit",
      "brand": null,
      "brandStatus": "unverified",
      "categories": [
        "construction"
      ],
      "subcategories": [
        "construction-5"
      ],
      "applications": [
        "Construction & Workshop"
      ],
      "image": {
        "asset": "equipment",
        "tile": 4
      },
      "gallery": [
        {
          "type": "photo",
          "asset": "equipment",
          "tile": 4,
          "label": "Representative image"
        },
        {
          "type": "spec",
          "label": "Specification overview"
        }
      ],
      "alt": "Illustrative construction & tools equipment; not an exact model photograph",
      "photoStatus": "Illustrative category visual; exact product photography pending",
      "shortDescription": "An illustrative drill-driver kit for assembly and maintenance work.",
      "description": "An illustrative drill-driver kit for assembly and maintenance work. Compare chuck size, battery compatibility and included accessories.",
      "specs": {
        "Supply": "Battery-powered",
        "Battery platform": "To be confirmed",
        "Kit contents": "To be confirmed"
      },
      "power": "Battery",
      "capacity": null,
      "phase": null,
      "price": 14900,
      "priceType": "fixed",
      "currency": "KES",
      "quotationStatus": "priced",
      "evidenceStatus": "illustrative",
      "sourceReference": null,
      "sourceChecked": null,
      "sourceClassification": "illustrative",
      "featured": true,
      "approved": false,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "sewage-pump",
      "sku": null,
      "model": null,
      "name": "Submersible drainage & sewage pump",
      "brand": null,
      "brandStatus": "unverified",
      "categories": [
        "construction"
      ],
      "subcategories": [
        "construction-6"
      ],
      "applications": [
        "Construction & Workshop"
      ],
      "image": {
        "asset": "equipment",
        "tile": 4
      },
      "gallery": [
        {
          "type": "photo",
          "asset": "equipment",
          "tile": 4,
          "label": "Representative image"
        },
        {
          "type": "spec",
          "label": "Specification overview"
        }
      ],
      "alt": "Illustrative construction & tools equipment; not an exact model photograph",
      "photoStatus": "Illustrative category visual; exact product photography pending",
      "shortDescription": "An illustrative drainage pump.",
      "description": "An illustrative drainage pump. Share the liquid type, solids size and pumping duty.",
      "specs": {
        "Pump type": "Submersible",
        "Solids handling": "To be confirmed",
        "Head & flow": "To be sized"
      },
      "power": "Electric",
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "evidenceStatus": "illustrative",
      "sourceReference": null,
      "sourceChecked": null,
      "sourceClassification": "illustrative",
      "featured": false,
      "approved": false,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "security-camera",
      "sku": null,
      "model": null,
      "name": "Outdoor security camera",
      "brand": null,
      "brandStatus": "unverified",
      "categories": [
        "construction"
      ],
      "subcategories": [
        "construction-7"
      ],
      "applications": [
        "Construction & Workshop"
      ],
      "image": {
        "asset": "equipment",
        "tile": 4
      },
      "gallery": [
        {
          "type": "photo",
          "asset": "equipment",
          "tile": 4,
          "label": "Representative image"
        },
        {
          "type": "spec",
          "label": "Specification overview"
        }
      ],
      "alt": "Illustrative construction & tools equipment; not an exact model photograph",
      "photoStatus": "Illustrative category visual; exact product photography pending",
      "shortDescription": "An illustrative security-equipment enquiry.",
      "description": "An illustrative security-equipment enquiry. Specify coverage, recording and network requirements.",
      "specs": {
        "Device type": "Camera",
        "Connectivity": "To be selected",
        "Ingress rating": "Not verified"
      },
      "power": "Electric",
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "evidenceStatus": "illustrative",
      "sourceReference": null,
      "sourceChecked": null,
      "sourceClassification": "illustrative",
      "featured": false,
      "approved": false,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "ladder",
      "sku": null,
      "model": null,
      "name": "Aluminium step ladder",
      "brand": null,
      "brandStatus": "unverified",
      "categories": [
        "construction"
      ],
      "subcategories": [
        "construction-8"
      ],
      "applications": [
        "Construction & Workshop"
      ],
      "image": {
        "asset": "equipment",
        "tile": 4
      },
      "gallery": [
        {
          "type": "photo",
          "asset": "equipment",
          "tile": 4,
          "label": "Representative image"
        },
        {
          "type": "spec",
          "label": "Specification overview"
        }
      ],
      "alt": "Illustrative construction & tools equipment; not an exact model photograph",
      "photoStatus": "Illustrative category visual; exact product photography pending",
      "shortDescription": "A planning example for access equipment.",
      "description": "A planning example for access equipment. Confirm the rated working height and intended use.",
      "specs": {
        "Material": "Aluminium (illustrative)",
        "Working height": "To be selected",
        "Load rating": "To be verified"
      },
      "power": "Manual",
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "evidenceStatus": "illustrative",
      "sourceReference": null,
      "sourceChecked": null,
      "sourceClassification": "illustrative",
      "featured": false,
      "approved": false,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "extinguisher",
      "sku": null,
      "model": null,
      "name": "Portable fire extinguisher",
      "brand": null,
      "brandStatus": "unverified",
      "categories": [
        "construction"
      ],
      "subcategories": [
        "construction-9"
      ],
      "applications": [
        "Construction & Workshop"
      ],
      "image": {
        "asset": "equipment",
        "tile": 4
      },
      "gallery": [
        {
          "type": "photo",
          "asset": "equipment",
          "tile": 4,
          "label": "Representative image"
        },
        {
          "type": "spec",
          "label": "Specification overview"
        }
      ],
      "alt": "Illustrative construction & tools equipment; not an exact model photograph",
      "photoStatus": "Illustrative category visual; exact product photography pending",
      "shortDescription": "An illustrative fire-safety enquiry item.",
      "description": "An illustrative fire-safety enquiry item. Selection requires the applicable fire risks and verified product documentation.",
      "specs": {
        "Agent & capacity": "To be specified",
        "Fire class": "To be selected",
        "Certification": "Not verified"
      },
      "power": "Manual",
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "evidenceStatus": "illustrative",
      "sourceReference": null,
      "sourceChecked": null,
      "sourceClassification": "illustrative",
      "featured": false,
      "approved": false,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "lawn-mower",
      "sku": null,
      "model": null,
      "name": "Petrol walk-behind lawn mower",
      "brand": null,
      "brandStatus": "unverified",
      "categories": [
        "construction"
      ],
      "subcategories": [
        "construction-10"
      ],
      "applications": [
        "Construction & Workshop"
      ],
      "image": {
        "asset": "equipment",
        "tile": 4
      },
      "gallery": [
        {
          "type": "photo",
          "asset": "equipment",
          "tile": 4,
          "label": "Representative image"
        },
        {
          "type": "spec",
          "label": "Specification overview"
        }
      ],
      "alt": "Illustrative construction & tools equipment; not an exact model photograph",
      "photoStatus": "Illustrative category visual; exact product photography pending",
      "shortDescription": "An illustrative mower for grounds maintenance.",
      "description": "An illustrative mower for grounds maintenance. Share your lawn area and terrain.",
      "specs": {
        "Fuel": "Petrol",
        "Cutting width": "To be selected",
        "Collection": "To be confirmed"
      },
      "power": "Petrol",
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "evidenceStatus": "illustrative",
      "sourceReference": null,
      "sourceChecked": null,
      "sourceClassification": "illustrative",
      "featured": false,
      "approved": false,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "petrol-generator",
      "sku": null,
      "model": null,
      "name": "Portable petrol generator",
      "brand": null,
      "brandStatus": "unverified",
      "categories": [
        "generators"
      ],
      "subcategories": [
        "generators-1"
      ],
      "applications": [
        "Home Backup Power"
      ],
      "image": {
        "asset": "equipment",
        "tile": 5
      },
      "gallery": [
        {
          "type": "photo",
          "asset": "equipment",
          "tile": 5,
          "label": "Representative image"
        },
        {
          "type": "spec",
          "label": "Specification overview"
        }
      ],
      "alt": "Illustrative petrol & diesel generators equipment; not an exact model photograph",
      "photoStatus": "Illustrative category visual; exact product photography pending",
      "shortDescription": "An illustrative backup-power option.",
      "description": "An illustrative backup-power option. Share your continuous and starting loads for equipment selection.",
      "specs": {
        "Fuel": "Petrol",
        "Rated output": "To be sized",
        "Starting method": "To be confirmed"
      },
      "power": "Petrol",
      "capacity": "To be sized",
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "evidenceStatus": "illustrative",
      "sourceReference": null,
      "sourceChecked": null,
      "sourceClassification": "illustrative",
      "featured": false,
      "approved": false,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "hisaki-generator",
      "sku": null,
      "model": "HK7000SNA",
      "name": "Hisaki 8.75 kVA diesel generator",
      "brand": "Hisaki",
      "brandStatus": "retailer-listed",
      "categories": [
        "generators"
      ],
      "subcategories": [
        "generators-2",
        "generators-3",
        "generators-5",
        "generators-10"
      ],
      "applications": [
        "Home Backup Power"
      ],
      "image": {
        "asset": "equipment",
        "tile": 5
      },
      "gallery": [
        {
          "type": "photo",
          "asset": "equipment",
          "tile": 5,
          "label": "Representative image"
        },
        {
          "type": "spec",
          "label": "Specification overview"
        }
      ],
      "alt": "Illustrative petrol & diesel generators equipment; not an exact model photograph",
      "photoStatus": "Illustrative category visual; exact product photography pending",
      "shortDescription": "A sourced model reference for backup-power planning.",
      "description": "A sourced model reference for backup-power planning. Confirm continuous rating and the scope of any changeover equipment.",
      "specs": {
        "Listed output": "8.75 kVA",
        "Phase": "Single phase",
        "Fuel": "Diesel",
        "Enclosure": "Canopy"
      },
      "power": "Diesel",
      "capacity": "8.75 kVA",
      "phase": "Single phase",
      "price": 167990,
      "priceType": "fixed",
      "currency": "KES",
      "quotationStatus": "priced",
      "evidenceStatus": "sourced",
      "sourceReference": "https://macire.co.ke/product-category/petrol-diesel-power-generators/diesel-generators/",
      "sourceChecked": "2026-10-07",
      "sourceClassification": "sourced",
      "featured": true,
      "approved": false,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "pulsar-generator",
      "sku": null,
      "model": "TWS-30KF",
      "name": "Pulsar 41 kVA diesel generator",
      "brand": "Pulsar",
      "brandStatus": "retailer-listed",
      "categories": [
        "generators"
      ],
      "subcategories": [
        "generators-4",
        "generators-6"
      ],
      "applications": [
        "Construction & Workshop"
      ],
      "image": {
        "asset": "equipment",
        "tile": 5
      },
      "gallery": [
        {
          "type": "photo",
          "asset": "equipment",
          "tile": 5,
          "label": "Representative image"
        },
        {
          "type": "spec",
          "label": "Specification overview"
        }
      ],
      "alt": "Illustrative petrol & diesel generators equipment; not an exact model photograph",
      "photoStatus": "Illustrative category visual; exact product photography pending",
      "shortDescription": "A sourced industrial-generator example.",
      "description": "A sourced industrial-generator example. Final selection needs a load schedule and confirmation of the rated duty.",
      "specs": {
        "Listed output": "41 kVA",
        "Phase": "Three phase",
        "Cooling": "Water cooled",
        "Fuel": "Diesel"
      },
      "power": "Diesel",
      "capacity": "41 kVA",
      "phase": "Three phase",
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "evidenceStatus": "sourced",
      "sourceReference": "https://macire.co.ke/product/41kva-pulsar-tws-30kf-3-phase-diesel-generator-water-cooled/",
      "sourceChecked": "2026-10-07",
      "sourceClassification": "sourced",
      "featured": false,
      "approved": false,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "alternator",
      "sku": null,
      "model": null,
      "name": "Generator alternator",
      "brand": null,
      "brandStatus": "unverified",
      "categories": [
        "generators"
      ],
      "subcategories": [
        "generators-7"
      ],
      "applications": [
        "Construction & Workshop"
      ],
      "image": {
        "asset": "equipment",
        "tile": 5
      },
      "gallery": [
        {
          "type": "photo",
          "asset": "equipment",
          "tile": 5,
          "label": "Representative image"
        },
        {
          "type": "spec",
          "label": "Specification overview"
        }
      ],
      "alt": "Illustrative petrol & diesel generators equipment; not an exact model photograph",
      "photoStatus": "Illustrative category visual; exact product photography pending",
      "shortDescription": "An illustrative alternator enquiry item.",
      "description": "An illustrative alternator enquiry item. Provide the engine speed, mounting and required output.",
      "specs": {
        "Output & phase": "To be selected",
        "Shaft coupling": "To be confirmed",
        "Speed": "To be confirmed"
      },
      "power": "Mechanical",
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "evidenceStatus": "illustrative",
      "sourceReference": null,
      "sourceChecked": null,
      "sourceClassification": "illustrative",
      "featured": false,
      "approved": false,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "lpg-generator",
      "sku": null,
      "model": null,
      "name": "Gas-fuelled generator",
      "brand": null,
      "brandStatus": "unverified",
      "categories": [
        "generators"
      ],
      "subcategories": [
        "generators-8"
      ],
      "applications": [
        "Home Backup Power"
      ],
      "image": {
        "asset": "equipment",
        "tile": 5
      },
      "gallery": [
        {
          "type": "photo",
          "asset": "equipment",
          "tile": 5,
          "label": "Representative image"
        },
        {
          "type": "spec",
          "label": "Specification overview"
        }
      ],
      "alt": "Illustrative petrol & diesel generators equipment; not an exact model photograph",
      "photoStatus": "Illustrative category visual; exact product photography pending",
      "shortDescription": "An illustrative gas-generator enquiry.",
      "description": "An illustrative gas-generator enquiry. LPG and biogas are different fuels; compatibility cannot be assumed.",
      "specs": {
        "Fuel": "Gas configuration to be specified",
        "Output": "To be sized",
        "LPG/biogas suitability": "Separately verified"
      },
      "power": "Gas",
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "evidenceStatus": "illustrative",
      "sourceReference": null,
      "sourceChecked": null,
      "sourceClassification": "illustrative",
      "featured": false,
      "approved": false,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "tlac-welding",
      "sku": null,
      "model": "TLD9500W",
      "name": "TLAC 220 A diesel welding generator",
      "brand": "TLAC",
      "brandStatus": "retailer-listed",
      "categories": [
        "generators",
        "construction"
      ],
      "subcategories": [
        "generators-9",
        "construction-3"
      ],
      "applications": [
        "Construction & Workshop"
      ],
      "image": {
        "asset": "equipment",
        "tile": 5
      },
      "gallery": [
        {
          "type": "photo",
          "asset": "equipment",
          "tile": 5,
          "label": "Representative image"
        },
        {
          "type": "spec",
          "label": "Specification overview"
        }
      ],
      "alt": "Illustrative petrol & diesel generators equipment; not an exact model photograph",
      "photoStatus": "Illustrative category visual; exact product photography pending",
      "shortDescription": "A sourced engine-driven welding reference for field-work enquiries.",
      "description": "A sourced engine-driven welding reference for field-work enquiries. Confirm the welding duty cycle and auxiliary power rating.",
      "specs": {
        "Listed welding current": "220 A",
        "Fuel": "Diesel",
        "Starting method": "Battery key start"
      },
      "power": "Diesel",
      "capacity": "220 A",
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "evidenceStatus": "sourced",
      "sourceReference": "https://macire.co.ke/product/220a-tlac-tld9500w-diesel-welding-generator/",
      "sourceChecked": "2026-10-07",
      "sourceClassification": "sourced",
      "featured": false,
      "approved": false,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-5feb147d94b109c9",
      "name": "2kW Felicity Lithium Deluxe Family Solar Kit (24V)",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "solar"
      ],
      "subcategories": [
        "solar-1"
      ],
      "applications": [
        "Home Backup Power"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 2kW Felicity Lithium Deluxe Family Solar Kit (24V)",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Lithium Starter Solar Kits. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/2kw-felicity-lithium-solar-family-kit-24v-inverter-battery-panels/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-ed22563493a8039d",
      "name": "5.5Kw Seven Stars Lithium Solar Kit",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "solar"
      ],
      "subcategories": [
        "solar-2"
      ],
      "applications": [
        "Home Backup Power"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 5.5Kw Seven Stars Lithium Solar Kit",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Lithium Family & Home Solar Kits. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/5-5kw-seven-stars-lithium-solar-kit-5500w-48v-affordable-reliable/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-fa5c03466bc72fba",
      "name": "11kW ALPS Power with 10kWh Storage Solar Kit",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "solar"
      ],
      "subcategories": [
        "solar-2"
      ],
      "applications": [
        "Home Backup Power"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 11kW ALPS Power with 10kWh Storage Solar Kit",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Lithium Family & Home Solar Kits. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/11kw-alps-power-with-10kwh-storage-solar-kit/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-0e86ac139f88528f",
      "name": "6.2kW 48V SVC Lithium Smart Home Solar Kit",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "solar"
      ],
      "subcategories": [
        "solar-3"
      ],
      "applications": [
        "Home Backup Power"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 6.2kW 48V SVC Lithium Smart Home Solar Kit",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Lithium Premium Home & Business Kits. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/6-2kw-48v-svc-lithium-smart-home-solar-kit-5-12kwh-battery-6-x-590w-panels/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-aeea5c22f3ebffb9",
      "name": "1.5kVA MUST VPM High-Frequency Inverter",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "solar"
      ],
      "subcategories": [
        "solar-5"
      ],
      "applications": [
        "Home Backup Power"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 1.5kVA MUST VPM High-Frequency Inverter",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Hybrid Solar Inverters. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/1-5kva-must-vpm-high-frequency-inverter-12v-60a-160vdc/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-9ba8db28754fc1c1",
      "name": "Must 2.5Kw 2500Watts 24V PV1800 VPM Hybrid Offgrid Inverter",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "solar"
      ],
      "subcategories": [
        "solar-5"
      ],
      "applications": [
        "Home Backup Power"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for Must 2.5Kw 2500Watts 24V PV1800 VPM Hybrid Offgrid Inverter",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Hybrid Solar Inverters. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/must-2-5kw-2500watts-24v-pv1800-vpm-hybrid-offgrid-inverter/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-aa0e0d783bb89ee6",
      "name": "4kw 24v SVC Off-grid Solar Inverter",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "solar"
      ],
      "subcategories": [
        "solar-5"
      ],
      "applications": [
        "Home Backup Power"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 4kw 24v SVC Off-grid Solar Inverter",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Hybrid Solar Inverters. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/4kw-24v-svc-off-grid-solar-inverter-4000w-100a-mppt-intuitive-lcd-display/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-467da55be5974657",
      "name": "200Ah Platinum LiFePO₄ Lithium Battery 12.8V",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "solar"
      ],
      "subcategories": [
        "solar-6"
      ],
      "applications": [
        "Home Backup Power"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 200Ah Platinum LiFePO₄ Lithium Battery 12.8V",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Lithium Batteries. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/200ah-platinum-lifepo%e2%82%84-lithium-battery-12-8v-high-capacity-deep-cycle-solar-battery/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-6acb386c924abe8e",
      "name": "2.56kWh Felicity FLA12200PG2 12V 200Ah Grade A Battery",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "solar"
      ],
      "subcategories": [
        "solar-6"
      ],
      "applications": [
        "Home Backup Power"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 2.56kWh Felicity FLA12200PG2 12V 200Ah Grade A Battery",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Lithium Batteries. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/2-56kwh-felicity-fla12200pg2-12v-200ah-grade-a-battery/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-2fdc94310df43916",
      "name": "200Ah Yachu 12.8V Lithium Battery",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "solar"
      ],
      "subcategories": [
        "solar-6"
      ],
      "applications": [
        "Home Backup Power"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 200Ah Yachu 12.8V Lithium Battery",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Lithium Batteries. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/200ah-yachu-12-8v-lithium-battery-lifepo%e2%82%84-built-in-bms-deep-cycle/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-d8b4138bdced3923",
      "name": "Lithium Battery 12v 150ah Lifepo4 Battery Pack",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "solar"
      ],
      "subcategories": [
        "solar-6"
      ],
      "applications": [
        "Home Backup Power"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for Lithium Battery 12v 150ah Lifepo4 Battery Pack",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Lithium Batteries. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/lithium-battery-12v-150ah-lifepo4-battery-pack/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-8c8f4fe27c352c2f",
      "name": "50m 1500L/h 24v Premier Solar DC Water Pump Deep Well JZDC3S24-250 with 250watts Panel",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "solar"
      ],
      "subcategories": [
        "solar-7"
      ],
      "applications": [
        "Home Backup Power"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 50m 1500L/h 24v Premier Solar DC Water Pump Deep Well JZDC3S24-250 with 250watts Panel",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Solar DC Borehole Pumps. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/60m-1500l-h-24v-premier-solar-dc-water-pump-deep-well-jzdc3s24-250-with-250watts-panel/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-b7b89b8d827fc1d0",
      "name": "60M Premier DC Solar Submersible Pump",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "solar"
      ],
      "subcategories": [
        "solar-7"
      ],
      "applications": [
        "Home Backup Power"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 60M Premier DC Solar Submersible Pump",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Solar DC Borehole Pumps. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/60m-premier-dc-solar-submersible-pump-250w-24v/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-b239d146f89e4414",
      "name": "1.25″ Shiyuan 2.2kW Hybrid AC/DC Submersible Deep Well Pump",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "solar"
      ],
      "subcategories": [
        "solar-7"
      ],
      "applications": [
        "Home Backup Power"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 1.25″ Shiyuan 2.2kW Hybrid AC/DC Submersible Deep Well Pump",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Solar DC Borehole Pumps. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/160m-2-2kw-solar-borehole-pump-6-5m3-h-shiyuan-280v-1-25-submersible-deep-well-pump/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-6980550400e3a1fd",
      "name": "56m 6000L/Hr 4″ Solar Water Pump Kit with Panels 4DPC6-56-48-750 DC 48V 750W Submersible Borehole Deep Well pump with Mppt Controller Trunsun",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "solar"
      ],
      "subcategories": [
        "solar-7"
      ],
      "applications": [
        "Home Backup Power"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 56m 6000L/Hr 4″ Solar Water Pump Kit with Panels 4DPC6-56-48-750 DC 48V 750W Submersible Borehole Deep Well pump with Mppt Controller Trunsun",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Solar DC Borehole Pumps. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/56m-6000l-hr-4-solar-water-pump-kit-with-panels-4dpc6-56-48-750-dc-48v-750w-submersible-borehole-deep-well-pump-with-mppt-controller-trunsun/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-08da9355b0ebddca",
      "name": "3Kw 7m³ 220m Doyin DC AC/DC Hybrid Borehole Submersible Water Pump",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "solar"
      ],
      "subcategories": [
        "solar-7"
      ],
      "applications": [
        "Home Backup Power"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 3Kw 7m³ 220m Doyin DC AC/DC Hybrid Borehole Submersible Water Pump",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Solar DC Borehole Pumps. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/3kw-7m%c2%b3-220m-doyin-dc-ac-dc-hybrid-borehole-submersible-water-pump-4sds7-3000w-4hp-7000l-h/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-1065cd36afab46d9",
      "name": "200L Aquasun Non-Pressurised Solar Water Heater",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "solar"
      ],
      "subcategories": [
        "solar-8"
      ],
      "applications": [
        "Home Backup Power"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 200L Aquasun Non-Pressurised Solar Water Heater",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Solar Water Heaters. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/200l-aquasun-non-pressurised-solar-water-heater/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-698a26450c916d1c",
      "name": "Suntree Pv cable 10.0mm2",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "solar"
      ],
      "subcategories": [
        "solar-9"
      ],
      "applications": [
        "Home Backup Power"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for Suntree Pv cable 10.0mm2",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Solar Accessories. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/suntree-pv-cable-10-0mm2/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-e6db74216d57fc61",
      "name": "Suntree Mc4 Connector",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "solar"
      ],
      "subcategories": [
        "solar-9"
      ],
      "applications": [
        "Home Backup Power"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for Suntree Mc4 Connector",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Solar Accessories. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/suntree-mc4-connector/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-907e6f513883a74d",
      "name": "6mm Pv Solar Cable",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "solar"
      ],
      "subcategories": [
        "solar-9"
      ],
      "applications": [
        "Home Backup Power"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 6mm Pv Solar Cable",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Solar Accessories. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/6mm-pv-solar-cable-pure-copper/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-037c3c86554b7e52",
      "name": "6mm Suntree Pv Solar Cable",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "solar"
      ],
      "subcategories": [
        "solar-9"
      ],
      "applications": [
        "Home Backup Power"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 6mm Suntree Pv Solar Cable",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Solar Accessories. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/6mm-suntree-pv-solar-cable/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-2cfcb7d30fba8237",
      "name": "Solar MC4 Connector T-Branch 3 to 1 Splitter MMMF + FFFM Pair",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "solar"
      ],
      "subcategories": [
        "solar-9"
      ],
      "applications": [
        "Home Backup Power"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for Solar MC4 Connector T-Branch 3 to 1 Splitter MMMF + FFFM Pair",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Solar Accessories. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/solar-mc4-connector-t-branch-3-to-1-splitter-mmmf-fffm-pair/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-99fc8e689924f3b0",
      "name": "2.2Kw Single Phase Hober Solar Pumping Hybrid Inverter",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "solar"
      ],
      "subcategories": [
        "solar-10"
      ],
      "applications": [
        "Home Backup Power"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 2.2Kw Single Phase Hober Solar Pumping Hybrid Inverter",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Solar Pumping Inverter. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/2-2kw-1ph-hober-solar-pumping-hybrid-inverter-advanced-mppt-technology/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-351ed119541ef20e",
      "name": "Premium Mesh Nylon Beekeeping Suit",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "agriculture"
      ],
      "subcategories": [
        "agriculture-3"
      ],
      "applications": [
        "Farm & Irrigation"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for Premium Mesh Nylon Beekeeping Suit",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Bee Keeping Equipment. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/premium-mesh-nylon-beekeeping-suit-camire-uk/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-d21e05ae2b6637b9",
      "name": "192 Eggs Premier Egg Incubator",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "agriculture"
      ],
      "subcategories": [
        "agriculture-4"
      ],
      "applications": [
        "Farm & Irrigation"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 192 Eggs Premier Egg Incubator",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Incubators. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/192-eggs-premier-egg-incubator-automatic-rolling-high-hatch-rate-energy-efficient/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-f9ffd8fc85332441",
      "name": "36 Eggs Incubator with Automatic Turning & Humidity Control & LED Canding Lamp Milano",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "agriculture"
      ],
      "subcategories": [
        "agriculture-4"
      ],
      "applications": [
        "Farm & Irrigation"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 36 Eggs Incubator with Automatic Turning & Humidity Control & LED Canding Lamp Milano",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Incubators. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/36-eggs-incubator-with-automatic-turning-humidity-control-led-canding-lamp-milano/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-b74e29b468f41c25",
      "name": "120 Egg Automatic Incubator (Can Use Electricity or Battery)",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "agriculture"
      ],
      "subcategories": [
        "agriculture-4"
      ],
      "applications": [
        "Farm & Irrigation"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 120 Egg Automatic Incubator (Can Use Electricity or Battery)",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Incubators. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/120-egg-automatic-incubator-can-use-electricity-or-battery/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-4e7d9a3ce2b81cef",
      "name": "450kg/h Premier PM33 Commercial Maize Mill",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "agriculture"
      ],
      "subcategories": [
        "agriculture-5"
      ],
      "applications": [
        "Farm & Irrigation"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 450kg/h Premier PM33 Commercial Maize Mill",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Posho Mill. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/450kg-h-premier-pm33-commercial-maize-mill-dual-frame-free-screen-7-5hp-ready/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-087453e6c9df55a8",
      "name": "2″ x 100m Premier Heavy Duty Delivery Hose Pipe",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "agriculture"
      ],
      "subcategories": [
        "agriculture-6"
      ],
      "applications": [
        "Farm & Irrigation"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 2″ x 100m Premier Heavy Duty Delivery Hose Pipe",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Irrigation Pipes. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/2-x-100m-premier-heavy-duty-delivery-hose-pipe-copy/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-a03a7880b9ed14f0",
      "name": "2 Inches Lenhard Germany Delivery Blue Pipes 2 X 50metres",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "agriculture"
      ],
      "subcategories": [
        "agriculture-6"
      ],
      "applications": [
        "Farm & Irrigation"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 2 Inches Lenhard Germany Delivery Blue Pipes 2 X 50metres",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Irrigation Pipes. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/lenhard-germany-delivery-blue-pipes-2-x-50metres-2-inches-heavy-duty-reinforced-pvc-lay-flat/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-8f242801d7b7c792",
      "name": "1.5″ 30m Canvas Delivery White Pipe Sunny Brand",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "agriculture"
      ],
      "subcategories": [
        "agriculture-6"
      ],
      "applications": [
        "Farm & Irrigation"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 1.5″ 30m Canvas Delivery White Pipe Sunny Brand",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Irrigation Pipes. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/1-5-30m-canvas-delivery-white-pipe-sunny-brand/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-5a96a045f90798b1",
      "name": "2″ 50m Blue Delivery Pipe Kmax Italy",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "agriculture"
      ],
      "subcategories": [
        "agriculture-6"
      ],
      "applications": [
        "Farm & Irrigation"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 2″ 50m Blue Delivery Pipe Kmax Italy",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Irrigation Pipes. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/2-50m-blue-delivery-pipe-kmax-italy-heavy-duty-reinforced-pvc-lay-flat/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-4a96c998ab874a41",
      "name": "24HP JD Jindong Diesel Engine Water Cooled",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "agriculture"
      ],
      "subcategories": [
        "agriculture-7"
      ],
      "applications": [
        "Farm & Irrigation"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 24HP JD Jindong Diesel Engine Water Cooled",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Agricultural Diesel Engines. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/24hp-jd-jindong-diesel-engine-water-cooled-zs1115wp/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-00b6fb736984b420",
      "name": "7.5hp JD Jiadi Diesel Engine JD175WP Water Cooled Manual Start",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "agriculture"
      ],
      "subcategories": [
        "agriculture-7"
      ],
      "applications": [
        "Farm & Irrigation"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 7.5hp JD Jiadi Diesel Engine JD175WP Water Cooled Manual Start",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Agricultural Diesel Engines. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/7-5hp-jd-jiadi-diesel-engine-jd175wp-water-cooled-manual-start/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-7c69f871ee1d3dfe",
      "name": "Water cooled diesel engine ZH-1110",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "agriculture"
      ],
      "subcategories": [
        "agriculture-7"
      ],
      "applications": [
        "Farm & Irrigation"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for Water cooled diesel engine ZH-1110",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Agricultural Diesel Engines. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/water-cooled-diesel-engine-zh-1110-22-hp/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-19989dbfc50da6b9",
      "name": "Garden Pressure Sprayer Heavy Duty",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "agriculture"
      ],
      "subcategories": [
        "agriculture-8"
      ],
      "applications": [
        "Farm & Irrigation"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for Garden Pressure Sprayer Heavy Duty",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Knapsack Sprayers. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/garden-pressure-sprayer-heavy-duty/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-3972a48d5671a9f2",
      "name": "20L Premier Economy Knapsack Sprayer",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "agriculture"
      ],
      "subcategories": [
        "agriculture-8"
      ],
      "applications": [
        "Farm & Irrigation"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 20L Premier Economy Knapsack Sprayer",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Knapsack Sprayers. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/20l-premier-economy-knapsack-sprayer-manual-farm-sprayer/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-2876c7d2e4fc4b14",
      "name": "Farmate 15L Original Knapsack Sprayer",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "agriculture"
      ],
      "subcategories": [
        "agriculture-8"
      ],
      "applications": [
        "Farm & Irrigation"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for Farmate 15L Original Knapsack Sprayer",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Knapsack Sprayers. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/farmate-15l-original-knapsack-sprayer/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-fc664d47c471c3a8",
      "name": "2″ Big Rain Gun Irrigation Rain Gun Stainless Steel Tripod Type",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "agriculture"
      ],
      "subcategories": [
        "agriculture-9"
      ],
      "applications": [
        "Farm & Irrigation"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 2″ Big Rain Gun Irrigation Rain Gun Stainless Steel Tripod Type",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Farm Irrigation Equipment. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/2-big-rain-gun-irrigation-rain-gun-stainless-steel-tripod-type/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-6315b5724ff3c4f6",
      "name": "2″ Aico Japan Diesel Water Pump Engine",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "agriculture"
      ],
      "subcategories": [
        "agriculture-9"
      ],
      "applications": [
        "Farm & Irrigation"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 2″ Aico Japan Diesel Water Pump Engine",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Farm Irrigation Equipment. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/2-aico-japan-diesel-water-pump-engine-normal-pressure/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-1fd02009cbe7d050",
      "name": "2hp 28m 6m³/h Electric Submersible Water Pump Premier",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "agriculture"
      ],
      "subcategories": [
        "agriculture-9"
      ],
      "applications": [
        "Farm & Irrigation"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 2hp 28m 6m³/h Electric Submersible Water Pump Premier",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Farm Irrigation Equipment. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/2hp-28m-6m%c2%b3-h-electric-submersible-water-pump-premier-1-1kw-pr6-28-1-5/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-1d21f9d15927634b",
      "name": "10mm West Twin With Earth Local Cable",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "electrical"
      ],
      "subcategories": [
        "electrical-1"
      ],
      "applications": [
        "Construction & Workshop"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 10mm West Twin With Earth Local Cable",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Electrical Cables. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/10mm-west-twin-with-earth-local-cable-price-per-meter-energy-efficient-cost-effective/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-0a8797fff7e8cb17",
      "name": "25m POWERMATE Extension Reel",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "electrical"
      ],
      "subcategories": [
        "electrical-5"
      ],
      "applications": [
        "Construction & Workshop"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 25m POWERMATE Extension Reel",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Extension Cords. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/25m-powermate-extension-reel-1-5mm%c2%b2-cable/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-a190ba2a8c3984c8",
      "name": "93m Doyin AC Borehole Submersible Water Pump",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "water"
      ],
      "subcategories": [
        "water-1"
      ],
      "applications": [
        "Farm & Irrigation"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 93m Doyin AC Borehole Submersible Water Pump",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Electric Borehole Pumps. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/93m-doyin-ac-borehole-submersible-water-pump-0-75kw-1hp-ordinary-impeller/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-fbe091f333751629",
      "name": "0.7KVA Lorentz PS2-600 Controller",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "water"
      ],
      "subcategories": [
        "water-5"
      ],
      "applications": [
        "Farm & Irrigation"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 0.7KVA Lorentz PS2-600 Controller",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Automatic Pump Control Switch. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/0-7kva-lorentz-ps2-600-controller/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-36a86978b922dd61",
      "name": "60M Aico Japan 1HP Centrifugal Water Booster Pump AKP80",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "water"
      ],
      "subcategories": [
        "water-7"
      ],
      "applications": [
        "Farm & Irrigation"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 60M Aico Japan 1HP Centrifugal Water Booster Pump AKP80",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Booster Centrifugal Water Pumps. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/60m-aico-japan-1hp-centrifugal-water-booster-pump-akp80/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-7cfcc4c16a67907a",
      "name": "0.32hp 0.25Kw Dayliff DDP 50A Automatic Mini Electric Booster Water Pump",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "water"
      ],
      "subcategories": [
        "water-7"
      ],
      "applications": [
        "Farm & Irrigation"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 0.32hp 0.25Kw Dayliff DDP 50A Automatic Mini Electric Booster Water Pump",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Booster Centrifugal Water Pumps. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/dayliff-ddp-50a-automatic-mini-booster-pump/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-5c5903a4cab7826b",
      "name": "0.5hp 0.37Kw 35m Dayliff DDP 60 Electric Booster Water Pump High Quality",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "water"
      ],
      "subcategories": [
        "water-7"
      ],
      "applications": [
        "Farm & Irrigation"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 0.5hp 0.37Kw 35m Dayliff DDP 60 Electric Booster Water Pump High Quality",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Booster Centrifugal Water Pumps. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/dayliff-ddp-60-high-quality-booster-pump/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-0c6d10cfdbc95b38",
      "name": "0.5hp 28m 1.8m³ Electric Booster Peripheral Water Pump Premier QB60",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "water"
      ],
      "subcategories": [
        "water-7"
      ],
      "applications": [
        "Farm & Irrigation"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 0.5hp 28m 1.8m³ Electric Booster Peripheral Water Pump Premier QB60",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Booster Centrifugal Water Pumps. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/0-5hp-28m-1-8m%c2%b3-electric-booster-peripheral-water-pump-premier-qb60/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-9388eea52d56284f",
      "name": "1.1kW Aico Japan Swimming Pool Pump",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "water"
      ],
      "subcategories": [
        "water-8"
      ],
      "applications": [
        "Farm & Irrigation"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 1.1kW Aico Japan Swimming Pool Pump",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Swimming Pools Pumps & Accessories. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/1-1kw-aico-japan-swimming-pool-pump-ac-spp-366l-min-flow-25m-head/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-10ff23cbb69bf8d1",
      "name": "Dayliff Chlorine 65",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "water"
      ],
      "subcategories": [
        "water-9"
      ],
      "applications": [
        "Farm & Irrigation"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for Dayliff Chlorine 65",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Water Treatment. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/dayliff-chlorine-65-40kgs/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-714e12f1a6dfb6ef",
      "name": "ATLAS OASIS DP Sanic 100GPD Water Treatment",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "water"
      ],
      "subcategories": [
        "water-9"
      ],
      "applications": [
        "Farm & Irrigation"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for ATLAS OASIS DP Sanic 100GPD Water Treatment",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Water Treatment. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/atlas-oasis-dp-sanic-100gpd-water-treatment/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-32a0e4b493559dbd",
      "name": "450L WASP Concrete Mixer with Diesel Engine Heavy Duty",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "construction"
      ],
      "subcategories": [
        "construction-1"
      ],
      "applications": [
        "Construction & Workshop"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 450L WASP Concrete Mixer with Diesel Engine Heavy Duty",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Building Equipment. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/450l-wasp-concrete-mixer-with-diesel-engine-heavy-duty/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-39e119878713c2a6",
      "name": "CONCRETE MIXER",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "construction"
      ],
      "subcategories": [
        "construction-1"
      ],
      "applications": [
        "Construction & Workshop"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for CONCRETE MIXER",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Building Equipment. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/concrete-mixer-2/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-ceb830889f76e8a7",
      "name": "Poker Vibrator Golf Germany HT-ZB50",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "construction"
      ],
      "subcategories": [
        "construction-1"
      ],
      "applications": [
        "Construction & Workshop"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for Poker Vibrator Golf Germany HT-ZB50",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Building Equipment. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/poker-vibrator-golf-germany-ht-zb50-petrol-portable-and-durable/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-22a89f20a82c0551",
      "name": "Aico Japan Petrol Poker Vibrator Complete with 45mm Poker Shaft",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "construction"
      ],
      "subcategories": [
        "construction-1"
      ],
      "applications": [
        "Construction & Workshop"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for Aico Japan Petrol Poker Vibrator Complete with 45mm Poker Shaft",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Building Equipment. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/aico-japan-petrol-poker-vibrator-complete-with-45mm-poker-shaft/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-77810d6b80734af0",
      "name": "90kg Tolsen Gasoline Plate Compactor 86103",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "construction"
      ],
      "subcategories": [
        "construction-1"
      ],
      "applications": [
        "Construction & Workshop"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 90kg Tolsen Gasoline Plate Compactor 86103",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Building Equipment. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/90kg-tolsen-gasoline-plate-compactor-86103/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-e37ca0f126e60649",
      "name": "Aico Japan Power Trowel with Honda GP160 Engine",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "construction"
      ],
      "subcategories": [
        "construction-2"
      ],
      "applications": [
        "Construction & Workshop"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for Aico Japan Power Trowel with Honda GP160 Engine",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Construction Machinery. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/aico-japan-power-trowel-with-honda-gp160-engine/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-1f8dd30504905e8b",
      "name": "Mercury Weldmaster Inverter Welder Evo-300",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "construction"
      ],
      "subcategories": [
        "construction-3"
      ],
      "applications": [
        "Construction & Workshop"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for Mercury Weldmaster Inverter Welder Evo-300",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Welding Machines & Accessories. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/mercury-weldmaster-inverter-welder-evo-300/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-469f9831d56e1502",
      "name": "Aico Japan MIG-200I Portable HEAVY DUTY MIG Inverter Welder AMPS AC/DC",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "construction"
      ],
      "subcategories": [
        "construction-3"
      ],
      "applications": [
        "Construction & Workshop"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for Aico Japan MIG-200I Portable HEAVY DUTY MIG Inverter Welder AMPS AC/DC",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Welding Machines & Accessories. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/aico-japan-mig-200i-portable-heavy-duty-mig-inverter-welder-amps-ac-dc/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-0498f8924f492f21",
      "name": "300A Aico Japan MMA300 Portable Arc Inverter Welding Machine",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "construction"
      ],
      "subcategories": [
        "construction-3"
      ],
      "applications": [
        "Construction & Workshop"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 300A Aico Japan MMA300 Portable Arc Inverter Welding Machine",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Welding Machines & Accessories. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/300a-aico-japan-mma300-portable-arc-inverter-welding-machine/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-f37cd967ae4bf144",
      "name": "Riland MIG 350 Welding Machine",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "construction"
      ],
      "subcategories": [
        "construction-3"
      ],
      "applications": [
        "Construction & Workshop"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for Riland MIG 350 Welding Machine",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Welding Machines & Accessories. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/riland-mig-350-welding-machine/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-8e40f5fad3f4cca3",
      "name": "Planer Blade 16” for ML393 Woodworking Table Saw Spare",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "construction"
      ],
      "subcategories": [
        "construction-4"
      ],
      "applications": [
        "Construction & Workshop"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for Planer Blade 16” for ML393 Woodworking Table Saw Spare",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Wood Working & Carpentry. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/planer-blade-16-for-ml393-woodworking-table-saw-spare/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-eb6809c0bd80b675",
      "name": "Tolsen Jigsaw 800w Variable Speed",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "construction"
      ],
      "subcategories": [
        "construction-4"
      ],
      "applications": [
        "Construction & Workshop"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for Tolsen Jigsaw 800w Variable Speed",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Wood Working & Carpentry. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/tolsen-jigsaw-800w-variable-speed/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-0bc176b2434b6be4",
      "name": "Husqvarna 272 XP Power Saw",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "construction"
      ],
      "subcategories": [
        "construction-4"
      ],
      "applications": [
        "Construction & Workshop"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for Husqvarna 272 XP Power Saw",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Wood Working & Carpentry. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/original-husqvarna-272-xp-power-saw-forestry-timber-cutting/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-cfe600ea9f519667",
      "name": "Lida Woodworking Table Saw",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "construction"
      ],
      "subcategories": [
        "construction-4"
      ],
      "applications": [
        "Construction & Workshop"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for Lida Woodworking Table Saw",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Wood Working & Carpentry. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/lida-woodworking-table-saw-workshop-wood-cutting-machine/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-40c76470e51dd01a",
      "name": "Tolsen Industrial 1/2″ Air Impact Wrench",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "construction"
      ],
      "subcategories": [
        "construction-5"
      ],
      "applications": [
        "Construction & Workshop"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for Tolsen Industrial 1/2″ Air Impact Wrench",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Power & Hand Tools. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/tolsen-industrial-1-2-air-impact-wrench/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-5ad361fa136f86db",
      "name": "MAKITA PW5001C POLISHER STONE(MARBLE/GRANITE) 7” 900W",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "construction"
      ],
      "subcategories": [
        "construction-5"
      ],
      "applications": [
        "Construction & Workshop"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for MAKITA PW5001C POLISHER STONE(MARBLE/GRANITE) 7” 900W",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Power & Hand Tools. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/makita-pw5001c-polisher-stonemarble-granite-7-900w/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-dc7814819c7c3157",
      "name": "750Watts CAT Impact Drill DX17",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "construction"
      ],
      "subcategories": [
        "construction-5"
      ],
      "applications": [
        "Construction & Workshop"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 750Watts CAT Impact Drill DX17",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Power & Hand Tools. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/750watts-cat-impact-drill-dx17/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-71a88ba6f3953afd",
      "name": "0.75kW 1.0HP TOTAL Sewage Submersible Pump Electric AC TWP87506 750w (Dirty Water 8m Head 217L/min)",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "construction"
      ],
      "subcategories": [
        "construction-6"
      ],
      "applications": [
        "Construction & Workshop"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 0.75kW 1.0HP TOTAL Sewage Submersible Pump Electric AC TWP87506 750w (Dirty Water 8m Head 217L/min)",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Plumbing & Sewage Pumps. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/0-75kw-1-0hp-total-sewage-submersible-pump-electric-ac-twp87506-750w-dirty-water-8m-head-217l-min/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-aacce114f64acfca",
      "name": "2.2kW 3″ TOTAL Sewage Submersible Pump Electric 3hp AC TWP7220026 (633L/min)",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "construction"
      ],
      "subcategories": [
        "construction-6"
      ],
      "applications": [
        "Construction & Workshop"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 2.2kW 3″ TOTAL Sewage Submersible Pump Electric 3hp AC TWP7220026 (633L/min)",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Plumbing & Sewage Pumps. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/2-2kw-3-total-sewage-submersible-pump-electric-3hp-ac-twp7220026-633l-min/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-e8436bd6951edf79",
      "name": "5hp 10m Sewage Pump Shallow Well Water Pump QXD",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "construction"
      ],
      "subcategories": [
        "construction-6"
      ],
      "applications": [
        "Construction & Workshop"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 5hp 10m Sewage Pump Shallow Well Water Pump QXD",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Plumbing & Sewage Pumps. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/5hp-10m-sewage-pump-shallow-well-water-pump-qxd/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-693262acd380f7e1",
      "name": "15HP Aico Japan WQD10-130 Sewage Submersible Pump",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "construction"
      ],
      "subcategories": [
        "construction-6"
      ],
      "applications": [
        "Construction & Workshop"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 15HP Aico Japan WQD10-130 Sewage Submersible Pump",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Plumbing & Sewage Pumps. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/15hp-aico-japan-wqd10-130-sewage-submersible-pump-11kw-170m-head-three-phase-2-inch-outlet/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-20221f1266b0ec1b",
      "name": "6 Step Ladder Red Foldable",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "construction"
      ],
      "subcategories": [
        "construction-8"
      ],
      "applications": [
        "Construction & Workshop"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 6 Step Ladder Red Foldable",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Ladders. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/6-step-ladder-red-foldable-heavy-duty/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-cced3d55e3e957fd",
      "name": "A’ Type 5 Steps Aluminum Ladder",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "construction"
      ],
      "subcategories": [
        "construction-8"
      ],
      "applications": [
        "Construction & Workshop"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for A’ Type 5 Steps Aluminum Ladder",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Ladders. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/a-type-5-steps-aluminum-ladder/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-3105f0120401388c",
      "name": "16″ 3.5hp 123cc Lawn Mower Loncin Germany Brand Hand Push LYS16",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "construction"
      ],
      "subcategories": [
        "construction-10"
      ],
      "applications": [
        "Construction & Workshop"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 16″ 3.5hp 123cc Lawn Mower Loncin Germany Brand Hand Push LYS16",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Gardening & Lawn Mowers. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/16-3-5hp-123cc-lawn-mower-loncin-germany-brand-hand-push-lys16/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-01eaabe3eae0dcb3",
      "name": "21-Inch Briggs & Stratton WYS21 Lawn Mower",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "construction"
      ],
      "subcategories": [
        "construction-10"
      ],
      "applications": [
        "Construction & Workshop"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 21-Inch Briggs & Stratton WYS21 Lawn Mower",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Gardening & Lawn Mowers. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/21-inch-briggs-stratton-wys21-lawn-mower-wide-cut-lawn-maintenance/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-9dda6dc5c4f30080",
      "name": "16 Inches AICO Japan Manual Lawn Mower AC16MW",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "construction"
      ],
      "subcategories": [
        "construction-10"
      ],
      "applications": [
        "Construction & Workshop"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 16 Inches AICO Japan Manual Lawn Mower AC16MW",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Gardening & Lawn Mowers. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/16-inches-aico-japan-manual-lawn-mower-ac16mw/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-68af157c8129c445",
      "name": "6.8kVA Cigma-UK Petrol Generator (5.0kW Rated, Key Start, Trolley & Wheels) 6500AE2",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "generators"
      ],
      "subcategories": [
        "generators-1"
      ],
      "applications": [
        "Home Backup Power"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 6.8kVA Cigma-UK Petrol Generator (5.0kW Rated, Key Start, Trolley & Wheels) 6500AE2",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Petrol Generators. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/6-8kva-cigma-uk-petrol-generator-5-0kw-rated-key-start-trolley-wheels-6500ae2/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-f3fc0e042b443c5d",
      "name": "8.1Kva Pioneer Japan Petrol Generator LT8000EN-6",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "generators"
      ],
      "subcategories": [
        "generators-1"
      ],
      "applications": [
        "Home Backup Power"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 8.1Kva Pioneer Japan Petrol Generator LT8000EN-6",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Petrol Generators. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/8-1kva-pioneer-japan-petrol-generator-lt8000en-6/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-de7749177e05518e",
      "name": "2.4kW DAICHI DC2500 Petrol Generator",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "generators"
      ],
      "subcategories": [
        "generators-1"
      ],
      "applications": [
        "Home Backup Power"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 2.4kW DAICHI DC2500 Petrol Generator",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Petrol Generators. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/2-4kw-daichi-dc2500-petrol-generator-key-start/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-fcc658b486ea6072",
      "name": "1.2kva 4 stroke Aico Japan LT2000CL Petrol Generator",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "generators"
      ],
      "subcategories": [
        "generators-1"
      ],
      "applications": [
        "Home Backup Power"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 1.2kva 4 stroke Aico Japan LT2000CL Petrol Generator",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Petrol Generators. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/1-2kva-4-stroke-aico-japan-lt2000cl-petrol-generator/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-18eaf5e15fb64d12",
      "name": "10.5kw Benford Uk Diesel Silent Genset",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "generators"
      ],
      "subcategories": [
        "generators-2"
      ],
      "applications": [
        "Home Backup Power"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 10.5kw Benford Uk Diesel Silent Genset",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Diesel Generators. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/10-5kw-benford-uk-diesel-silent-genset-compact-design/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-6b4e3c6f64c977e5",
      "name": "16.25Kva Hisaki Japan Diesel Generator",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "generators"
      ],
      "subcategories": [
        "generators-2"
      ],
      "applications": [
        "Home Backup Power"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 16.25Kva Hisaki Japan Diesel Generator",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Diesel Generators. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/16-25kva-hisaki-japan-diesel-generator/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-03601a07a487a4c3",
      "name": "5kVA Dayliff Open Diesel Generator",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "generators"
      ],
      "subcategories": [
        "generators-2"
      ],
      "applications": [
        "Home Backup Power"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 5kVA Dayliff Open Diesel Generator",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Diesel Generators. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/5kva-dayliff-open-diesel-generator-fuel-efficient-industrial-power-solution/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-af60226328579568",
      "name": "15kva Maybach Diesel Generator",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "generators"
      ],
      "subcategories": [
        "generators-2"
      ],
      "applications": [
        "Home Backup Power"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 15kva Maybach Diesel Generator",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Diesel Generators. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/15kva-maybach-diesel-generator-model-mb15000ds3rated-power-12-0kvamax/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-7fa45fb7c970bbd0",
      "name": "10kVA Pulsar Diesel Silent Generator",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "generators"
      ],
      "subcategories": [
        "generators-4"
      ],
      "applications": [
        "Home Backup Power"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 10kVA Pulsar Diesel Silent Generator",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Three Phase Diesel Generators. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/10kva-pulsar-diesel-silent-generator-three-phase-ats/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-743e53b8463372ef",
      "name": "Cummins 33kVA C33D5",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "generators"
      ],
      "subcategories": [
        "generators-4"
      ],
      "applications": [
        "Home Backup Power"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for Cummins 33kVA C33D5",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Three Phase Diesel Generators. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/cummins-33kva-c33d5-super-silent-diesel-generator/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-df574ae6ecee0d83",
      "name": "10.5kVA Maybach 3 Phase Silent Diesel Generator with ATS",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "generators"
      ],
      "subcategories": [
        "generators-5"
      ],
      "applications": [
        "Home Backup Power"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 10.5kVA Maybach 3 Phase Silent Diesel Generator with ATS",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Silent Canopy Generators. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/10-5kva-maybach-3-phase-silent-diesel-generator-with-ats-white/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-33ff3ea966c861e1",
      "name": "15kVA Pyramid Germany Silent Diesel Generator with ATS",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "generators"
      ],
      "subcategories": [
        "generators-5"
      ],
      "applications": [
        "Home Backup Power"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 15kVA Pyramid Germany Silent Diesel Generator with ATS",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Silent Canopy Generators. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/15kva-pyramid-germany-silent-diesel-generator-with-ats-heavy-duty-three-phase-power/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-3d9cac0197f63239",
      "name": "10.5kVA Maybach Yellow Silent Diesel Generator",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "generators"
      ],
      "subcategories": [
        "generators-5"
      ],
      "applications": [
        "Home Backup Power"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 10.5kVA Maybach Yellow Silent Diesel Generator",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Silent Canopy Generators. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/10-5kva-maybach-yellow-silent-diesel-generator-reliable-single-phase-power/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-e19868a193b066ed",
      "name": "12kVA CIGMA-UK Diesel Silent Generator",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "generators"
      ],
      "subcategories": [
        "generators-5"
      ],
      "applications": [
        "Home Backup Power"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 12kVA CIGMA-UK Diesel Silent Generator",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Silent Canopy Generators. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/12kva-cigma-uk-diesel-silent-generator-electric-start-dual-power/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-fbc807d261b9f880",
      "name": "8.5Kva 1-Phase Premier Silent Diesel Generator w/o ATS",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "generators"
      ],
      "subcategories": [
        "generators-5"
      ],
      "applications": [
        "Home Backup Power"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 8.5Kva 1-Phase Premier Silent Diesel Generator w/o ATS",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Silent Canopy Generators. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/8-5kva-1-phase-premier-silent-diesel-generator-w-o-ats-heavy-duty-design/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-f04a34af25f6733c",
      "name": "12.5Kva Maybach Welding Generator",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "generators"
      ],
      "subcategories": [
        "generators-9"
      ],
      "applications": [
        "Home Backup Power"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 12.5Kva Maybach Welding Generator",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Diesel Welding Generators. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/12-5kva-maybach-welding-generator-2-in-1-heavy-duty-diesel/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-004f77a3877d246c",
      "name": "7kva Diesel Welding Generator Uk Standard",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "generators"
      ],
      "subcategories": [
        "generators-9"
      ],
      "applications": [
        "Home Backup Power"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 7kva Diesel Welding Generator Uk Standard",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Diesel Welding Generators. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/7kva-diesel-welding-generator-uk-standard/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    },
    {
      "id": "macire-ad05e72379ef9abc",
      "name": "8kva Diesel Welding Generator Rhino Japan Technology",
      "sku": null,
      "model": null,
      "brand": null,
      "brandStatus": "To Be Confirmed",
      "categories": [
        "generators"
      ],
      "subcategories": [
        "generators-9"
      ],
      "applications": [
        "Home Backup Power"
      ],
      "image": {
        "src": "assets/images/placeholder.svg",
        "tile": 0
      },
      "gallery": [
        {
          "type": "photo",
          "tile": 0,
          "label": "Product photograph pending"
        }
      ],
      "alt": "Product photograph unavailable for 8kva Diesel Welding Generator Rhino Japan Technology",
      "photoStatus": "Product photograph pending",
      "shortDescription": "Enquire about this item in Diesel Welding Generators. Exact product details are To Be Confirmed.",
      "description": "Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.",
      "specs": {},
      "power": null,
      "capacity": null,
      "phase": null,
      "price": null,
      "priceType": "quote",
      "currency": "KES",
      "quotationStatus": "quote-required",
      "stock": null,
      "priceDate": null,
      "imageSource": "Nyce neutral placeholder; not a product photograph",
      "verificationStatus": null,
      "evidenceStatus": "illustrative",
      "sourceReference": "https://macire.co.ke/product/rhino-japan-technology-8kva-diesel-welding-generator/",
      "sourceChecked": "2026-10-10",
      "sourceClassification": "enquiry-only",
      "featured": false,
      "approved": true,
      "dateAdded": null,
      "related": []
    }
  ]
};
