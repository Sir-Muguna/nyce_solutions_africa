"""Publish the approved 96 Macire records as enquiry-only listings with no verified-data claims."""
import argparse
import copy
import csv
import hashlib
import json
import pathlib
import re
import runpy
import shutil

ROOT = pathlib.Path(__file__).resolve().parent.parent
V = runpy.run_path(str(ROOT / 'tools/validate-catalogue.py'))
CATALOGUE = ROOT / 'assets/js/catalogue.js'
DRAFTS = ROOT / 'data/macire-catalogue-drafts.json'
FILES = ['assets/js/catalogue.js', 'assets/js/app.js', 'tests/acceptance.py', 'data/macire-catalogue-drafts.json']


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def proposal():
    catalogue = V['load_catalogue']()
    payload = copy.deepcopy(catalogue)
    drafts = json.loads(DRAFTS.read_text(encoding='utf-8'))['drafts']
    if len(drafts) != 96:
        raise ValueError('Expected exactly 96 approved source records')
    ids = {product['id'] for product in catalogue['products']}
    names = {V['norm'](product['name']) for product in catalogue['products']}
    models = {(V['norm'](product.get('brand')), V['norm'](product.get('model'))) for product in catalogue['products'] if product.get('brand') and product.get('model')}
    skus = {V['norm'](product['sku']) for product in catalogue['products'] if product.get('sku')}
    subs = {sub['id']: (category['id'], sub['name']) for category in catalogue['categories'] for sub in category['subcategories']}
    logs = []
    for draft in drafts:
        product = copy.deepcopy(draft['record'])
        name = re.split(r'\s+[\u2013|]\s+', product['name'])[0].strip()
        name = re.sub(r'^(?:Original!|New!)\s*', '', name)
        identity = (V['norm'](product.get('brand')), V['norm'](product.get('model')))
        if product['id'] in ids or V['norm'](name) in names or (all(identity) and identity in models) or (product.get('sku') and V['norm'](product['sku']) in skus):
            raise ValueError(f'Duplicate identity requires reconciliation: {product["id"]}')
        if len(product['subcategories']) != 1 or len(product['categories']) != 1:
            raise ValueError('Expected one approved category/subcategory per enquiry')
        category, sub_name = subs[product['subcategories'][0]]
        if product['categories'] != [category]:
            raise ValueError('Category/subcategory mismatch')
        product.update(name=name, brand=None, model=None, sku=None, brandStatus='To Be Confirmed',
                       specs={}, power=None, capacity=None, phase=None, price=None, priceDate=None,
                       priceType='quote', quotationStatus='quote-required', stock=None,
                       image={'src': 'assets/images/placeholder.svg', 'tile': 0},
                       imageSource='Nyce neutral placeholder; not a product photograph',
                       gallery=[{'type': 'photo', 'tile': 0, 'label': 'Product photograph pending'}],
                       alt=f'Product photograph unavailable for {name}', photoStatus='Product photograph pending',
                       shortDescription=f'Enquire about this item in {sub_name}. Exact product details are To Be Confirmed.',
                       description='Request a quotation for the exact brand, model and specification offered. Availability, compatibility, pricing and support terms are confirmed with your enquiry. An enquiry is not an order.',
                       evidenceStatus='illustrative', sourceClassification='enquiry-only', verificationStatus=None,
                       approved=True, featured=False, dateAdded=None, related=[],
                       applications=['Home Backup Power' if category in ('solar', 'generators') else 'Farm & Irrigation' if category in ('agriculture', 'water') else 'Construction & Workshop'])
        ids.add(product['id'])
        names.add(V['norm'](name))
        if all(identity):
            models.add(identity)
        payload['products'].append(product)
        logs.append({'id': product['id'], 'name': name, 'category': category, 'subcategory': product['subcategories'][0],
                     'source_url': product['sourceReference'], 'outcome': 'Published enquiry-only',
                     'approval': 'Owner explicitly approved 96 enquiry-only listings with neutral placeholders',
                     'verification': 'Not technically verified; brand/model/specs/price/stock omitted'})
    categories = {category['id']: category for category in payload['categories']}
    sub_categories = {identifier: values[0] for identifier, values in subs.items()}
    for product in payload['products']:
        errors = V['schema_errors'](product, categories, sub_categories, ids)
        if errors:
            raise ValueError(f'{product["id"]}: {errors}')
    assert payload['categories'] == catalogue['categories']
    assert payload['products'][:len(catalogue['products'])] == catalogue['products']
    return payload, logs


def publish(run):
    if run.resolve().parent != (ROOT / 'docs/macire-publication-runs').resolve():
        raise ValueError('Use a direct publication run directory')
    payload, logs = proposal()
    for relative in FILES:
        if not (run / 'backup' / relative).exists():
            raise ValueError(f'Missing pre-publication backup: {relative}')
    before = {relative: digest(run / 'backup' / relative) for relative in FILES}
    if digest(CATALOGUE) != before['assets/js/catalogue.js'] or digest(DRAFTS) != before['data/macire-catalogue-drafts.json']:
        raise ValueError('Catalogue or draft changed since backup')
    text = CATALOGUE.read_text(encoding='utf-8')
    head = text[:text.index('{', text.index('window.NYCE_CATALOGUE'))]
    rendered = (head + json.dumps(payload, indent=2, ensure_ascii=False) + ';\n').encode('utf-8')
    after = {relative: digest(ROOT / relative) for relative in FILES}
    after['assets/js/catalogue.js'] = hashlib.sha256(rendered).hexdigest()
    manifest = {'status': 'prepared', 'before': before, 'after': after}
    (run / 'manifest.json').write_text(json.dumps(manifest, indent=2), encoding='utf-8')
    with (run / 'publication-log.csv').open('w', encoding='utf-8-sig', newline='') as handle:
        writer = csv.DictWriter(handle, fieldnames=list(logs[0]))
        writer.writeheader()
        writer.writerows(logs)
    CATALOGUE.write_bytes(rendered)
    assert digest(CATALOGUE) == after['assets/js/catalogue.js']
    manifest['status'] = 'published'
    (run / 'manifest.json').write_text(json.dumps(manifest, indent=2), encoding='utf-8')
    print(f'Published {len(logs)} enquiry-only listings; total {len(payload["products"])}. No priced/stock/technical claims added.')


def rollback(run):
    if run.resolve().parent != (ROOT / 'docs/macire-publication-runs').resolve():
        raise ValueError('Invalid publication run directory')
    manifest = json.loads((run / 'manifest.json').read_text(encoding='utf-8'))
    if manifest['status'] not in ('prepared', 'published') or set(manifest['before']) != set(FILES):
        raise ValueError('Invalid or already rolled-back manifest')
    for relative in FILES:
        if digest(ROOT / relative) != manifest['after'][relative]:
            raise ValueError(f'Later edit detected; rollback refused: {relative}')
        if digest(run / 'backup' / relative) != manifest['before'][relative]:
            raise ValueError('Backup checksum mismatch')
    for relative in FILES:
        if manifest['before'][relative] != manifest['after'][relative]:
            shutil.copy2(run / 'backup' / relative, ROOT / relative)
    manifest['status'] = 'rolled-back'
    (run / 'manifest.json').write_text(json.dumps(manifest, indent=2), encoding='utf-8')
    print('Rollback complete; pre-publication catalogue, renderer and tests restored.')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    modes = parser.add_mutually_exclusive_group(required=True)
    modes.add_argument('--dry-run', action='store_true')
    modes.add_argument('--publish', type=pathlib.Path)
    modes.add_argument('--rollback', type=pathlib.Path)
    args = parser.parse_args()
    if args.dry_run:
        payload, logs = proposal()
        print(f'Dry run passed: {len(logs)} enquiry-only listings; {len(payload["products"])} total; existing records and taxonomy preserved.')
    elif args.publish:
        publish(args.publish)
    else:
        rollback(args.rollback)


if __name__ == '__main__':
    main()