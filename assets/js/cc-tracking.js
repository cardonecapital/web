/**
 * ============================================================
 * cc-tracking.js — Cardone Capital Analytics & Integration
 * ============================================================
 * Version:  1.0.0
 * Updated:  2026-04-01
 * Site:     cardonecapital.com
 *
 * WHAT THIS FILE CONTAINS:
 *   1.  GTM container snippet (head + body versions)
 *   2.  GA4 configuration and all custom events
 *   3.  Microsoft Clarity snippet
 *   4.  HubSpot tracking pixel
 *   5.  Custom event helper functions (public API)
 *   6.  DOM-ready init that fires all trackers
 *   7.  DataLayer push helpers for GTM
 *   8.  Privacy/consent guard layer
 *
 * QUICK-START CHECKLIST (do these before going live):
 *   □  Replace GTM-XXXXXXX  with your real GTM container ID
 *   □  Replace G-XXXXXXXXXX with your real GA4 measurement ID
 *   □  Replace CLARITY_XXXX with your real Clarity project ID
 *   □  Replace HS_PORTAL_ID with your real HubSpot portal ID
 *   □  Remove the IS_DEV guard at the bottom once IDs are set
 *   □  Set CONSENT_REQUIRED to true if serving EU/California
 *      users and you have a CMP (cookie consent platform)
 *   □  Add <script src="/assets/js/cc-tracking.js"></script>
 *      as the LAST script in <head> on every main-site page
 *   □  Add the GTM <noscript> snippet immediately after the
 *      opening <body> tag (paste from NOSCRIPT section below)
 *
 * PLACEMENT IN HTML:
 *   HEAD (first item, before all other <script> tags):
 *     <script src="/assets/js/cc-tracking.js"></script>
 *
 *   BODY (immediately after <body> opening tag):
 *     <!-- Paste the GTM noscript block from this file -->
 *
 *   EXCLUDED PAGES (do NOT include this file):
 *     /lp/* — all paid-ads funnel pages use separate GTM tags
 *              managed through the GTM container directly
 *
 * TESTING:
 *   GTM preview mode:   tagmanager.google.com → Preview
 *   GA4 DebugView:      analytics.google.com → DebugView
 *   GA4 real-time:      analytics.google.com → Realtime
 *   Clarity sessions:   clarity.microsoft.com
 *   HubSpot activity:   app.hubspot.com → Contacts → Activity
 *   Console API:        window.CCTrack.validate()
 *   Console events:     window.CCTrack.testFire()
 * ============================================================
 */


/* ─────────────────────────────────────────────────────────────
   CONFIGURATION — REPLACE THESE PLACEHOLDER IDs BEFORE LAUNCH
───────────────────────────────────────────────────────────── */
var CC_CONFIG = {

  /* Google Tag Manager
     Find at: tagmanager.google.com → your account → container
     Format:  GTM-XXXXXXX (7 alphanumeric chars after GTM-)    */
  GTM_ID: 'GTM-XXXXXXX',

  /* Google Analytics 4 — Measurement ID
     Find at: GA4 → Admin → Data Streams → your stream
     Format:  G-XXXXXXXXXX                                      */
  GA4_ID: 'G-XXXXXXXXXX',

  /* Microsoft Clarity — Project ID
     Find at: clarity.microsoft.com → your project → Settings
     Format:  10-char alphanumeric (e.g. "abcde12345")          */
  CLARITY_ID: 'CLARITY_XXXX',

  /* HubSpot — Portal ID (numeric)
     Find at: HubSpot → Settings → Account Setup → Account ID
     Format:  numeric string, e.g. "12345678"                   */
  HS_PORTAL_ID: 'HS_PORTAL_ID',

  /* HubSpot — Region prefix
     'na1' for North America (default for US accounts)
     'eu1' for EU-hosted accounts                               */
  HS_REGION: 'na1',

  /* Consent gate — set true to delay all tracking until
     window.CCTrack.grantConsent() is called (for GDPR/CCPA).
     Set false for US-only sites without a consent requirement. */
  CONSENT_REQUIRED: false,

  /* Debug mode — set false in production to silence console.log */
  DEBUG: false,
};


/* ─────────────────────────────────────────────────────────────
   VALIDATION — detect placeholder IDs and warn in console
   This block runs once and warns the dev team if any IDs have
   not been replaced before deployment.
───────────────────────────────────────────────────────────── */
(function validateConfig() {
  var placeholders = [];
  if (CC_CONFIG.GTM_ID     === 'GTM-XXXXXXX')  placeholders.push('GTM_ID');
  if (CC_CONFIG.GA4_ID     === 'G-XXXXXXXXXX')  placeholders.push('GA4_ID');
  if (CC_CONFIG.CLARITY_ID === 'CLARITY_XXXX')  placeholders.push('CLARITY_ID');
  if (CC_CONFIG.HS_PORTAL_ID === 'HS_PORTAL_ID') placeholders.push('HS_PORTAL_ID');
  if (placeholders.length) {
    console.warn(
      '[CCTrack] ⚠ Placeholder IDs not replaced:\n' +
      placeholders.map(function(k){ return '  • ' + k + ' = "' + CC_CONFIG[k] + '"'; }).join('\n') +
      '\n  → Edit CC_CONFIG in cc-tracking.js before going live.'
    );
  }
})();


/* ─────────────────────────────────────────────────────────────
   CONSENT STATE — internal flag
   When CONSENT_REQUIRED is false this is always true.
   When true, call window.CCTrack.grantConsent() from your
   cookie consent callback to unblock all trackers.
───────────────────────────────────────────────────────────── */
var _consentGranted = !CC_CONFIG.CONSENT_REQUIRED;
var _initialized    = false;


/* ─────────────────────────────────────────────────────────────
   UTILITY HELPERS
───────────────────────────────────────────────────────────── */
function _log(msg) {
  if (CC_CONFIG.DEBUG) console.log('[CCTrack]', msg);
}

/** Safe gtag() caller — no-ops if gtag is not yet defined */
function _gtag() {
  if (typeof window.gtag === 'function') {
    window.gtag.apply(window, arguments);
  } else {
    _log('gtag not ready — queuing: ' + JSON.stringify(Array.prototype.slice.call(arguments)));
  }
}

/** Safe dataLayer push — initialises dataLayer if missing */
function _dlPush(obj) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(obj);
  _log('dataLayer.push → ' + JSON.stringify(obj));
}

/** Get page path normalised with trailing slash */
function _path() {
  return (window.location.pathname || '/').replace(/\/?$/, '/');
}

/** Returns true if current path starts with prefix */
function _onPage(prefix) {
  return _path().indexOf(prefix) === 0;
}


/* ═══════════════════════════════════════════════════════════
   ① GOOGLE TAG MANAGER
   ───────────────────────────────────────────────────────────
   GTM is the container for GA4, conversion tags, remarketing,
   LinkedIn Insight, Facebook Pixel, and all other tags.
   Everything flows through GTM — GA4 config is loaded via
   GTM's "Google Analytics: GA4 Configuration" tag type
   (not directly via gtag.js), which allows GA4 events to be
   fired from GTM triggers in addition to the direct gtag()
   calls in this file.

   HEAD SNIPPET — place as early as possible in <head>:
   ───────────────────────────────────────────────────────────
   <script>
   (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
   new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
   j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;
   j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
   f.parentNode.insertBefore(j,f);
   })(window,document,'script','dataLayer','GTM-XXXXXXX');
   </script>

   NOSCRIPT SNIPPET — paste immediately after <body> opening:
   ───────────────────────────────────────────────────────────
   <noscript>
   <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
   height="0" width="0" style="display:none;visibility:hidden"></iframe>
   </noscript>

   Replace GTM-XXXXXXX with your container ID in both blocks.
═══════════════════════════════════════════════════════════ */
function _initGTM() {
  if (CC_CONFIG.GTM_ID === 'GTM-XXXXXXX') {
    _log('GTM skipped — placeholder ID.');
    return;
  }
  /* Initialise dataLayer before GTM script loads */
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });

  var f = document.getElementsByTagName('script')[0];
  var j = document.createElement('script');
  j.async = true;
  j.src   = 'https://www.googletagmanager.com/gtm.js?id=' + CC_CONFIG.GTM_ID;
  j.id    = 'gtm-container';
  f.parentNode.insertBefore(j, f);
  _log('GTM loaded → ' + CC_CONFIG.GTM_ID);
}

/**
 * Call this function to inject the GTM <noscript> body tag.
 * Alternatively, paste the static noscript HTML from the
 * comment block above directly in your HTML template.
 * This JS approach works for SPAs and server-rendered sites
 * that don't have a static HTML template to edit.
 */
function _injectGTMNoscript() {
  if (CC_CONFIG.GTM_ID === 'GTM-XXXXXXX') return;
  var ns = document.createElement('noscript');
  var fi = document.createElement('iframe');
  fi.src    = 'https://www.googletagmanager.com/ns.html?id=' + CC_CONFIG.GTM_ID;
  fi.height = '0';
  fi.width  = '0';
  fi.style.display    = 'none';
  fi.style.visibility = 'hidden';
  ns.appendChild(fi);
  /* Insert immediately after opening <body> */
  if (document.body && document.body.firstChild) {
    document.body.insertBefore(ns, document.body.firstChild);
  } else if (document.body) {
    document.body.appendChild(ns);
  }
  _log('GTM noscript injected.');
}


/* ═══════════════════════════════════════════════════════════
   ② GOOGLE ANALYTICS 4
   ───────────────────────────────────────────────────────────
   GA4 is loaded via the GTM container tag in production.
   This direct gtag.js bootstrap is provided as a fallback
   for pages that load cc-tracking.js without GTM, or for
   local testing. In production with GTM active, GA4 fires
   through the GTM "GA4 Configuration" tag — not this snippet.

   If loading GA4 DIRECTLY (without GTM), uncomment and add
   to your <head> before cc-tracking.js:

   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>

   The gtag() initialisation below is still required in
   either case — it sets up the dataLayer interface.
═══════════════════════════════════════════════════════════ */
function _initGA4() {
  /* Set up gtag() function regardless of how GA4 loads */
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  if (CC_CONFIG.GA4_ID === 'G-XXXXXXXXXX') {
    _log('GA4 skipped — placeholder ID.');
    return;
  }

  /* Push consent defaults BEFORE config (if consent-gated) */
  if (CC_CONFIG.CONSENT_REQUIRED) {
    _gtag('consent', 'default', {
      ad_storage:            'denied',
      analytics_storage:     'denied',
      functionality_storage: 'denied',
      personalization_storage: 'denied',
      wait_for_update: 500,
    });
  }

  /* GA4 base configuration */
  _gtag('js', new Date());
  _gtag('config', CC_CONFIG.GA4_ID, {
    /* Page-view hit fires automatically on config call.
       Set send_page_view: false if GTM fires pageviews instead. */
    send_page_view:   true,
    /* Anonymize IP (EU compliance — enabled by default in GA4,
       this makes it explicit) */
    anonymize_ip:     true,
    /* Cookie domain — let GA4 auto-detect */
    cookie_domain:    'auto',
    /* Cookie flags for HTTPS-only, SameSite=None for cross-site */
    cookie_flags:     'SameSite=None;Secure',
    /* Custom dimensions mapped to event parameters */
    custom_map: {
      dimension1: 'funnel_variant',
      dimension2: 'book_id',
      dimension3: 'source',
    },
    /* Link attribution for multi-page funnel tracking */
    link_attribution: true,
    /* Enhanced measurement — auto-track scroll, outbound clicks,
       site search, video engagement, file downloads            */
    enhanced_measurement: {
      scroll_threshold:  90,  /* Fire scroll event at 90% depth */
      outbound_click:    true,
      site_search:       true,
      video_engagement:  true,
      file_download:     true,
    },
  });
  _log('GA4 configured → ' + CC_CONFIG.GA4_ID);

  /* Load gtag.js script if not already present
     (only needed when NOT using GTM to load GA4) */
  if (!document.getElementById('ga4-script') && !window._gtmScriptLoaded) {
    var s   = document.createElement('script');
    s.async = true;
    s.id    = 'ga4-script';
    s.src   = 'https://www.googletagmanager.com/gtag/js?id=' + CC_CONFIG.GA4_ID;
    document.head.appendChild(s);
    _log('GA4 script injected (standalone mode).');
  }
}


/* ═══════════════════════════════════════════════════════════
   ③ MICROSOFT CLARITY
   ───────────────────────────────────────────────────────────
   Clarity provides session recordings and heatmaps.
   Essential for CRO on fund pages, book forms, and the
   HubSpot calendar embed — see exactly where investors
   hesitate, rage-click, or abandon.

   Get your Project ID at: clarity.microsoft.com
   → New Project → Web → copy the 10-char ID

   Clarity is privacy-compliant by default (no PII captured).
   It respects Do Not Track headers automatically.
═══════════════════════════════════════════════════════════ */
function _initClarity() {
  if (CC_CONFIG.CLARITY_ID === 'CLARITY_XXXX') {
    _log('Clarity skipped — placeholder ID.');
    return;
  }
  (function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(window,document,'clarity','script', CC_CONFIG.CLARITY_ID);
  _log('Clarity loaded → ' + CC_CONFIG.CLARITY_ID);
}


/* ═══════════════════════════════════════════════════════════
   ④ HUBSPOT TRACKING PIXEL
   ───────────────────────────────────────────────────────────
   The HubSpot tracking pixel enables:
   • Contact identification (email-based, after form fills)
   • Page view tracking inside HubSpot CRM
   • Chat widget (if enabled in HubSpot settings)
   • HubSpot list membership based on page visits
   • Marketing email link tracking

   Find your Portal ID:
   HubSpot → Settings (gear icon) → Account Setup → Account ID
   It is a pure numeric string, e.g. "12345678"

   Region:
   'na1' = North America (default for US accounts)
   'eu1' = EU-hosted accounts (check HubSpot Settings → Account Setup)

   IMPORTANT: This script should only load on main-site pages
   (/). The /lp/* funnel pages use separate HubSpot forms that
   have their own tracking context — including this pixel on
   /lp/* would double-count page views in HubSpot analytics.
═══════════════════════════════════════════════════════════ */
function _initHubSpot() {
  if (CC_CONFIG.HS_PORTAL_ID === 'HS_PORTAL_ID') {
    _log('HubSpot pixel skipped — placeholder ID.');
    return;
  }
  var s    = document.createElement('script');
  s.type   = 'text/javascript';
  s.id     = 'hs-script-loader';
  s.async  = true;
  s.defer  = true;
  s.src    = '//' + 'js-' + CC_CONFIG.HS_REGION + '.hs-scripts.com/' + CC_CONFIG.HS_PORTAL_ID + '.js';
  document.head.appendChild(s);
  _log('HubSpot pixel loading → portal ' + CC_CONFIG.HS_PORTAL_ID);
}


/* ═══════════════════════════════════════════════════════════
   ⑤ CUSTOM GA4 EVENT DEFINITIONS
   ───────────────────────────────────────────────────────────
   These are the three conversion/lead events defined in the
   Cardone Capital skills spec. Each function:
   1. Fires a gtag() event to GA4
   2. Pushes to dataLayer for GTM trigger pickup
   3. Logs to console in DEBUG mode
   4. Optionally fires a Clarity custom tag for session labelling
═══════════════════════════════════════════════════════════ */

/**
 * EVENT: call_booked
 * ──────────────────
 * Fire on: /lp/thank-you-call/ page load
 * Also fire directly from the Alpine.js _fireGA4() method
 * in lp-thank-you-call.html
 *
 * @param {string} funnelVariant — one of:
 *   'general'  → /lp/investor-call/
 *   'bitcoin'  → /lp/fund29-bitcoin/
 *   'cashonly' → /lp/fund30-cashonly/
 *   'ira'      → /lp/ira-401k/
 *   'spanish'  → /lp/es/
 *
 * Example usage:
 *   window.CCTrack.callBooked('bitcoin');
 *   window.CCTrack.callBooked(); // defaults to 'general'
 */
function trackCallBooked(funnelVariant) {
  var variant = funnelVariant || _detectVariant() || 'general';

  /* GA4 event */
  _gtag('event', 'call_booked', {
    event_category: 'conversion',
    funnel_variant:  variant,
    value:           1,
    currency:        'USD',
  });

  /* DataLayer push for GTM (fires any GTM trigger watching
     for event name 'call_booked' or custom event 'conversion') */
  _dlPush({
    event:           'call_booked',
    event_category:  'conversion',
    funnel_variant:  variant,
    value:           1,
  });

  /* Microsoft Clarity — tag session with conversion type */
  if (typeof window.clarity === 'function') {
    window.clarity('set', 'conversion_type', 'call_booked');
    window.clarity('set', 'funnel_variant',  variant);
  }

  /* HubSpot custom behavioral event (if hs-analytics is ready) */
  if (typeof window._hsq !== 'undefined') {
    window._hsq.push(['trackCustomBehavioralEvent', {
      name:       'call_booked',
      properties: { funnel_variant: variant }
    }]);
  }

  _log('call_booked fired → variant: "' + variant + '"');
}


/**
 * EVENT: book_download
 * ─────────────────────
 * Fire on: /academy/ book form submit (Alpine.js submit handler)
 * and from exit-intent forms on article pages
 *
 * @param {string} bookId — one of:
 *   're-investor-guide'    → Book 1 (HubSpot Seq #4)
 *   '401k-ira-book'        → Book 2 (HubSpot Seq #2)
 *   'bitcoin-re-guide'     → Book 3 (HubSpot Seq #5)
 *   'how-to-create-wealth-re' → Book 4 (HubSpot Seq #1)
 *   '1031-exchange-book'   → Book 5 (HubSpot Seq #3)
 *
 * @param {string} source — where the form was submitted:
 *   'academy'              → /academy/ inline book form
 *   'exit-intent-bitcoin'  → exit bar on /academy/bitcoin-real-estate/
 *   'exit-intent-re101'    → exit bar on /academy/real-estate-101/
 *   'exit-intent-ira'      → exit bar on /academy/ira-401k-guide/
 *   'exit-intent-lp-general'   → exit on /lp/investor-call/
 *   'exit-intent-lp-bitcoin'   → exit on /lp/fund29-bitcoin/
 *   'exit-intent-lp-cashonly'  → exit on /lp/fund30-cashonly/
 *   'exit-intent-lp-ira'       → exit on /lp/ira-401k/
 *   'exit-intent-lp-spanish'   → exit on /lp/es/
 *
 * HubSpot sequence mapping (for reference):
 *   Book 1 → Seq #4 → General/Fund30/Spanish funnel nurture
 *   Book 2 → Seq #2 → IRA funnel nurture
 *   Book 3 → Seq #5 → Fund29/Bitcoin funnel nurture
 *   Book 4 → Seq #1 → Academy flagship nurture
 *   Book 5 → Seq #3 → 1031 Exchange nurture
 *
 * Example usage:
 *   window.CCTrack.bookDownload('re-investor-guide', 'academy');
 *   window.CCTrack.bookDownload('bitcoin-re-guide', 'exit-intent-bitcoin');
 */
function trackBookDownload(bookId, source) {
  var bId = bookId || 'unknown';
  var src  = source  || _detectPageSource() || 'unknown';

  _gtag('event', 'book_download', {
    event_category: 'lead',
    book_id:         bId,
    source:          src,
    value:           1,
    currency:        'USD',
  });

  _dlPush({
    event:          'book_download',
    event_category: 'lead',
    book_id:         bId,
    source:          src,
    value:           1,
  });

  /* Clarity: tag the session so you can filter recordings
     by which book triggered the download */
  if (typeof window.clarity === 'function') {
    window.clarity('set', 'lead_type',  'book_download');
    window.clarity('set', 'book_id',    bId);
  }

  if (typeof window._hsq !== 'undefined') {
    window._hsq.push(['trackCustomBehavioralEvent', {
      name:       'book_download',
      properties: { book_id: bId, source: src }
    }]);
  }

  _log('book_download fired → book: "' + bId + '" source: "' + src + '"');
}


/**
 * EVENT: contact_form_submit
 * ──────────────────────────
 * Fire on: /thank-you/ page load (post organic contact form)
 * This page is reached after the form on /contact/ submits.
 * The event fires on page load — every /thank-you/ load = 1 lead.
 *
 * Example usage:
 *   window.CCTrack.contactForm();
 *   // Called automatically in the auto-init below on /thank-you/
 */
function trackContactForm() {
  _gtag('event', 'contact_form_submit', {
    event_category: 'lead',
    value:           1,
    currency:        'USD',
  });

  _dlPush({
    event:          'contact_form_submit',
    event_category: 'lead',
    value:           1,
  });

  if (typeof window.clarity === 'function') {
    window.clarity('set', 'lead_type', 'contact_form');
  }

  if (typeof window._hsq !== 'undefined') {
    window._hsq.push(['trackCustomBehavioralEvent', {
      name: 'contact_form_submit',
      properties: {}
    }]);
  }

  _log('contact_form_submit fired.');
}


/* ─────────────────────────────────────────────────────────────
   ADDITIONAL GA4 EVENTS — available for future use
   ─────────────────────────────────────────────────────────────
   These events are not in the original spec but are strongly
   recommended for a financial services site. Wire them to
   clicks/interactions in your Alpine.js or HTML event handlers.
───────────────────────────────────────────────────────────── */

/**
 * EVENT: investor_portal_click
 * Track every click on the AppFolio "Investor Login ↗" nav link.
 * Add onclick="CCTrack.investorPortalClick()" to the nav anchor.
 */
function trackInvestorPortalClick() {
  _gtag('event', 'investor_portal_click', {
    event_category: 'navigation',
    destination:    'appfolio',
  });
  _dlPush({ event: 'investor_portal_click', destination: 'appfolio' });
  _log('investor_portal_click fired.');
}

/**
 * EVENT: fund_card_click
 * Track which fund card a visitor clicks on the /invest/ page
 * or the homepage fund cards section.
 *
 * @param {string} fundId — 'fund29' or 'fund30'
 */
function trackFundCardClick(fundId) {
  _gtag('event', 'fund_card_click', {
    event_category: 'engagement',
    fund_id:         fundId || 'unknown',
  });
  _dlPush({ event: 'fund_card_click', fund_id: fundId || 'unknown' });
  _log('fund_card_click fired → ' + fundId);
}

/**
 * EVENT: schedule_click
 * Track every "Book a Call" / "Book a Free Investor Call" CTA click.
 * Fires before the user reaches the HubSpot calendar.
 * Add onclick="CCTrack.scheduleClick(this.dataset.source)"
 * to every Book a Call button, setting data-source="<location>".
 *
 * @param {string} source — e.g. 'hero', 'sticky-cta', 'inline-cta-s3', 'sidebar'
 */
function trackScheduleClick(source) {
  _gtag('event', 'schedule_click', {
    event_category: 'engagement',
    source:          source || 'unknown',
  });
  _dlPush({ event: 'schedule_click', source: source || 'unknown' });
  _log('schedule_click fired → ' + source);
}

/**
 * EVENT: ira_sms_click
 * Track clicks on SMS "Text IRA to 305-407-0276" deep links.
 * Add onclick="CCTrack.iraSmsClick()" to the SMS anchor.
 */
function trackIraSmsClick() {
  _gtag('event', 'ira_sms_click', {
    event_category: 'engagement',
    action:          'sms_ira',
  });
  _dlPush({ event: 'ira_sms_click' });
  _log('ira_sms_click fired.');
}


/* ─────────────────────────────────────────────────────────────
   AUTO-DETECTION HELPERS
   Used by event functions to auto-detect context when
   explicit parameters are not passed.
───────────────────────────────────────────────────────────── */

/** Detect funnel variant from URL ?variant= param */
function _detectVariant() {
  return new URLSearchParams(window.location.search).get('variant') || null;
}

/** Detect a reasonable source label from current page path */
function _detectPageSource() {
  var p = _path();
  if (p === '/academy/')                         return 'academy';
  if (p === '/academy/bitcoin-real-estate/')     return 'exit-intent-bitcoin';
  if (p === '/academy/real-estate-101/')         return 'exit-intent-re101';
  if (p === '/academy/ira-401k-guide/')          return 'exit-intent-ira';
  if (p.indexOf('/lp/') === 0)                   return 'lp-' + p.split('/lp/')[1].replace(/\//g, '');
  return null;
}


/* ═══════════════════════════════════════════════════════════
   ⑥ HUBSPOT PAGE VIEW TRACKING
   ───────────────────────────────────────────────────────────
   The _hsq array is HubSpot's analytics queue. Pushing
   'setPath' + 'trackPageView' re-fires a HubSpot pageview,
   which is useful for SPAs where the URL changes without a
   full page reload. On standard multi-page sites this is
   handled automatically by the tracking pixel.
═══════════════════════════════════════════════════════════ */
function _trackHubSpotPageView(path) {
  if (typeof window._hsq === 'undefined') {
    window._hsq = window._hsq || [];
  }
  window._hsq.push(['setPath', path || _path()]);
  window._hsq.push(['trackPageView']);
  _log('HubSpot pageview tracked → ' + (path || _path()));
}


/* ═══════════════════════════════════════════════════════════
   ⑦ CONSENT MANAGEMENT
   ───────────────────────────────────────────────────────────
   If CONSENT_REQUIRED = true, all trackers are held until
   window.CCTrack.grantConsent() is called.
   Call this from your CMP (OneTrust, Cookiebot, Axeptio, etc.)
   accept callback:

   // In your CMP callback:
   window.CCTrack.grantConsent();

   For GA4 consent mode update:
   window.CCTrack.grantConsent({ analytics: true, ads: false });
═══════════════════════════════════════════════════════════ */
function grantConsent(opts) {
  var options = opts || {};
  _consentGranted = true;

  /* Update GA4 consent state */
  _gtag('consent', 'update', {
    analytics_storage:     'granted',
    ad_storage:            options.ads !== false ? 'granted' : 'denied',
    functionality_storage: 'granted',
    personalization_storage: options.personalization !== false ? 'granted' : 'denied',
  });

  /* If trackers haven't initialised yet (held by consent gate),
     run the init sequence now */
  if (!_initialized) _init();

  _log('Consent granted → analytics: true, ads: ' + (options.ads !== false));
}

function revokeConsent() {
  _consentGranted = false;
  _gtag('consent', 'update', {
    analytics_storage:      'denied',
    ad_storage:             'denied',
    functionality_storage:  'denied',
    personalization_storage: 'denied',
  });
  _log('Consent revoked.');
}


/* ═══════════════════════════════════════════════════════════
   ⑧ AUTO-INIT ON PAGE LOAD
   ───────────────────────────────────────────────────────────
   Fires all trackers when the DOM is ready.
   Also auto-fires page-specific conversion events.
═══════════════════════════════════════════════════════════ */
function _init() {
  if (!_consentGranted) {
    _log('Init held — consent not yet granted.');
    return;
  }
  if (_initialized) return; /* prevent double-init */
  _initialized = true;

  /* Load all tracker scripts */
  _initGTM();
  _initGA4();
  _initClarity();

  /* HubSpot pixel loads on all MAIN SITE pages only.
     Do NOT load on /lp/* pages — managed separately. */
  if (!_onPage('/lp/')) {
    _initHubSpot();
  }

  /* ── Page-specific auto-events ── */

  /* /thank-you/ — organic contact form conversion */
  if (_path() === '/thank-you/') {
    /* Small delay ensures GA4 is fully configured before event */
    setTimeout(function () {
      trackContactForm();
    }, 300);
  }

  /* /lp/thank-you-call/ — call booked conversion */
  if (_path() === '/lp/thank-you-call/') {
    var variant = _detectVariant() || 'general';
    setTimeout(function () {
      trackCallBooked(variant);
    }, 300);
  }

  /* Inject GTM noscript into body */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _injectGTMNoscript);
  } else {
    _injectGTMNoscript();
  }

  _log('CCTrack initialised on ' + _path());
}


/* ─────────────────────────────────────────────────────────────
   KICK OFF INIT
   Runs immediately if DOM is already ready, otherwise waits.
───────────────────────────────────────────────────────────── */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', _init);
} else {
  _init();
}


/* ═══════════════════════════════════════════════════════════
   PUBLIC API — window.CCTrack
   ───────────────────────────────────────────────────────────
   Expose all tracking functions and utilities for use by:
   • Alpine.js components (CCTrack.bookDownload(...))
   • Inline onclick handlers
   • Other page scripts
   • Browser console testing
═══════════════════════════════════════════════════════════ */
window.CCTrack = {

  /* ── Conversion & lead events ── */
  callBooked:          trackCallBooked,
  bookDownload:        trackBookDownload,
  contactForm:         trackContactForm,

  /* ── Engagement events ── */
  investorPortalClick: trackInvestorPortalClick,
  fundCardClick:       trackFundCardClick,
  scheduleClick:       trackScheduleClick,
  iraSmsClick:         trackIraSmsClick,

  /* ── HubSpot ── */
  trackPageView:       _trackHubSpotPageView,

  /* ── Consent management ── */
  grantConsent:        grantConsent,
  revokeConsent:       revokeConsent,

  /* ── Config access (read-only reference) ── */
  config: CC_CONFIG,

  /* ── Development helpers ── */

  /**
   * CCTrack.validate()
   * Logs all active tracker status to console.
   * Run from DevTools to confirm trackers are firing.
   */
  validate: function () {
    console.group('[CCTrack] Tracker Status');
    console.log('Page path:     ', _path());
    console.log('Consent:       ', _consentGranted ? '✓ Granted' : '⚠ Pending');
    console.log('Initialised:   ', _initialized ? '✓ Yes' : '✗ No');
    console.log('GTM ID:        ', CC_CONFIG.GTM_ID);
    console.log('GA4 ID:        ', CC_CONFIG.GA4_ID);
    console.log('Clarity ID:    ', CC_CONFIG.CLARITY_ID);
    console.log('HubSpot ID:    ', CC_CONFIG.HS_PORTAL_ID);
    console.log('dataLayer:     ', window.dataLayer ? window.dataLayer.length + ' events' : 'not found');
    console.log('gtag:          ', typeof window.gtag === 'function' ? '✓ present' : '✗ missing');
    console.log('clarity:       ', typeof window.clarity === 'function' ? '✓ present' : '✗ missing');
    console.log('_hsq:          ', Array.isArray(window._hsq) ? '✓ present (' + window._hsq.length + ' items)' : '✗ missing');
    console.groupEnd();
  },

  /**
   * CCTrack.testFire()
   * Fires all three conversion events with test data.
   * Use in DevTools on a local/staging build only.
   * DO NOT call on production — creates bogus conversion data.
   */
  testFire: function () {
    console.warn('[CCTrack] testFire() called — DO NOT run in production.');
    trackCallBooked('bitcoin');
    trackBookDownload('re-investor-guide', 'academy');
    trackContactForm();
    console.log('[CCTrack] All 3 test events fired. Check GA4 DebugView.');
  },

  /**
   * CCTrack.setDebug(bool)
   * Toggle debug logging at runtime.
   * CCTrack.setDebug(true)  — enable verbose logs
   * CCTrack.setDebug(false) — silence
   */
  setDebug: function (enabled) {
    CC_CONFIG.DEBUG = !!enabled;
    console.log('[CCTrack] Debug mode: ' + (CC_CONFIG.DEBUG ? 'ON' : 'OFF'));
  },
};


/*
 * ============================================================
 * STATIC HTML SNIPPET REFERENCE
 * ============================================================
 * Copy the snippets below directly into your HTML templates.
 * Replace GTM-XXXXXXX with your real GTM container ID.
 *
 * ── HEAD SNIPPET (paste in <head>, before other scripts) ──
 *
 * <!-- Google Tag Manager -->
 * <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
 * new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
 * j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;
 * j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
 * f.parentNode.insertBefore(j,f);
 * })(window,document,'script','dataLayer','GTM-XXXXXXX');</script>
 * <!-- End Google Tag Manager -->
 *
 * <!-- Google Analytics 4 (standalone, no GTM) -->
 * <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
 *
 * <!-- Cardone Capital Tracking -->
 * <script src="/assets/js/cc-tracking.js"></script>
 *
 *
 * ── BODY SNIPPET (paste immediately after <body> tag) ──
 *
 * <!-- Google Tag Manager (noscript) -->
 * <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
 * height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
 * <!-- End Google Tag Manager (noscript) -->
 *
 *
 * ── USAGE IN ALPINE.JS (example — academy.html book submit) ──
 *
 * submit(n, bookId) {
 *   window.CCTrack && CCTrack.bookDownload(bookId, 'academy');
 *   this.done = { ...this.done, [n]: true };
 *   this.open = null;
 * }
 *
 *
 * ── USAGE ON BOOK A CALL BUTTON ──
 *
 * <a href="/schedule/"
 *    onclick="window.CCTrack && CCTrack.scheduleClick('hero')"
 *    class="btn btn-primary">
 *   Book a Free Investor Call →
 * </a>
 *
 *
 * ── USAGE ON INVESTOR PORTAL LINK ──
 *
 * <a href="https://investors.appfolioim.com/..."
 *    onclick="window.CCTrack && CCTrack.investorPortalClick()"
 *    target="_blank">
 *   Investor Login ↗
 * </a>
 *
 * ============================================================
 */
