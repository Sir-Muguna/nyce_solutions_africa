#!/usr/bin/env python3
"""Validate assets/js/catalogue.js and report catalogue gaps per category and subcategory.

    python tools/validate-catalogue.py                      # gap analysis (console)
    python tools/validate-catalogue.py --csv docs/catalogue-gap-report.csv
    python tools/validate-catalogue.py --template docs/product-template.json
    python tools/validate-catalogue.py --quiet              # summary only; exit 1 on schema errors

Schema errors break the site (search, filters, product pages, cart) and fail the run.
Gaps are content work for the owner (missing photos, unverified specs, unconfirmed brands) and never fail it.
Only the Python standard library is used.
"""
import argparse, collections, csv, json, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
CATALOGUE = ROOT / 'assets' / 'js' / 'catalogue.js'

APPLICATIONS = {'Home Backup Power', 'Farm & Irrigation', 'Construction & Workshop'}
PRICE_TYPES = {'fixed', 'demo', 'quote'}
QUOTATION_STATUS = {'fixed': 'priced', 'demo': 'demo-price', 'quote': 'quote-required'}
EVIDENCE = {'owner-supplied', 'sourced', 'illustrative'}
INTERNAL_WORDING = re.compile(r'(?i)\b(example|illustrat\w*|sourced|retailer[- ]listed|reference product|demonstration|placeholder)\b')

# Field rules: (type(s), required, allow null). Types follow JSON: str, int/float, bool, list, dict.
FIELDS = {
    'id': ((str,), True, False), 'name': ((str,), True, False), 'sku': ((str,), True, True), 'model': ((str,), True, True),
    'brand': ((str,), True, True), 'brandStatus': ((str,), False, True),
    'categories': ((list,), True, False), 'subcategories': ((list,), True, False), 'applications': ((list,), True, False),
    'image': ((dict,), True, False), 'gallery': ((list,), True, False), 'alt': ((str,), True, False), 'photoStatus': ((str,), False, True),
    'shortDescription': ((str,), True, False), 'description': ((str,), True, False), 'specs': ((dict,), True, False),
    'power': ((str,), True, True), 'capacity': ((str,), False, True), 'phase': ((str,), False, True),
    'price': ((int, float), True, True), 'priceType': ((str,), True, False), 'currency': ((str,), True, False), 'quotationStatus': ((str,), True, False),
    'stock': ((str,), False, True),
    'priceDate': ((str,), False, True), 'imageSource': ((str,), False, True), 'verificationStatus': ((str,), False, True),
    'evidenceStatus': ((str,), True, False), 'sourceReference': ((str,), False, True), 'sourceChecked': ((str,), False, True), 'sourceClassification': ((str,), False, True),
    'featured': ((bool,), True, False), 'approved': ((bool,), True, False), 'dateAdded': ((str,), True, True), 'related': ((list,), True, False),
}

# Attributes a buyer needs for each product type. Each entry: (label shown to the owner, spec-key prefixes that satisfy it).
PROFILES = {
    'solar_kit': [('Inverter rating (kW)', ['inverter rating', 'inverter power']), ('Battery capacity (kWh)', ['battery capacity', 'nominal storage', 'nominal energy']), ('Solar array (panel W x quantity)', ['solar array', 'solar panels', 'proposed panels', 'proposed array']), ('System voltage (V)', ['system voltage'])],
    'inverter': [('Rated power (kW)', ['rated power', 'output power', 'inverter power']), ('Battery voltage (V)', ['battery voltage', 'battery platform']), ('MPPT / PV input', ['mppt', 'pv input']), ('Phase', ['phase'])],
    'battery': [('Capacity (kWh)', ['capacity', 'nominal energy', 'nominal storage']), ('Nominal voltage (V)', ['nominal voltage', 'voltage']), ('Chemistry', ['chemistry', 'cell type']), ('Cycle life', ['cycle life'])],
    'pump': [('Motor power (kW / HP)', ['motor power', 'pump power', 'power rating']), ('Maximum head (m)', ['maximum head', 'head & flow']), ('Maximum flow (m3/h)', ['maximum flow', 'head & flow']), ('Power supply (V / phase / DC)', ['power supply', 'supply']), ('Outlet size', ['outlet'])],
    'water_heater': [('Tank capacity (L)', ['tank capacity', 'capacity']), ('Collector type', ['collector']), ('Pressure type', ['pressure'])],
    'pump_inverter': [('Rated power (kW)', ['rated power', 'output power', 'motor compatibility']), ('Input voltage range (V)', ['input voltage', 'pv input']), ('Output phase', ['output phase', 'phase'])],
    'accessory': [('Accessory type', ['component', 'type', 'function', 'use']), ('Rating / compatibility', ['rating', 'compatibility', 'cable compatibility'])],
    'irrigation': [('Irrigation type', ['irrigation type']), ('Coverage area', ['coverage', 'area']), ('Pipe / emitter size', ['pipe size', 'diameter', 'emitter']), ('Water source / pressure', ['water source', 'pressure'])],
    'engine': [('Engine power (HP)', ['engine power', 'rated power']), ('Fuel', ['fuel']), ('Starting method', ['starting method']), ('Cooling', ['cooling'])],
    'beehive': [('Hive type', ['equipment type', 'hive type']), ('Material', ['hive material', 'material']), ('Frames', ['frame'])],
    'incubator': [('Egg capacity', ['egg capacity']), ('Turning', ['turning']), ('Power supply', ['power supply', 'supply'])],
    'mill': [('Throughput (kg/h)', ['throughput']), ('Power source', ['power source', 'drive', 'fuel']), ('Motor / engine power', ['motor power', 'engine power', 'power rating'])],
    'pipe': [('Diameter (mm)', ['diameter']), ('Pressure class', ['pressure']), ('Length (m)', ['length', 'coil']), ('Material', ['material'])],
    'sprayer': [('Tank capacity (L)', ['tank capacity']), ('Operation', ['operation'])],
    'cable': [('Cross-section (mm2)', ['cross-section']), ('Core count', ['core']), ('Conductor material', ['conductor', 'material']), ('Length / sale unit', ['length', 'sale unit'])],
    'switch': [('Electrical rating (A)', ['electrical rating', 'rating']), ('Gangs / poles', ['gang', 'pole']), ('Finish / mounting', ['finish', 'mounting'])],
    'changeover': [('Rating (A)', ['electrical rating', 'rating']), ('Poles', ['pole']), ('Operation (manual / automatic)', ['operation'])],
    'power_strip': [('Outlets', ['outlets']), ('Rating (A)', ['electrical rating', 'rating']), ('Cable length (m)', ['cable length']), ('Surge protection', ['surge'])],
    'stabilizer': [('Capacity (kVA)', ['capacity', 'power rating']), ('Input voltage range (V)', ['input voltage', 'voltage range']), ('Phase', ['phase'])],
    'enclosure': [('Ways', ['ways', 'layout']), ('Rating (A)', ['electrical rating', 'rating']), ('Mounting', ['mounting']), ('Enclosure material', ['enclosure', 'material'])],
    'pump_control': [('Function', ['function']), ('Rating', ['rating', 'motor compatibility']), ('Supply', ['supply', 'power supply'])],
    'water_treatment': [('Treatment type', ['treatment', 'function', 'stages']), ('Flow rate', ['flow']), ('Connection size', ['connection', 'port'])],
    'machine': [('Capacity / load', ['capacity', 'load']), ('Power source', ['power source', 'fuel', 'drive']), ('Motor / engine power', ['motor power', 'engine power', 'power rating'])],
    'welder': [('Output current (A)', ['output current', 'welding current']), ('Input voltage (V)', ['input voltage', 'supply', 'power supply']), ('Duty cycle', ['duty cycle'])],
    'power_tool': [('Power (W) / battery (V)', ['power rating', 'battery platform', 'voltage']), ('Tool type', ['equipment type', 'use', 'function']), ('Chuck / blade size', ['chuck', 'blade', 'disc'])],
    'security': [('Resolution', ['resolution']), ('Power supply', ['power supply', 'supply']), ('Connectivity', ['connectivity'])],
    'ladder': [('Working height / steps', ['height', 'steps']), ('Material', ['material']), ('Load rating (kg)', ['load'])],
    'fire': [('Extinguishing agent', ['agent', 'type']), ('Capacity (kg / L)', ['capacity']), ('Fire classes', ['class'])],
    'mower': [('Engine power', ['engine power', 'power rating']), ('Cutting width', ['cutting width']), ('Fuel', ['fuel'])],
    'generator': [('Rated output (kVA / kW)', ['rated output', 'listed output', 'output power', 'power rating']), ('Fuel', ['fuel']), ('Phase', ['phase']), ('Starting method', ['starting method']), ('Fuel tank (L)', ['fuel tank'])],
    'alternator': [('Rated output (kVA)', ['rated output', 'listed output', 'output power']), ('Phase', ['phase']), ('Voltage (V)', ['voltage'])],
    'welding_generator': [('Rated output (kVA)', ['rated output', 'listed output', 'output power']), ('Welding current (A)', ['welding current', 'output current']), ('Fuel', ['fuel'])],
}
SUBCATEGORY_PROFILE = {
    **{f'solar-{i}': 'solar_kit' for i in (1, 2, 3, 4)}, 'solar-5': 'inverter', 'solar-6': 'battery', 'solar-7': 'pump', 'solar-8': 'water_heater', 'solar-9': 'accessory', 'solar-10': 'pump_inverter',
    'agriculture-1': 'irrigation', 'agriculture-2': 'engine', 'agriculture-3': 'beehive', 'agriculture-4': 'incubator', 'agriculture-5': 'mill', 'agriculture-6': 'pipe', 'agriculture-7': 'engine', 'agriculture-8': 'sprayer', 'agriculture-9': 'irrigation',
    'electrical-1': 'cable', 'electrical-2': 'switch', 'electrical-3': 'changeover', 'electrical-4': 'cable', 'electrical-5': 'power_strip', 'electrical-6': 'stabilizer', 'electrical-7': 'enclosure', 'electrical-8': 'power_strip', 'electrical-9': 'cable', 'electrical-10': 'enclosure',
    'water-1': 'pump', 'water-3': 'pump', 'water-4': 'cable', 'water-5': 'pump_control', 'water-6': 'pump', 'water-7': 'pump', 'water-8': 'pump', 'water-9': 'water_treatment', 'water-10': 'irrigation',
    'construction-1': 'machine', 'construction-2': 'machine', 'construction-3': 'welder', 'construction-4': 'power_tool', 'construction-5': 'power_tool', 'construction-6': 'pump', 'construction-7': 'security', 'construction-8': 'ladder', 'construction-9': 'fire', 'construction-10': 'mower',
    **{f'generators-{i}': 'generator' for i in (1, 2, 3, 4, 5, 6, 8, 10)}, 'generators-7': 'alternator', 'generators-9': 'welding_generator',
}


def load_catalogue():
    text = CATALOGUE.read_text(encoding='utf-8')
    start = text.index('window.NYCE_CATALOGUE')
    return json.loads(text[text.index('{', start):text.rstrip().rstrip(';').rindex('}') + 1])


def norm(s):
    return re.sub(r'[^a-z0-9]+', ' ', str(s or '').lower()).strip()


def missing_specs(product, sub_id):
    keys = [k.lower() for k in (product.get('specs') or {})]
    return [label for label, prefixes in PROFILES.get(SUBCATEGORY_PROFILE.get(sub_id), []) if not any(k.startswith(p) for k in keys for p in prefixes)]


def schema_errors(p, cats, subs, ids):
    """Errors that would break search, filters, product pages or the cart."""
    errs = []
    for field, (types, required, nullable) in FIELDS.items():
        if field not in p:
            if required: errs.append(f'missing field "{field}"')
            continue
        v = p[field]
        if v is None:
            if not nullable: errs.append(f'"{field}" is null')
        elif not isinstance(v, types) or (isinstance(v, bool) and bool not in types):
            errs.append(f'"{field}" has type {type(v).__name__}')
    unknown = set(p) - set(FIELDS)
    if unknown: errs.append(f'unknown fields {sorted(unknown)}')
    for c in p.get('categories') or []:
        if c not in cats: errs.append(f'unknown category "{c}"')
    for s in p.get('subcategories') or []:
        if s not in subs: errs.append(f'unknown subcategory "{s}"')
        elif subs[s] not in (p.get('categories') or []): errs.append(f'subcategory "{s}" belongs to "{subs[s]}", which is not in categories')
    for c in p.get('categories') or []:
        if not any(subs.get(s) == c for s in p.get('subcategories') or []): errs.append(f'category "{c}" has no matching subcategory')
    if p.get('categories') and p.get('subcategories') and subs.get(p['subcategories'][0]) != p['categories'][0]:
        errs.append('first subcategory is not under the first category (breadcrumb mismatch)')
    if not p.get('applications'): errs.append('no applications')
    for f in ('id', 'name', 'alt', 'shortDescription', 'description'):
        if isinstance(p.get(f), str) and not p[f].strip(): errs.append(f'"{f}" is empty')
    gallery = p.get('gallery') or []
    if not gallery: errs.append('gallery is empty (the product page needs at least one image entry)')
    for g in gallery:
        if not isinstance(g, dict) or g.get('type') not in ('photo', 'spec') or (g.get('type') == 'photo' and not isinstance(g.get('tile'), int)):
            errs.append(f'invalid gallery entry {g}')
    for a in p.get('applications') or []:
        if a not in APPLICATIONS: errs.append(f'unknown application "{a}"')
    pt = p.get('priceType')
    if pt not in PRICE_TYPES: errs.append(f'unknown priceType "{pt}"')
    elif (pt == 'quote') != (p.get('price') is None): errs.append(f'priceType "{pt}" does not match price {p.get("price")}')
    elif p.get('quotationStatus') != QUOTATION_STATUS[pt]: errs.append(f'quotationStatus "{p.get("quotationStatus")}" should be "{QUOTATION_STATUS[pt]}"')
    if isinstance(p.get('price'), (int, float)) and p['price'] < 0: errs.append('negative price')
    if p.get('currency') != 'KES': errs.append('currency is not KES')
    if p.get('evidenceStatus') not in EVIDENCE: errs.append(f'unknown evidenceStatus "{p.get("evidenceStatus")}"')
    img = p.get('image') or {}
    if not (isinstance(img.get('src'), str) or isinstance(img.get('tile'), int)): errs.append('image has neither src nor tile')
    for r in p.get('related') or []:
        if r not in ids: errs.append(f'related product "{r}" does not exist')
    if p.get('dateAdded') and not re.fullmatch(r'\d{4}-\d{2}-\d{2}', p['dateAdded']): errs.append('dateAdded is not YYYY-MM-DD')
    if p.get('priceDate') and not re.fullmatch(r'\d{4}-\d{2}-\d{2}', p['priceDate']): errs.append('priceDate is not YYYY-MM-DD')
    if p.get('verificationStatus') not in (None, 'draft', 'verified'): errs.append(f'unknown verificationStatus "{p.get("verificationStatus")}"')
    return errs


def publication_blockers(p):
    """Facts a record must carry before it may leave the draft file and appear on the site."""
    b = []
    if p.get('verificationStatus') != 'verified': b.append('verificationStatus is not "verified"')
    if not p.get('brand'): b.append('brand')
    if not (p.get('model') or p.get('sku')): b.append('model or SKU')
    if not (p.get('shortDescription') or '').strip() or not (p.get('description') or '').strip(): b.append('original short and detailed description')
    if not p.get('applications'): b.append('applications')
    if not p.get('specs'): b.append('verified specifications')
    if p.get('priceType') == 'fixed' and not p.get('priceDate'): b.append('price source date')
    if p.get('priceType') == 'demo': b.append('demonstration price')
    if not p.get('stock'): b.append('availability status')
    img = p.get('image') or {}
    if not img.get('src'): b.append('product photo (image.src)')
    if img.get('src') and not p.get('imageSource'): b.append('authorized image source / licence')
    if not p.get('sourceReference'): b.append('source URL')
    if INTERNAL_WORDING.search(p.get('name', '')) or re.search(r'(?i)macire', p.get('name', '')): b.append('name contains internal or competitor wording')
    return b


def content_gaps(p, sub_id, cat_names):
    """Owner content work. Never blocks the site."""
    g = collections.OrderedDict()
    verified = p.get('evidenceStatus') != 'illustrative'
    g['missing_attributes'] = [f for f, ok in [('brand', p.get('brand')), ('model', p.get('model')), ('sku', p.get('sku')), ('availability (stock)', p.get('stock'))] if not ok]
    g['missing_type_specs'] = missing_specs(p, sub_id)
    name_issues = []
    if INTERNAL_WORDING.search(p.get('name', '')): name_issues.append('internal wording in name')
    if norm(p.get('name')) in cat_names: name_issues.append('name equals a category name')
    if p.get('brand') and norm(p['brand']) not in norm(p.get('name')): name_issues.append('brand not in name')
    if p.get('name', '') != p.get('name', '').strip(): name_issues.append('leading/trailing spaces')
    if INTERNAL_WORDING.search(f"{p.get('shortDescription', '')} {p.get('description', '')}"): name_issues.append('internal wording in description')
    g['naming'] = name_issues
    img = p.get('image') or {}
    g['images'] = [] if isinstance(img.get('src'), str) else ['shared category sprite, no product photo']
    if INTERNAL_WORDING.search(p.get('alt', '')): g['images'].append('alt text describes an illustrative visual')
    g['unverified'] = ([] if verified else ['specifications']) + (['price (product identity unverified)'] if p.get('priceType') == 'fixed' and not verified else []) + (['demonstration price'] if p.get('priceType') == 'demo' else [])
    return g


def analyse(data):
    cats = {c['id']: c for c in data['categories']}
    subs = {s['id']: c['id'] for c in data['categories'] for s in c['subcategories']}
    sub_names = {s['id']: s['name'] for c in data['categories'] for s in c['subcategories']}
    cat_names = {norm(c['name']) for c in data['categories']}
    products = data['products']
    ids = [p.get('id') for p in products]
    errors = collections.defaultdict(list)
    for p in products:
        for e in schema_errors(p, cats, subs, set(ids)): errors[p.get('id')].append(e)
    for pid, n in collections.Counter(ids).items():
        if n > 1: errors[pid].append(f'duplicate id ({n} records)')
    taxonomy = []
    for k, v in collections.Counter(norm(n) for n in sub_names.values()).items():
        if v > 1: taxonomy.append(f'duplicate subcategory name "{k}"')
    for sid, name in sub_names.items():
        if norm(name) == norm(cats[subs[sid]]['name']): taxonomy.append(f'{sid} has the same name as its category')
        if sid not in SUBCATEGORY_PROFILE: taxonomy.append(f'{sid} has no attribute profile in validate-catalogue.py')
    dupes = collections.defaultdict(list)
    for p in products:
        dupes[('name', norm(p.get('name')))].append(p['id'])
        if p.get('brand') and p.get('model'): dupes[('brand+model', norm(p['brand']) + '|' + norm(p['model']))].append(p['id'])
        if p.get('sku'): dupes[('sku', norm(p['sku']))].append(p['id'])
    duplicates = {k: v for k, v in dupes.items() if len(v) > 1}
    rows = []
    for c in data['categories']:
        for s in c['subcategories']:
            members = [p for p in products if s['id'] in (p.get('subcategories') or [])]
            for p in members or [None]:
                gaps = content_gaps(p, s['id'], cat_names) if p else None
                rows.append({'category': c['id'], 'subcategory': s['id'], 'subcategory_name': s['name'], 'product_count': len(members),
                             'product_id': p['id'] if p else '', 'product_name': p['name'] if p else '',
                             'evidence': p.get('evidenceStatus', '') if p else '', 'price_type': p.get('priceType', '') if p else '',
                             'schema_errors': '; '.join(errors.get(p['id'], [])) if p else '',
                             'duplicates': '; '.join(f'{k[0]} shared with {", ".join(x for x in v if x != p["id"])}' for k, v in duplicates.items() if p and p['id'] in v),
                             **({k: '; '.join(v) for k, v in gaps.items()} if gaps else {'missing_attributes': '', 'missing_type_specs': '', 'naming': '', 'images': '', 'unverified': ''}),
                             'required_type_attributes': '; '.join(l for l, _ in PROFILES.get(SUBCATEGORY_PROFILE.get(s['id']), [])),
                             'status': 'EMPTY - needs products' if not p else ('SCHEMA ERROR' if errors.get(p['id']) else 'ok')})
    return rows, errors, taxonomy, duplicates


def template(data):
    """A blank, schema-valid record: every field present, no facts populated."""
    blank = {f: (None if nullable else ([] if list in types else {} if dict in types else False if bool in types else ''))
             for f, (types, _req, nullable) in FIELDS.items()}
    blank.update({'priceType': 'quote', 'currency': 'KES', 'quotationStatus': 'quote-required', 'evidenceStatus': 'owner-supplied', 'sourceClassification': 'owner-supplied',
                  'image': {'src': None, 'tile': None}, 'gallery': [], 'specs': {}, 'applications': [], 'featured': False, 'approved': False, 'related': []})
    return {
        '_how_to_use': [
            'Copy "product" once per item and fill only facts you can confirm (supplier documents, packaging, invoices).',
            'Leave unknown values as null. The website shows "To Be Confirmed" for brand, model and availability, and hides unverified specs.',
            'price: number in KES with priceType "fixed" for a confirmed selling price; null with priceType "quote" for Request Price.',
            'image.src: path under assets/images/ (or https URL) for a licensed product photo, at least 1200 x 1200 px. Without a photo, leave src null and set image.tile to the category imageTile (0-5).',
            'gallery: keep at least one entry, e.g. [{"type": "photo", "asset": "equipment", "tile": <same tile>, "label": "Product image"}, {"type": "spec", "label": "Specification overview"}].',
            'specs: use the attribute names listed for the product\'s first subcategory in "requiredSpecsBySubcategory".',
            'Run: python tools/validate-catalogue.py  — it must report 0 schema errors before publishing.'],
        'fieldRules': {f: {'type': '|'.join(t.__name__ for t in types), 'required': req, 'nullable': nullable} for f, (types, req, nullable) in FIELDS.items()},
        'allowedValues': {'applications': sorted(APPLICATIONS), 'priceType': sorted(PRICE_TYPES), 'quotationStatus by priceType': QUOTATION_STATUS, 'evidenceStatus': sorted(EVIDENCE), 'currency': ['KES'],
                          'categories': [c['id'] for c in data['categories']], 'subcategories': {s['id']: s['name'] for c in data['categories'] for s in c['subcategories']}},
        'requiredSpecsBySubcategory': {sid: [l for l, _ in PROFILES[prof]] for sid, prof in SUBCATEGORY_PROFILE.items()},
        'product': blank,
    }


def validate_template(tpl, data):
    """The template must contain every field with an allowed type; null placeholders are expected."""
    p = tpl['product']
    errs = [f'template missing "{f}"' for f in FIELDS if f not in p]
    errs += [f'template has unknown "{f}"' for f in p if f not in FIELDS]
    if p.get('priceType') not in PRICE_TYPES or p.get('quotationStatus') != QUOTATION_STATUS.get(p.get('priceType')): errs.append('template price fields inconsistent')
    if set(tpl['requiredSpecsBySubcategory']) != {s['id'] for c in data['categories'] for s in c['subcategories']}: errs.append('template spec profiles do not cover every subcategory')
    return errs


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--csv'); ap.add_argument('--template'); ap.add_argument('--quiet', action='store_true')
    args = ap.parse_args()
    data = load_catalogue()
    rows, errors, taxonomy, duplicates = analyse(data)
    if not args.quiet:
        for c in data['categories']:
            crow = [r for r in rows if r['category'] == c['id']]
            print(f"\n== {c['name']} ({c['id']}) - {len({r['product_id'] for r in crow if r['product_id']})} products")
            for s in c['subcategories']:
                srows = [r for r in crow if r['subcategory'] == s['id']]
                n = srows[0]['product_count']
                agg = lambda k: sorted({x for r in srows for x in r[k].split('; ') if x})
                print(f"  {s['id']:<16} {s['name']:<40} {n} product(s)  {srows[0]['status'] if n == 0 else ''}")
                for k, label in [('schema_errors', 'schema'), ('duplicates', 'duplicates'), ('missing_attributes', 'missing'), ('missing_type_specs', 'type specs missing'), ('naming', 'naming'), ('images', 'images'), ('unverified', 'unverified')]:
                    if agg(k): print(f"      {label}: {', '.join(agg(k))}")
                if n == 0: print(f"      required for this type: {srows[0]['required_type_attributes']}")
    products = data['products']
    print('\n== SUMMARY')
    print(f"categories {len(data['categories'])}, subcategories {sum(len(c['subcategories']) for c in data['categories'])}, products {len(products)}")
    print(f"schema errors: {sum(len(v) for v in errors.values())} in {len(errors)} product(s)")
    print(f"empty subcategories: {sorted({r['subcategory'] for r in rows if r['product_count'] == 0})}")
    print(f"duplicates: {len(duplicates)}; taxonomy notes: {taxonomy or 'none'}")
    print(f"no product photo: {sum(not isinstance((p.get('image') or {}).get('src'), str) for p in products)}; unverified specs: {sum(p.get('evidenceStatus') == 'illustrative' for p in products)}; "
          f"no brand: {sum(not p.get('brand') for p in products)}; no model: {sum(not p.get('model') for p in products)}; no SKU: {sum(not p.get('sku') for p in products)}; no availability: {sum(not p.get('stock') for p in products)}")
    print(f"prices: fixed {sum(p.get('priceType') == 'fixed' for p in products)}, quote {sum(p.get('priceType') == 'quote' for p in products)}, demo {sum(p.get('priceType') == 'demo' for p in products)}")
    if args.csv:
        out = ROOT / args.csv
        with out.open('w', newline='', encoding='utf-8') as fh:
            w = csv.DictWriter(fh, fieldnames=list(rows[0])); w.writeheader(); w.writerows(rows)
        print(f'wrote {out.relative_to(ROOT)} ({len(rows)} rows)')
    if args.template:
        tpl = template(data)
        terrs = validate_template(tpl, data)
        if terrs: print('TEMPLATE ERRORS:', terrs); return 1
        out = ROOT / args.template
        out.write_text(json.dumps(tpl, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
        print(f'wrote {out.relative_to(ROOT)} (validated)')
    return 1 if errors else 0


if __name__ == '__main__':
    sys.exit(main())
