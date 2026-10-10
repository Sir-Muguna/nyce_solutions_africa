"""Generate review-only mapping reports. Never writes catalogue or draft records."""
import collections
import csv
import difflib
import hashlib
import json
import pathlib
import re
import runpy
import urllib.parse

ROOT = pathlib.Path(__file__).resolve().parent.parent
VALIDATOR = runpy.run_path(str(ROOT / 'tools/validate-catalogue.py'))
REGISTER = ROOT / 'data/macire-source-register.csv'
OUTPUT = ROOT / 'docs/macire-proposed-mapping.csv'
REPORT = ROOT / 'docs/macire-mapping-review.md'
norm = VALIDATOR['norm']


def url_key(value):
    parsed = urllib.parse.urlsplit(value or '')
    return (parsed.netloc.lower(), urllib.parse.unquote(parsed.path).rstrip('/'))


def specifications(row):
    return dict(part.split(': ', 1) for part in row['visible_specifications'].split('; ') if ': ' in part)


def stated(value):
    return bool(value and norm(value) not in ('not stated', 'to be confirmed', 'not listed'))


def identity(row):
    specs = specifications(row)
    model = row['model_or_sku'] if stated(row['model_or_sku']) else ''
    if not model:
        model = next((value for key, value in specs.items() if norm(key) in ('model', 'model number', 'model no', 'product model')), '')
    return row['brand'] if stated(row['brand']) else '', model


def target(row, original):
    name = norm(row['product_name'])
    changes = []
    selected = original
    if original == 'solar-10' and 'inverter' not in name and 'pump' in name:
        selected = 'water-7'
    elif original == 'electrical-2' and 'changeover' in name:
        selected = 'electrical-3'
    elif original == 'electrical-4' and '3 core' in name:
        selected = 'electrical-1'
    elif original == 'electrical-5' and 'single core' in name:
        selected = 'electrical-4'
    elif original == 'electrical-8':
        selected = 'solar-9'
    elif original in ('agriculture-1', 'water-10') and 'pump' in name:
        selected = 'water-1' if 'borehole' in name else 'agriculture-9'
    elif original == 'agriculture-9' and ('booster' in name or 'shallow well' in name):
        selected = 'water-7'
    elif original == 'water-1' and ('solar' in name or re.search(r'\bdc\b', name)):
        selected = 'solar-7'
    elif original == 'water-6':
        if 'control' in name:
            selected = 'water-5'
        elif 'solar' in name:
            selected = 'solar-7'
        elif 'sewage' in name:
            selected = 'construction-6'
    elif original == 'construction-5' and 'brush cutter' in name:
        selected = 'construction-10'
    elif original == 'generators-4' and 'single phase' in name:
        selected = 'generators-3'
    elif original == 'generators-7' and 'diesel generator' in name:
        selected = 'generators-6'
    if selected != original:
        changes.append(f'Proposed reassignment {original} -> {selected}; owner approval required')
    uncertain = []
    if original == 'agriculture-2' and 'harvester' in name:
        uncertain.append('Maize harvester is not a walking tractor; no dedicated existing subcategory')
    if original == 'construction-5' and 'truck sack' in name:
        uncertain.append('Sack truck is not a power/hand tool; possible Building Equipment requires owner review')
    if original == 'water-3' and 'pump body' in name:
        uncertain.append('Pump body only; AC/DC motor compatibility not established')
    if original == 'water-1' and 'shallow well' in name:
        uncertain.append('Shallow well pump is not confirmed as a borehole pump')
    if original == 'generators-9' and 'weld' not in name:
        uncertain.append('Diesel generator listing does not establish welding output')
    if original == 'generators-10':
        uncertain.append('Home backup suitability and installation requirements not established')
    if original == 'generators-3' and 'single and three phase' in name:
        changes.append('Dual-phase model: confirm ratings before approving single-/three-phase placement')
    if original == 'solar-4' and ('on grid' in name or 'grid tied' in name):
        uncertain.append('Lithium storage not established for grid-tied commercial kit')
    return selected, changes, uncertain


def match(row, records):
    brand, model = identity(row)
    confirmed, possible = [], []
    for product in records:
        reasons = []
        reference = product.get('sourceReference') or ''
        if '/product/' in reference and url_key(reference) == url_key(row['product_url']):
            reasons.append('exact product URL')
        if norm(product['name']) == norm(row['product_name']):
            reasons.append('exact normalized name')
        if brand and model and norm(brand) == norm(product.get('brand')) and norm(model) == norm(product.get('model')):
            reasons.append('exact brand + model (variant details still require review)')
        if reasons:
            confirmed.append((product, ', '.join(reasons)))
            continue
        product_model = norm(product.get('model'))
        same_brand = brand and norm(brand) == norm(product.get('brand'))
        if same_brand and product_model and f' {product_model} ' in f" {norm(row['product_name'])} ":
            possible.append((product, 'brand + catalogue model in source title; verify variant'))
        elif same_brand and norm(product['name']) and difflib.SequenceMatcher(None, norm(product['name']), norm(row['product_name'])).ratio() >= 0.72:
            possible.append((product, 'similar name + same brand; not proof of identity'))
    return confirmed, possible


def conflicts(row, matches):
    source_specs = specifications(row)
    source_values = {norm(key): value for key, value in source_specs.items()}
    brand, model = identity(row)
    findings = []
    for product, reason in matches:
        for field, source in [('brand', brand), ('model', model)]:
            existing = product.get(field)
            if stated(existing) and stated(source) and norm(existing) != norm(source):
                findings.append(f'{product["id"]} {field}: catalogue={existing}; source={source}')
        for key, existing in (product.get('specs') or {}).items():
            source = source_values.get(norm(key))
            if stated(source) and stated(existing) and norm(source).replace(' ', '') != norm(existing).replace(' ', ''):
                findings.append(f'{product["id"]} spec {key}: catalogue={existing}; source={source} (unit/meaning review needed)')
        if product.get('price') is not None:
            source_price = float(row['listed_price_kes'].replace(',', '')) if stated(row['listed_price_kes']) else None
            if source_price is not None and source_price != product['price']:
                findings.append(f'{product["id"]} price: Nyce KES {product["price"]}; Macire KES {source_price:g}; different retailer, never overwrite')
        if stated(product.get('stock')) and norm(product['stock']) != norm(row['availability']):
            findings.append(f'{product["id"]} stock differs by retailer; never overwrite')
    return findings


def main():
    protected = [ROOT / 'assets/js/catalogue.js', ROOT / 'data/catalogue-drafts.json', ROOT / 'assets/js/app.js', ROOT / 'assets/js/config.js', ROOT / 'assets/css/styles.css', ROOT / 'index.html', REGISTER]
    before = {path: hashlib.sha256(path.read_bytes()).hexdigest() for path in protected}
    catalogue = VALIDATOR['load_catalogue']()
    taxonomy = {sub['id']: (category['id'], category['name'], sub['name']) for category in catalogue['categories'] for sub in category['subcategories']}
    live = catalogue['products']
    drafts = [draft['record'] for draft in json.loads((ROOT / 'data/catalogue-drafts.json').read_text(encoding='utf-8'))['drafts']]
    with REGISTER.open(encoding='utf-8-sig', newline='') as handle:
        sources = list(csv.DictReader(handle))
    rows = []
    for number, source in enumerate(sources, 1):
        original = re.search(r'\(([^()]+)\)$', source['proposed_nyce_subcategory']).group(1)
        selected, changes, uncertain = target(source, original)
        if selected not in taxonomy:
            uncertain.append('Target not in existing taxonomy')
        if uncertain:
            changes.append('Rejected placement requires owner taxonomy/fit review; no category change authorized')
        live_exact, live_possible = match(source, live)
        draft_exact, draft_possible = match(source, drafts)
        source_records = [{'id': f'MACIRE-{position:03}', 'name': candidate['product_name'], 'brand': identity(candidate)[0], 'model': identity(candidate)[1], 'sourceReference': candidate['product_url'], 'specs': specifications(candidate)} for position, candidate in enumerate(sources, 1) if position != number]
        source_exact, source_possible = match(source, source_records)
        brand, model = identity(source)
        essential = VALIDATOR['missing_specs']({'specs': {key: value for key, value in specifications(source).items() if stated(value)}}, selected)
        missing = ([label for label, value in [('Source brand', brand), ('Source product model/SKU', model)] if not value] + [f'Essential attribute: {label}' for label in essential])
        missing += ['Manufacturer/owner verification of identity and specifications', 'Nyce price and date or owner-approved quote-only policy', 'Nyce availability', 'Authorized product photo', 'Original Nyce descriptions and application classification']
        matched = live_exact + live_possible + draft_exact + draft_possible
        issues = conflicts(source, matched + source_exact + source_possible)
        for product, reason in live_exact + draft_exact:
            if selected not in product.get('subcategories', []):
                changes.append(f'{product["id"]}: target differs from existing placement {product.get("subcategories")}; approval required')
        if re.search(r'(?i)macire|installation|all-inclusive|warranty', source['visible_specifications']):
            issues.append('Retailer package/installation/warranty terms are not Nyce commitments; do not copy')
        decision = 'Reject - insufficient reliable information'
        if uncertain:
            decision = 'Reject - taxonomy fit not established'
        elif not essential and brand and model:
            decision = 'Conditional review candidate - not importable'
        if len(live_exact) > 1 or source_exact or source_possible:
            issues.append('Possible variant/model-family collision; compare power, capacity, phase, package and sale unit before any merge')
        status = 'Existing live product' if live_exact else 'Possible existing live product' if live_possible else 'Existing unpublished draft only' if draft_exact else 'New candidate (identity unconfirmed)' if not model else 'New candidate'
        duplicate = []
        for label, matches in [('Live exact', live_exact), ('Live possible', live_possible), ('Draft exact', draft_exact), ('Draft possible', draft_possible), ('Register exact/model-family', source_exact), ('Register possible', source_possible)]:
            if matches:
                duplicate.append(f'{label}: ' + ' | '.join(f'{product["id"]} ({reason})' for product, reason in matches))
        category_id, category_name, sub_name = taxonomy.get(selected, ('', '', ''))
        rows.append({
            'source_id': f'MACIRE-{number:03}', 'source_product': source['product_name'], 'product_url': source['product_url'], 'research_date': source['research_date'],
            'existing_or_new_product': status, 'existing_live_ids': ' | '.join(product['id'] for product, reason in live_exact + live_possible),
            'existing_draft_ids': ' | '.join(product['id'] for product, reason in draft_exact + draft_possible),
            'original_proposed_subcategory': original, 'target_category_id': category_id, 'target_category': category_name, 'target_subcategory_id': selected, 'target_subcategory': sub_name,
            'taxonomy_status': '; '.join(uncertain) or ('Proposed reassignment; pending approval' if changes else 'Fits current taxonomy provisionally'),
            'duplicate_status': '; '.join(duplicate) or 'No match found; absence is not proof of uniqueness',
            'attribute_conflicts': '; '.join(issues) or 'No comparable stated conflict found; unverified/missing values are not agreement',
            'missing_information': '; '.join(missing), 'image_licensing_status': source['image_source_status'],
            'import_recommendation': decision + ('; enrich existing record only after verification, do not create duplicate' if live_exact or draft_exact else '; do not merge similar names or model variants'),
            'category_change_approval': '; '.join(changes) or 'No reassignment proposed',
            'approval_status': 'Not approved - owner review pending; no import authorized',
        })
    OUTPUT.parent.mkdir(exist_ok=True)
    with OUTPUT.open('w', encoding='utf-8-sig', newline='') as handle:
        writer = csv.DictWriter(handle, fieldnames=list(rows[0]))
        writer.writeheader()
        writer.writerows(rows)
    decisions = collections.Counter(row['import_recommendation'].split(';')[0] for row in rows)
    classifications = collections.Counter(row['existing_or_new_product'] for row in rows)
    lines = ['# Macire Proposed Mapping Review', '', 'Research-only proposal. No catalogue, draft, site, price or image changes. Every row is unapproved.', '',
             f'Compared {len(sources)} source rows against {len(live)} current catalogue records and {len(drafts)} unpublished drafts.', '', '## Decisions', '']
    lines += [f'- {label}: {count}' for label, count in sorted(decisions.items())]
    lines += ['', '## Identity Matching', ''] + [f'- {label}: {count}' for label, count in sorted(classifications.items())]
    lines += ['', 'Exact product URLs and normalized full names establish record links, not verified specifications. Exact brand + model identifies a model family, not necessarily a saleable variant. Model-in-title and similar-name matches are possible duplicates only. No model is invented from a title. Draft matches are not live products. Generic catalogue placeholders are not matched solely by category or power.', '',
              'Attribute conflicts compare stated brand/model and matching specification keys, including possible register duplicates. Whitespace-only differences (10 HP vs 10HP) are ignored; differently named keys and units are not silently reconciled. Missing values do not establish agreement. Retailer prices, stock, warranties, installation and package claims never overwrite Nyce data.', '',
              'The existing validator attribute profiles provide a conservative baseline. All essential fields must be visible for a conditional candidate; mismatched or incomplete profiles are rejected pending type-specific review. Appliance load examples are not component specifications. The source register may truncate specification tables, so absent evidence is a register gap, not a claim that the source cannot supply it.', '',
              'All rows lack manufacturer/owner confirmation, Nyce commercial terms and licensed images. Conditional candidates are a verification shortlist, not import-ready or approved products. Rejections apply to the available evidence and may be reconsidered after reliable information is supplied.', '',
              '## Category Changes Requiring Approval', '']
    lines += [f'- {row["source_id"]}: {row["source_product"]} ({row["original_proposed_subcategory"]} -> {row["target_subcategory_id"]}). {row["category_change_approval"]}' for row in rows if row['category_change_approval'] != 'No reassignment proposed']
    lines += ['', 'See macire-proposed-mapping.csv for every source row, duplicate evidence, conflicts, missing information, licensing and approval status.', '']
    REPORT.write_text('\n'.join(lines), encoding='utf-8')
    assert len(rows) == len(sources)
    assert all(hashlib.sha256(path.read_bytes()).hexdigest() == digest for path, digest in before.items()), 'Protected input changed'
    assert all(row['approval_status'].startswith('Not approved') for row in rows)
    print(json.dumps({'rows': len(rows), 'decisions': decisions, 'identities': classifications, 'category_approval_rows': sum(row['category_change_approval'] != 'No reassignment proposed' for row in rows), 'protected_inputs_unchanged': True}, indent=2))


if __name__ == '__main__':
    main()