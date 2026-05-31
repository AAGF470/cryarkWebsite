import SiteNav from "@shared/components/ui/SiteNav";
import SiteFooter from "@shared/components/ui/SiteFooter";
import Button from "@shared/components/ui/Button";
import "./NotFoundPage.css";

// ---------------------------------------------------------------------------
// NotFoundPage — 404
//
// Welcoming, game-flavoured dead-end page.
// Renders for any route not matched by the router.
// ---------------------------------------------------------------------------

export default function NotFoundPage() {
  return (
    <div className="nf__page">
      <SiteNav />

      <main className="nf__main">
        <div className="nf__card">

          {/* Big gold gradient number */}
          <p className="nf__code" aria-hidden="true">404</p>

          <h1 className="nf__heading">Level not found.</h1>

          <p className="nf__body">
            This page was cut in pre-production — or it never shipped.
            Either way, there's nothing to render here.
          </p>

          <div className="nf__actions">
            <Button label="Back to main menu" href="/" lava />
            <Button variant="ghost" label="Browse the lab" href="/lab" />
          </div>

        </div>

        {/* Ambient grid — decorative */}
        <div className="nf__grid" aria-hidden="true" />
      </main>

      <SiteFooter />
    </div>
  );
}
