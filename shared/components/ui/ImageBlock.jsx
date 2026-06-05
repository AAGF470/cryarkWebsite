import "./ImageBlock.css";

// ---------------------------------------------------------------------------
// ImageBlock
//
// Single inline image for devlog / article content. Centered with optional
// caption. Use ScreenshotGallery for multi-image strips.
//
// Props:
//   image_src  string   — resolved image URL from GROQ
//   alt        string?  — alt text
//   caption    string?  — caption shown below the image
//   size       "normal" | "wide"  (default: "normal")
//                normal = max-width 720px, wide = full content width
// ---------------------------------------------------------------------------

export default function ImageBlock({ image_src = null, alt = "", caption = null, size = "normal" }) {
  if (!image_src) return null;

  return (
    <figure className={`img-block img-block--${size}`}>
      <img
        className="img-block__img"
        src={image_src}
        alt={alt}
        loading="lazy"
      />
      {caption && (
        <figcaption className="img-block__caption">{caption}</figcaption>
      )}
    </figure>
  );
}
