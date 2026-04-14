/**
 * cc-schemas.js — Cardone Capital Structured Data Library
 * =========================================================
 * Complete JSON-LD schema collection for cardonecapital.com
 * IA v1.9 LOCKED | Design System v6 NOVA | April 2026
 *
 * USAGE OPTIONS:
 *
 * Option A — Auto-inject (recommended):
 *   Add ONE script tag before </body> on every page:
 *   <script src="/assets/js/cc-schemas.js"></script>
 *   The IIFE detects the current URL and injects the correct schemas.
 *
 * Option B — Manual paste per page:
 *   Each schema section below includes a "RAW JSON-LD" block
 *   you can copy-paste directly into the page <head>.
 *
 * MAINTENANCE:
 *   Update the STATS object below when stats change.
 *   Update DATES.lastmod on any content update.
 *   Run JSON-LD validation at: https://validator.schema.org/
 *   Test rich results at: https://search.google.com/test/rich-results
 *   Test breadcrumbs at: https://search.google.com/test/rich-results?url=...
 *
 * LEGAL NOTE:
 *   All fund descriptions contain required investment disclaimers.
 *   "Zero principal losses" is historical and unaudited —
 *   must not be presented as a guarantee in schema text.
 * =========================================================
 */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────────────────
     SINGLE SOURCE OF TRUTH — UPDATE HERE WHEN STATS CHANGE
  ───────────────────────────────────────────────────────── */
  const BASE    = 'https://cardonecapital.com';
  const STATS   = {
    aum:          '$5.3 billion',
    distributed:  '$591 million',
    investors:    20020,
    raised:       '$1.9 billion',
    assets:       46,
    units:        14600,
    states:       ['FL', 'TX', 'AZ', 'GA', 'AL', 'MD'],
    founded:      2016,
  };
  const CONTACT = {
    phone:     '+13054070276',
    email:     'invest@cardonecapital.com',
    street:    '18851 NE 29th Ave Suite 1000',
    city:      'Aventura',
    state:     'FL',
    zip:       '33180',
    country:   'US',
  };
  const SOCIAL = {
    cc_facebook:  'https://www.facebook.com/cardonecapital/',
    cc_instagram: 'https://www.instagram.com/cardonecapital/',
    cc_linkedin:  'https://www.linkedin.com/company/cardonecapital/',
    cc_youtube:   'https://www.youtube.com/channel/UCmqGSGKGzOiHmcOBY3eafQg',
    gc_twitter:   'https://twitter.com/GrantCardone',
    gc_instagram: 'https://www.instagram.com/grantcardone/',
    gc_facebook:  'https://www.facebook.com/grantcardone',
    gc_linkedin:  'https://www.linkedin.com/in/grantcardone/',
    gc_youtube:   'https://www.youtube.com/user/GrantCardone',
    gc_wikipedia: 'https://en.wikipedia.org/wiki/Grant_Cardone',
    gc_website:   'https://grantcardone.com',
  };
  const DATES   = {
    founded:     '2016-01-01',
    lastmod:     '2026-04-01',
  };
  const DISCLAIMER = 'For accredited investors only per SEC Rule 501(a). Investing involves risk including possible loss of principal. Historical performance does not guarantee future results.';

  /* ─────────────────────────────────────────────────────────
     UTILITY — inject a JSON-LD block into <head>
     id: unique string to prevent duplicate injection
     schema: plain JavaScript object (will be JSON.stringify'd)
  ───────────────────────────────────────────────────────── */
  function injectSchema(id, schema) {
    if (document.getElementById('ld-' + id)) return; // idempotent
    var s = document.createElement('script');
    s.id            = 'ld-' + id;
    s.type          = 'application/ld+json';
    s.textContent   = JSON.stringify(schema, null, 2);
    document.head.appendChild(s);
  }

  /* ─────────────────────────────────────────────────────────
     PAGE DETECTION — normalise current path for matching
  ───────────────────────────────────────────────────────── */
  var path = (window.location.pathname || '/').replace(/\/?$/, '/');
  // Ensure trailing slash for consistent matching
  if (path === '') path = '/';


  /* ==========================================================
     ① ORGANIZATION SCHEMA
     Page: / (homepage)
     Add directly to: index.html <head>
     ──────────────────────────────────────────────────────────
     RAW SCRIPT TAG — COPY THIS INTO index.html <head>:
     <script type="application/ld+json" id="ld-organization">
     (see schema object below — JSON.stringify it)
     </script>
  ========================================================== */
  var schemaOrganization = {
    '@context':        'https://schema.org',
    '@type':           'Organization',
    '@id':             BASE + '/#organization',
    'name':            'Cardone Capital',
    'legalName':       'Cardone Capital, LLC',
    'url':             BASE + '/',
    'logo': {
      '@type':   'ImageObject',
      'url':     BASE + '/assets/img/cc-logo.png',
      'width':   400,
      'height':  120,
    },
    'image':           BASE + '/og/homepage.jpg',
    'description':     'Cardone Capital is an institutional real estate investment firm managing ' + STATS.aum + ' in assets across ' + STATS.assets + ' Class-A multifamily properties in FL, TX, AZ, GA, AL, and MD. Founded by Grant Cardone in ' + STATS.founded + '. ' + STATS.investors.toLocaleString() + ' investors. ' + STATS.distributed + ' distributed. Zero principal losses since inception. Accredited investors only.',
    'foundingDate':    DATES.founded,
    'foundingLocation': {
      '@type':           'Place',
      'name':            'Aventura, Florida',
      'address': {
        '@type':            'PostalAddress',
        'streetAddress':    CONTACT.street,
        'addressLocality':  CONTACT.city,
        'addressRegion':    CONTACT.state,
        'postalCode':       CONTACT.zip,
        'addressCountry':   CONTACT.country,
      },
    },
    'address': {
      '@type':            'PostalAddress',
      'streetAddress':    CONTACT.street,
      'addressLocality':  CONTACT.city,
      'addressRegion':    CONTACT.state,
      'postalCode':       CONTACT.zip,
      'addressCountry':   CONTACT.country,
    },
    'contactPoint': [
      {
        '@type':            'ContactPoint',
        'telephone':        CONTACT.phone,
        'contactType':      'investor relations',
        'email':            CONTACT.email,
        'availableLanguage': ['English', 'Spanish'],
        'areaServed':        'US',
      },
      {
        '@type':       'ContactPoint',
        'contactType': 'investor portal',
        'url':         'https://investors.appfolioim.com/cardonecapital/investor/login',
      },
    ],
    'employee': {
      '@type':    'Person',
      '@id':      BASE + '/team/#grant-cardone',
      'name':     'Grant Cardone',
      'jobTitle': 'Founder and CEO',
    },
    'founder': {
      '@type': 'Person',
      '@id':   BASE + '/team/#grant-cardone',
      'name':  'Grant Cardone',
    },
    'numberOfEmployees': { '@type': 'QuantitativeValue', 'value': 50 },
    'sameAs': [
      SOCIAL.cc_facebook,
      SOCIAL.cc_instagram,
      SOCIAL.cc_linkedin,
      SOCIAL.cc_youtube,
    ],
    'areaServed': [
      { '@type': 'State', 'name': 'Florida' },
      { '@type': 'State', 'name': 'Texas' },
      { '@type': 'State', 'name': 'Arizona' },
      { '@type': 'State', 'name': 'Georgia' },
      { '@type': 'State', 'name': 'Alabama' },
      { '@type': 'State', 'name': 'Maryland' },
    ],
    'knowsAbout': [
      'Institutional Real Estate Investment',
      'Multifamily Real Estate',
      'Accredited Investor Funds',
      'Real Estate Syndication',
      'Self-Directed IRA Investing',
      'Bitcoin Real Estate Strategy',
      'Private Equity Real Estate',
    ],
    'hasOfferCatalog': {
      '@type': 'OfferCatalog',
      'name':  'Cardone Capital Investment Funds',
      'itemListElement': [
        {
          '@type':       'Offer',
          'name':        'Fund 29 — Real Estate + Bitcoin',
          'url':         BASE + '/fund29/',
          'description': 'Institutional multifamily real estate that systematically accumulates Bitcoin. Target 20%+ IRR. Quarterly distributions. Accredited investors only.',
        },
        {
          '@type':       'Offer',
          'name':        'Fund 30 — Cash Only Distributions',
          'url':         BASE + '/fund30/',
          'description': 'Institutional multifamily real estate with maximum quarterly cash distributions. No Bitcoin exposure. Accredited investors only.',
        },
      ],
    },
  };


  /* ==========================================================
     ② WEBSITE SCHEMA WITH SEARCH ACTION (Sitelinks Search Box)
     Page: / (homepage)
     Add to: index.html <head> alongside Organization schema
     ──────────────────────────────────────────────────────────
     NOTE: SearchAction enables Google Sitelinks Search Box in
     SERPs. Requires your site search URL to support the
     ?q= parameter, e.g. /search/?q={search_term_string}
     Update target URL if your CMS uses a different param.
  ========================================================== */
  var schemaWebSite = {
    '@context': 'https://schema.org',
    '@type':    'WebSite',
    '@id':      BASE + '/#website',
    'name':     'Cardone Capital',
    'url':      BASE + '/',
    'description': 'Institutional real estate + Bitcoin investment platform. Accredited investors. Fund 29 and Fund 30 currently open.',
    'publisher': { '@id': BASE + '/#organization' },
    'inLanguage':   'en-US',
    'potentialAction': {
      '@type':        'SearchAction',
      'target': {
        '@type':      'EntryPoint',
        'urlTemplate': BASE + '/search/?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };


  /* ==========================================================
     ③ PERSON SCHEMA — Grant Cardone
     Page: /team/ (and referenced from Organization above)
     Add to: team.html <head>
     ──────────────────────────────────────────────────────────
     Establishes Grant Cardone as a named entity in Google's
     Knowledge Graph. The @id anchors all future references
     (Article authorship, Organization founder, etc.)
  ========================================================== */
  var schemaPerson = {
    '@context':   'https://schema.org',
    '@type':      'Person',
    '@id':        BASE + '/team/#grant-cardone',
    'name':       'Grant Cardone',
    'givenName':  'Grant',
    'familyName': 'Cardone',
    'jobTitle':   'Founder and CEO',
    'worksFor': {
      '@type': 'Organization',
      '@id':   BASE + '/#organization',
      'name':  'Cardone Capital',
    },
    'url':           SOCIAL.gc_website,
    'image':         BASE + '/assets/img/grant-cardone.jpg',
    'description':   'Grant Cardone is the Founder and CEO of Cardone Capital, an institutional real estate investment firm managing ' + STATS.aum + ' in assets. A New York Times Best-Selling author, entrepreneur, and 10X Movement founder with over 35 years of real estate experience and approximately 20 million social media followers. Cardone Capital has distributed ' + STATS.distributed + ' to more than ' + STATS.investors.toLocaleString() + ' accredited investors with zero principal losses since 2016.',
    'birthPlace':    { '@type': 'Place', 'name': 'Lake Charles, Louisiana, USA' },
    'nationality':   { '@type': 'Country', 'name': 'United States' },
    'alumniOf':      { '@type': 'EducationalOrganization', 'name': 'McNeese State University' },
    'award': [
      'New York Times Best-Selling Author',
      'Wall Street Journal Best-Selling Author',
      'USA Today Best-Selling Author',
    ],
    'knowsAbout': [
      'Real Estate Investment',
      'Multifamily Real Estate',
      'Sales Training',
      'Entrepreneurship',
      'Bitcoin Investment',
      'Private Equity Real Estate',
      'Institutional Real Estate Funds',
    ],
    'sameAs': [
      SOCIAL.gc_twitter,
      SOCIAL.gc_instagram,
      SOCIAL.gc_facebook,
      SOCIAL.gc_linkedin,
      SOCIAL.gc_youtube,
      SOCIAL.gc_wikipedia,
      SOCIAL.gc_website,
      BASE + '/team/',
    ],
  };


  /* ==========================================================
     ④ FAQPAGE SCHEMA — 15 Q&A pairs
     Page: /academy/faq/
     Add to: faq.html <head>
     ──────────────────────────────────────────────────────────
     FAQPage schema enables Google FAQ rich results — expandable
     Q&A directly in SERPs. Requires questions also present
     as visible HTML on the page with matching text.
     Each answer must be under ~300 words to display fully.
  ========================================================== */
  var schemaFAQ = {
    '@context': 'https://schema.org',
    '@type':    'FAQPage',
    '@id':      BASE + '/academy/faq/#faqpage',
    'name':     'Cardone Capital Investor FAQ',
    'url':      BASE + '/academy/faq/',
    'mainEntity': [

      /* 1 */ {
        '@type':          'Question',
        'name':           'What is Cardone Capital?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text':  'Cardone Capital is an institutional real estate investment firm founded in 2016 by Grant Cardone. The firm manages ' + STATS.aum + ' in assets across ' + STATS.assets + ' Class-A multifamily properties in Florida, Texas, Arizona, Georgia, Alabama, and Maryland. Cardone Capital has raised ' + STATS.raised + ' in capital, distributed ' + STATS.distributed + ' to investors, and served more than ' + STATS.investors.toLocaleString() + ' accredited investors with zero principal losses since inception.',
        },
      },

      /* 2 */ {
        '@type':          'Question',
        'name':           'Who qualifies to invest with Cardone Capital?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text':  'Cardone Capital funds are available exclusively to accredited investors as defined by SEC Rule 501(a). You qualify as an accredited investor if you have a net worth exceeding $1 million (excluding your primary residence), annual income exceeding $200,000 as an individual (or $300,000 jointly with a spouse) for two consecutive years, or hold an active FINRA Series 7, 65, or 82 license. Non-accredited investors are not served. Book a free call with our investor relations team to confirm your eligibility.',
        },
      },

      /* 3 */ {
        '@type':          'Question',
        'name':           'What is Fund 29?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text':  'Fund 29 is Cardone Capital\'s dual-hard-asset fund combining institutional multifamily real estate with systematic Bitcoin accumulation. The fund deploys investor capital into Class-A apartment communities across the Sun Belt. A portion of the rental income generated by the portfolio is used to purchase Bitcoin on behalf of the fund — meaning Bitcoin is accumulated using cash flow, not principal. Fund 29 pays quarterly distributions, targets a 20%+ IRR, and is structured under Regulation D, Rule 506(c) for accredited investors only.',
        },
      },

      /* 4 */ {
        '@type':          'Question',
        'name':           'What is Fund 30?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text':  'Fund 30 is Cardone Capital\'s cash-only distribution fund. It is backed by the same institutional multifamily real estate portfolio as Fund 29, but does not allocate any income to Bitcoin. The full available cash flow from the portfolio is distributed to investors quarterly, making Fund 30 the choice for accredited investors who want maximum current income with zero Bitcoin exposure. Like Fund 29, Fund 30 is available exclusively to accredited investors under Regulation D, Rule 506(c).',
        },
      },

      /* 5 */ {
        '@type':          'Question',
        'name':           'What is the minimum investment for Cardone Capital funds?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text':  'Minimum investment requirements for Fund 29 and Fund 30 are disclosed during the investor relations call and outlined in each fund\'s Private Placement Memorandum (PPM). To learn the current minimum and discuss how it fits your portfolio, book a free call with our investor relations team at cardonecapital.com/schedule/. There is no commitment required for the initial conversation.',
        },
      },

      /* 6 */ {
        '@type':          'Question',
        'name':           'How do investor distributions work?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text':  'Both Fund 29 and Fund 30 pay quarterly distributions to investors. Distributions are funded by rental income from the portfolio\'s multifamily properties after operating expenses and debt service. For Fund 29, a portion of income is directed to Bitcoin purchases rather than distributed, so distributions are lower than Fund 30. For Fund 30, available cash flow is maximized for quarterly distribution. Distribution amounts are variable and not guaranteed. Distributions are paid to investors\' bank accounts and documented in quarterly investor statements.',
        },
      },

      /* 7 */ {
        '@type':          'Question',
        'name':           'Can I invest in Cardone Capital through my IRA or 401k?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text':  'Yes. Both Fund 29 and Fund 30 are eligible for investment through a Self-Directed IRA (SD-IRA). To use retirement funds, you open an SD-IRA with a specialized custodian, then direct the custodian to invest in Cardone Capital on behalf of your IRA. You can roll over an existing 401k to an SD-IRA through a direct rollover — a non-taxable transaction when handled correctly. Cardone Capital\'s IRA specialists guide every investor through the process at no charge. Text "IRA" to 305-407-0276 to get started, or visit cardonecapital.com/ira-401k/.',
        },
      },

      /* 8 */ {
        '@type':          'Question',
        'name':           'What states does Cardone Capital invest in?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text':  'Cardone Capital\'s ' + STATS.assets + '-property portfolio is concentrated in six high-demand Sun Belt markets: Florida, Texas, Arizona, Georgia, Alabama, and Maryland. These states were selected for strong population growth, diversified employment bases, and favorable multifamily supply-demand dynamics. The portfolio includes approximately ' + STATS.units.toLocaleString() + ' residential units across these six states.',
        },
      },

      /* 9 */ {
        '@type':          'Question',
        'name':           'What is Cardone Capital\'s investment track record?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text':  'Since founding in 2016, Cardone Capital has managed institutional real estate exclusively — raising ' + STATS.raised + ' in capital, acquiring ' + STATS.assets + ' Class-A multifamily properties totaling approximately ' + STATS.units.toLocaleString() + ' units, and distributing ' + STATS.distributed + ' to more than ' + STATS.investors.toLocaleString() + ' accredited investors. The firm has maintained zero principal losses across all fund vintages. This historical performance is unaudited and does not guarantee future results. All investments involve risk including possible loss of principal.',
        },
      },

      /* 10 */ {
        '@type':          'Question',
        'name':           'How do I get started as a Cardone Capital investor?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text':  'Getting started involves three steps. First, book a free investor call at cardonecapital.com/schedule/ — our IR team reviews your eligibility, explains Fund 29 and Fund 30, and answers every question you have. Second, review and sign the subscription documents and fund\'s Private Placement Memorandum (PPM). Third, wire your investment per the instructions provided. Your first quarterly distribution follows according to the fund\'s distribution schedule. The entire process typically takes 1-2 weeks from first call to funded investment.',
        },
      },

      /* 11 */ {
        '@type':          'Question',
        'name':           'How long is the investment hold period for Cardone Capital funds?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text':  'Cardone Capital funds are private, illiquid real estate investments with multi-year hold periods. Specific hold periods are outlined in each fund\'s Private Placement Memorandum, which is provided before you invest. Investors should only commit capital they do not need access to in the near term. There is no publicly traded market for fund interests — liquidity is provided only through fund distributions and upon fund wind-down or portfolio disposition.',
        },
      },

      /* 12 */ {
        '@type':          'Question',
        'name':           'How does the Bitcoin strategy work in Fund 29?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text':  'Fund 29 uses a portion of the portfolio\'s net rental income to systematically purchase Bitcoin on behalf of the fund. Bitcoin is acquired using property cash flow — not from investors\' principal capital. Your invested capital remains in institutional real estate; the Bitcoin position is built using income generated by the properties. This structure allows the fund to accumulate Bitcoin without exposing investor principal to direct cryptocurrency volatility. If Bitcoin prices decline, the real estate portfolio continues generating income and the fund continues accumulating Bitcoin at lower cost. Investors in Fund 29 accept lower current quarterly distributions in exchange for participation in the Bitcoin accumulation strategy.',
        },
      },

      /* 13 */ {
        '@type':          'Question',
        'name':           'What fees does Cardone Capital charge?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text':  'Fee structures for Fund 29 and Fund 30 are fully disclosed in each fund\'s Private Placement Memorandum. Typical fees in institutional real estate funds include acquisition fees (charged when a property is purchased), asset management fees (ongoing annual percentage of assets under management), property management fees (charged for day-to-day operations), and disposition fees (charged when a property is sold). Cardone Capital is a vertically integrated operator — the same team that acquires and manages assets handles investor relations, which reduces third-party management costs. Full fee disclosure is required before any investment commitment.',
        },
      },

      /* 14 */ {
        '@type':          'Question',
        'name':           'How does Cardone Capital communicate with investors after I invest?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text':  'Cardone Capital provides quarterly investor reports, quarterly distribution statements, and annual tax documents (K-1s) to all investors. All documents and account information are accessible through the AppFolio investor portal at investors.appfolioim.com/cardonecapital/investor/login. Investors can log in at any time to review their account balance, distribution history, and portfolio performance. Significant portfolio events — acquisitions, dispositions, major refinancings — are communicated to investors directly.',
        },
      },

      /* 15 */ {
        '@type':          'Question',
        'name':           'Is Cardone Capital registered with the SEC?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text':  'Cardone Capital funds are offered pursuant to Regulation D, Rule 506(c) of the Securities Act of 1933, which provides an exemption from SEC registration for private placements to accredited investors only. The firm is not a registered investment adviser. All fund offerings are made only through Private Placement Memoranda to verified accredited investors. Investing involves risk. You should review all offering documents carefully and consult your own legal, financial, and tax advisors before making any investment decision.',
        },
      },

    ],
  };


  /* ==========================================================
     ⑤ BREADCRUMBLIST SCHEMAS — one per inner page
     ──────────────────────────────────────────────────────────
     BreadcrumbList enables rich results breadcrumb display
     in Google SERPs. Each item must match the visible
     breadcrumb navigation shown on the page.
  ========================================================== */

  /** Helper: build a BreadcrumbList schema from an array of
   *  { name, url } items. The array should start with Home
   *  and end with the current page.
   */
  function breadcrumb(items) {
    return {
      '@context': 'https://schema.org',
      '@type':    'BreadcrumbList',
      'itemListElement': items.map(function (item, i) {
        return {
          '@type':    'ListItem',
          'position': i + 1,
          'name':     item.name,
          'item':     item.url,
        };
      }),
    };
  }

  var breadcrumbs = {
    /* /invest/ — Fund comparison hub */
    invest: breadcrumb([
      { name: 'Home',       url: BASE + '/' },
      { name: 'Invest',     url: BASE + '/invest/' },
    ]),

    /* /fund29/ — Fund 29 detail page */
    fund29: breadcrumb([
      { name: 'Home',       url: BASE + '/' },
      { name: 'Invest',     url: BASE + '/invest/' },
      { name: 'Fund 29 — Real Estate + Bitcoin', url: BASE + '/fund29/' },
    ]),

    /* /fund30/ — Fund 30 detail page */
    fund30: breadcrumb([
      { name: 'Home',       url: BASE + '/' },
      { name: 'Invest',     url: BASE + '/invest/' },
      { name: 'Fund 30 — Cash Only Distributions', url: BASE + '/fund30/' },
    ]),

    /* /ira-401k/ — IRA investing overview page */
    ira: breadcrumb([
      { name: 'Home',       url: BASE + '/' },
      { name: 'Invest',     url: BASE + '/invest/' },
      { name: 'IRA / 401k Investing', url: BASE + '/ira-401k/' },
    ]),

    /* /portfolio/ — 46 property grid */
    portfolio: breadcrumb([
      { name: 'Home',       url: BASE + '/' },
      { name: 'Portfolio',  url: BASE + '/portfolio/' },
    ]),

    /* /company/ — Company overview + performance + careers */
    company: breadcrumb([
      { name: 'Home',       url: BASE + '/' },
      { name: 'Company',    url: BASE + '/company/' },
    ]),

    /* /team/ — Grant + executive team + careers */
    team: breadcrumb([
      { name: 'Home',       url: BASE + '/' },
      { name: 'Team',       url: BASE + '/team/' },
    ]),

    /* /academy/ — 10X Academy hub */
    academy: breadcrumb([
      { name: 'Home',         url: BASE + '/' },
      { name: '10X Academy',  url: BASE + '/academy/' },
    ]),

    /* /contact/ — contact + HubSpot calendar */
    contact: breadcrumb([
      { name: 'Home',       url: BASE + '/' },
      { name: 'Contact',    url: BASE + '/contact/' },
    ]),

    /* /academy/bitcoin-real-estate/ — pillar article */
    academyBitcoin: breadcrumb([
      { name: 'Home',                       url: BASE + '/' },
      { name: '10X Academy',                url: BASE + '/academy/' },
      { name: 'Bitcoin + Real Estate Strategy', url: BASE + '/academy/bitcoin-real-estate/' },
    ]),

    /* /academy/real-estate-101/ — pillar article */
    academyRE101: breadcrumb([
      { name: 'Home',                       url: BASE + '/' },
      { name: '10X Academy',                url: BASE + '/academy/' },
      { name: 'Real Estate Investing 101',  url: BASE + '/academy/real-estate-101/' },
    ]),

    /* /academy/ira-401k-guide/ — long-form guide */
    academyIRA: breadcrumb([
      { name: 'Home',                       url: BASE + '/' },
      { name: '10X Academy',                url: BASE + '/academy/' },
      { name: 'IRA & 401k Guide',           url: BASE + '/academy/ira-401k-guide/' },
    ]),

    /* /academy/faq/ — FAQ page */
    academyFAQ: breadcrumb([
      { name: 'Home',                       url: BASE + '/' },
      { name: '10X Academy',                url: BASE + '/academy/' },
      { name: 'Investor FAQ',               url: BASE + '/academy/faq/' },
    ]),
  };


  /* ==========================================================
     ⑥ FINANCIAL PRODUCT SCHEMAS — Fund 29 and Fund 30
     ──────────────────────────────────────────────────────────
     Schema.org InvestmentOrFund is a subtype of FinancialProduct.
     These schemas signal to AI search engines (Perplexity,
     ChatGPT Search, Gemini) that these are structured
     investment products with verifiable properties.
     ──────────────────────────────────────────────────────────
     IMPORTANT LEGAL: Google may display fund data from schema
     directly in SERPs. All text must be accurate and include
     the accredited-investor disclaimer. Do not include
     specific fee percentages unless you can update them
     whenever the fund terms change.
  ========================================================== */

  /** Fund 29 — Real Estate + Bitcoin */
  var schemaFund29 = {
    '@context': 'https://schema.org',
    '@type':    ['InvestmentOrFund', 'FinancialProduct'],
    '@id':      BASE + '/fund29/#fund',
    'name':     'Cardone Capital Fund 29 — Real Estate + Bitcoin',
    'alternateName': 'Fund 29',
    'url':      BASE + '/fund29/',
    'description': 'Institutional Class-A multifamily real estate investment fund that systematically accumulates Bitcoin using property cash flow. Target 20%+ IRR. Quarterly distributions. Available to accredited investors only under Regulation D, Rule 506(c). ' + DISCLAIMER,
    'provider': {
      '@type': 'Organization',
      '@id':   BASE + '/#organization',
      'name':  'Cardone Capital',
    },
    'broker': {
      '@type': 'Organization',
      '@id':   BASE + '/#organization',
      'name':  'Cardone Capital, LLC',
    },
    'feesAndCommissionsSpecification': 'Fee structure disclosed in the Private Placement Memorandum. Typical fees include acquisition, asset management, property management, and disposition fees. Contact investor relations for full disclosure.',
    'offers': {
      '@type':            'Offer',
      'url':              BASE + '/fund29/',
      'eligibleCustomer': {
        '@type': 'BusinessEntityType',
        'name':  'Accredited Investors',
      },
      'eligibleRegion': {
        '@type': 'Country',
        'name':  'United States',
      },
      'availability':  'https://schema.org/InStock',
      'priceSpecification': {
        '@type':    'PriceSpecification',
        'price':    0,
        'priceCurrency': 'USD',
        'description': 'Minimum investment disclosed in the PPM. Book a call for details.',
      },
    },
    'areaServed': [
      { '@type': 'State', 'name': 'Florida' },
      { '@type': 'State', 'name': 'Texas' },
      { '@type': 'State', 'name': 'Arizona' },
      { '@type': 'State', 'name': 'Georgia' },
      { '@type': 'State', 'name': 'Alabama' },
      { '@type': 'State', 'name': 'Maryland' },
    ],
    'additionalProperty': [
      {
        '@type':         'PropertyValue',
        'name':          'Target IRR',
        'value':         '20%+',
        'description':   'Target internal rate of return. Forward-looking estimate only — not a guarantee.',
      },
      {
        '@type':         'PropertyValue',
        'name':          'Distribution Frequency',
        'value':         'Quarterly',
      },
      {
        '@type':         'PropertyValue',
        'name':          'Asset Class',
        'value':         'Institutional Multifamily Real Estate + Bitcoin',
      },
      {
        '@type':         'PropertyValue',
        'name':          'Investor Eligibility',
        'value':         'Accredited investors only (SEC Rule 501(a))',
      },
      {
        '@type':         'PropertyValue',
        'name':          'Regulatory Structure',
        'value':         'Regulation D, Rule 506(c)',
      },
      {
        '@type':         'PropertyValue',
        'name':          'Portfolio AUM',
        'value':         STATS.aum,
      },
      {
        '@type':         'PropertyValue',
        'name':          'Total Properties',
        'value':         STATS.assets,
      },
      {
        '@type':         'PropertyValue',
        'name':          'Total Distributed (Firm-Wide)',
        'value':         STATS.distributed,
      },
    ],
  };

  /** Fund 30 — Cash Only Distributions */
  var schemaFund30 = {
    '@context': 'https://schema.org',
    '@type':    ['InvestmentOrFund', 'FinancialProduct'],
    '@id':      BASE + '/fund30/#fund',
    'name':     'Cardone Capital Fund 30 — Cash Only Distributions',
    'alternateName': 'Fund 30',
    'url':      BASE + '/fund30/',
    'description': 'Institutional Class-A multifamily real estate investment fund focused on maximum quarterly cash distributions. No Bitcoin allocation — 100% of available cash flow is distributed to investors. Backed by Cardone Capital\'s ' + STATS.aum + ' institutional portfolio. Available to accredited investors only under Regulation D, Rule 506(c). ' + DISCLAIMER,
    'provider': {
      '@type': 'Organization',
      '@id':   BASE + '/#organization',
      'name':  'Cardone Capital',
    },
    'broker': {
      '@type': 'Organization',
      '@id':   BASE + '/#organization',
      'name':  'Cardone Capital, LLC',
    },
    'feesAndCommissionsSpecification': 'Fee structure disclosed in the Private Placement Memorandum. Typical fees include acquisition, asset management, property management, and disposition fees. Contact investor relations for full disclosure.',
    'offers': {
      '@type':            'Offer',
      'url':              BASE + '/fund30/',
      'eligibleCustomer': {
        '@type': 'BusinessEntityType',
        'name':  'Accredited Investors',
      },
      'eligibleRegion': {
        '@type': 'Country',
        'name':  'United States',
      },
      'availability': 'https://schema.org/InStock',
      'priceSpecification': {
        '@type':    'PriceSpecification',
        'price':    0,
        'priceCurrency': 'USD',
        'description': 'Minimum investment disclosed in the PPM. Book a call for details.',
      },
    },
    'areaServed': [
      { '@type': 'State', 'name': 'Florida' },
      { '@type': 'State', 'name': 'Texas' },
      { '@type': 'State', 'name': 'Arizona' },
      { '@type': 'State', 'name': 'Georgia' },
      { '@type': 'State', 'name': 'Alabama' },
      { '@type': 'State', 'name': 'Maryland' },
    ],
    'additionalProperty': [
      {
        '@type':         'PropertyValue',
        'name':          'Distribution Strategy',
        'value':         'Cash Only — 100% of available cash flow distributed',
        'description':   'No Bitcoin allocation. Maximum quarterly income.',
      },
      {
        '@type':         'PropertyValue',
        'name':          'Distribution Frequency',
        'value':         'Quarterly',
      },
      {
        '@type':         'PropertyValue',
        'name':          'Asset Class',
        'value':         'Institutional Multifamily Real Estate (Cash Distributions Only)',
      },
      {
        '@type':         'PropertyValue',
        'name':          'Bitcoin Exposure',
        'value':         'None',
      },
      {
        '@type':         'PropertyValue',
        'name':          'Investor Eligibility',
        'value':         'Accredited investors only (SEC Rule 501(a))',
      },
      {
        '@type':         'PropertyValue',
        'name':          'Regulatory Structure',
        'value':         'Regulation D, Rule 506(c)',
      },
      {
        '@type':         'PropertyValue',
        'name':          'Portfolio AUM',
        'value':         STATS.aum,
      },
      {
        '@type':         'PropertyValue',
        'name':          'Total Properties',
        'value':         STATS.assets,
      },
      {
        '@type':         'PropertyValue',
        'name':          'Total Distributed (Firm-Wide)',
        'value':         STATS.distributed,
      },
    ],
  };


  /* ==========================================================
     AUTO-INJECTION ROUTER
     ──────────────────────────────────────────────────────────
     Detects the current page path and injects the correct
     schema(s). Each page gets only the schemas that belong to
     it — no cross-contamination.
     ──────────────────────────────────────────────────────────
     To add to a new page, add a new case below.
     The injectSchema() call is idempotent — safe to call
     multiple times.
  ========================================================== */

  switch (true) {

    /* ── Homepage ── */
    case (path === '/'):
      injectSchema('organization', schemaOrganization);
      injectSchema('website',      schemaWebSite);
      break;

    /* ── Invest Hub ── */
    case (path === '/invest/'):
      injectSchema('breadcrumb-invest', breadcrumbs.invest);
      break;

    /* ── Fund 29 ── */
    case (path === '/fund29/'):
      injectSchema('breadcrumb-fund29', breadcrumbs.fund29);
      injectSchema('fund29',            schemaFund29);
      break;

    /* ── Fund 30 ── */
    case (path === '/fund30/'):
      injectSchema('breadcrumb-fund30', breadcrumbs.fund30);
      injectSchema('fund30',            schemaFund30);
      break;

    /* ── IRA / 401k ── */
    case (path === '/ira-401k/'):
      injectSchema('breadcrumb-ira', breadcrumbs.ira);
      break;

    /* ── Portfolio ── */
    case (path === '/portfolio/'):
      injectSchema('breadcrumb-portfolio', breadcrumbs.portfolio);
      break;

    /* ── Company ── */
    case (path === '/company/'):
      injectSchema('breadcrumb-company', breadcrumbs.company);
      break;

    /* ── Team ── */
    case (path === '/team/'):
      injectSchema('breadcrumb-team', breadcrumbs.team);
      injectSchema('person-grant',    schemaPerson);
      break;

    /* ── Academy Hub ── */
    case (path === '/academy/'):
      injectSchema('breadcrumb-academy', breadcrumbs.academy);
      break;

    /* ── Academy — Bitcoin + RE Strategy ── */
    case (path === '/academy/bitcoin-real-estate/'):
      injectSchema('breadcrumb-academy-bitcoin', breadcrumbs.academyBitcoin);
      break;

    /* ── Academy — RE Investing 101 ── */
    case (path === '/academy/real-estate-101/'):
      injectSchema('breadcrumb-academy-re101', breadcrumbs.academyRE101);
      break;

    /* ── Academy — IRA & 401k Guide ── */
    case (path === '/academy/ira-401k-guide/'):
      injectSchema('breadcrumb-academy-ira', breadcrumbs.academyIRA);
      break;

    /* ── Academy — FAQ ── */
    case (path === '/academy/faq/'):
      injectSchema('breadcrumb-academy-faq', breadcrumbs.academyFAQ);
      injectSchema('faqpage',                schemaFAQ);
      break;

    /* ── Contact ── */
    case (path === '/contact/'):
      injectSchema('breadcrumb-contact', breadcrumbs.contact);
      break;

    default:
      /* No schema for this path — no-op */
      break;
  }

  /* ==========================================================
     PUBLIC API — for testing and manual usage
     ──────────────────────────────────────────────────────────
     Access via window.CCSchemas in browser console:
     CCSchemas.inject('organization', CCSchemas.schemas.organization)
     CCSchemas.validate()  — logs all current LD+JSON to console
     CCSchemas.schemas     — raw schema objects for inspection
  ========================================================== */
  window.CCSchemas = {
    schemas: {
      organization:  schemaOrganization,
      website:       schemaWebSite,
      person:        schemaPerson,
      faq:           schemaFAQ,
      breadcrumbs:   breadcrumbs,
      fund29:        schemaFund29,
      fund30:        schemaFund30,
    },
    inject: injectSchema,
    validate: function () {
      var scripts = document.querySelectorAll('script[type="application/ld+json"]');
      if (!scripts.length) {
        console.warn('[CCSchemas] No JSON-LD scripts found on this page.');
        return;
      }
      scripts.forEach(function (s) {
        try {
          var parsed = JSON.parse(s.textContent);
          console.log('[CCSchemas] ✓', s.id || '(no id)', '→', parsed['@type']);
        } catch (e) {
          console.error('[CCSchemas] ✗ Parse error in', s.id || '(no id)', e.message);
        }
      });
    },
  };

})();

/*
 * ============================================================
 * MANUAL COPY-PASTE REFERENCE
 * ============================================================
 * If you prefer to paste schemas directly into each page's
 * <head> instead of using this auto-inject script, here are
 * the page-by-page instructions:
 *
 * / (homepage):
 *   → Inject: schemaOrganization + schemaWebSite
 *   → Use: window.CCSchemas.schemas.organization
 *          window.CCSchemas.schemas.website
 *
 * /team/:
 *   → Inject: schemaPerson + breadcrumbs.team
 *   → Use: window.CCSchemas.schemas.person
 *          window.CCSchemas.schemas.breadcrumbs.team
 *
 * /academy/faq/:
 *   → Inject: schemaFAQ + breadcrumbs.academyFAQ
 *   → Use: window.CCSchemas.schemas.faq
 *          window.CCSchemas.schemas.breadcrumbs.academyFAQ
 *
 * /fund29/:
 *   → Inject: schemaFund29 + breadcrumbs.fund29
 *   → Use: window.CCSchemas.schemas.fund29
 *          window.CCSchemas.schemas.breadcrumbs.fund29
 *
 * /fund30/:
 *   → Inject: schemaFund30 + breadcrumbs.fund30
 *   → Use: window.CCSchemas.schemas.fund30
 *          window.CCSchemas.schemas.breadcrumbs.fund30
 *
 * All other inner pages:
 *   → Inject: breadcrumbs.[pageName]
 *   → Use: window.CCSchemas.schemas.breadcrumbs.[pageName]
 *
 * VALIDATION TOOLS:
 *   https://validator.schema.org/
 *   https://search.google.com/test/rich-results
 *   Chrome DevTools → Console → CCSchemas.validate()
 * ============================================================
 */
