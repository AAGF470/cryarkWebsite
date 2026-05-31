// ---------------------------------------------------------------------------
// ComingSoon — cryark.net holding page
//
// Shown for all routes while the full studio site is under construction.
// Atmospheric brand anchor: wordmark, tagline, and link to guillen.studio.
// ---------------------------------------------------------------------------

import "./ComingSoon.css";

export default function ComingSoon() {
  return (
    <div className="cs">
      <div className="cs__grain" aria-hidden="true" />

      <main className="cs__main">
        <p className="cs__status">Something is being forged.</p>

        <h1 className="cs__wordmark">Cryark</h1>

        <p className="cs__tagline">Games and tools, built to last.</p>

        <p className="cs__desc">
          An independent solo studio building atmospheric games and sharp
          developer tooling. Each project ships when it&rsquo;s ready.
        </p>

        <ul className="cs__pillars" aria-label="Coming soon">
          <li>Games</li>
          <li>Developer Tools</li>
          <li>Lab</li>
        </ul>

        <a
          href="https://guillen.studio"
          className="cs__link"
          target="_blank"
          rel="noreferrer"
        >
          Visit guillen.studio ↗
        </a>
      </main>
    </div>
  );
}
