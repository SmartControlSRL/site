/** Apply only the owner's registered navigation-logo exception, never prose or metadata. */
export function applyBrandClaimScope(text, path, claimId, approvedCopy = []) {
  const approval = approvedCopy.find(entry =>
    entry.id === claimId && entry.scope === 'navigation-brand-lockup' &&
    entry.wording === 'DIN 2003' && entry.source === 'src/components/Nav.astro' &&
    entry.status === 'approved-copy' && entry.approval && entry.reviewBy
  );
  if (!approval || (path !== approval.source && !/^dist\/.+\.html$/.test(path))) return text;
  return text.replace(/<nav\b(?=[^>]*\bdata-nav-shrink(?:\s|=|>))[^>]*>[\s\S]*?<\/nav\s*>/g, nav =>
    nav.replace(/<a\b[^>]*>[\s\S]*?<\/a\s*>/g, link => {
      if (!/<span\b[^>]*\bdata-brand-wordmark(?:\s|=|>)/.test(link)) return link;
      return link.replace(/(<span\b(?=[^>]*\bdata-brand-since(?:\s|=|>))[^>]*>)\s*DIN 2003\s*(<\/span\s*>)/g,
        '$1[approved brand lockup]$2');
    })
  );
}
