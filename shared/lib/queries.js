// ---------------------------------------------------------------------------
// GROQ queries — shared between cryark.net and guillen.studio
//
// Site separation:
//   Every listing query filters by site_visibility.
//   coalesce(site_visibility, ["cryark","guillen"]) treats documents that
//   predate the field as visible on both sites.
//
//   Cryark filter:  "cryark"  in coalesce(site_visibility, ["cryark","guillen"])
//   Guillen filter: "guillen" in coalesce(site_visibility, ["cryark","guillen"])
//
//   Slug / detail queries do NOT filter by site — if you have a direct URL
//   you can reach the content regardless of which site it's listed on.
// ---------------------------------------------------------------------------

// ── SHARED CONSTANTS ─────────────────────────────────────────────────────────
const CRYARK     = `"cryark"  in coalesce(site_visibility, ["cryark","guillen"])`;
const GUILLEN    = `"guillen" in coalesce(site_visibility, ["cryark","guillen"])`;
// Used by shared components that receive `site` as a GROQ $site parameter
const SITE_PARAM = `$site in coalesce(site_visibility, ["cryark","guillen"])`;

// ── DETAIL QUERIES (no site filter — accessed by direct URL) ─────────────────

export const LAB_ENTRY_BY_SLUG = `
  *[_type == "labEntry" && slug.current == $slug && is_draft != true][0] {
    _id,
    title,
    eyebrow,
    subtitle,
    abstract,
    collab,
    status,
    tags,
    stats,
    sidebar_sections,
    sections[] {
      ...,
      _type,
      "image_src": image.asset->url,
      images[] {
        "src": image.asset->url,
        alt,
        caption,
      },
      cards[] {
        ...,
        "image_src": image.asset->url,
      },
      assets[] {
        ...,
        "preview_src": preview.asset->url,
      },
      "poster_src": poster.asset->url,
      left[] {
        ...,
        _type,
        "image_src": image.asset->url,
        "poster_src": poster.asset->url,
        images[] {
          "src": image.asset->url,
          alt,
          caption,
        },
        cards[] {
          ...,
          "image_src": image.asset->url,
        },
      },
      right[] {
        ...,
        _type,
        "image_src": image.asset->url,
        "poster_src": poster.asset->url,
        images[] {
          "src": image.asset->url,
          alt,
          caption,
        },
        cards[] {
          ...,
          "image_src": image.asset->url,
        },
      },
    },
    content_sections[] {
      section_id,
      section_label,
      content[] {
        ...,
        _type,
        "image_src": image.asset->url,
      },
    },
    published_at,
  }
`

export const PRODUCT_BY_SLUG = `
  *[_type == "product" && slug.current == $slug && is_draft != true][0] {
    _id,
    title,
    eyebrow,
    subtitle,
    description,
    status,
    product_type,
    tags,
    platforms[] {
      slug,
      label,
      icon,
      src,
    },
    hero_image,
    key_art,
    thumbnail,
    screenshots[] {
      "src": image.asset->url,
      alt,
      caption,
    },
    sections[] {
      ...,
      _type,
      "image_src": image.asset->url,
      images[] {
        "src": image.asset->url,
        alt,
        caption,
      },
      cards[] {
        ...,
        "image_src": image.asset->url,
      },
      assets[] {
        ...,
        "preview_src": preview.asset->url,
      },
      "poster_src": poster.asset->url,
      left[] {
        ...,
        _type,
        "image_src": image.asset->url,
        "poster_src": poster.asset->url,
        images[] {
          "src": image.asset->url,
          alt,
          caption,
        },
        cards[] {
          ...,
          "image_src": image.asset->url,
        },
      },
      right[] {
        ...,
        _type,
        "image_src": image.asset->url,
        "poster_src": poster.asset->url,
        images[] {
          "src": image.asset->url,
          alt,
          caption,
        },
        cards[] {
          ...,
          "image_src": image.asset->url,
        },
      },
    },
    built_with[] {
      name,
      "logo_url": logo.asset->url,
      src,
    },
    cta_links[] {
      label,
      href,
      variant,
      lava,
    },
    published_at,
  }
`

// ── CRYARK LISTING QUERIES ────────────────────────────────────────────────────

// Lab entries — shown in Cryark's /lab section
export const ALL_LAB_ENTRIES = `
  *[_type == "labEntry" && ${CRYARK} && is_draft != true]
  | order(published_at desc) {
    _id,
    title,
    "slug": slug.current,
    eyebrow,
    subtitle,
    abstract,
    status,
    tags,
  }
`

// All products on Cryark (homepage + /games, /tools listing)
export const ALL_PRODUCTS = `
  *[_type == "product" && ${CRYARK} && is_draft != true]
  | order(published_at desc) {
    _id,
    title,
    "slug": slug.current,
    eyebrow,
    subtitle,
    description,
    status,
    product_type,
    tags,
    thumbnail,
  }
`

// Products filtered by type — used by Cryark /games and /tools pages
export const PRODUCTS_BY_TYPE = `
  *[_type == "product" && product_type == $product_type && ${CRYARK} && is_draft != true]
  | order(published_at desc) {
    _id,
    title,
    "slug": slug.current,
    eyebrow,
    subtitle,
    description,
    status,
    product_type,
    tags,
    thumbnail,
  }
`

// Related products sidebar — Cryark product pages
export const RELATED_PRODUCTS = `
  *[_type == "product" && slug.current != $slug && ${CRYARK} && is_draft != true]
  | order(published_at desc) [0..2] {
    _id,
    title,
    "slug": slug.current,
    subtitle,
    status,
    tags,
    thumbnail,
  }
`

// ── GUILLEN LISTING QUERIES ───────────────────────────────────────────────────

// Work listing — all products visible on Guillen, includes preview_code slot
export const ALL_PRODUCTS_WORK = `
  *[_type == "product" && ${GUILLEN} && is_draft != true]
  | order(published_at desc) {
    _id,
    title,
    "slug": slug.current,
    eyebrow,
    subtitle,
    description,
    status,
    product_type,
    tags,
    thumbnail,
    preview_code,
  }
`

// All devlogs visible on Guillen — for /devlog listing page
export const ALL_DEVLOGS = `
  *[_type == "labEntry" && ${GUILLEN} && is_draft != true]
  | order(published_at desc) {
    _id,
    title,
    "slug": slug.current,
    eyebrow,
    subtitle,
    abstract,
    status,
    tags,
    published_at,
    "project_slug": project->slug.current,
    "project_title": project->title,
  }
`

// ── PROJECT-LINKED DEVLOG QUERIES ─────────────────────────────────────────────

// Single most-recent devlog for a project — shown in the WorkCard devlog slot
export const LATEST_DEVLOG_BY_PROJECT = `
  *[_type == "labEntry" && project._ref == $project_id && ${GUILLEN} && is_draft != true]
  | order(published_at desc)[0] {
    _id,
    title,
    "slug": slug.current,
    abstract,
    subtitle,
    published_at,
  }
`

// All devlogs for a project — shown at the bottom of a /work/:slug page
export const DEVLOGS_BY_PROJECT = `
  *[_type == "labEntry" && project._ref == $project_id && ${GUILLEN} && is_draft != true]
  | order(published_at desc) {
    _id,
    title,
    "slug": slug.current,
    abstract,
    subtitle,
    tags,
    published_at,
  }
`

// ── ABOUT PAGE QUERIES (shared — use $site parameter) ────────────────────────

// Hero content, bio, education, and contact links for one site
export const ABOUT_PROFILE = `
  *[_type == "aboutProfile" && site == $site][0] {
    _id,
    name,
    title,
    tagline,
    bio,
    education,
    contact_links,
  }
`

// All skills visible on a site, ordered by category then manual order
export const ALL_SKILLS = `
  *[_type == "skill" && ${SITE_PARAM}]
  | order(category asc, order asc) {
    _id,
    name,
    category,
    proficiency,
    description,
  }
`

// All experience entries visible on a site, ordered by manual order
export const ALL_EXPERIENCE = `
  *[_type == "experience" && ${SITE_PARAM}]
  | order(order asc) {
    _id,
    title,
    sub,
    date_range,
    description,
    tags,
    demo_url,
    "project_slug": project->slug.current,
  }
`

// ── DOCS QUERIES ─────────────────────────────────────────────────────────────

// Doc space nav — space metadata + full flat page list for building the sidebar tree.
// The frontend nests pages by parent_id and sorts by order.
export const DOC_SPACE_NAV = `
  *[_type == "docSpace" && slug.current == $space_slug && is_draft != true][0] {
    _id,
    title,
    "slug": slug.current,
    description,
    "product_slug": product->slug.current,
    "pages": *[_type == "docPage" && space._ref == ^._id && is_draft != true] | order(order asc) {
      _id,
      title,
      "slug": slug.current,
      "parent_id": parent._ref,
      order,
    }
  }
`

// Single doc page — content only (nav comes from DOC_SPACE_NAV above).
export const DOC_PAGE_BY_SLUG = `
  *[_type == "docPage"
    && space->slug.current == $space_slug
    && slug.current == $page_slug
    && is_draft != true][0] {
    _id,
    title,
    content_sections[] {
      section_id,
      section_label,
      content[] {
        ...,
        _type,
        "image_src": image.asset->url,
      },
    },
  }
`

// All doc spaces — for a /docs listing page or product links.
export const ALL_DOC_SPACES = `
  *[_type == "docSpace" && is_draft != true] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    "product_slug": product->slug.current,
    "product_title": product->title,
    "page_count": count(*[_type == "docPage" && space._ref == ^._id && is_draft != true]),
  }
`

// ── ABOUT PAGE QUERIES (shared — use $site parameter) ────────────────────────

// All site links (social / external) visible on a site, ordered by manual order.
// Filter by show_in on the client: "footer", "hero", "about", "nav"
export const ALL_SITE_LINKS = `
  *[_type == "siteLink" && ${SITE_PARAM}]
  | order(order asc) {
    _id,
    label,
    url,
    display,
    icon,
    "logo_url": logo.asset->url,
    show_in,
  }
`

// About page projects — glance cards with expandable deep-dive content
export const ALL_ABOUT_PROJECTS = `
  *[_type == "aboutProject" && ${SITE_PARAM}]
  | order(order asc) {
    _id,
    title,
    status,
    stack,
    description,
    role,
    "thumbnail_url": thumbnail.asset->url,
    video_url,
    expanded_content[] {
      _type,
      text,
      "image_url": image.asset->url,
      caption,
      full_width,
      language,
      label,
      code,
    },
    "project_slug": project->slug.current,
  }
`
