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
    }
  ]
};
