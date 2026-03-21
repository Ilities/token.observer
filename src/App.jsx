import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import Compare from "./pages/Compare";
import { ModelsList, ModelDetail } from "./pages/Models";
import About from "./pages/About";
import History from "./pages/History";

// Component to handle redirect from 404.html
function RedirectHandler() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if there's a redirect URI stored from 404.html
    const redirectUri = sessionStorage.getItem('gh_redirect_uri');
    if (redirectUri) {
      // Clear the stored redirect URI to prevent infinite loops
      sessionStorage.removeItem('gh_redirect_uri');
      
      // Only navigate if we're not already at the target location
      const currentPath = location.pathname + location.search + location.hash;
      if (redirectUri !== currentPath) {
        // Navigate to the original path
        navigate(redirectUri, { replace: true });
      }
    }
  }, [location, navigate]);

  return null;
}

function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--academia-border)",
        padding: "48px 0",
        marginTop: 64,
        background: "var(--academia-background-alt)",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 24,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 600,
              fontSize: 18,
              color: "var(--academia-accent)",
              letterSpacing: "-0.01em",
            }}
          >
            token<span style={{ color: "var(--academia-crimson)" }}>.observer</span>
          </div>
          <div
            style={{
              fontSize: 13,
              color: "var(--academia-muted-foreground)",
              marginTop: 8,
              fontFamily: "var(--font-body)",
              lineHeight: 1.6,
            }}
          >
            Are models a commodity? The math says yes.
          </div>
        </div>
        <div
          style={{
            fontSize: 12,
            color: "var(--academia-muted-foreground)",
            fontFamily: "var(--font-display)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Prices verified March 2026 · Open source · PRs welcome
        </div>
      </div>
    </footer>
  );
}

function AppContent() {
  return (
    <>
      <RedirectHandler />
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/history" element={<History />} />
          <Route path="/models" element={<ModelsList />} />
          <Route path="/models/:id" element={<ModelDetail />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
