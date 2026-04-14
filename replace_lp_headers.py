import os, re

root = os.path.dirname(os.path.abspath(__file__))

# Logo to embed inside the hero — 10% bigger than standard 40px → 44px
LOGO_HTML = (
    '<div style="text-align:center;padding-top:36px;padding-bottom:28px">\n'
    '      <a href="/web/" aria-label="Cardone Capital home">\n'
    '        <img src="/web/assets/images/logocc.png" alt="Cardone Capital"'
    ' style="height:44px;width:auto;display:inline-block;">\n'
    '      </a>\n'
    '    </div>\n\n    '
)

LP_PAGES = [
    'lp/fund29-bitcoin/index.html',
    'lp/fund30-cashonly/index.html',
    'lp/ira-401k/index.html',
    'lp/investor-call/index.html',
    'lp/es/index.html',
]

THANKYOU_PAGE = 'lp/thank-you-call/index.html'

# ── 1. Fix the 5 LP pages ────────────────────────────────────────────────────
for rel in LP_PAGES:
    fpath = os.path.join(root, rel)
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()

    # a) Remove the fixed <header> bar (including any duplicate <!-- /nav -->)
    content, n1 = re.subn(
        r'<header style="position:fixed[\s\S]*?</header>\s*(\n<!-- /nav -->)+',
        '', content, count=1
    )

    # b) Strip padding-top from the hero section (was 90px or 96px to clear fixed nav)
    content, n2 = re.subn(
        r'(style="[^"]*?)padding-top:\s*\d+px;',
        r'\1padding-top:0;',
        content, count=1   # only first section (the hero)
    )

    # c) Insert the logo as the first child of the hero content wrapper
    #    The wrapper is always: <div class="relative z-10 max-w-5xl mx-auto px-5 ...
    content, n3 = re.subn(
        r'(<div class="relative z-10 max-w-5xl mx-auto[^"]*text-center">\s*\n)',
        r'\1    ' + LOGO_HTML,
        content, count=1
    )

    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"  {rel}: header_removed={n1} padding_fixed={n2} logo_inserted={n3}")

# ── 2. Fix thank-you-call ────────────────────────────────────────────────────
fpath = os.path.join(root, THANKYOU_PAGE)
with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()

# a) Remove the fixed <header> bar
content, n1 = re.subn(
    r'<header style="position:fixed[\s\S]*?</header>\s*\n<!-- /nav -->\n?',
    '', content, count=1
)

# b) Replace the existing "TOP BRAND BAR" div with a simple centered logo
content, n2 = re.subn(
    r'<!-- ── TOP BRAND BAR[\s\S]*?</div>\s*\n',
    (
        '<div style="text-align:center;padding-top:36px;padding-bottom:24px" class="z1">\n'
        '  <a href="/web/" aria-label="Cardone Capital home">\n'
        '    <img src="/web/assets/images/logocc.png" alt="Cardone Capital"'
        ' style="height:44px;width:auto;display:inline-block;">\n'
        '  </a>\n'
        '</div>\n\n'
    ),
    content, count=1
)

with open(fpath, 'w', encoding='utf-8') as f:
    f.write(content)
print(f"  {THANKYOU_PAGE}: header_removed={n1} brand_bar_replaced={n2}")
