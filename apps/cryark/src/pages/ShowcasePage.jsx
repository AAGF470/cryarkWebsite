import Button from "@shared/components/ui/Button";
import Card from "@shared/components/ui/Card";
import Pill from "@shared/components/ui/Pill";
import SiteNav from "@shared/components/ui/SiteNav";
import CinematicHero from "@shared/components/ui/CinematicHero";
import FeatureSpotlight from "@shared/components/ui/FeatureSpotlight";
import ScreenshotGallery from "@shared/components/ui/ScreenshotGallery";
import PlatformBadge from "@shared/components/ui/PlatformBadge";
import SiteFooter from "@shared/components/ui/SiteFooter";
import "./ShowcasePage.css";

// ── Sample data ──────────────────────────────────────────────────────────────

const SAMPLE_PILLS = [
  "Blender", "Python", "Godot 4", "GLSL", "FastAPI",
  "React", "CV / ML", "GDScript", "Rust", "WebGL",
];

const CARD_RELEASED = {
  title: "Simply Simple Foliage",
  description: "Procedural tree generator for Blender. Abstract base class hierarchy, ID-based registry, non-destructive recompilation pipeline.",
  tags: ["Blender", "Python", "Procedural"],
  status: "released",
  href: "#",
};

const CARD_IN_DEV = {
  title: "FORGE",
  description: "Constraint-based modular level assembly plugin for Godot 4. Snap, align, and compose environments without manual placement.",
  tags: ["Godot 4", "GDScript", "Tooling"],
  status: "in_dev",
  href: "#",
};

const CARD_RESEARCH = {
  title: "DERG",
  description: "Synthetic Blender training data pipeline for NU AERO's Legolass rocket tracking model. Procedural terrain, Geometry Nodes, Python batch rendering.",
  tags: ["Blender", "Python", "CV / ML"],
  status: "research",
  stats: [{ value: "NU", label: "AERO" }, { value: "CV", label: "ML target" }, { value: "3D", label: "pipeline" }],
  href: "#",
};

const CARD_LIVE = {
  title: "Gym Tracker",
  description: "Workout logging and progression tracking. FastAPI + React + SQLite, live deployed. ML forecast layer in progress.",
  tags: ["FastAPI", "React", "SQLite"],
  status: "live",
  stats: [{ value: "Live", label: "status" }, { value: "gym.", label: "subdomain" }, { value: "ML", label: "incoming" }],
  href: "#",
};

const CARD_COLLAB = {
  title: "Wind Tunnel Software",
  description: "Real-time DAQ and visualization tool for wind tunnel sensor arrays. Built with an aerospace ME student.",
  tags: ["Python", "Aerospace", "DAQ"],
  status: "collab",
  href: "#",
};

const PLATFORM_SLUGS = ["godot", "blender", "windows", "macos", "linux", "itch", "steam", "gumroad", "unreal", "unity"];

// ── Scaffold components ───────────────────────────────────────────────────────

function Section({ id, label, description, children, wide }) {
  return (
    <section className={`sc__section${wide ? " sc__section--wide" : ""}`} id={id}>
      <header className="sc__section_header">
        <div className="sc__section_label">{label}</div>
        {description && <p className="sc__section_desc">{description}</p>}
      </header>
      {children}
    </section>
  );
}

function VLabel({ children }) {
  return <span className="sc__vlabel">{children}</span>;
}

function VSlot({ label, children }) {
  return (
    <div className="sc__vslot">
      {children}
      <VLabel>{label}</VLabel>
    </div>
  );
}

function Swatch({ name, value, css_var }) {
  return (
    <div className="sc__swatch">
      <div className="sc__swatch_color" style={{ background: value }} />
      <span className="sc__swatch_name">{name}</span>
      {css_var && <code className="sc__swatch_var">{css_var}</code>}
      <code className="sc__swatch_hex">{value}</code>
    </div>
  );
}

// ── Section previews ──────────────────────────────────────────────────────────

function HeroPreview() {
  return (
    <div className="sc__hero_preview">
      <div className="sc__hero_preview_text">
        <div className="sc__eyebrow_demo">Angel Guillen Flores — Northeastern University</div>
        <h2 className="sc__hero_title_demo">
          Building tools at the<br />
          edge of <em className="sc__hero_accent_demo">code and craft</em>
        </h2>
        <p className="sc__hero_sub_demo">
          Computer engineering student specializing in graphics, game tooling,
          and ML infrastructure. I build things that didn't exist yet.
        </p>
        <div className="sc__hero_actions_demo">
          <Button label="See products" href="#" />
          <Button variant="ghost" label="Read the lab" href="#" />
        </div>
      </div>
      <div className="sc__hero_visual_demo">
        <span className="sc__hero_visual_label">asset goes here</span>
      </div>
    </div>
  );
}

function SectionLabelDemo() {
  return (
    <div className="sc__section_label_row">
      <div className="sc__section_label_demo">Products</div>
      <div className="sc__section_label_demo">Lab</div>
      <div className="sc__section_label_demo">About</div>
    </div>
  );
}

function StatusBadgeRow() {
  const statuses = ["released", "in_dev", "research", "live", "collab"];
  const labels   = { released: "Released", in_dev: "In dev", research: "Research", live: "Live", collab: "Collab" };

  return (
    <div className="sc__badge_row">
      {statuses.map(s => (
        <span key={s} className={`card__status_badge card__status_badge--${s}`}>
          {s === "live" && <span className="card__live_dot" />}
          {labels[s]}
        </span>
      ))}
    </div>
  );
}

function AboutStripPreview() {
  return (
    <div className="about__strip">
      <div className="about__text">
        <p className="about__name">Cryark — solo studio, Northeastern '28</p>
        <p className="about__desc">
          Graphics programming, game engine tooling, and ML infrastructure.
          Targeting co-ops at Riot, NVIDIA, Epic, and Draper Lab starting Spring 2027.
        </p>
      </div>
      <div className="about__meta">
        <div className="about__stat"><span className="about__stat_num">7</span><span className="about__stat_label">projects</span></div>
        <div className="about__stat"><span className="about__stat_num">2</span><span className="about__stat_label">live</span></div>
        <div className="about__stat"><span className="about__stat_num">'28</span><span className="about__stat_label">class</span></div>
      </div>
      <Button variant="ghost" label="About Cryark" href="#" />
    </div>
  );
}

function FooterPreview() {
  return (
    <div className="sc__footer_preview">
      <SiteFooter />
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ShowcasePage() {
  const TOC_ITEMS = [
    "nav", "cinematic-hero", "hero", "section-label", "status",
    "buttons", "pills", "cards", "platform-badges",
    "feature-spotlight", "screenshot-gallery",
    "about", "footer", "palette",
  ];

  return (
    <div className="sc__page">
      <SiteNav />

      {/* Page header */}
      <header className="sc__hero">
        <div className="sc__hero_eyebrow">Cryark · Design System</div>
        <h1 className="sc__hero_title">Component Library</h1>
        <p className="sc__hero_desc">
          All built UI primitives and page sections. Hover interactive elements — most have canvas effects.
        </p>
        <nav className="sc__toc">
          {TOC_ITEMS.map(a => (
            <a key={a} href={`#${a}`} className="sc__toc_link">{a.replace(/-/g, " ")}</a>
          ))}
        </nav>
      </header>

      {/* ── SITENAV ── */}
      <Section id="nav" label="SiteNav"
        description="Sticky 3-zone navigation: logo left, links centered, CTA right. Glass deepens at 32px scroll. Hides on scroll-down, reveals on scroll-up or mouse within 72px of top. Active links show a gold underline dot."
      >
        <div className="sc__nav_demo">
          <p className="sc__hint">↑ the SiteNav above is a live instance — scroll down to hide it, scroll up or move mouse to top to reveal it.</p>
          <div className="sc__nav_states">
            <div className="sc__nav_state_label">at rest (transparent)</div>
            <div className="sc__nav_state_label">scrolled (glass deepens, gold border)</div>
            <div className="sc__nav_state_label">scroll-down (hidden above viewport)</div>
          </div>
        </div>
      </Section>

      {/* ── CINEMATIC HERO ── */}
      <Section id="cinematic-hero" label="Cinematic Hero"
        description="Full-viewport (100svh) hero with video or image background. Multi-stop gradient overlay anchors text readability at the bottom. Animated scroll hint at base. Left-aligned default; center variant available."
        wide
      >
        <div className="sc__cinematic_demo">
          <CinematicHero
            eyebrow="Cryark · Games"
            title={<>A world built at the<br />edge of <em style={{ color: "rgba(220,193,148,0.95)", fontStyle: "normal" }}>code and craft</em></>}
            subtitle="Cinematic hero with placeholder background. Drop a video_src or image_src prop to replace the diagonal-stripe placeholder."
            actions={[
              { label: "Watch trailer",  href: "#", variant: "solid" },
              { label: "Learn more",     href: "#", variant: "ghost" },
            ]}
          />
        </div>
        <p className="sc__hint" style={{ padding: "0 48px" }}>↑ pass video_src="/path/to/trailer.mp4" or image_src="/path/to/key-art.jpg" to fill the background</p>
      </Section>

      {/* ── HERO ── */}
      <Section id="hero" label="Descriptive Hero"
        description="Two-column hero: text left, visual asset placeholder right. Title has gold text-shadow glow. Eyebrow line uses the accent color with a decorative rule."
        wide
      >
        <HeroPreview />
      </Section>

      {/* ── SECTION LABEL ── */}
      <Section id="section-label" label="Section Label"
        description="Left-bar section divider: 2px vertical gold gradient, bold 700 uppercase text, and a hairline gradient rule extending right. Used above every content section."
      >
        <SectionLabelDemo />
      </Section>

      {/* ── STATUS BADGES ── */}
      <Section id="status" label="Status Badge"
        description="Five status variants used on project cards: released (gold), in_dev (purple), research (blue), live (green + pulse dot), collab (blue-gray)."
      >
        <StatusBadgeRow />
      </Section>

      {/* ── BUTTONS ── */}
      <Section id="buttons" label="Button"
        description="Three variants — solid, ghost, ghost-bordered — plus a lava modifier on solid. All theme colors are injected as CSS custom properties."
      >
        <div className="sc__row sc__row--gap-lg sc__row--wrap sc__row--top">
          <VSlot label="solid (default)"><Button label="See Products" href="#" /></VSlot>
          <VSlot label="solid + lava"><Button label="Get on Gumroad" lava href="#" /></VSlot>
          <VSlot label="ghost"><Button variant="ghost" label="Read the lab" href="#" /></VSlot>
          <VSlot label="ghost-bordered"><Button variant="ghost-bordered" label="View source" href="#" /></VSlot>
          <VSlot label="ghost-bordered, no arrow"><Button variant="ghost-bordered" label="Resume" href="#" show_arrow={false} /></VSlot>
        </div>
      </Section>

      {/* ── PILLS ── */}
      <Section id="pills" label="Pill"
        description="Tag pill with canvas-driven thermal heat animation on hover. Cold → gold → white overexposure. Text flips dark at peak brightness."
      >
        <div className="sc__pill_grid">
          {SAMPLE_PILLS.map(tag => <Pill key={tag} label={tag} />)}
        </div>
        <p className="sc__hint">↑ hover each pill to trigger the heat animation</p>
      </Section>

      {/* ── CARDS ── */}
      <Section id="cards" label="Card"
        description="Glass card with cursor-reactive gold outline glow and 3D tilt on hover. Text-only variant and stats variant. Outline canvas uses wrapper dimensions to stay perfectly aligned."
      >
        <div className="sc__card_grid">
          <div className="sc__card_col"><VLabel>released · text-only</VLabel><Card {...CARD_RELEASED} /></div>
          <div className="sc__card_col"><VLabel>in_dev · text-only</VLabel><Card {...CARD_IN_DEV} /></div>
          <div className="sc__card_col"><VLabel>research · stats row</VLabel><Card {...CARD_RESEARCH} /></div>
          <div className="sc__card_col"><VLabel>live · stats + pulse dot</VLabel><Card {...CARD_LIVE} /></div>
          <div className="sc__card_col"><VLabel>collab · text-only</VLabel><Card {...CARD_COLLAB} /></div>
        </div>
        <p className="sc__hint">↑ move your cursor over each card — glow tracks cursor position, card tilts in 3D</p>
      </Section>

      {/* ── PLATFORM BADGES ── */}
      <Section id="platform-badges" label="Platform Badge"
        description="Square icon container (32×32px, 8px radius) for non-text square platform logos. Icons load from /public/icons/{platform}.svg — empty container shown if icon is missing."
      >
        <div className="sc__row sc__row--wrap sc__row--gap-md">
          {PLATFORM_SLUGS.map(p => (
            <VSlot key={p} label={p}>
              <PlatformBadge platform={p} />
            </VSlot>
          ))}
          <VSlot label="size={48}">
            <PlatformBadge platform="godot" size={48} />
          </VSlot>
        </div>
        <p className="sc__hint">↑ add icons to /public/icons/ — godot.svg, blender.svg, etc.</p>
      </Section>

      {/* ── FEATURE SPOTLIGHT ── */}
      <Section id="feature-spotlight" label="Feature Spotlight"
        description="Editorial two-panel section: full-bleed media left (~55%), content panel right. flip prop swaps the sides. Platform badge row and CTA buttons slot in below the description."
        wide
      >
        <FeatureSpotlight
          eyebrow="Developer Tools"
          title="Simply Simple Foliage"
          description="Procedural tree generator for Blender with an abstract base class hierarchy, ID-based asset registry, and non-destructive recompilation pipeline. Drop a tree, tweak parameters, done."
          platforms={["blender", "gumroad"]}
          actions={[
            { label: "Get on Gumroad", href: "#", lava: true },
            { label: "View docs",      href: "#", variant: "ghost-bordered" },
          ]}
        />
        <div style={{ marginTop: "1px" }}>
          <FeatureSpotlight
            flip
            eyebrow="Godot 4 Plugin"
            title="FORGE"
            description="Constraint-based modular level assembly plugin for Godot 4. Snap, align, and compose environments from reusable modules without manual placement or scripting."
            platforms={["godot", "itch"]}
            actions={[
              { label: "View on itch.io", href: "#", variant: "solid" },
            ]}
          />
        </div>
        <p className="sc__hint" style={{ padding: "16px 48px 0" }}>↑ first card: media left. second card: flip=true, media right</p>
      </Section>

      {/* ── SCREENSHOT GALLERY ── */}
      <Section id="screenshot-gallery" label="Screenshot Gallery"
        description="Horizontally scrollable thumbnail strip with click-to-open lightbox. Keyboard: Escape closes, ← / → navigates. Placeholder thumbnails shown when images array is empty."
      >
        <ScreenshotGallery />
        <p className="sc__hint">↑ pass images={`[{ src, alt, caption }]`} to populate — click a placeholder to confirm the lightbox wires up correctly (requires real src)</p>
      </Section>

      {/* ── ABOUT STRIP ── */}
      <Section id="about" label="About Strip"
        description="Full-width glassmorphism banner: name/description left, stat counters center, ghost CTA right."
        wide
      >
        <AboutStripPreview />
      </Section>

      {/* ── FOOTER ── */}
      <Section id="footer" label="Footer"
        description="Minimal two-zone footer: site identity left, external links right."
        wide
      >
        <FooterPreview />
      </Section>

      {/* ── PALETTE ── */}
      <Section id="palette" label="Color Palette"
        description="Core token set in :root (index.css). These CSS custom properties drive the consistent palette across all components."
      >
        <div className="sc__row sc__row--wrap sc__row--gap-md sc__row--top">
          <Swatch name="Background"    value="#050508"                  css_var="--color-bg" />
          <Swatch name="Text"          value="#e8e6e1"                  css_var="--color-text" />
          <Swatch name="Text Dim"      value="rgba(232,230,225,0.42)"   css_var="--color-text-dim" />
          <Swatch name="Accent Gold"   value="#c8a97e"                  css_var="--color-accent" />
          <Swatch name="Border Subtle" value="rgba(255,255,255,0.06)"   css_var="--color-border-sub" />
          <Swatch name="Lava Gold"     value="rgb(195,160,95)" />
          <Swatch name="Purple Orb"    value="rgb(55,30,160)" />
          <Swatch name="Blue Orb"      value="rgb(15,55,160)" />
          <Swatch name="Amber Orb"     value="rgb(160,55,15)" />
        </div>
      </Section>

      <SiteFooter />
    </div>
  );
}
