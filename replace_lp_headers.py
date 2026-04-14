import os, re

root = os.path.dirname(os.path.abspath(__file__))

# Minimal centered-logo header for LP / thank-you pages
# Logo 15% bigger than standard 40px → 46px
MINIMAL_HEADER = '''\
<header style="position:fixed;top:0;left:0;right:0;height:72px;z-index:100;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,rgba(7,45,81,.88) 0%,rgba(0,21,42,.82) 50%,rgba(28,58,67,.78) 100%);border-bottom:1px solid rgba(255,159,10,.12);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px)">
  <a href="/web/" aria-label="Cardone Capital home">
    <img src="/web/assets/images/logocc.png" alt="Cardone Capital" style="height:46px;width:auto;display:block;">
  </a>
</header>
<!-- /nav -->'''

LP_PAGES = [
    'lp/fund29-bitcoin/index.html',
    'lp/fund30-cashonly/index.html',
    'lp/ira-401k/index.html',
    'lp/investor-call/index.html',
    'lp/es/index.html',
]

THANKYOU_PAGE = 'lp/thank-you-call/index.html'

for rel in LP_PAGES:
    fpath = os.path.join(root, rel)
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace full header (including any extra <!-- /nav --> duplicates)
    new_content, n = re.subn(
        r'<header[\s\S]*?</header>(\s*<!-- /nav -->)+',
        MINIMAL_HEADER,
        content, count=1
    )
    if n:
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"  replaced header: {rel}")
    else:
        print(f"  WARNING – no header found: {rel}")

# thank-you-call has no header – insert one after <body>
fpath = os.path.join(root, THANKYOU_PAGE)
with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()

if '<header' not in content:
    new_content = content.replace(
        '<body>',
        '<body>\n' + MINIMAL_HEADER,
        1
    )
    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"  inserted header: {THANKYOU_PAGE}")
else:
    print(f"  already has header: {THANKYOU_PAGE}")
