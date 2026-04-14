import os, re

root = os.path.dirname(os.path.abspath(__file__))

# ─── 1. Read index.html (the source of truth) ─────────────────────────────
with open(os.path.join(root, 'index.html'), 'r', encoding='utf-8') as f:
    source = f.read()

# ─── 2. Extract header HTML (from <header ... to <!-- /nav -->) ────────────
header_match = re.search(r'(<header[\s\S]*?<!-- /nav -->)', source)
if not header_match:
    print("ERROR: Could not find header block in index.html")
    exit(1)
new_header = header_match.group(1)
print(f"Header HTML: {len(new_header)} chars")

# ─── 3. Extract nav CSS from index.html ───────────────────────────────────
# Desktop nav: .cc-nav through .ham-bar{...}
nav_desktop = re.search(r'(    \.cc-nav\{[\s\S]*?    \.ham-bar\{[^}]*\})', source)
# Mobile nav: /* Mobile hamburger */ comment through .mob-divider{...}
nav_mobile = re.search(r'(    /\* [─]+ Mobile hamburger[\s\S]*?    \.mob-divider\{[^}]*\})', source)

if not nav_desktop or not nav_mobile:
    print("ERROR: Could not extract nav CSS from index.html")
    exit(1)

new_nav_css = (
    "/* nav */\n"
    + nav_desktop.group(1) + "\n\n"
    + nav_mobile.group(1) + "\n\n"
)
print(f"Nav CSS: {len(new_nav_css)} chars")

# ─── 4. Walk all pages ─────────────────────────────────────────────────────
skip = {os.path.join(root, 'index.html')}
updated = []
skipped = []

for dirpath, dirnames, filenames in os.walk(root):
    dirnames[:] = [d for d in dirnames if d not in {'.git', '.claude'}]
    for fname in filenames:
        if fname != 'index.html':
            continue
        fpath = os.path.join(dirpath, fname)
        if fpath in skip:
            continue

        with open(fpath, 'r', encoding='utf-8') as f:
            content = f.read()

        changed = False

        # ── a) Replace header HTML ──────────────────────────────────────────
        content, n = re.subn(
            r'<header[\s\S]*?(?:<!-- /nav -->|</header>)',
            new_header, content, count=1
        )
        if n: changed = True

        # ── b) Replace nav CSS block (/* nav */ ... up to /* footer */) ─────
        content, n = re.subn(
            r'/\* nav \*/[\s\S]*?(?=/\* footer \*/)',
            new_nav_css, content, count=1
        )
        if n: changed = True

        # ── c) Add missing transition vars (--t-fast etc.) if not declared ──
        if not re.search(r'--t-fast\s*:', content):
            content, n = re.subn(
                r'(--tf\s*:\s*150ms ease;)',
                r'\1--t-fast:150ms ease;--t-base:250ms ease;--t-slow:400ms ease;',
                content, count=1
            )
            if n: changed = True

        if changed:
            with open(fpath, 'w', encoding='utf-8') as f:
                f.write(content)
            updated.append(fpath.replace(root, ''))
        else:
            skipped.append(fpath.replace(root, ''))

print(f"\nUpdated ({len(updated)}):")
for p in sorted(updated): print(f"  {p}")

if skipped:
    print(f"\nSkipped ({len(skipped)}):")
    for p in sorted(skipped): print(f"  {p}")
