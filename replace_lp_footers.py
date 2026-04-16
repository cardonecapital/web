import os, re

root = os.path.dirname(os.path.abspath(__file__))

# ── Helper: build the new centered minimal footer ──────────────────────────────
def make_footer(logo_file, disclosure_p, links_html, copyright_text):
    return (
        f'  <div style="background:#00152a;border-top:1px solid #1c3a43;padding:28px 20px;text-align:center">\n'
        f'    <div class="max-w-3xl mx-auto">\n'
        f'      <a href="/web/" aria-label="Cardone Capital">'
        f'<img src="/web/assets/images/{logo_file}" alt="Cardone Capital"'
        f' style="height:31px;width:auto;display:inline-block;margin-bottom:16px"></a>\n'
        f'{disclosure_p}\n'
        f'      <div style="display:flex;gap:16px;justify-content:center;margin-bottom:6px">{links_html}</div>\n'
        f'      <p style="font-family:\'Barlow\',sans-serif;font-size:10px;color:#5C7A8A;margin:0">'
        f'{copyright_text}</p>\n'
        f'    </div>\n'
        f'  </div>\n'
    )

LINK_STYLE = "font-family:'Barlow',sans-serif;font-size:10px;color:#5C7A8A;text-decoration:none"

# ── Page definitions ───────────────────────────────────────────────────────────
# Each entry: (rel_path, logo, disclosure_html, links_html, copyright)

PAGES = [
    (
        'lp/fund29-bitcoin/index.html',
        'logoccbtc.png',
        (
            "      <p style=\"font-family:'Barlow',sans-serif;font-size:10px;line-height:1.7;"
            "color:#5C7A8A;margin:0 0 8px\">"
            "<strong style=\"color:#BEC5D4\">Disclosures:</strong> "
            "Investments offered by Cardone Capital, LLC are available exclusively to accredited investors under Regulation D. "
            "Past performance does not guarantee future results. All investments involve risk including potential loss of principal. "
            "Fund 29 Bitcoin allocation involves digital asset volatility, regulatory, and custody risks. "
            "This page does not constitute an offer to sell securities. Consult your own legal, tax, and financial advisors.</p>"
        ),
        (
            f'<a href="/web/privacy-policy/" style="{LINK_STYLE}">Privacy Policy</a>'
            f'<a href="/web/terms-and-conditions/" style="{LINK_STYLE}">Terms</a>'
            f'<a href="/web/disclosures/" style="{LINK_STYLE}">Disclosures</a>'
        ),
        '© 2026 Cardone Capital, LLC. All rights reserved.',
    ),
    (
        'lp/fund30-cashonly/index.html',
        'logocc.png',
        (
            "      <p style=\"font-family:'Barlow',sans-serif;font-size:10px;line-height:1.7;"
            "color:#5C7A8A;margin:0 0 8px\">"
            "<strong style=\"color:#BEC5D4\">Disclosures:</strong> "
            "Investments offered by Cardone Capital, LLC are available exclusively to accredited investors under Regulation D. "
            "Past performance does not guarantee future results. All investments involve risk including potential loss of principal. "
            "Distribution amounts are not guaranteed and depend on fund operating results. "
            "This page does not constitute an offer to sell securities. Consult your own legal, tax, and financial advisors.</p>"
        ),
        (
            f'<a href="/web/privacy-policy/" style="{LINK_STYLE}">Privacy Policy</a>'
            f'<a href="/web/terms-and-conditions/" style="{LINK_STYLE}">Terms</a>'
            f'<a href="/web/disclosures/" style="{LINK_STYLE}">Disclosures</a>'
        ),
        '© 2026 Cardone Capital, LLC. All rights reserved.',
    ),
    (
        'lp/ira-401k/index.html',
        'logocc.png',
        (
            "      <p style=\"font-family:'Barlow',sans-serif;font-size:10px;line-height:1.7;"
            "color:#5C7A8A;margin:0 0 8px\">"
            "<strong style=\"color:#BEC5D4\">Important Disclosures:</strong> "
            "Investments offered by Cardone Capital, LLC are available exclusively to accredited investors under Regulation D. "
            "Past performance does not guarantee future results. All investments involve risk including potential loss of principal. "
            "IRA and 401k investing involves specific tax rules \u2014 consult a qualified tax professional before making investment or rollover decisions. "
            "This page does not constitute tax, legal, or investment advice. Cardone Capital is not a registered investment advisor.</p>"
        ),
        (
            f'<a href="/web/privacy-policy/" style="{LINK_STYLE}">Privacy Policy</a>'
            f'<a href="/web/terms-and-conditions/" style="{LINK_STYLE}">Terms</a>'
            f'<a href="/web/disclosures/" style="{LINK_STYLE}">Disclosures</a>'
        ),
        '© 2026 Cardone Capital, LLC. All rights reserved.',
    ),
    (
        'lp/investor-call/index.html',
        'logocc.png',
        (
            "      <p style=\"font-family:'Barlow',sans-serif;font-size:10px;line-height:1.7;"
            "color:#5C7A8A;margin:0 0 8px\">"
            "<strong style=\"color:#BEC5D4\">Important Disclosures:</strong> "
            "Investments offered by Cardone Capital, LLC are available exclusively to accredited investors as defined by Rule 501 of Regulation D under the Securities Act of 1933. "
            "Past performance is not indicative of future results. All investments involve risk, including the potential loss of principal. "
            "This page is for informational purposes only and does not constitute an offer or solicitation to buy or sell securities in any jurisdiction. "
            "Cardone Capital is not a registered investment advisor or broker-dealer. Prospective investors should consult with their own legal, tax, and financial advisors. "
            "Fund 29 Bitcoin allocation involves additional risks including digital asset volatility, regulatory risk, and custody risk.</p>"
        ),
        (
            f'<a href="/web/privacy-policy/" style="{LINK_STYLE}">Privacy Policy</a>'
            f'<a href="/web/terms-and-conditions/" style="{LINK_STYLE}">Terms</a>'
            f'<a href="/web/disclosures/" style="{LINK_STYLE}">Disclosures</a>'
        ),
        '© 2026 Cardone Capital, LLC. All rights reserved.',
    ),
    (
        'lp/es/index.html',
        'logocc.png',
        (
            "      <p style=\"font-family:'Barlow',sans-serif;font-size:10px;line-height:1.7;"
            "color:#5C7A8A;margin:0 0 8px\">"
            "<strong style=\"color:#BEC5D4\">Divulgaciones Importantes:</strong> "
            "Las inversiones ofrecidas por Cardone Capital, LLC est\u00e1n disponibles exclusivamente para inversores acreditados seg\u00fan lo define la Regla 501 del Reglamento D de la Ley de Valores de 1933. "
            "El rendimiento pasado no garantiza resultados futuros. Todas las inversiones conllevan riesgos, incluida la posible p\u00e9rdida del capital principal. "
            "El Fondo 29 incluye una asignaci\u00f3n en Bitcoin que conlleva riesgos adicionales, incluyendo volatilidad de activos digitales, riesgos regulatorios y de custodia. "
            "Esta p\u00e1gina es solo para fines informativos y no constituye una oferta de venta de valores en ninguna jurisdicci\u00f3n donde dicha oferta sea ilegal. "
            "Cardone Capital no es un asesor de inversiones registrado ni un corredor de bolsa. "
            "Los inversores potenciales deben consultar con sus propios asesores legales, fiscales y financieros antes de tomar cualquier decisi\u00f3n de inversi\u00f3n.</p>"
        ),
        (
            f'<a href="/web/privacy-policy/" style="{LINK_STYLE}">Pol\u00edtica de Privacidad</a>'
            f'<a href="/web/terms-and-conditions/" style="{LINK_STYLE}">T\u00e9rminos y Condiciones</a>'
            f'<a href="/web/disclosures/" style="{LINK_STYLE}">Divulgaciones</a>'
        ),
        '© 2026 Cardone Capital, LLC. Todos los derechos reservados.',
    ),
]

# ── 1. Fix the 5 LP pages ──────────────────────────────────────────────────────
for (rel, logo, disclosure_p, links_html, copyright) in PAGES:
    fpath = os.path.join(root, rel)
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()

    new_footer = make_footer(logo, disclosure_p, links_html, copyright)

    # Match the comment + the entire div block (handles variations in comment text)
    pattern = (
        r'[ \t]*<!--[^\n]*(?:Minimal legal|MINIMAL LEGAL|Pie de página mínimo)[^\n]*-->\n'
        r'[ \t]*<div style="background:#00152a[\s\S]*?</div>\n'
    )
    content_new, n = re.subn(pattern, new_footer, content, count=1)

    if n == 0:
        print(f"  WARNING: no footer match in {rel}")
    else:
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(content_new)
        print(f"  {rel}: footer replaced (n={n})")


# ── 2. Fix thank-you-call ──────────────────────────────────────────────────────
THANKYOU = 'lp/thank-you-call/index.html'
fpath = os.path.join(root, THANKYOU)
with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()

# Disclosure text from its existing legal section
ty_disclosure = (
    "      <p style=\"font-family:var(--fb);font-size:10px;line-height:1.4;"
    "color:rgba(255,255,255,.18);margin:0 0 8px;text-align:justify\">"
    "Investing involves risk, including loss of principal. Past performance does not guarantee or indicate future results. "
    "Any historical returns, expected returns, or probability projections may not reflect actual future performance. "
    "While the data we use from third parties is believed to be reliable, we cannot ensure the accuracy or completeness "
    "of data provided by investors or other third parties. Neither Cardone Capital nor any of its affiliates provide "
    "tax advice and do not represent in any manner that the outcomes described herein will result in any particular "
    "tax consequence. Offers to sell, or solicitations of offers to buy, any security can only be made through "
    "official offering documents that contain important information about investment objectives, risks, fees and expenses. "
    "Bitcoin is highly speculative and its actual performance may not match investor expectation. Prospective investors "
    "should consult with a tax, legal and/or financial adviser before making any investment decision. "
    "For additional important risks, disclosures, and information, please visit "
    '<a href="https://cardonecapital.com/disclosures/" target="_blank" rel="noopener noreferrer"'
    ' style="color:inherit;text-decoration:underline;text-underline-offset:2px">'
    "https://cardonecapital.com/disclosures/</a></p>"
)

TY_LINK_STYLE = "font-family:var(--fb);font-size:11px;color:rgba(255,255,255,.22);padding:3px 14px;text-decoration:none"
ty_links = (
    f'<a href="/web/privacy-policy/" style="{TY_LINK_STYLE}" onmouseover="this.style.color=\'rgba(255,255,255,.55)\'" onmouseout="this.style.color=\'rgba(255,255,255,.22)\'">Privacy Policy</a>'
    f'<span style="color:rgba(28,58,67,.8)">|</span>'
    f'<a href="/web/terms-and-conditions/" style="{TY_LINK_STYLE}" onmouseover="this.style.color=\'rgba(255,255,255,.55)\'" onmouseout="this.style.color=\'rgba(255,255,255,.22)\'">Terms &amp; Conditions</a>'
    f'<span style="color:rgba(28,58,67,.8)">|</span>'
    f'<a href="/web/disclosures/" style="{TY_LINK_STYLE}" onmouseover="this.style.color=\'rgba(255,255,255,.55)\'" onmouseout="this.style.color=\'rgba(255,255,255,.22)\'">Disclosures</a>'
)

ty_new_footer = (
    '<!-- Footer -->\n'
    '<div style="background:#00152a;border-top:1px solid #1c3a43;padding:32px 20px;text-align:center" role="contentinfo">\n'
    '  <div class="max-w-3xl mx-auto">\n'
    '    <a href="/web/" aria-label="Cardone Capital home">'
    '<img src="/web/assets/images/logocc.png" alt="Cardone Capital"'
    ' style="height:31px;width:auto;display:inline-block;margin-bottom:20px"></a>\n'
    f'{ty_disclosure}\n'
    f'    <div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:0;margin-bottom:8px">{ty_links}</div>\n'
    '    <p style="font-family:var(--fb);font-size:11px;color:rgba(255,255,255,.2);margin:0">© 2026 Cardone Capital, LLC. All rights reserved.</p>\n'
    '  </div>\n'
    '</div>\n'
    '<!-- /footer -->\n'
)

# Replace entire footer block (comment through closing </footer>)
pattern_ty = r'<!-- Footer -->\n<footer class="cc-footer-bg"[\s\S]*?</footer>\n<!-- /footer -->\n'
content_new, n = re.subn(pattern_ty, ty_new_footer, content, count=1)

if n == 0:
    print(f"  WARNING: no footer match in {THANKYOU}")
else:
    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(content_new)
    print(f"  {THANKYOU}: full footer replaced (n={n})")
