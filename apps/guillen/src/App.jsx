import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Component }       from "react";
import GuillenHomePage     from "./pages/GuillenHomePage";
import WorkPage            from "./pages/WorkPage";
import WorkDetailPage      from "./pages/WorkDetailPage";
import DevlogPage          from "./pages/DevlogPage";
import DevlogDetailPage    from "./pages/DevlogDetailPage";
import AboutPage           from "./pages/AboutPage";
import NotFoundPage        from "./pages/NotFoundPage";

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
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}
