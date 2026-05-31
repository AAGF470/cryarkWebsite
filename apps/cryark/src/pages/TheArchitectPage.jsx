import SiteNav from "@shared/components/ui/SiteNav";
import CinematicHero from "@shared/components/ui/CinematicHero";
import ProductInfoBar from "@shared/components/ui/ProductInfoBar";
import FeatureSpotlight from "@shared/components/ui/FeatureSpotlight";
import ScreenshotGallery from "@shared/components/ui/ScreenshotGallery";
import Button from "@shared/components/ui/Button";
import SiteFooter from "@shared/components/ui/SiteFooter";
import "./TheArchitectPage.css";

// ── Asset paths ───────────────────────────────────────────────────────────────

const ASSETS = {
  hero:         "/products/the-architect/screenshot-01.png",
  key_art:      "/products/the-architect/key-art.png",
  end_scene:    "/products/the-architect/screenshot-02.png",
  icon_godot:   "/icons/godot.png",
  icon_itch:    "/icons/itch.png",
  logo_godot:   "/logos/godot-full.png",
  logo_blender: "/logos/blender-full.png",
};

const SCREENSHOTS = [
  {
    src:     "/products/the-architect/screenshot-01.png",
    alt:     "Exterior — foggy suburban street at night with red streetlights",
    caption: "Chapter 1 — The City That Shouldn't Exist",
  },
  {
    src:     "/products/the-architect/key-art.png",
    alt:     "Key art — The Architect Vol. 1",
    caption: "Official key art",
  },
  {
    src:     "/products/the-architect/screenshot-02.png",
    alt:     "End scene — figure at a grand piano in overgrown ruins",
    caption: "The End — a moment of stillness",
  },
];

const PLATFORMS = [
  { platform: "godot", src: ASSETS.icon_godot },
  { platform: "itch",  src: ASSETS.icon_itch  },
];

// ── Section components ────────────────────────────────────────────────────────

function BuiltWith() {
  return (
    <section className="tarch__built_with">
      <div className="tarch__built_label">Built with</div>
      <div className="tarch__built_logos">
        <img src={ASSETS.logo_godot}   alt="Godot Engine"  className="tarch__built_logo" />
        <img src={ASSETS.logo_blender} alt="Blender"       className="tarch__built_logo" />
      </div>
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function TheArchitectPage() {
  return (
    <div className="tarch__page">
      <SiteNav />

      {/* ── 1. CINEMATIC HERO ── */}
      <CinematicHero
        image_src={ASSETS.hero}
        eyebrow="Cryark · Games"
        title={
          <>
            The Architect<br />
            <span className="tarch__hero_vol">Vol. 1</span>
          </>
        }
        subtitle="Some cities are built. Some are remembered."
        actions={[
          { label: "Play on itch.io",   href: "#", lava: true  },
          { label: "Add to wishlist",   href: "#", variant: "ghost-bordered" },
        ]}
      />

      {/* ── 2. INFO BAR ── */}
      <ProductInfoBar
        back_href="/"
        back_label="Products"
        status="in_dev"
        tags={["Narrative", "Psychological", "Atmospheric", "Godot 4"]}
        platforms={PLATFORMS}
      />

      {/* ── 3. OVERVIEW — key art + description ── */}
      <FeatureSpotlight
        image_src={ASSETS.key_art}
        media_fit="contain"
        media_bg="#07040a"
        eyebrow="About the game"
        title="A story of identity and architecture"
        description="You are the Architect — or so the city tells you. Wake up in a neighborhood that shouldn't exist, piece together its fractured geometry, and decide whether the world you inhabit is a memory, a mistake, or a masterpiece. The Architect Vol. 1 is a psychological narrative game built on handcrafted 3D environments and a soundtrack that breathes with the level."
        platforms={[
          { platform: "godot", src: ASSETS.icon_godot },
          { platform: "itch",  src: ASSETS.icon_itch  },
        ]}
        actions={[
          { label: "Play on itch.io →", href: "#", lava: true },
        ]}
      />

      {/* ── 4. SCREENSHOTS ── */}
      <section className="tarch__section">
        <div className="tarch__section_label">Screenshots</div>
        <ScreenshotGallery images={SCREENSHOTS} />
      </section>

      {/* ── 5. FEATURE — end scene cinematic ── */}
      <FeatureSpotlight
        flip
        image_src={ASSETS.end_scene}
        eyebrow="Visual Design"
        title="Handcrafted environments, frame by frame"
        description="Every scene in The Architect is built by hand — no procedural filler, no asset-store shortcuts. Volumetric fog, geometry-lit interiors, and post-process color grading combine to give each chapter a distinct visual register. The end scene took three weeks to light."
        actions={[
          { label: "See how it's made", href: "#", variant: "ghost-bordered" },
        ]}
      />

      {/* ── 6. BUILT WITH ── */}
      <BuiltWith />

      {/* ── 7. FOOTER CTA ── */}
      <section className="tarch__cta">
        <p className="tarch__cta_eyebrow">Available now in early access</p>
        <h2 className="tarch__cta_title">Ready to step inside?</h2>
        <div className="tarch__cta_actions">
          <Button label="Play on itch.io" href="#" lava />
          <Button variant="ghost" label="Follow development" href="#" />
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
