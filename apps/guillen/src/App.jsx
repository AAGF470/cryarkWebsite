import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Component, useState, useEffect } from "react";
import GuillenHomePage     from "./pages/GuillenHomePage";
import WorkPage            from "./pages/WorkPage";
import WorkDetailPage      from "./pages/WorkDetailPage";
import DevlogPage          from "./pages/DevlogPage";
import DevlogDetailPage    from "./pages/DevlogDetailPage";
import AboutPage           from "./pages/AboutPage";
import DocsPage            from "./pages/DocsPage";
import NotFoundPage        from "./pages/NotFoundPage";
import PageLoader          from "@shared/components/ui/PageLoader";
import AuroraBackground    from "@shared/components/ui/AuroraBackground";

// ---------------------------------------------------------------------------
// Guillen.Studio — router
// ---------------------------------------------------------------------------

// ── Error boundary — catches CMS / render errors, shows NotFoundPage ──────

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { has_error: false };
  }

  static getDerivedStateFromError() {
    return { has_error: true };
  }

  componentDidCatch(err, info) {
    // Log to console in dev; swap for Sentry or similar in production.
    if (import.meta.env.DEV) {
      console.error("[ErrorBoundary]", err, info);
    }
  }

  render() {
    if (this.state.has_error) {
      return <NotFoundPage />;
    }
    return this.props.children;
  }
}

// ── Routes ─────────────────────────────────────────────────────────────────

const router = createBrowserRouter([
  {
    path: "/",
    element: <GuillenHomePage />,
  },
  {
    path: "/work",
    element: <WorkPage />,
  },
  {
    path: "/work/:slug",
    element: <WorkDetailPage />,
  },
  {
    path: "/devlog",
    element: <DevlogPage />,
  },
  {
    path: "/devlog/:slug",
    element: <DevlogDetailPage />,
  },
  {
    path: "/about",
    element: <AboutPage />,
  },
  {
    // /docs/:space_slug/:page_slug — full doc page
    path: "/docs/:space_slug/:page_slug",
    element: <DocsPage />,
  },
  {
    // /docs/:space_slug — redirects to first page (handled inside DocsPage)
    path: "/docs/:space_slug",
    element: <DocsPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

// ── First-load screen ──────────────────────────────────────────────────────
// Visible for 420 ms then fades out in 400 ms.
const LOADER_VISIBLE_MS = 420;

export default function App() {
  const [loading, set_loading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => set_loading(false), LOADER_VISIBLE_MS);
    return () => clearTimeout(t);
  }, []);

  return (
    <ErrorBoundary>
      <AuroraBackground />
      <PageLoader visible={loading} />
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}
