/** Apply only the owner's registered site-header brand label exception, never prose or metadata. */
export function applyBrandClaimScope(text, path, claimId, approvedCopy = []) {
  const approval = approvedCopy.find(entry =>
    entry.id === claimId && entry.scope === 'navigation-brand-label' &&
    entry.wording === 'DIN 2003' && entry.source === 'src/components/Nav.astro' &&
    entry.status === 'approved-copy' && entry.approval && entry.reviewBy
  );
  if (!approval || (path !== approval.source && !/^dist\/.+\.html$/.test(path))) return text;
  return text.replace(/<header\b[^>]*>[\s\S]*?<\/header\s*>/g, header => {
    if (!/<nav\b(?=[^>]*\bdata-nav-shrink(?:\s|=|>))/.test(header)) return header;
    return header.replace(/(<span\b(?=[^>]*\bdata-brand-since(?:\s|=|>))[^>]*>)\s*DIN 2003\s*(<\/span\s*>)/g,
      '$1[approved brand label]$2');
  });
}
