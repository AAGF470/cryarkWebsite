// ---------------------------------------------------------------------------
// SocialIcon — Central brand icon registry
//
// Single source of truth for every social / platform icon used across
// cryark.net and guillen.studio.
//
// HOW TO CHANGE AN ICON GLOBALLY:
//   1. SVG icons  → update the `path` string in its entry below.
//                   Get brand-accurate paths at https://simpleicons.org
//   2. Image icons → update the `src` string (file in /public/icons/).
//   3. Add a new icon → add an entry to SOCIAL_ICONS, export the component.
//
// All SVG icons use `currentColor` — they inherit the link's hover color
// automatically through CSS.
// ---------------------------------------------------------------------------

// ── Primitive renderers ────────────────────────────────────────────────────

function SvgIcon({ size = 20, path, viewBox = "0 0 24 24", label }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill="currentColor"
      aria-label={label}
      role="img"
      focusable="false"
      style={{ display: "block", flexShrink: 0 }}
    >
      <title>{label}</title>
      <path d={path} />
    </svg>
  );
}

function ImgIcon({ size = 20, src, label }) {
  return (
    <img
      src={src}
      alt={label}
      width={size}
      height={size}
      loading="lazy"
      style={{ display: "block", flexShrink: 0, objectFit: "contain" }}
      className="social-icon--img"
    />
  );
}

// ── Individual icon components ─────────────────────────────────────────────
// Source for SVG paths: https://simpleicons.org  (CC0 license)
// To update: replace the `path` value with the new SVG path data.

export function GitHubIcon({ size = 20 }) {
  return (
    <SvgIcon size={size} label="GitHub"
      path="M12 2C6.477 2 2 6.463 2 11.97c0 4.404 2.865 8.14 6.839 9.458.5.092.682-.216.682-.48 0-.236-.008-.864-.013-1.695-2.782.602-3.369-1.337-3.369-1.337-.454-1.151-1.11-1.458-1.11-1.458-.908-.618.069-.606.069-.606 1.003.07 1.531 1.027 1.531 1.027.892 1.524 2.341 1.084 2.91.828.092-.643.35-1.083.636-1.332-2.22-.251-4.555-1.107-4.555-4.927 0-1.088.39-1.979 1.029-2.675-.103-.252-.446-1.266.098-2.638 0 0 .84-.268 2.75 1.022A9.607 9.607 0 0112 6.82c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.372.202 2.386.1 2.638.64.696 1.028 1.587 1.028 2.675 0 3.83-2.339 4.673-4.566 4.92.359.307.678.915.678 1.846 0 1.332-.012 2.407-.012 2.735 0 .267.18.577.688.48C19.138 20.107 22 16.373 22 11.969 22 6.463 17.522 2 12 2z"
    />
  );
}

export function LinkedInIcon({ size = 20 }) {
  return (
    <SvgIcon size={size} label="LinkedIn"
      path="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
    />
  );
}

export function PatreonIcon({ size = 20 }) {
  return (
    <SvgIcon size={size} label="Patreon"
      path="M0 .48v23.04h4.22V.48zm15.385 0c-4.764 0-8.641 3.88-8.641 8.65 0 4.755 3.877 8.623 8.641 8.623 4.75 0 8.615-3.868 8.615-8.623C24 4.36 20.136.48 15.385.48z"
    />
  );
}

export function ItchIcon({ size = 20 }) {
  // Using /public/icons/itch.png — swap for SVG by changing to <SvgIcon>
  return <ImgIcon size={size} src="/icons/itch.png" label="itch.io" />;
}

export function SteamIcon({ size = 20 }) {
  // Using /public/icons/steam.png — swap for SVG by changing to <SvgIcon>
  return <ImgIcon size={size} src="/icons/steam.png" label="Steam" />;
}

// ── Add future icons here ──────────────────────────────────────────────────
// export function XIcon({ size = 20 }) { ... }
// export function BlueskyIcon({ size = 20 }) { ... }
// export function YoutubeIcon({ size = 20 }) { ... }

// ── Registry ───────────────────────────────────────────────────────────────
// Maps string keys → icon components.
// Used by SiteFooter and any other component that needs icon-by-key lookup.
// Add a new entry here and in the export above to register a new platform.

export const SOCIAL_ICONS = {
  github:   GitHubIcon,
  linkedin: LinkedInIcon,
  patreon:  PatreonIcon,
  itch:     ItchIcon,
  steam:    SteamIcon,
};
