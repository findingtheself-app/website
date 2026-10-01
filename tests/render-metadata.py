"""Render absolute metadata from the single approved release-origin constant."""
from pathlib import Path
from urllib.parse import urlparse
import json,re,html,xml.etree.ElementTree as ET
root=Path(__file__).resolve().parent.parent
origin=json.loads((root/'config/site.json').read_text())['CANONICAL_ORIGIN']
if origin is not None:
    parsed=urlparse(origin)
    if parsed.scheme!='https' or not parsed.hostname or parsed.username or parsed.password or parsed.query or parsed.fragment or parsed.path not in ('','/'):
        raise ValueError('CANONICAL_ORIGIN must be an approved HTTPS origin, without a path or credentials')
    origin=origin.rstrip('/')
for p in root.glob('*.html'):
    tags='<!-- [PLACEHOLDER] CANONICAL_ORIGIN awaits the domain decision. -->'
    if origin:
        url=html.escape(origin+'/'+('' if p.name=='index.html' else p.name),quote=True)
        image=html.escape(origin+'/assets/og.png',quote=True)
        tags=f'<link rel="canonical" href="{url}"><meta property="og:url" content="{url}"><meta property="og:image" content="{image}"><meta name="twitter:image" content="{image}">'
    s,count=re.subn(r'<!-- BEGIN CANONICAL_ORIGIN -->.*?<!-- END CANONICAL_ORIGIN -->','<!-- BEGIN CANONICAL_ORIGIN -->'+tags+'<!-- END CANONICAL_ORIGIN -->',p.read_text(),flags=re.S)
    assert count==1,p
    p.write_text(s)
ns='http://www.sitemaps.org/schemas/sitemap/0.9'
ET.register_namespace('',ns)
node=ET.Element('{'+ns+'}urlset')
if origin:
    for path in ('/','/privacy.html'):
        url=ET.SubElement(node,'{'+ns+'}url');ET.SubElement(url,'{'+ns+'}loc').text=origin+path
comment='<!-- [PLACEHOLDER] CANONICAL_ORIGIN is unset. Render URLs only after the domain decision. -->\n' if not origin else ''
(root/'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n'+comment+ET.tostring(node,encoding='unicode')+'\n')
print('Absolute metadata withheld: CANONICAL_ORIGIN unset' if not origin else 'Absolute metadata rendered from CANONICAL_ORIGIN')
