import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ComingSoon from "./pages/ComingSoon";

// ---------------------------------------------------------------------------
// Cryark.net — holding router
//
// The full studio site (games, tools, lab) is under construction.
// All routes resolve to the coming soon page with a link to guillen.studio.
// When ready to launch, restore the full route table from git history.
// ---------------------------------------------------------------------------

const router = createBrowserRouter([
  { path: "*", element: <ComingSoon /> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}