// Central UI string table for RO (default) + EN. Full parity required.
// Page/marketing copy lives in content collections (added in a later phase);
// this table is for chrome (nav, footer, CTAs) shared across pages.

export const languages = {
  ro: 'Română',
  en: 'English',
} as const;

export const defaultLang = 'ro';

export type Lang = keyof typeof languages;

export const ui = {
  ro: {
    'nav.services': 'Servicii',
    'nav.cloud': 'Cloud & Modernizare',
    'nav.products': 'Soluții',
    'nav.seknet': 'SEKNET',
    'nav.svpn': 'S-VPN',
    'nav.contact': 'Contact',
    // Site-wide primary CTA — book the free 2-day assessment.
    'cta.assessment': 'Programează evaluarea gratuită de 2 zile',
    'cta.assessment.short': 'Evaluare gratuită',
    // Products-only CTA.
    'cta.demo': 'Cere un demo',
    'footer.privacy': 'Politica de confidențialitate',
    'footer.rights': 'Toate drepturile rezervate.',
    'footer.tagline': 'Trusted Service Delivery Partner',
    'company.name': 'Smart Control',
    'company.address': 'Intrarea Aviator Teodor Iliescu 37, 011672 București',
  },
  en: {
    'nav.services': 'Services',
    'nav.cloud': 'Cloud & Modernization',
    'nav.products': 'Solutions',
    'nav.seknet': 'SEKNET',
    'nav.svpn': 'S-VPN',
    'nav.contact': 'Contact',
    'cta.assessment': 'Book the free 2-day assessment',
    'cta.assessment.short': 'Free assessment',
    'cta.demo': 'Request a demo',
    'footer.privacy': 'Privacy policy',
    'footer.rights': 'All rights reserved.',
    'footer.tagline': 'Trusted Service Delivery Partner',
    'company.name': 'Smart Control',
    'company.address': 'Intrarea Aviator Teodor Iliescu 37, 011672 București',
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

// Contact + canonical CTA targets. Email is the only contact channel
// (no forms, no phone). Subject-routed so inbound self-sorts.
export const EMAIL = 'office@smartcontrol.ro';
export const mailto = (subject: string) =>
  `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}`;
export const CTA_ASSESSMENT = mailto('Evaluare gratuită');
export const CTA_DEMO_SEKNET = mailto('Demo SEKNET');
export const CTA_DEMO_SVPN = mailto('Demo S-VPN');

// Company founded in 2003 — compute years so the figure never goes stale.
export const FOUNDED = 2003;
export const yearsInBusiness = (now: number) => now - FOUNDED;
