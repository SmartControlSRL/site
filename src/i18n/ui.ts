// Central UI string table for RO (default) + EN. Full parity required.
// Page/marketing copy lives in content collections / page files; this table
// is for chrome (nav, footer, CTAs) shared across pages. Export wording per
// RESOLUTIONS §11 ("Solicită assessment", "Solicită un demo").

export const languages = {
  ro: 'Română',
  en: 'English',
} as const;

export const defaultLang = 'ro';

export type Lang = keyof typeof languages;

export const ui = {
  ro: {
    // — Nav —
    'nav.services': 'Servicii',
    'nav.products': 'Soluții',
    'nav.cloud': 'Cloud & Modernizare',
    'nav.seknet': 'SEKNET',
    'nav.svpn': 'S-VPN',
    'nav.contact': 'Contact',
    'nav.menu.open': 'Deschide meniul',
    'nav.menu.close': 'Închide meniul',
    // — A11y chrome (skip link, landmark labels) —
    'a11y.skip': 'Sari la conținut',
    'a11y.nav': 'Principal',
    'a11y.home': 'Smart Control — acasă',
    // — CTAs (export wording, RESOLUTIONS §11) —
    'cta.assessment': 'Solicită assessment',
    'cta.demo.seknet': 'Solicită un demo',
    'cta.demo.svpn': 'Solicită un demo',
    // — Email subjects (routed inbound, RESOLUTIONS §13) —
    'subject.assessment': 'Evaluare gratuită',
    'subject.demo.seknet': 'Demo SEKNET',
    'subject.demo.svpn': 'Demo S-VPN',
    // — Footer —
    'footer.tagline': 'Trusted Service Delivery Partner',
    'footer.blurb':
      'Servicii IT enterprise și securitate cibernetică pentru companii din România și internațional, livrate integral de echipa noastră din 2003.',
    'footer.col.services': 'Servicii',
    'footer.col.solutions': 'Soluții',
    'footer.col.contact': 'Contact',
    'footer.service.infra': 'Infrastructură & Cloud',
    'footer.service.security': 'Securitate & Conformitate',
    'footer.service.software': 'Software & Automatizare',
    'footer.service.managed': 'Servicii Gestionate',
    'footer.privacy': 'Politica de confidențialitate',
    'footer.rights': 'Toate drepturile rezervate.',
    'footer.website': 'www.smartcontrol.ro',
    // — Company —
    'company.name': 'Smart Control SRL',
    'company.address.l1': 'Intrarea Aviator Teodor Iliescu 37,',
    'company.address.l2': '011672 București',
    'lang.switch': 'EN',
    'lang.switch.aria': 'Switch language to English',
  },
  en: {
    // — Nav —
    'nav.services': 'Services',
    'nav.products': 'Solutions',
    'nav.cloud': 'Cloud & Modernization',
    'nav.seknet': 'SEKNET',
    'nav.svpn': 'S-VPN',
    'nav.contact': 'Contact',
    'nav.menu.open': 'Open menu',
    'nav.menu.close': 'Close menu',
    'a11y.skip': 'Skip to content',
    'a11y.nav': 'Primary',
    'a11y.home': 'Smart Control — home',
    'cta.assessment': 'Request an assessment',
    'cta.demo.seknet': 'Request a demo',
    'cta.demo.svpn': 'Request a demo',
    // Stays Romanian on EN pages too: the subject is a self-routing inbox
    // token (RESOLUTIONS §13), same pattern as 'Demo SEKNET' / 'Demo S-VPN'
    // being identical across locales.
    'subject.assessment': 'Evaluare gratuită',
    'subject.demo.seknet': 'Demo SEKNET',
    'subject.demo.svpn': 'Demo S-VPN',
    'footer.tagline': 'Trusted Service Delivery Partner',
    'footer.blurb':
      'Enterprise IT services and cybersecurity for companies in Romania and abroad, delivered entirely by our own team since 2003.',
    'footer.col.services': 'Services',
    'footer.col.solutions': 'Solutions',
    'footer.col.contact': 'Contact',
    'footer.service.infra': 'Infrastructure & Cloud',
    'footer.service.security': 'Security & Compliance',
    'footer.service.software': 'Software & Automation',
    'footer.service.managed': 'Managed Services',
    'footer.privacy': 'Privacy policy',
    'footer.rights': 'All rights reserved.',
    'footer.website': 'www.smartcontrol.ro',
    'company.name': 'Smart Control SRL',
    'company.address.l1': 'Intrarea Aviator Teodor Iliescu 37,',
    'company.address.l2': '011672 București',
    'lang.switch': 'RO',
    'lang.switch.aria': 'Comută limba în română',
  },
} as const;

export type UIKey = keyof (typeof ui)['ro'];

/** Returns a translator bound to the given language, falling back to RO. */
export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}

/** Resolve the active language from an Astro URL pathname. */
export function getLangFromUrl(url: URL): Lang {
  const [, seg] = url.pathname.split('/');
  if (seg === 'en') return 'en';
  return 'ro';
}

/** Locale-aware path helper (RO at /, EN under /en/). Emits trailing-slash
 *  URLs so internal links match the build's canonical directory-format form
 *  (…/cloud/ — no redirect hop); hash fragments are kept after the slash. */
export function localizedPath(lang: Lang, path: string): string {
  const [bare, hash] = path.split('#');
  const prefixed = lang === 'en' ? `/en${bare === '/' ? '' : bare}` : bare;
  const slashed = prefixed.endsWith('/') ? prefixed : `${prefixed}/`;
  return hash ? `${slashed}#${hash}` : slashed;
}

// Routes whose EN slug differs from the mechanical /en prefix.
// RO path → EN path (both with trailing-slash-insensitive matching).
const ROUTE_MAP: Record<string, string> = {
  '/confidentialitate': '/en/privacy',
};

/** The same page in the other locale, honoring per-locale slugs. */
export function altLocalePath(pathname: string): string {
  const clean = pathname.replace(/\/$/, '') || '/';
  if (/^\/en(\/|$)/.test(clean)) {
    const ro = Object.entries(ROUTE_MAP).find(([, en]) => en === clean)?.[0];
    if (ro) return ro;
    return clean.replace(/^\/en(\/|$)/, '/') || '/';
  }
  if (ROUTE_MAP[clean]) return ROUTE_MAP[clean];
  return `/en${clean === '/' ? '' : clean}`;
}

/** RO + EN paths for the current page (for hreflang alternates). */
export function hreflangPair(pathname: string): { ro: string; en: string } {
  const clean = pathname.replace(/\/$/, '') || '/';
  if (/^\/en(\/|$)/.test(clean)) return { ro: altLocalePath(clean), en: clean };
  return { ro: clean, en: altLocalePath(clean) };
}

// Contact = email only (no forms, no phone). Split for the obfuscation
// pattern: components render data-email-user / data-email-domain and
// initEmails (motion.js) joins them + appends ?subject= at runtime.
export const EMAIL_USER = 'office';
export const EMAIL_DOMAIN = 'smartcontrol.ro';
export const EMAIL = `${EMAIL_USER}@${EMAIL_DOMAIN}`;

// Company founded in 2003 — compute years so the figure never goes stale.
export const FOUNDED = 2003;
export const yearsInBusiness = (now: number) => now - FOUNDED;
// Stat-block decade floor (RESOLUTIONS §10): the "20+" figure stays the
// computed floor — 2026 → 20, 2033 → 30.
export const yearsDecadeFloor = (now: number) =>
  Math.floor((now - FOUNDED) / 10) * 10;
