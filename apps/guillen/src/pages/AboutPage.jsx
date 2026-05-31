// ---------------------------------------------------------------------------
// AboutPage — guillen.studio/about
//
// Thin wrapper around the shared AboutPage component.
// All content is managed in Sanity under the "guillen" site profile.
//
// To add content:
//   1. Open Sanity Studio → About Profile → create a Guillen profile
//   2. Add Skills  → Skill documents (site_visibility: guillen)
//   3. Add entries → Experience documents (site_visibility: guillen)
// ---------------------------------------------------------------------------

import SharedAboutPage from "@shared/components/about/AboutPage";

const NAV = [
  { to: "/work",   label: "Work"   },
  { to: "/devlog", label: "Devlog" },
  { to: "/about",  label: "About"  },
];

export default function AboutPage() {
  return (
    <SharedAboutPage
      site="guillen"
      variant="guillen"
      nav_links={NAV}
      logo_text="AG"
    />
  );
}
