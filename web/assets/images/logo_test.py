import re, pathlib
sample = pathlib.Path('academy/real-estate-101/index.html').read_text(encoding='utf-8')
pattern = re.compile(r'(?s)(<a href="/"[^>]*>)(?:(?!</a>).)*?(?:<div class="cc-(?:lm|logo-mark)">).*?</a>')
m = pattern.search(sample)
print('match found', bool(m))
if m:
    print('matched text:')
    print(m.group(0)[:300])
    print('----')
    print(pattern.sub(r'\1<img src="/img/cc-logo-white.svg" alt="Cardone Capital" width="148" height="32" loading="lazy" decoding="async"></a>', sample)[:400])
