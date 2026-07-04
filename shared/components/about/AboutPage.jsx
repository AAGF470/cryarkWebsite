import { useState, useRef, useEffect } from "react";
import {
  useCmsQuery,
  ABOUT_PROFILE,
  ALL_SKILLS,
  ALL_EXPERIENCE,
  ALL_ABOUT_PROJECTS,
} from "@shared/lib/cms";
import SiteNav    from "@shared/components/ui/SiteNav";
import SiteFooter from "@shared/components/ui/SiteFooter";
import SEOMeta    from "@shared/components/SEOMeta";
import "./AboutPage.css";

// ---------------------------------------------------------------------------
// AboutPage — shared between guillen.studio and cryark.net
//
// Props:
//   site       "guillen" | "cryark"   — which CMS data to fetch
//   nav_links  array                  — passed to SiteNav
//   logo_text  string | null          — passed to SiteNav
//   variant    "guillen" | "cryark"   — controls accent colour via CSS vars
// ---------------------------------------------------------------------------

// ── Status badge labels & colours (matches WorkCard) ─────────────────────

const STATUS_LABELS = {
  released: 'Released',
  in_dev:   'In Dev',
  research: 'Research',
  live:     'Live',
  collab:   'Collab',
};

// ── Proficiency tooltip copy ──────────────────────────────────────────────

// Labels and descriptions frame usage depth, not self-assessed skill level.
// The scale answers: "how much have I actually used this and how central is it
// to my real work?" — not "how good do I think I am at it?"

const LEVEL_LABEL = {
  exploring:   'Exploring',
  integrating: 'Integrating',
  proficient:  'Established',
  expert:      'Core tooling',
};

const LEVEL_DEFAULT_DESC = {
  exploring:   'Newly picked up — building initial familiarity through experiments and side projects.',
  integrating: 'Actively integrating into real projects — hands-on use is building genuine experience.',
  proficient:  'A reliable part of my workflow — used consistently across multiple projects with shipped work.',
  expert:      'Central to how I build — deeply integrated into shipped projects with real, tangible results.',
};

// ── Skill chip with hover tooltip ────────────────────────────────────────

function SkillChip({ name, proficiency = 'proficient', description }) {
  return (
    <span className={`ab-chip ab-chip--${proficiency}`}>
      {name}
      <span className="ab-chip__tip" role="tooltip">
        <span className={`ab-chip__tip-level ab-chip__tip-level--${proficiency}`}>
          {LEVEL_LABEL[proficiency] ?? proficiency}
        </span>
        <span className="ab-chip__tip-desc">
          {description || LEVEL_DEFAULT_DESC[proficiency]}
        </span>
        <span className="ab-chip__tip-arrow" aria-hidden="true" />
      </span>
    </span>
  );
}

// ── Project card — glance row + expandable deep-dive drawer ──────────────

function ProjectCard({
  title, status, stack, description, role,
  thumbnail_url, video_url,
  expanded_content, project_slug,
}) {
  const [open, set_open]     = useState(false);
  const body_ref             = useRef(null);
  const [height, set_height] = useState(0);

  useEffect(() => {
    if (!body_ref.current) return;
    set_height(open ? body_ref.current.scrollHeight : 0);
  }, [open]);

  const has_expanded = expanded_content?.length > 0;
  const is_mp4       = video_url?.match(/\.(mp4|webm|ogg)(\?.*)?$/i);

  return (
    <div className={`ab-proj${open ? " ab-proj--open" : ""}`}>

      {/* ── Glance row (always visible) ─────────────────────────────── */}
      <div className="ab-proj__glance">

        {/* Media column */}
        {(video_url || thumbnail_url) && (
          <div className="ab-proj__media">
            {video_url ? (
              is_mp4 ? (
                <video src={video_url} autoPlay loop muted playsInline />
              ) : (
                <iframe src={video_url} title={title} allowFullScreen loading="lazy" />
              )
            ) : (
              <img src={thumbnail_url} alt={title} loading="lazy" />
            )}
          </div>
        )}

        {/* Info column */}
        <div className="ab-proj__info">
          <div className="ab-proj__head">
            <h3 className="ab-proj__title">{title}</h3>
            {status && (
              <span className={`ab-proj__status ab-proj__status--${status}`}>
                {STATUS_LABELS[status] ?? status}
              </span>
            )}
          </div>

          {stack?.length > 0 && (
            <div className="ab-proj__stack">
              {stack.map(s => (
                <span key={s} className="ab-proj__stack-chip">{s}</span>
              ))}
            </div>
          )}

          {description && (
            <p className="ab-proj__desc">{description}</p>
          )}

          {role && (
            <div className="ab-proj__role">
              <span className="ab-proj__role-label">My role</span>
              <span className="ab-proj__role-text">{role}</span>
            </div>
          )}

          <div className="ab-proj__footer">
            {project_slug && (
              <a
                href={`/work/${project_slug}`}
                className="ab-proj__worklink"
                onClick={e => e.stopPropagation()}
              >
                Full project ↗
              </a>
            )}
            {has_expanded && (
              <button
                className="ab-proj__expand-btn"
                onClick={() => set_open(v => !v)}
              >
                {open ? "Less ↑" : "More details ↓"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Deep-dive drawer (animated) ─────────────────────────────── */}
      <div
        className="ab-proj__body-wrap"
        style={{ maxHeight: height }}
        aria-hidden={!open}
      >
        <div className="ab-proj__body" ref={body_ref}>
          {expanded_content?.map((block, i) => {
            switch (block._type) {

              case 'proj_text':
                return block.text
                  ? <p key={i} className="ab-proj__body-text">{block.text}</p>
                  : null;

              case 'proj_image':
                return block.image_url ? (
                  <figure
                    key={i}
                    className={`ab-proj__body-img${block.full_width ? " ab-proj__body-img--full" : ""}`}
                  >
                    <img src={block.image_url} alt={block.caption ?? title} loading="lazy" />
                    {block.caption && (
                      <figcaption className="ab-proj__body-caption">{block.caption}</figcaption>
                    )}
                  </figure>
                ) : null;

              case 'proj_code':
                return (
                  <div key={i} className="ab-proj__body-code">
                    <div className="ab-proj__body-code-hdr">
                      <span className="ab-proj__body-code-lang">{block.language}</span>
                      {block.label && (
                        <span className="ab-proj__body-code-label">{block.label}</span>
                      )}
                    </div>
                    <pre className="ab-proj__body-code-pre">
                      <code>{block.code}</code>
                    </pre>
                  </div>
                );

              default:
                return null;
            }
          })}
        </div>
      </div>
    </div>
  );
}

// ── Accordion item (experience / timeline) ────────────────────────────────

function AccordionItem({ title, sub, date_range, description, tags, demo_url, project_slug }) {
  const [open, set_open]     = useState(false);
  const body_ref             = useRef(null);
  const [height, set_height] = useState(0);

  useEffect(() => {
    if (!body_ref.current) return;
    set_height(open ? body_ref.current.scrollHeight : 0);
  }, [open]);

  return (
    <div className={`ab-item${open ? " ab-item--open" : ""}`}>
      <button className="ab-item__trigger" onClick={() => set_open(v => !v)}>
        <div className="ab-item__left">
          <span className="ab-item__dot" aria-hidden="true" />
          <div className="ab-item__info">
            <span className="ab-item__title">{title}</span>
            {sub && <span className="ab-item__sub">{sub}</span>}
          </div>
        </div>
        <div className="ab-item__right">
          {date_range && <span className="ab-item__date">{date_range}</span>}
          <span className="ab-item__more" aria-hidden="true">
            {open ? "Less ↑" : "More details ↓"}
          </span>
        </div>
      </button>

      <div
        className="ab-item__body-wrap"
        style={{ maxHeight: height }}
        aria-hidden={!open}
      >
        <div className="ab-item__body" ref={body_ref}>
          {description && <p className="ab-item__desc">{description}</p>}

          {tags?.length > 0 && (
            <div className="ab-item__tags">
              {tags.map(t => (
                <span key={t} className="ab-item__tag">{t}</span>
              ))}
            </div>
          )}

          {demo_url && (
            <div className="ab-item__demo">
              <iframe
                src={demo_url}
                title={`${title} demo`}
                loading="lazy"
                allowFullScreen
              />
            </div>
          )}

          {project_slug && (
            <a href={`/work/${project_slug}`} className="ab-item__projlink">
              View project →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Section wrapper ───────────────────────────────────────────────────────

function Section({ label, children }) {
  return (
    <section className="ab-section">
      <div className="ab-section__label">{label}</div>
      {children}
    </section>
  );
}

// ── JSON-LD Person schema builder ─────────────────────────────────────────

function build_person_schema(profile, skills_raw) {
  const knows_about = (skills_raw ?? []).map(s => s.name);
  const same_as     = (profile?.contact_links ?? [])
    .filter(l => l.href && !l.href.startsWith("mailto"))
    .map(l => l.href);

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name:         profile?.name       ?? "Angel A. Guillen Flores",
    jobTitle:     profile?.title      ?? "Software Engineer & Game Developer",
    description:  profile?.bio        ?? "",
    url:          "https://guillen.studio",
    sameAs:       same_as.length > 0 ? same_as : [
      "https://github.com",
      "https://linkedin.com",
    ],
    knowsAbout:   knows_about,
    ...(profile?.education?.length > 0 && {
      alumniOf: profile.education.map(e => ({
        "@type": "EducationalOrganization",
        name: e.institution,
      })),
    }),
    // AI recruiter hint: structured skills for automated parsing
    hasOccupation: {
      "@type":         "Occupation",
      name:            profile?.title ?? "Software Engineer & Game Developer",
      skills:          knows_about.join(", "),
      occupationLocation: {
        "@type": "Country",
        name:    "United States",
      },
    },
  };
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function AboutPage({
  site       = "guillen",
  nav_links  = [],
  logo_text  = null,
  variant    = "guillen",
  nav_preset = 'bar',   // SiteNav preset pass-through (additive; 'bar' = legacy default)
}) {
  const { data: profile }    = useCmsQuery(ABOUT_PROFILE,      { site });
  const { data: skills_raw } = useCmsQuery(ALL_SKILLS,         { site });
  const { data: experience } = useCmsQuery(ALL_EXPERIENCE,     { site });
  const { data: projects }   = useCmsQuery(ALL_ABOUT_PROJECTS, { site });

  // Group skills by category, preserving CMS order within each group
  const skill_groups = (skills_raw ?? []).reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  // JSON-LD only for guillen (the public portfolio site)
  const person_schema = site === "guillen"
    ? build_person_schema(profile, skills_raw)
    : null;

  return (
    <div className={`ab-page ab-page--${variant}`}>
      {person_schema && (
        <SEOMeta
          title={profile?.name ?? "About"}
          description={profile?.bio?.slice(0, 160) ?? `Portfolio of ${profile?.name ?? "Angel A. Guillen Flores"} — ${profile?.title ?? "Software Engineer & Game Developer"}`}
          canonical="https://guillen.studio/about"
          schema={person_schema}
        />
      )}

      <div className="ab-grain" aria-hidden="true" />

      <SiteNav preset={nav_preset} links={nav_links} logo_text={logo_text} />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <header className="ab-hero">
        <div className="ab-hero__inner">
          {profile?.tagline && (
            <p className="ab-hero__tagline">{profile.tagline}</p>
          )}
          <h1 className="ab-hero__name">{profile?.name ?? " "}</h1>
          {profile?.title && (
            <p className="ab-hero__title">{profile.title}</p>
          )}
          {profile?.bio && (
            <p className="ab-hero__bio">{profile.bio}</p>
          )}
          <div className="ab-hero__actions">
            <a href="/work"   className="ab-hero__btn ab-hero__btn--primary">View Work →</a>
            <a href="/devlog" className="ab-hero__btn ab-hero__btn--ghost">Devlog</a>
          </div>

          <button
            className="ab-print-btn"
            onClick={() => window.print()}
            aria-label="Export as PDF"
          >
            ↓ Export PDF
          </button>
        </div>
      </header>

      <div className="ab-body">

        {/* ── Skills & Stack ──────────────────────────────────────────── */}
        {Object.keys(skill_groups).length > 0 && (
          <Section label="Skills & Stack">
            <div className="ab-skills">
              {Object.entries(skill_groups).map(([category, items]) => (
                <div key={category} className="ab-skills__row">
                  <span className="ab-skills__cat">{category}</span>
                  <div className="ab-skills__chips">
                    {items.map(s => (
                      <SkillChip
                        key={s._id}
                        name={s.name}
                        proficiency={s.proficiency}
                        description={s.description}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ── Projects ────────────────────────────────────────────────── */}
        {projects?.length > 0 && (
          <Section label="Projects">
            <div className="ab-projects">
              {projects.map(p => (
                <ProjectCard key={p._id} {...p} />
              ))}
            </div>
          </Section>
        )}

        {/* ── Experience ──────────────────────────────────────────────── */}
        <Section label="Experience">
          {!experience?.length ? (
            <p className="ab-placeholder">Experience entries coming soon.</p>
          ) : (
            <div className="ab-timeline">
              {experience.map(item => (
                <AccordionItem key={item._id} {...item} />
              ))}
            </div>
          )}
        </Section>

        {/* ── Education ───────────────────────────────────────────────── */}
        {profile?.education?.length > 0 && (
          <Section label="Education">
            <div className="ab-edu">
              {profile.education.map((e, i) => (
                <div key={i} className="ab-edu__item">
                  <div className="ab-edu__degree">{e.degree}</div>
                  <div className="ab-edu__inst">{e.institution} · {e.year}</div>
                  {e.notes && <div className="ab-edu__notes">{e.notes}</div>}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ── Contact ─────────────────────────────────────────────────── */}
        {profile?.contact_links?.length > 0 && (
          <Section label="Contact">
            <div className="ab-contact">
              {profile.contact_links.map(({ label, href, display }, i) => (
                <a
                  key={i}
                  href={href}
                  className="ab-contact__item"
                  target={href?.startsWith("mailto") ? undefined : "_blank"}
                  rel="noreferrer"
                >
                  <span className="ab-contact__label">{label}</span>
                  <span className="ab-contact__display">{display}</span>
                  <span className="ab-contact__arrow" aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </Section>
        )}

      </div>

      <SiteFooter variant={variant} />
    </div>
  );
}
