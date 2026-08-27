export const CONTACT_ADDRESS = 'office@smartcontrol.ro';
export const CONTACT_MAILTO = `mailto:${CONTACT_ADDRESS}`;

export function isCanonicalContactHref(href) {
  if (href.includes('#')) return false;
  const destination = href.split('?', 1)[0];
  return destination.toLowerCase() === CONTACT_MAILTO;
}
