// ---------------------------------------------------------------------------
// SEOMeta — page-level meta + JSON-LD structured data
//
// Uses React 19's native head tag hoisting (no react-helmet needed).
// Drop inside any page component and React will automatically move these
// into <head>.
//
// Props:
//   title        string   — page title (also sets og:title)
//   description  string?  — meta description (also og:description)
//   canonical    string?  — canonical URL (full URL)
//   og_image     string?  — OpenGraph image URL
//   schema       object?  — JSON-LD schema.org object (serialized to <script type="application/ld+json">)
// ---------------------------------------------------------------------------

export default function SEOMeta({ title, description, canonical, og_image, schema }) {
  const site_name = "guillen.studio";
  return (
    <>
      {title && <title>{title} · {site_name}</title>}
      {description && <meta name="description" content={description} />}
      {canonical && <link rel="canonical" href={canonical} />}
      {title && <meta property="og:title" content={`${title} · ${site_name}`} />}
      {description && <meta property="og:description" content={description} />}
      {og_image && <meta property="og:image" content={og_image} />}
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={site_name} />
      <meta name="twitter:card" content="summary_large_image" />
      {title && <meta name="twitter:title" content={`${title} · ${site_name}`} />}
      {description && <meta name="twitter:description" content={description} />}
      {og_image && <meta name="twitter:image" content={og_image} />}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </>
  );
}
