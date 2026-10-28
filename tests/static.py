"""Check all shipped HTML assets, internal links, fragments and translation keys."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import json
import subprocess

ROOT = Path(__file__).resolve().parents[1]
class Page(HTMLParser):
    def __init__(self, file):
        super().__init__()
        self.file, self.links, self.ids, self.keys = file, [], set(), []
        self.feed(file.read_text())
    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if 'id' in attrs:
            self.ids.add(attrs['id'])
        if 'data-i18n' in attrs:
            self.keys.append(attrs['data-i18n'])
        for attr in ['href', 'src']:
            if attrs.get(attr):
                self.links.append(attrs[attr])

pages = {p.resolve(): Page(p) for p in ROOT.rglob('*.html') if 'node_modules' not in p.parts}
failures = []
for file, page in pages.items():
    for link in page.links:
        url = urlsplit(link)
        if url.scheme or url.netloc:
            continue
        target = file if not url.path else ROOT / unquote(url.path).lstrip('/') if url.path.startswith('/') else file.parent / unquote(url.path)
        target = target.resolve()
        if target.is_dir():
            target /= 'index.html'
        if not target.is_file():
            failures.append(f'{file.relative_to(ROOT)}: missing {link}')
        elif url.fragment and target in pages and unquote(url.fragment) not in pages[target].ids:
            failures.append(f'{file.relative_to(ROOT)}: missing fragment {link}')
copy = json.loads(subprocess.check_output(['node', '-e', "global.window={};require('./assets/site-20261028-ux/content.js');console.log(JSON.stringify(window.DANHAUSCH_COPY));"], cwd=ROOT))
for page in pages.values():
    for key in page.keys:
        if key not in copy or not all(copy[key].get(lang) for lang in ['pt', 'en']):
            failures.append(f'{page.file.relative_to(ROOT)}: missing translation {key}')
assert not failures, '\n'.join(failures)
print(f'PASS: {len(pages)} HTML pages, local assets, fragments and translation keys')

# Every meaningful text node in the catalog must have an English counterpart.
catalog_copy = json.loads(subprocess.check_output(['node', '-e', "global.window={};require('./assets/site-20261028-ux/catalog-copy.js');console.log(JSON.stringify(window.DANHAUSCH_CATALOG_COPY));"], cwd=ROOT))
class CatalogText(HTMLParser):
    def __init__(self):
        super().__init__()
        self.inside = False
        self.missing = []
    def handle_starttag(self, tag, attributes):
        if tag == 'main':
            self.inside = True
    def handle_endtag(self, tag):
        if tag == 'main':
            self.inside = False
    def handle_data(self, text):
        value = text.strip()
        if self.inside and any(c.isalpha() for c in value) and value not in catalog_copy and value not in ['BA Pro', 'AgPlace', 'Fractional Head of AI']:
            self.missing.append(value)
for name in ['produtos/index.html', 'profissionais/index.html', 'empresas/index.html', 'landing-pages/ba.html']:
    parser = CatalogText()
    parser.feed((ROOT/name).read_text())
    assert not parser.missing, f'{name}: missing English copy {parser.missing}'
print('PASS: complete English copy for product, professional, business and BA workshop pages')
