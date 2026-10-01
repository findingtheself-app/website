from html.parser import HTMLParser
from pathlib import Path
import re, struct, json,hashlib, xml.etree.ElementTree as ET
root = Path(__file__).resolve().parent.parent
class Page(HTMLParser):
    def __init__(self): super().__init__(); self.tags=[]
    def handle_starttag(self, tag, attrs): self.tags.append((tag,dict(attrs)))
for file in root.glob('*.html'):
    s=file.read_text(); p=Page(); p.feed(s)
    assert sum(tag=='h1' for tag,attrs in p.tags)==1, file
    assert ('html',{'lang':'en-GB'}) in p.tags, file
    assert any(tag=='main' and attrs.get('id')=='main' for tag,attrs in p.tags), file
    assert any(tag=='meta' and attrs.get('name')=='robots' and 'noindex' in attrs.get('content','') for tag,attrs in p.tags), file
    assert any(tag=='meta' and attrs.get('http-equiv')=='Content-Security-Policy' and "form-action 'self'" in attrs.get('content','') for tag,attrs in p.tags), file
    for tag,attrs in p.tags:
        assert tag!='script' and 'style' not in attrs, file
        if tag=='svg': assert attrs.get('aria-hidden')=='true', file
        if tag in ('link','img'):
            resource=attrs.get('src') or attrs.get('href','')
            if attrs.get('rel')=='canonical': continue
            assert not resource.startswith('http'),(file,resource)
            assert (root/resource).is_file(),(file,resource)
        if tag=='a':
            href=attrs.get('href','')
            if href.startswith('https://'): continue
            dest,_,anchor=href.partition('#'); target=root/(dest or file.name)
            assert target.is_file(),(file,href)
            if anchor: assert f'id="{anchor}"' in target.read_text(),(file,href)
assert (root/'style.css').stat().st_size < 17500
palette={'F8F9F5','202923','60334F','596159','D9DED5','E8F48C','354C3E','47223B','FDBA88','FFF0DF','8A5906','F2E6CF','2F7D55','D8EADF','6A4FC0','E4DEF5'}
for color in re.findall(r'#([0-9a-fA-F]{6})(?:[0-9a-fA-F]{2})?(?![0-9a-fA-F])',(root/'style.css').read_text()): assert color.upper() in palette,color
assert 'prefers-reduced-motion' in (root/'style.css').read_text()
assert '<fieldset disabled>' in (root/'index.html').read_text()
assert "'enabled' => false" in (root/'config/signup-config.example.php').read_text()
assert 'Disallow: /' in (root/'robots.txt').read_text()
ET.parse(root/'sitemap.xml')
assert struct.unpack('>II',(root/'assets/og.png').read_bytes()[16:24])==(1200,630)
print('PASS: headings, landmarks, locale, noindex, CSP, local assets, links, decorative SVG, brand colours, CSS budget, disabled form/config, robots, sitemap, OG dimensions')

# Brand assets must retain the supplied glyph outlines, not live font text.
ns={'s':'http://www.w3.org/2000/svg'}
paths=[]
for file in ('badge.svg','badge-slant.svg','favicon.svg'):
    node=ET.parse(root/'assets'/file).getroot()
    assert not node.findall('.//s:text',ns) and not node.findall('.//s:script',ns) and not node.findall('.//s:filter',ns)
    glyph=node.find('.//s:path[@fill="#FFFFFF"]',ns)
    assert glyph is not None and glyph.attrib['fill']=='#FFFFFF'
    paths.append(glyph.attrib)
    square=node.find('.//s:path[@fill="#60334F"]',ns)
    assert square is not None and 'A26 26' in square.attrib['d']
    assert not node.findall('.//s:rect',ns)
assert paths[0]==paths[1]==paths[2]
assert paths[0]['transform']=='translate(34.43,353.12) scale(0.132684,-0.132684)'
assert hashlib.sha256(paths[0]['d'].encode()).hexdigest()=='47f6b0fa9636dabefaf88b5558410622958f2f56783074c0d77edea549e77a55'
for name,size in [('badge-512.png',512),('badge-slant-512.png',512),('favicon.png',32),('touch-icon.png',180)]:
    assert struct.unpack('>II',(root/'assets'/name).read_bytes()[16:24])==(size,size)
assert json.loads((root/'config/site.json').read_text())['CANONICAL_ORIGIN'] is None
for p in root.glob('*.html'):
    s=p.read_text()
    assert 'example.invalid' not in s
    assert not re.search(r'[\u2190-\u21ff\u27f0-\u27ff\u2900-\u297f]|&(?:nearr|rarr|darr|harr);',s)
    assert '<div class="draft"' not in s and 'preview' not in s.lower()
    assert '<img src="assets/badge-slant.svg" alt=".self" width="44" height="44">' in s
    assert '© 2026 findingtheself' in s
assert 'AES-256-GCM' in (root/'index.html').read_text() and 'Argon2id' in (root/'index.html').read_text()
assert not (root/'review').exists()
print('PASS: exact outlined badge paths, SVG safety, PNG sizes, unified origin constant, arrows/status removed, badge usage, privacy wording, review files absent')

for p in root.rglob("*"):
    if p.is_file() and ".git" not in p.parts and p.suffix in {".html",".php",".md",".svg"}:
        assert not re.search(r"\.self",p.read_text(),re.I) or not re.search(r"\.self",p.read_text().replace(".self",""),re.I),p
assert "Words hidden" not in (root/"index.html").read_text()
assert (root/"index.html").read_text().count("<li><p>")==4

outline=ET.parse(root/"assets/badge-slant-outline.svg").getroot()
assert outline.find('.//s:path[@fill="#FFFFFF"]',ns).attrib==paths[0]
assert outline.find(".//s:rect",ns).attrib["stroke"]=="#FFF0DF"
