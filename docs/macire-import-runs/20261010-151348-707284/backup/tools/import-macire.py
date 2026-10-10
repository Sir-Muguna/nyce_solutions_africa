"""Stage retailer research only: --dry-run, --apply PLAN, or --rollback RUN_DIRECTORY."""
import argparse
import collections
import copy
import csv
import datetime
import hashlib
import json
import os
import pathlib
import runpy
import shutil
import tempfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
M = runpy.run_path(str(ROOT / 'tools/map-research.py'))
V = M['VALIDATOR']
STAGE = pathlib.Path('data/macire-catalogue-drafts.json')
PLAN = pathlib.Path('docs/macire-dry-run.json')
RUNS = pathlib.Path('docs/macire-import-runs')
INPUTS = [pathlib.Path(name) for name in ('assets/js/catalogue.js', 'assets/js/app.js', 'assets/js/config.js', 'assets/css/styles.css', 'index.html', '404.html', 'data/catalogue-drafts.json', 'data/macire-source-register.csv', 'docs/macire-proposed-mapping.csv', 'tools/import-macire.py', 'tools/map-research.py', 'tools/validate-catalogue.py')]


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest() if path.exists() else None


def write_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    descriptor, temporary = tempfile.mkstemp(dir=path.parent)
    try:
        with os.fdopen(descriptor, 'w', encoding='utf-8', newline='\n') as handle:
            json.dump(value, handle, indent=2, ensure_ascii=False)
            handle.write('\n')
        os.replace(temporary, path)
    finally:
        if os.path.exists(temporary):
            os.unlink(temporary)


def input_hashes():
    return {str(path): digest(ROOT / path) for path in INPUTS + [STAGE]}


def duplicate_matches(row, records):
    exact, possible = M['match'](row, records)
    matches = {product['id']: reason for product, reason in exact + possible}
    identifier = M['norm'](row['model_or_sku']).replace(' ', '') if M['stated'](row['model_or_sku']) else ''
    for product in records:
        sku = M['norm'](product.get('sku')).replace(' ', '')
        if identifier and sku and identifier == sku:
            matches[product['id']] = 'source identifier matches existing SKU; variant review required'
    return matches


def validate_drafts(payload, catalogue, existing_ids):
    categories = {category['id']: category for category in catalogue['categories']}
    subs = {sub['id']: category['id'] for category in catalogue['categories'] for sub in category['subcategories']}
    ids = [draft['record']['id'] for draft in payload['drafts']]
    if len(ids) != len(set(ids)) or set(ids) & existing_ids:
        raise ValueError('Duplicate staged identifier or collision with existing records')
    for draft in payload['drafts']:
        product = draft['record']
        errors = [error for error in V['schema_errors'](product, categories, subs, existing_ids | set(ids)) if error != 'no applications']
        if errors:
            raise ValueError(f'{product["id"]}: {errors}')
        if product.get('approved') is not False or product.get('verificationStatus') != 'draft':
            raise ValueError('Research must remain an unapproved draft')
        if product.get('price') is not None or product.get('stock') is not None or product.get('image', {}).get('src'):
            raise ValueError('Retailer prices, stock or unauthorized images entered a draft')
        if product.get('specs') or not V['publication_blockers'](product):
            raise ValueError('Unverified specifications must remain review evidence')


def build_plan():
    before = input_hashes()
    catalogue = V['load_catalogue']()
    existing = json.loads((ROOT / 'data/catalogue-drafts.json').read_text(encoding='utf-8'))['drafts']
    prior = json.loads((ROOT / STAGE).read_text(encoding='utf-8')) if (ROOT / STAGE).exists() else {'status': 'Unpublished retailer research', 'drafts': []}
    payload = copy.deepcopy(prior)
    existing_ids = {product['id'] for product in catalogue['products']} | {draft['record']['id'] for draft in existing}
    taken = existing_ids | {draft['record']['id'] for draft in payload['drafts']}
    taxonomy = {sub['id']: (category, sub) for category in catalogue['categories'] for sub in category['subcategories']}
    with (ROOT / 'docs/macire-proposed-mapping.csv').open(encoding='utf-8-sig', newline='') as handle:
        mapping = list(csv.DictReader(handle))
    with (ROOT / 'data/macire-source-register.csv').open(encoding='utf-8-sig', newline='') as handle:
        sources = list(csv.DictReader(handle))
    source_urls = [source['product_url'] for source in sources]
    mapped_urls = [row['product_url'] for row in mapping]
    if len(set(source_urls)) != len(sources) or len(set(mapped_urls)) != len(mapping) or set(mapped_urls) != set(source_urls):
        raise ValueError('Research/mapping coverage is not one-to-one')
    by_url = {row['product_url']: row for row in mapping}
    actions = []
    for source in sources:
        row = by_url[source['product_url']]
        action = {'source_id': row['source_id'], 'product': source['product_name'], 'source_url': source['product_url'], 'outcome': '', 'draft_id': '', 'reason': ''}
        if row['taxonomy_status'] != 'Fits current taxonomy provisionally' or row['category_change_approval'] != 'No reassignment proposed' or row['target_subcategory_id'] not in taxonomy:
            action.update(outcome='skipped', reason='Placement unclear or requires business approval: ' + row['category_change_approval'])
        else:
            category, sub = taxonomy[row['target_subcategory_id']]
            selected, changes, uncertain = M['target'](source, row['original_proposed_subcategory'])
            if changes or uncertain or selected != sub['id'] or category['id'] != row['target_category_id']:
                action.update(outcome='skipped', reason='Current taxonomy evidence does not confirm proposed placement')
            else:
                records = catalogue['products'] + [draft['record'] for draft in existing + payload['drafts']]
                matches = duplicate_matches(source, records)
                if matches:
                    action.update(outcome='duplicate', reason='Duplicate/possible variant - no merge: ' + '; '.join(f'{identifier}: {reason}' for identifier, reason in matches.items()))
                else:
                    identifier = 'macire-' + hashlib.sha256(source['product_url'].encode('utf-8')).hexdigest()[:16]
                    if identifier in taken:
                        raise ValueError('Generated identifier collision')
                    taken.add(identifier)
                    product = copy.deepcopy(V['template'](catalogue)['product'])
                    brand, model = M['identity'](source)
                    label = ' '.join(value for value in (brand, model) if value) or sub['name']
                    product.update(id=identifier, name=source['product_name'], brand=brand or None, model=model or None,
                                   categories=[category['id']], subcategories=[sub['id']],
                                   image={'src': None, 'tile': category['imageTile']},
                                   gallery=[{'type': 'photo', 'asset': 'equipment', 'tile': category['imageTile'], 'label': 'Product photo pending'}],
                                   alt=label, shortDescription=f'{label}: proposed equipment for {sub["name"]}.',
                                   description=f'This product is being reviewed for {sub["name"]}. Technical details and compatibility require confirmation before selection.',
                                   sourceReference=source['product_url'], sourceChecked=source['research_date'],
                                   sourceClassification='retailer research - unverified', evidenceStatus='sourced',
                                   verificationStatus='draft', approved=False, photoStatus='Authorized product image pending',
                                   brandStatus='Retailer claim - verification pending')
                    review = {'sourceId': row['source_id'], 'sourceName': source['product_name'], 'sourceBrand': source['brand'],
                              'sourceModelOrSku': source['model_or_sku'], 'sourceSpecifications': M['specifications'](source),
                              'sourcePrice': {'currency': 'KES', 'listed': source['listed_price_kes'], 'url': source['product_url'], 'date': source['research_date']},
                              'sourceAvailability': source['availability'], 'imageLicensing': source['image_source_status'],
                              'notes': ['All retailer claims remain unverified and unpublished. No source image or marketing copy imported. Source model/SKU label may be ambiguous; confirm product identity.'],
                              'publicationBlockers': V['publication_blockers'](product), 'missingTypeSpecs': V['missing_specs'](product, sub['id'])}
                    payload['drafts'].append({'record': product, 'review': review})
                    action.update(outcome='draft', draft_id=identifier, reason='Imported as unpublished draft; manufacturer verification, commercial terms and image rights pending')
        actions.append(action)
    validate_drafts(payload, catalogue, existing_ids)
    if input_hashes() != before:
        raise ValueError('Inputs changed during dry run')
    counts = collections.Counter(action['outcome'] for action in actions)
    return {'date': datetime.date.today().isoformat(), 'before': before, 'payload': payload, 'actions': actions,
            'summary': {'reviewed': len(actions), 'live_imported': 0, 'draft_imported': counts['draft'], 'duplicates': counts['duplicate'], 'skipped': counts['skipped'], 'total_staged_drafts': len(payload['drafts'])}}


def export_log(path, actions):
    with path.open('w', encoding='utf-8-sig', newline='') as handle:
        writer = csv.DictWriter(handle, fieldnames=['source_id', 'product', 'source_url', 'outcome', 'draft_id', 'reason'])
        writer.writeheader()
        writer.writerows(actions)


def apply_plan(path):
    plan = json.loads(path.read_text(encoding='utf-8'))
    if input_hashes() != plan['before']:
        raise ValueError('Dry-run inputs changed; rerun --dry-run')
    if plan != build_plan():
        raise ValueError('Dry-run plan is stale or edited; rerun --dry-run')
    run = ROOT / RUNS / datetime.datetime.now().strftime('%Y%m%d-%H%M%S-%f')
    run.mkdir(parents=True)
    for relative, expected in plan['before'].items():
        if expected is not None:
            backup = run / 'backup' / relative
            backup.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(ROOT / relative, backup)
            if digest(backup) != expected:
                raise ValueError('Backup hash mismatch')
    staged_hash = hashlib.sha256((json.dumps(plan['payload'], indent=2, ensure_ascii=False) + '\n').encode('utf-8')).hexdigest() if plan['summary']['draft_imported'] else plan['before'][str(STAGE)]
    manifest = {'before': plan['before'], 'stage_after': staged_hash, 'status': 'prepared'}
    write_json(run / 'manifest.json', manifest)
    export_log(run / 'import-log.csv', [action for action in plan['actions'] if action['outcome'] == 'draft'])
    export_log(run / 'rejection-log.csv', [action for action in plan['actions'] if action['outcome'] != 'draft'])
    write_json(run / 'summary.json', plan['summary'])
    if input_hashes() != plan['before']:
        raise ValueError('Inputs changed before commit')
    if plan['summary']['draft_imported']:
        write_json(ROOT / STAGE, plan['payload'])
    if digest(ROOT / STAGE) != staged_hash:
        raise ValueError('Committed draft hash mismatch; use guarded rollback')
    manifest.update(status='applied')
    write_json(run / 'manifest.json', manifest)
    if any(digest(ROOT / relative) != expected for relative, expected in plan['before'].items() if relative != str(STAGE)):
        raise ValueError('Protected live/input file changed')
    print(json.dumps(plan['summary'], indent=2))
    print(f'Backup/logs: {run.relative_to(ROOT)}')
    print(f'Rollback: python tools/import-macire.py --rollback {run.relative_to(ROOT)}')


def rollback(run):
    if run.resolve().parent != (ROOT / RUNS).resolve():
        raise ValueError('Rollback directory must be a direct child of docs/macire-import-runs')
    manifest = json.loads((run / 'manifest.json').read_text(encoding='utf-8'))
    if manifest['status'] not in ('prepared', 'applied') or set(manifest['before']) != {str(path) for path in INPUTS + [STAGE]}:
        raise ValueError('Invalid or already rolled-back manifest')
    if manifest['status'] == 'prepared' and input_hashes() == manifest['before']:
        manifest['status'] = 'rolled-back'
        write_json(run / 'manifest.json', manifest)
        print('Prepared run cancelled; no staged data had been committed.')
        return
    expected = dict(manifest['before'])
    expected[str(STAGE)] = manifest['stage_after']
    if input_hashes() != expected:
        raise ValueError('Files changed since import; rollback refused to protect later edits')
    original = manifest['before'][str(STAGE)]
    if original is None:
        (ROOT / STAGE).unlink(missing_ok=True)
    else:
        backup = run / 'backup' / STAGE
        if digest(backup) != original:
            raise ValueError('Backup hash mismatch')
        shutil.copy2(backup, ROOT / STAGE)
    if input_hashes() != manifest['before']:
        raise ValueError('Rollback hash verification failed')
    manifest['status'] = 'rolled-back'
    write_json(run / 'manifest.json', manifest)
    print('Rollback verified; only staged research restored. Live catalogue unchanged.')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    modes = parser.add_mutually_exclusive_group(required=True)
    modes.add_argument('--dry-run', action='store_true')
    modes.add_argument('--apply', type=pathlib.Path)
    modes.add_argument('--rollback', type=pathlib.Path)
    args = parser.parse_args()
    if args.dry_run:
        plan = build_plan()
        write_json(ROOT / PLAN, plan)
        print(json.dumps(plan['summary'], indent=2))
        print(f'Validated plan: {PLAN}; no catalogue or draft writes')
    elif args.apply:
        apply_plan(args.apply)
    else:
        rollback(args.rollback)


if __name__ == '__main__':
    main()