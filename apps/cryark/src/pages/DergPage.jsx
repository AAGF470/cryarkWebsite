import SiteNav from "@shared/components/ui/SiteNav";
import LabHero from "@shared/components/ui/LabHero";
import DocLayout from "@shared/components/ui/DocLayout";
import CodeBlock from "@shared/components/ui/CodeBlock";
import Button from "@shared/components/ui/Button";
import SiteFooter from "@shared/components/ui/SiteFooter";
import "./DergPage.css";

// ── Sidebar navigation ────────────────────────────────────────────────────────

const SIDEBAR = [
  {
    label: "DERG",
    items: [
      { label: "Overview",          anchor: "overview"       },
      { label: "Pipeline",          anchor: "pipeline"       },
      { label: "Design Decisions",  anchor: "decisions"      },
      { label: "Implementation",    anchor: "implementation" },
      { label: "Session Schema",    anchor: "schema"         },
    ],
  },
  {
    label: "More Lab",
    items: [
      { label: "Wind Tunnel Software", href: "/" },
      { label: "Gym Tracker",          href: "/" },
    ],
  },
];

// ── Code snippets ─────────────────────────────────────────────────────────────

const CODE_SESSION_LOAD = `\
def load_session(session_path: Path) -> dict:
    """Load and validate session.json, normalising legacy key names."""
    with session_path.open() as f:
        data: dict = json.load(f)

    blend = data.get("blend_file") or data.get("blend")
    if not blend:
        raise KeyError("session.json must contain 'blend_file' or 'blend'")

    data["blend_file"] = blend
    return data`;

const CODE_TAG_GROUPS = `\
def collect_tag_groups(
    collection: bpy.types.Collection,
    depth: int = 0,
) -> dict[str, list[str]]:
    """Recursively walk ASSETS_LIBRARY; innermost collections become tag groups."""
    groups: dict[str, list[str]] = {}

    for child in collection.children:
        if child.children:
            groups |= collect_tag_groups(child, depth + 1)
        else:
            groups[child.name] = [obj.name for obj in child.objects]

    return groups`;

const CODE_PLACE_ASSET = `\
def place_asset(
    obj: bpy.types.Object,
    origin: bpy.types.Object,
    offset: tuple[float, float, float],
) -> None:
    """Parent obj to DERG_ORIGIN and apply a local offset."""
    ox, oy, oz = origin.location
    obj.location = (ox + offset[0], oy + offset[1], oz + offset[2])
    obj.parent = origin
    obj.matrix_parent_inverse = origin.matrix_world.inverted()`;

const CODE_RENDER_COLLECTOR = `\
def collect_renders(
    output_dir: Path,
    expected_count: int,
    poll_interval: float = 0.5,
    timeout: float = 300.0,
) -> list[Path]:
    """Block until all expected PNGs appear or timeout is reached."""
    deadline = time.monotonic() + timeout
    while time.monotonic() < deadline:
        frames = sorted(output_dir.glob("frame_*.png"))
        if len(frames) >= expected_count:
            return frames
        time.sleep(poll_interval)
    raise TimeoutError(f"Only {len(frames)}/{expected_count} frames rendered.")`;

const CODE_SESSION_JSON = `\
{
  "blend_file": "DergScene.blend",
  "output_dir": "outputs/run_042",
  "hdri_folders": ["hdri/overcast", "hdri/golden_hour"],
  "active_groups": ["trees_pine", "rocks_alpine", "props_launch_pad"],
  "batches": [
    {
      "id": "batch_01",
      "altitude_m": 120,
      "frame_count": 48,
      "designer": "rocket_designer"
    }
  ]
}`;

const CODE_PIPELINE = `\
derg.py (orchestrator)
  └─ level_query.py        # Blender subprocess — scans ASSETS_LIBRARY, builds library.json
  └─ level_designer.py     # User-swappable — reads manifest, outputs placement plan
  └─ internal_blender.py   # Places instances, sets HDRI, renders each stage
  └─ render_collector.py   # Polls output dir for PNGs, pipes to ffmpeg → MP4`;

const DECISIONS = [
  {
    key:  "Single session.json",
    desc: "All state lives in one file: batch definitions, render queue, asset library metadata, and manifest data. No separate database, no scattered config files. The entire job is self-describing and portable.",
  },
  {
    key:  "Blender as a subprocess",
    desc: "Rather than embedding Python inside Blender's interpreter permanently, DERG spawns Blender headlessly per job and communicates through stdout. This keeps the orchestration layer clean and makes Blender version swaps trivial.",
  },
  {
    key:  "Swappable designer module",
    desc: "level_designer.py is intentionally replaceable. Swap in rocket_designer.py or any other designer without touching the core pipeline. The designer receives the manifest and returns asset placement instructions — no coupling to render logic.",
  },
  {
    key:  "Terrain unhidden, never duplicated",
    desc: "Terrain meshes live in ASSETS_LIBRARY/terrain/ and are toggled visible rather than instanced. This avoids Blender's linked duplicate quirks on large landscape meshes, which can corrupt normals and UV data unpredictably.",
  },
  {
    key:  "DERG_ORIGIN empty as scatter anchor",
    desc: "A single empty object in the scene defines the world scatter origin. All asset placement is relative to it, so repositioning the entire scene is a one-object move with zero rework on the placement plan.",
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DergPage() {
  return (
    <div className="derg__page">
      <SiteNav />

      {/* Full-width hero — outside the doc grid */}
      <LabHero
        back_href="/"
        back_label="Lab"
        eyebrow="NU AERO × Cryark"
        title="DERG"
        subtitle="Dynamic Environment Render Generator"
        abstract="Python-driven render pipeline built for NU AERO's Legolass AI rocket tracking model. Given a flight profile, DERG generates a sequence of terrain and sky frames used as synthetic training data — all triggered through a Tauri desktop UI so non-engineers can configure and kick off render jobs without touching the command line."
        status="research"
        tags={["Blender", "Python", "CV / ML", "Tauri v2", "ffmpeg"]}
        collab="Collaboration with NU AERO — Northeastern University Aerospace Club"
        stats={[
          { value: "NU",  label: "AERO"      },
          { value: "CV",  label: "ML target" },
          { value: "3D",  label: "pipeline"  },
        ]}
      />

      {/* Sidebar + content */}
      <DocLayout sections={SIDEBAR}>

        {/* ── OVERVIEW ── */}
        <section className="derg__section" id="overview" data-doc-section>
          <div className="derg__container">
            <div className="derg__section_label">Overview</div>
            <p className="derg__prose">
              DERG takes a session configuration and a flight altitude profile, then scatters 3D assets
              from a curated Blender library into scenes matching the rocket's altitude and terrain
              context. Each batch renders headlessly via Blender subprocess calls and stitches rendered
              PNGs into an MP4 through ffmpeg. The entire system is packaged as a Tauri v2 desktop
              application with a custom React frontend — members of the NU AERO team can configure
              render jobs, kick off batches, and review output without ever touching the command line.
            </p>
            <p className="derg__prose">
              The AI target — Legolass — is a rocket tracking model that needs high-volume synthetic
              frames across variable altitude bands, lighting conditions, and terrain types. Manual
              Blender renders at that volume were infeasible. DERG reduced the per-batch effort from
              hours of manual work to a single session config and a button press.
            </p>
          </div>
        </section>

        {/* ── PIPELINE ── */}
        <section className="derg__section" id="pipeline" data-doc-section>
          <div className="derg__container derg__container--wide">
            <div className="derg__section_label">Pipeline</div>
            <p className="derg__prose derg__prose--sm">
              Four stages, each as a standalone Python module. The orchestrator (<code>derg.py</code>)
              owns the job loop; each stage is independently testable and replaceable.
            </p>
            <CodeBlock language="text" title="module graph" code={CODE_PIPELINE} />
          </div>
        </section>

        {/* ── DESIGN DECISIONS ── */}
        <section className="derg__section" id="decisions" data-doc-section>
          <div className="derg__container">
            <div className="derg__section_label">Design Decisions</div>
            <p className="derg__prose derg__prose--sm">
              Five architectural bets that shaped the whole system — each trading short-term
              complexity for long-term maintainability.
            </p>
            <ul className="derg__decisions">
              {DECISIONS.map(d => (
                <li key={d.key} className="derg__decision">
                  <strong className="derg__decision_key">{d.key}</strong>
                  <p className="derg__decision_desc">{d.desc}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── IMPLEMENTATION ── */}
        <section className="derg__section" id="implementation" data-doc-section>
          <div className="derg__container derg__container--wide">
            <div className="derg__section_label">Implementation</div>
            <p className="derg__prose derg__prose--sm">
              Selected snippets from the four pipeline modules.
            </p>
            <div className="derg__code_pair">
              <CodeBlock
                language="python"
                title="derg.py — session loading with key fallback"
                code={CODE_SESSION_LOAD}
              />
              <CodeBlock
                language="python"
                title="level_query.py — recursive sub-collection scan"
                code={CODE_TAG_GROUPS}
              />
            </div>
            <CodeBlock
              language="python"
              title="internal_blender.py — origin-relative asset placement"
              code={CODE_PLACE_ASSET}
            />
            <CodeBlock
              language="python"
              title="render_collector.py — PNG poll loop with timeout"
              code={CODE_RENDER_COLLECTOR}
            />
          </div>
        </section>

        {/* ── SESSION SCHEMA ── */}
        <section className="derg__section derg__section--last" id="schema" data-doc-section>
          <div className="derg__container derg__container--wide">
            <div className="derg__section_label">Session Schema</div>
            <p className="derg__prose derg__prose--sm">
              The single JSON file that drives a full render run. HDRI folders, active asset groups,
              and per-batch parameters all live here — no secondary config files.
            </p>
            <CodeBlock language="json" title="session.json" code={CODE_SESSION_JSON} />
          </div>
        </section>

      </DocLayout>

      {/* ── CTA — full width, outside doc grid ── */}
      <section className="derg__cta">
        <p className="derg__cta_eyebrow">Research · NU AERO × Cryark</p>
        <h2 className="derg__cta_title">Questions or collaborations?</h2>
        <p className="derg__cta_desc">
          DERG is an internal research tool. The pipeline design is adaptable
          to other synthetic data generation targets.
        </p>
        <div className="derg__cta_actions">
          <Button label="Get in touch" href="mailto:guillen.a@northeastern.edu" lava />
          <Button variant="ghost" label="← Back to lab" href="/" />
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
