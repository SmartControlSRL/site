function attribute(tag, name) {
  return tag
    .match(new RegExp(`\\s${name}=(?:"([^"]*)"|'([^']*)')`, 'i'))
    ?.slice(1)
    .find((value) => value !== undefined);
}

export function hasRobotsDirective(value, directive) {
  const expected = directive.toLowerCase();
  return value
    ?.toLowerCase()
    .split(/[\s,]+/)
    .filter(Boolean)
    .includes(expected) ?? false;
}

export function hasRobotsMeta(html, directive) {
  const metaTags = html.match(/<meta\b[^>]*>/gi) ?? [];
  return metaTags.some((tag) =>
    attribute(tag, 'name')?.trim().toLowerCase() === 'robots'
    && hasRobotsDirective(attribute(tag, 'content'), directive)
  );
}

export function nginxHeaderHasDirective(config, headerName, directive) {
  const escapedName = headerName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const headerPattern = new RegExp(
    `\\badd_header\\s+${escapedName}\\s+(?:"([^"]*)"|'([^']*)'|([^;\\s]+))[^;]*;`,
    'gi',
  );
  return [...config.matchAll(headerPattern)].some((match) =>
    hasRobotsDirective(match.slice(1).find((value) => value !== undefined), directive)
  );
}
