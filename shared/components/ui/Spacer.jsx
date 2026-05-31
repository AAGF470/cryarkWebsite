// ---------------------------------------------------------------------------
// Spacer
// Simple vertical gap between page sections.
// Use in the CMS to add breathing room between blocks.
//
// Props:
//   size  "xs"|"sm"|"md"|"lg"|"xl"  (default: "md")
// ---------------------------------------------------------------------------

const SIZES = {
  xs:  32,
  sm:  56,
  md:  88,
  lg:  128,
  xl:  180,
};

export default function Spacer({ size = "md" }) {
  const height = SIZES[size] ?? SIZES.md;
  return <div aria-hidden="true" style={{ height, flexShrink: 0 }} />;
}
