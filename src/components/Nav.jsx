import { Link, useLocation } from "react-router-dom";

export default function Nav() {
  const { pathname } = useLocation();

  const links = [
    { to: "/", label: "Expose" },
    { to: "/compare", label: "Compare" },
    { to: "/benchmarks", label: "Benchmarks" },
    { to: "/hardware", label: "Hardware" },
    { to: "/history", label: "History" },
    { to: "/timemachine", label: "Time Machine" },
    { to: "/models", label: "Models" },
    { to: "/about", label: "About" },
  ];

  return (
    <nav
      style={{
        borderBottom: "1px solid var(--academia-border)",
        position: "sticky",
        top: 0,
        background: "rgba(28, 23, 20, 0.95)",
        backdropFilter: "blur(8px)",
        zIndex: 100,
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 64,
        }}
      >
        <Link
          to="/"
          style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 600,
            fontSize: 20,
            color: "var(--academia-accent)",
            letterSpacing: "-0.01em",
            textDecoration: "none",
            transition: "color 0.3s ease-out",
          }}
        >
          token<span style={{ color: "var(--academia-crimson)" }}>.observer</span>
        </Link>

        <div
          style={{
            display: "flex",
            gap: 8,
          }}
        >
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              style={{
                padding: "6px 14px",
                fontFamily: "var(--font-display)",
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color:
                  pathname === l.to ? "var(--academia-accent)" : "var(--academia-muted-foreground)",
                textDecoration: "none",
                borderBottom:
                  pathname === l.to
                    ? "1px solid var(--academia-accent)"
                    : "1px solid transparent",
                transition: "color 0.3s ease-out, border-color 0.3s ease-out",
              }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
