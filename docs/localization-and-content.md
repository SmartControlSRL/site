# Localisation and shared-content guide

`docs/build-specs/RESOLUTIONS.md` is the binding wording record. This guide
defines how to apply it without allowing the Romanian and English routes to
drift.

## Sources of truth

- Shared chrome and CTA labels: `src/i18n/ui.ts`.
- Services hub and solutions hub: `src/content/hub-pages.ts`.
- Security, Software, and Managed Services detail pages:
  `src/content/service-pages.ts`.
- Shared renderers: `src/components/pages/`.
- Unique Cloud and product-detail copy: the corresponding `.astro` page pair.

Update both locales in the same typed record. Do not copy a shared template
back into locale-specific page files. Route-specific layout may be added
through an explicit typed field or a named slot when it has genuine semantic
value; avoid one-off boolean collections that recreate two independent pages.

## Semantic parity

Parity means that a route pair offers equivalent intent, headings, actions,
workflow stages, capability groups, contact path, metadata, and structured-data
identity. It does not require word-for-word translation or identical text
length. Localised slugs, language conventions, and sentence structure may
differ.

The localisation check verifies route pairs, locale-specific social metadata,
heading order, the expected route visuals, and use of the shared templates.
The full link and browser suites protect canonical, hreflang, section anchors,
responsive behaviour, and the generated route inventory.

## CTA matrix and terminology

Service routes use the assessment action. Product-detail routes use the
product-specific demo action. The Romanian assessment email subject remains on
English routes as an internal routing token; it is not translated display copy.

Romanian keeps established technical terms where translation would reduce
precision. English uses British spelling consistently. The approved second
service pillar is “Networking & Security”. The Cloud Fast Track is optional and
must not appear as one of the universal five stages.

## Metadata targets

Aim for a unique title between 30 and 70 characters and a description between
70 and 180 characters. Legal holds and error documents may use shorter copy
when clarity requires it. Both locales use a separate 1200×630 social image and
locale-specific Open Graph and Twitter image alternative text.

## Review checklist

1. Run `npm run qa:static` and `npm run check:localization`.
2. Run `npm run qa:browser` for layout, contrast, interaction, and performance.
3. Compare the RO/EN route pair at 390, 768, and 1280 px.
4. Confirm that copy changes do not reintroduce blocked claims.
5. When a meaningful diagram changes, confirm that its visible caption remains
   an equivalent text description and that no sensitive technical footprint is
   exposed.
