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
    'nav.cloud': 'Cloud & Modernizare',
    'nav.seknet': 'SEKNET',
    'nav.svpn': 'S-VPN',
    'nav.contact': 'Contact',
    'nav.menu.open': 'Deschide meniul',
    'nav.menu.close': 'Închide meniul',
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
      'Proiectăm, operăm și securizăm infrastructuri IT pentru companii din România și internațional — echipă proprie, abordare consultativă.',
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
    'nav.cloud': 'Cloud & Modernization',
    'nav.seknet': 'SEKNET',
    'nav.svpn': 'S-VPN',
    'nav.contact': 'Contact',
    'nav.menu.open': 'Open menu',
    'nav.menu.close': 'Close menu',
    'cta.assessment': 'Request assessment',
    'cta.demo.seknet': 'Request a demo',
    'cta.demo.svpn': 'Request a demo',
    'subject.assessment': 'Free assessment',
    'subject.demo.seknet': 'Demo SEKNET',
    'subject.demo.svpn': 'Demo S-VPN',
    'footer.tagline': 'Trusted Service Delivery Partner',
    'footer.blurb':
      'We design, operate and secure IT infrastructure for companies in Romania and abroad — our own team, a consultative approach.',
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

/** Locale-aware path helper (RO at /, EN under /en/). */
export function localizedPath(lang: Lang, path: string): string {
  if (lang === 'en') return `/en${path === '/' ? '' : path}`;
  return path;
}

// Routes whose EN slug differs from the mechanical /en prefix.
// RO path → EN path (both with trailing-slash-insensitive matching).
const ROUTE_MAP: Record<string, string> = {
  '/confidentialitate': '/en/privacy',
};

/** The same page in the other locale, honoring per-locale slugs. */
export function altLocalePath(pathname: string): string {
  const clean = pathname.replace(/\/$/, '') || '/';
  if (clean.startsWith('/en')) {
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
  if (clean.startsWith('/en')) return { ro: altLocalePath(clean), en: clean };
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
