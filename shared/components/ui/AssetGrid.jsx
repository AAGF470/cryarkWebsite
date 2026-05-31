import "./AssetGrid.css";

// ---------------------------------------------------------------------------
// AssetGrid
//
// Grid of downloadable asset cards for the Lab. Shows preview image,
// name, file type badge, file size, license, and a download button.
//
// Props:
//   heading  string?  — section label above the grid
//   assets   array    — array of asset objects (see below)
//
// Asset object shape:
//   name         string  — display name
//   category     string? — e.g. "3D Character", "Texture Pack"
//   preview_src  string? — URL to preview image
//   file_url     string  — download URL (VPS)
//   file_type    string  — "glb" | "fbx" | "obj" | "blend" | "png" |
//                          "psd" | "zip" | "svg" | "mp3" | "wav"
//   file_size    string? — e.g. "4.2 MB"
//   license      string  — "free" | "cc0" | "attribution" | "patreon"
//   description  string? — short description
// ---------------------------------------------------------------------------

const LICENSE_LABELS = {
  free:        "Free",
  cc0:         "CC0",
  attribution: "CC-BY",
  patreon:     "Patreon",
};

export default function AssetGrid({ heading = null, assets = [] }) {
  if (!assets.length) return null;

  return (
    <section className="asset-grid">
      {heading && (
        <div className="asset-grid__heading_wrap">
          <h2 className="asset-grid__heading">{heading}</h2>
        </div>
      )}

      <ul className="asset-grid__list">
        {assets.map((asset, i) => (
          <AssetCard key={asset.name ?? i} asset={asset} />
        ))}
      </ul>
    </section>
  );
}

function AssetCard({ asset }) {
  const {
    name        = "Untitled",
    category    = null,
    preview_src = null,
    file_url    = "#",
    file_type   = "zip",
    file_size   = null,
    license     = "free",
    description = null,
  } = asset;

  const license_label = LICENSE_LABELS[license] ?? license;

  return (
    <li className={`asset-grid__card asset-grid__card--license-${license}`}>
      {/* Preview image */}
      <div className="asset-grid__preview">
        {preview_src
          ? <img src={preview_src} alt={name} draggable="false" />
          : <div className="asset-grid__preview_placeholder">
              <span className="asset-grid__type_badge asset-grid__type_badge--large">
                .{file_type}
              </span>
            </div>
        }
        {/* License tag overlaid on image */}
        <span className={`asset-grid__license asset-grid__license--${license}`}>
          {license_label}
        </span>
      </div>

      {/* Card body */}
      <div className="asset-grid__body">
        {category && (
          <p className="asset-grid__category">{category}</p>
        )}
        <h3 className="asset-grid__name">{name}</h3>
        {description && (
          <p className="asset-grid__desc">{description}</p>
        )}

        {/* Meta row */}
        <div className="asset-grid__meta">
          <span className="asset-grid__type_badge">.{file_type}</span>
          {file_size && (
            <span className="asset-grid__size">{file_size}</span>
          )}
        </div>
      </div>

      {/* Download button */}
      <div className="asset-grid__footer">
        {license === "patreon" ? (
          <a
            href={file_url}
            className="asset-grid__dl_btn asset-grid__dl_btn--patreon"
            target="_blank"
            rel="noreferrer"
          >
            Patreon Access
          </a>
        ) : (
          <a
            href={file_url}
            className="asset-grid__dl_btn"
            download
          >
            Download
          </a>
        )}
      </div>
    </li>
  );
}
