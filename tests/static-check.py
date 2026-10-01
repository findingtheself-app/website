from html.parser import HTMLParser
from pathlib import Path
import re, struct, xml.etree.ElementTree as ET
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
assert (root/'style.css').stat().st_size < 16000
palette={'F8F9F5','202923','60334F','596159','D9DED5','E8F48C','354C3E','47223B','FDBA88','FFF0DF','8A5906','F2E6CF','2F7D55','D8EADF','6A4FC0','E4DEF5'}
for color in re.findall(r'#([0-9a-fA-F]{6})(?:[0-9a-fA-F]{2})?(?![0-9a-fA-F])',(root/'style.css').read_text()): assert color.upper() in palette,color
assert 'prefers-reduced-motion' in (root/'style.css').read_text()
assert '<fieldset disabled>' in (root/'index.html').read_text()
assert "'enabled' => false" in (root/'config/signup-config.example.php').read_text()
assert 'Disallow: /' in (root/'robots.txt').read_text()
ET.parse(root/'sitemap.xml')
assert struct.unpack('>II',(root/'assets/og.png').read_bytes()[16:24])==(1200,630)
print('PASS: headings, landmarks, locale, noindex, CSP, local assets, links, decorative SVG, brand colours, CSS budget, disabled form/config, robots, sitemap, OG dimensions')
