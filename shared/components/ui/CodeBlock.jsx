import { useState } from "react";
import "./CodeBlock.css";

// ---------------------------------------------------------------------------
// CodeBlock
//
// Styled code panel that fits the Cryark / Guillen dark aesthetic.
// Features:
//   • Mac-style window dots in the header
//   • Gold top-sheen border
//   • Language badge with per-language accent colour
//   • Copy-to-clipboard button
//   • Collapse/expand toggle when the snippet exceeds 14 lines
//
// Props:
//   language   string   — "python" | "javascript" | "gdscript" | "bash" | …
//   title      string?  — filename or context label in the header
//   code       string   — raw code string
// ---------------------------------------------------------------------------

const LANG_LABELS = {
  // Web
  javascript: "JavaScript",
  js:         "JS",
  jsx:        "JSX",
  typescript: "TypeScript",
  ts:         "TS",
  tsx:        "TSX",
  html:       "HTML",
  css:        "CSS",
  scss:       "SCSS",
  // Data / config
  json:       "JSON",
  yaml:       "YAML",
  toml:       "TOML",
  graphql:    "GraphQL",
  sql:        "SQL",
  // Scripting
  python:     "Python",
  bash:       "Bash",
  shell:      "Shell",
  lua:        "Lua",
  ruby:       "Ruby",
  php:        "PHP",
  // Systems
  csharp:     "C#",
  cpp:        "C++",
  c:          "C",
  rust:       "Rust",
  go:         "Go",
  zig:        "Zig",
  swift:      "Swift",
  kotlin:     "Kotlin",
  java:       "Java",
  // Shaders / game
  glsl:       "GLSL",
  hlsl:       "HLSL",
  wgsl:       "WGSL",
  gdscript:   "GDScript",
  // Frameworks / markup
  vue:        "Vue",
  markdown:   "Markdown",
  dockerfile: "Dockerfile",
  solidity:   "Solidity",
  // Fallback
  text:       "Text",
};

// Lines before the "Expand" button appears
const COLLAPSE_THRESHOLD = 14;

export default function CodeBlock({ language = "text", title = null, code = "" }) {
  const [copied,   set_copied]   = useState(false);
  const [expanded, set_expanded] = useState(false);

  const line_count = (code ?? "").split("\n").length;
  const is_long    = line_count > COLLAPSE_THRESHOLD;

  // ── Copy ──────────────────────────────────────────────────────────────────
  function handle_copy() {
    const on_success = () => {
      set_copied(true);
      setTimeout(() => set_copied(false), 2200);
    };

    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).then(on_success).catch(fallback);
    } else {
      fallback();
    }

    function fallback() {
      const el = document.createElement("textarea");
      el.value = code;
      el.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      on_success();
    }
  }

  const lang_label = LANG_LABELS[language] ?? language.toUpperCase();

  return (
    <div className={`code-block code-block--${language}`}>

      {/* ── Header ── */}
      <div className="code-block__header">
        {/* Mac window dots */}
        <div className="code-block__dots" aria-hidden="true">
          <span className="code-block__dot code-block__dot--red"    />
          <span className="code-block__dot code-block__dot--yellow" />
          <span className="code-block__dot code-block__dot--green"  />
        </div>

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

      {/* ── Code body ── */}
      <div className={`code-block__body${is_long && !expanded ? " code-block__body--collapsed" : ""}`}>
        <pre className="code-block__pre">
          <code className="code-block__code">{code}</code>
        </pre>
        {/* Fade mask — only visible when collapsed */}
        {is_long && !expanded && (
          <div className="code-block__fade" aria-hidden="true" />
        )}
      </div>

      {/* ── Expand / collapse toggle ── */}
      {is_long && (
        <button
          className="code-block__expand"
          onClick={() => set_expanded(e => !e)}
        >
          {expanded
            ? "Collapse ↑"
            : `Show all · ${line_count} lines ↓`}
        </button>
      )}
    </div>
  );
}
