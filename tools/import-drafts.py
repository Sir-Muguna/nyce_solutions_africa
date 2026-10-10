#!/usr/bin/env python3
"""Import a product-research spreadsheet as unpublished draft records.

    python tools/import-drafts.py <workbook.xlsx>            # writes data/catalogue-drafts.json + docs/draft-import-report.csv
    python tools/import-drafts.py --promote                  # moves verified, complete drafts into assets/js/catalogue.js

Expected sheet columns: Category | Subcategory | Product Name | Brand (first sheet, header in row 1).
Only facts present in the sheet are stored. Everything else stays null and is listed as a publication blocker,
so nothing reaches the website until it is verified (see publication_blockers in validate-catalogue.py).
Only the Python standard library is used.
"""
import argparse, copy, csv, datetime, importlib.util, json, pathlib, re, sys, zipfile
import xml.etree.ElementTree as ET

ROOT = pathlib.Path(__file__).resolve().parent.parent
DRAFTS = ROOT / 'data' / 'catalogue-drafts.json'
REPORT = ROOT / 'docs' / 'draft-import-report.csv'
spec = importlib.util.spec_from_file_location('validate_catalogue', ROOT / 'tools' / 'validate-catalogue.py')
V = importlib.util.module_from_spec(spec); spec.loader.exec_module(V)

# Sheet labels that differ from the live taxonomy after the agreed merge/rename.
SUB_ALIASES = {('agriculture', 'agriculture irrigation'): 'agriculture-9', ('water', 'solar dc borehole pumps'): 'solar-7'}
# Content-only gaps that are expected in a draft and reported as blockers instead of structural errors.
DRAFT_TOLERATED = ('no applications', '"shortDescription" is empty', '"description" is empty')
NS = {'m': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main', 'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}


def read_rows(path):
    z = zipfile.ZipFile(path)
    shared = [''.join(t.text or '' for t in si.iter(f'{{{NS["m"]}}}t')) for si in ET.fromstring(z.read('xl/sharedStrings.xml')).findall('m:si', NS)] if 'xl/sharedStrings.xml' in z.namelist() else []
    wb, rels = ET.fromstring(z.read('xl/workbook.xml')), ET.fromstring(z.read('xl/_rels/workbook.xml.rels'))
    first = wb.find('m:sheets', NS)[0]
    target = {r.get('Id'): r.get('Target') for r in rels}[first.get(f'{{{NS["r"]}}}id')]
    sheet = ET.fromstring(z.read('xl/' + target.lstrip('/').replace('xl/', '')))
    rows = []
    for row in sheet.iter(f'{{{NS["m"]}}}row'):
        cells = {}
        for c in row.findall('m:c', NS):
            col = 0
            for ch in re.match(r'[A-Z]+', c.get('r')).group(): col = col * 26 + ord(ch) - 64
            v = c.find('m:v', NS)
            if c.get('t') == 's' and v is not None: val = shared[int(v.text)]
            elif c.get('t') == 'inlineStr': val = ''.join(x.text or '' for x in c.iter(f'{{{NS["m"]}}}t'))
            else: val = v.text if v is not None else ''
            cells[col - 1] = (val or '').strip()
        rows.append((int(row.get('r')), [cells.get(i, '') for i in range(4)]))
    return rows[1:]


def clean_name(name):
    name = re.sub(r'\?{2,}', '', name)
    name = re.sub(r'\s+', ' ', name).strip()
    return re.sub(r'[\s,|–-]+$', '', name).strip()


def identifiers(name):
    """Model-like tokens in a listing name, used only for duplicate detection (never published as facts)."""
    toks = re.findall(r'\b(?:[A-Z]{1,8}[-]?\d[\w.-]*|\d[A-Z]{2,}[\w-]*|\d{5,})\b', name)
    return sorted({re.sub(r'[^A-Z0-9]', '', t.upper()) for t in toks if len(re.sub(r'[^A-Z0-9]', '', t.upper())) >= 4})


def brand_key(brand):
    return V.norm(brand).split(' ')[0] if brand else ''


def name_tokens(name):
    return set(re.findall(r'[a-z0-9.]+', re.sub(r'(\d)\s+(kw|kva|kwh|hp|l|m)\b', r'\1\2', name.lower())))


def slug(name, taken):
    base = re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')[:60].strip('-') or 'product'
    sid, n = base, 2
    while sid in taken: sid, n = f'{base}-{n}', n + 1
    taken.add(sid); return sid


def import_workbook(path):
    data = V.load_catalogue()
    cats = {V.norm(c['name']): c for c in data['categories']}
    blank = V.template(data)['product']
    taken = {p['id'] for p in data['products']}
    existing = [(brand_key(p.get('brand')), re.sub(r'[^A-Z0-9]', '', (p.get('model') or '').upper()), name_tokens(p['name']), p['id']) for p in data['products']]
    drafts, skipped, by_key = [], [], {}
    for rownum, (cat_name, sub_name, raw_name, raw_brand) in read_rows(path):
        if not (cat_name or sub_name or raw_name):
            continue
        c = cats.get(V.norm(cat_name))
        if not c or not raw_name:
            skipped.append({'row': rownum, 'name': raw_name, 'reason': f'unknown category "{cat_name}"' if not c else 'no product name'}); continue
        sub_id = SUB_ALIASES.get((c['id'], V.norm(sub_name))) or next((s['id'] for s in c['subcategories'] if V.norm(s['name']) == V.norm(sub_name)), None)
        if not sub_id:
            skipped.append({'row': rownum, 'name': raw_name, 'reason': f'unknown subcategory "{sub_name}" in {c["id"]}'}); continue
        sub_cat = next(cc['id'] for cc in data['categories'] if any(s['id'] == sub_id for s in cc['subcategories']))
        name, brand = clean_name(raw_name), (None if V.norm(raw_brand) in ('', 'to be confirmed') else raw_brand.strip())
        ids = identifiers(name)
        same = [e[3] for e in existing if e[0] and e[0] == brand_key(brand) and e[1] and e[1] in ids]
        if same:
            skipped.append({'row': rownum, 'name': name, 'reason': f'already in catalogue as "{same[0]}"'}); continue
        key = (brand_key(brand), tuple(ids)) if ids else ('', V.norm(name))
        if key in by_key:
            d = by_key[key]; r = d['record']
            if sub_cat not in r['categories']: r['categories'].append(sub_cat)
            if sub_id not in r['subcategories']: r['subcategories'].append(sub_id)
            d['review']['sheetRows'].append(rownum); d['review']['notes'].append(f'row {rownum} merged as a duplicate listing ({sub_name})')
            continue
        r = copy.deepcopy(blank)
        r.update({'id': slug(name, taken), 'name': name, 'brand': brand, 'categories': [sub_cat], 'subcategories': [sub_id],
                  'image': {'asset': 'equipment', 'tile': c['imageTile']}, 'alt': f'Representative {c["name"].lower()} image',
                  'gallery': [{'type': 'photo', 'asset': 'equipment', 'tile': c['imageTile'], 'label': 'Representative image'}, {'type': 'spec', 'label': 'Specification overview'}],
                  'photoStatus': 'Product photo pending', 'evidenceStatus': 'illustrative', 'sourceClassification': None, 'verificationStatus': 'draft'})
        r.pop('sku', None); r['sku'] = None
        possible = [e[3] for e in existing if len(name_tokens(name) & e[2]) / max(1, len(name_tokens(name) | e[2])) >= 0.5]
        notes = [f'listed under "{sub_name}" in the sheet; that subcategory was merged into Solar DC Borehole Pumps (solar-7)'] if (c['id'], V.norm(sub_name)) == ('water', 'solar dc borehole pumps') else []
        if c['id'] != sub_cat: notes.append(f'sheet category "{cat_name}" kept as context only')
        if sub_id == 'agriculture-9' and re.search(r'(?i)diesel engine', name): notes.append('diesel engine listed under the former "Agriculture & Irrigation" subcategory (now Farm Irrigation Equipment); Agricultural Diesel Engines (agriculture-7) may fit better')
        d = {'record': r, 'review': {'sheetRows': [rownum], 'identifiersInName': ids, 'possibleDuplicateOf': possible, 'notes': notes}}
        by_key[key] = d; drafts.append(d)
    for d in drafts:
        errs = [e for e in V.schema_errors(d['record'], {c['id']: c for c in data['categories']}, {s['id']: c['id'] for c in data['categories'] for s in c['subcategories']}, taken) if e not in DRAFT_TOLERATED]
        d['review']['structuralErrors'] = errs
        d['review']['publicationBlockers'] = V.publication_blockers(d['record'])
    return {'source': pathlib.Path(path).name, 'imported': datetime.date.today().isoformat(), 'status': 'drafts - not published',
            'drafts': drafts, 'skipped': skipped}


def write_outputs(result):
    DRAFTS.parent.mkdir(parents=True, exist_ok=True)
    DRAFTS.write_text(json.dumps(result, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    with REPORT.open('w', newline='', encoding='utf-8') as fh:
        w = csv.writer(fh)
        w.writerow(['sheet_rows', 'draft_id', 'status', 'category', 'subcategory', 'name', 'brand', 'identifiers_in_name', 'possible_duplicate_of', 'structural_errors', 'publication_blockers', 'notes'])
        for d in result['drafts']:
            r, rv = d['record'], d['review']
            w.writerow([' '.join(map(str, rv['sheetRows'])), r['id'], 'draft' if rv['publicationBlockers'] else 'ready', ' '.join(r['categories']), ' '.join(r['subcategories']), r['name'], r['brand'] or '',
                        ' '.join(rv['identifiersInName']), ' '.join(rv['possibleDuplicateOf']), '; '.join(rv['structuralErrors']), '; '.join(rv['publicationBlockers']), '; '.join(rv['notes'])])
        for s in result['skipped']:
            w.writerow([s['row'], '', 'skipped', '', '', s['name'], '', '', '', '', '', s['reason']])


def promote():
    """Move drafts with no blockers and no structural errors into catalogue.js; everything else stays a draft."""
    result = json.loads(DRAFTS.read_text(encoding='utf-8'))
    data = V.load_catalogue()
    ready = [d for d in result['drafts'] if not V.publication_blockers(d['record']) and not d['review'].get('structuralErrors')]
    if not ready:
        print('no draft is verified and complete; catalogue.js unchanged'); return 0
    data['products'].extend(d['record'] for d in ready)
    text = V.CATALOGUE.read_text(encoding='utf-8')
    head = text[:text.index('{', text.index('window.NYCE_CATALOGUE'))]
    V.CATALOGUE.write_text(head + json.dumps(data, indent=2, ensure_ascii=False) + ';\n', encoding='utf-8')
    result['drafts'] = [d for d in result['drafts'] if d not in ready]
    DRAFTS.write_text(json.dumps(result, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    print(f'promoted {len(ready)} product(s); run tools/validate-catalogue.py and the acceptance tests'); return 0


def main():
    ap = argparse.ArgumentParser(); ap.add_argument('workbook', nargs='?'); ap.add_argument('--promote', action='store_true')
    a = ap.parse_args()
    if a.promote: return promote()
    if not a.workbook: ap.error('workbook path required')
    result = import_workbook(a.workbook)
    write_outputs(result)
    ds = result['drafts']
    print(f"{len(ds)} draft(s), {len(result['skipped'])} skipped, {sum(1 for d in ds if not d['review']['publicationBlockers'])} ready to publish")
    print(f"structural errors: {sum(len(d['review']['structuralErrors']) for d in ds)}; merged duplicate listings: {sum(len(d['review']['sheetRows']) - 1 for d in ds)}; possible duplicates of live products: {sum(1 for d in ds if d['review']['possibleDuplicateOf'])}")
    for s in result['skipped']: print(f"  skipped row {s['row']}: {s['name'][:70]} - {s['reason']}")
    print(f'wrote {DRAFTS.relative_to(ROOT)} and {REPORT.relative_to(ROOT)}')
    return 1 if any(d['review']['structuralErrors'] for d in ds) else 0


if __name__ == '__main__':
    sys.exit(main())
