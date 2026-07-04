import "./NotFoundPage.css";

export default function NotFoundPage() {
  return (
    <main className="nf">
      <div className="gh-grain" aria-hidden="true" />

      <div className="nf__content">
        <p className="nf-code">404</p>
        <h1 className="nf-title">Page not found.</h1>
        <p className="nf-tagline">This route doesn't exist — yet.</p>

        <div className="nf__links">
          <a href="/">Home</a>
          <a href="/work">View work</a>
        </div>
      </div>
    </main>
  );
}
