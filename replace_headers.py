import os, re

root = os.path.dirname(os.path.abspath(__file__))

# Extract header from index.html (between <header and <!-- /nav -->)
with open(os.path.join(root, 'index.html'), 'r', encoding='utf-8') as f:
    source = f.read()

header_match = re.search(r'(<header[\s\S]*?<!-- /nav -->)', source)
if not header_match:
    print("ERROR: Could not find header in index.html")
    exit(1)

new_header = header_match.group(1)
print(f"Extracted header: {len(new_header)} chars")

# All pages to update (skip index.html and lp/ pages which have custom layouts)
skip = {os.path.join(root, 'index.html')}

updated = []
skipped = []

for dirpath, dirnames, filenames in os.walk(root):
    # Skip git and claude dirs
    dirnames[:] = [d for d in dirnames if d not in {'.git', '.claude'}]
    for fname in filenames:
        if fname != 'index.html':
            continue
        fpath = os.path.join(dirpath, fname)
        if fpath in skip:
            continue

        with open(fpath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Find and replace existing header block (handles both closing markers)
        new_content, count = re.subn(
            r'<header[\s\S]*?(?:<!-- /nav -->|</header>)',
            new_header,
            content,
            count=1
        )

        if count == 0:
            skipped.append(fpath.replace(root, ''))
            continue

        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        updated.append(fpath.replace(root, ''))

print(f"\nUpdated ({len(updated)}):")
for p in sorted(updated): print(f"  {p}")

if skipped:
    print(f"\nNo header found — skipped ({len(skipped)}):")
    for p in sorted(skipped): print(f"  {p}")
