import { useState } from "react";
import "./CodeBlock.css";

// ---------------------------------------------------------------------------
// CodeBlock
//
// Styled code snippet panel with language badge, optional title, and a
// copy-to-clipboard button. No runtime syntax highlighting — clean
// monospace on a dark panel. Add a highlighting library later if needed.
//
// Props:
//   language   string   — "python" | "json" | "bash" | "text" | any slug
//   title      string?  — filename or description shown in the header
//   code       string   — the raw code string (use template literals)
// ---------------------------------------------------------------------------

const LANG_LABELS = {
  python: "Python",
  json:   "JSON",
  bash:   "Bash",
  text:   "Text",
  js:     "JS",
  jsx:    "JSX",
  ts:     "TS",
  css:    "CSS",
};

export default function CodeBlock({ language = "text", title = null, code = "" }) {
  const [copied, set_copied] = useState(false);

  function handle_copy() {
    const do_copy = text => {
      set_copied(true);
      setTimeout(() => set_copied(false), 2200);
    };

    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).then(do_copy).catch(() => fallback_copy());
    } else {
      fallback_copy();
    }

    function fallback_copy() {
      const el = document.createElement("textarea");
      el.value = code;
      el.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      do_copy();
    }
  }

  const lang_label = LANG_LABELS[language] ?? language.toUpperCase();

  return (
    <div className={`code-block code-block--${language}`}>
      <div className="code-block__header">
        <span className="code-block__lang">{lang_label}</span>
        {title && <span className="code-block__title">{title}</span>}
        <button
          className={`code-block__copy${copied ? " code-block__copy--done" : ""}`}
          onClick={handle_copy}
          aria-label="Copy code"
        >
          {copied ? "✓ copied" : "copy"}
        </button>
      </div>
      <pre className="code-block__pre"><code className="code-block__code">{code}</code></pre>
    </div>
  );
}
