import { Link } from "react-router-dom";
import { MODELS, TIERS } from "../data/models";
import ModelCard from "../components/ModelCard";
import FrontierTimelineGraph from "../components/FrontierTimelineGraph";

function Ticker() {
  const items = [
    "Qwen3.5 122B = Claude Sonnet 4.6 quality at $0.20/M input",
    "MiniMax M2.5 = Claude Opus 4.6 speed at 1/10th the cost",
    "RunPod A100 @ $1.33/hr · H100 @ $2.17/hr · billed per second",
    "Qwen3.5 27B fits on a single RTX 4090",
    "LLM API prices dropped 80% in 2025→2026",
    "Are you still paying Anthropic full price?",
  ];
  const text = [...items, ...items].join("   ✦   ");

  return (
    <div
      style={{
        borderBottom: "1px solid var(--academia-border)",
        borderTop: "1px solid var(--academia-border)",
        overflow: "hidden",
        background: "var(--academia-background-alt)",
        padding: "10px 0",
      }}
    >
      <div
        style={{
          whiteSpace: "nowrap",
          display: "inline-block",
          animation: "ticker 60s linear infinite",
          fontSize: 12,
          color: "var(--academia-muted-foreground)",
          letterSpacing: "0.06em",
          fontFamily: "var(--font-display)",
        }}
      >
        {text}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{text}
      </div>
    </div>
  );
}

const THESIS_POINTS = [
  {
    id: "quality_plateau",
    title: "Quality has plateaued for everyday tasks",
    body: "For writing, coding assistance, and analysis, mid-tier open models now match Claude Sonnet and GPT-4o. The gap that justified premium API pricing has collapsed.",
  },
  {
    id: "price_collapse",
    title: "API prices fell 80% in 12 months",
    body: "Competition from DeepSeek, Qwen, and MiniMax forced Western providers to slash prices. The $10/M input norm is now $0.20/M for open models.",
  },
  {
    id: "hardware_accessibility",
    title: "Self-host is accessible on consumer hardware",
    body: "Qwen3.5 27B runs on a single RTX 4090. A used RTX 3090 ($550) is enough for personal use. You don't need a datacenter anymore.",
  },
  {
    id: "decision_complexity",
    title: "The decision is no longer about quality—it's about math",
    body: "Given your usage pattern and quality needs, there's an optimal choice: closed API, open API, rental, or owned hardware. We built the calculator to find it.",
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <div
        className="corner-flourish corner-flourish-lg"
        style={{
          borderBottom: "1px solid var(--academia-border)",
          padding: "96px 0 80px",
          position: "relative",
          overflow: "hidden",
          background: "var(--academia-background-alt)",
        }}
      >
        {/* Background grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(var(--academia-border) 1px, transparent 1px), linear-gradient(90deg, var(--academia-border) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            opacity: 0.25,
          }}
        />

        <div className="container" style={{ position: "relative" }}>
          {/* Investigation label */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 32,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 10,
                color: "var(--academia-crimson)",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                padding: "4px 12px",
                border: "1px solid var(--academia-crimson)",
                borderRadius: "2px",
              }}
            >
              Investigation
            </span>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 10,
                color: "var(--academia-muted-foreground)",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              March 2026
            </span>
          </div>

          {/* Main headline */}
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(42px, 7vw, 80px)",
              fontWeight: 500,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              marginBottom: 32,
              maxWidth: 850,
              color: "var(--academia-foreground)",
            }}
          >
            Are AI Models
            <br />
            <span style={{ color: "var(--academia-accent)" }}>Becoming a Commodity?</span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 18,
              color: "var(--academia-muted-foreground)",
              maxWidth: 600,
              lineHeight: 1.75,
              marginBottom: 40,
            }}
          >
            We ran the math on local hardware, rented cloud GPUs, and per-token APIs. The results
            are uncomfortable for the incumbents.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <Link
              to="/compare"
              className="btn btn-primary"
              style={{ textDecoration: "none" }}
            >
              Run The Numbers →
            </Link>
            <Link
              to="/models"
              className="btn btn-secondary"
              style={{ textDecoration: "none" }}
            >
              Browse Models
            </Link>
          </div>
        </div>
      </div>

      {/* Ticker */}
      <Ticker />

      {/* Key Stats Section */}
      <div
        style={{
          borderBottom: "1px solid var(--academia-border)",
          padding: "64px 0",
        }}
      >
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 1,
              background: "var(--academia-border)",
            }}
          >
            {[
              {
                label: "API price drop 2025→2026",
                value: "80%",
                color: "var(--academia-accent)",
                sub: "Market-wide average",
              },
              {
                label: "Cheapest open model API",
                value: "$0.02/M",
                color: "var(--academia-accent)",
                sub: "DeepInfra Llama 3.1 8B",
              },
              {
                label: "RunPod H100 per second",
                value: "$0.0006",
                color: "var(--academia-foreground)",
                sub: "Billed by the millisecond",
              },
              {
                label: "Qwen3.5 27B on RTX 4090",
                value: "~60 t/s",
                color: "var(--academia-accent)",
                sub: "Q4 quantized, ~$0.01/day electricity",
              },
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  background: "var(--academia-background-alt)",
                  padding: "32px 28px",
                  transition: "background 0.3s ease-out",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--academia-muted)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "var(--academia-background-alt)")
                }
              >
                <div
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: 36,
                    fontWeight: 600,
                    color: s.color,
                    marginBottom: 8,
                    lineHeight: 1.1,
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 10,
                    color: "var(--academia-muted-foreground)",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    lineHeight: 1.5,
                  }}
                >
                  {s.label}
                </div>
                {s.sub && (
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--academia-muted-foreground)",
                      marginTop: 8,
                      lineHeight: 1.5,
                    }}
                  >
                    {s.sub}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Frontier Timeline Graph Section */}
      <div
        style={{
          borderBottom: "1px solid var(--academia-border)",
          padding: "80px 0",
          background: "var(--academia-background-alt)",
        }}
      >
        <div className="container">
          {/* Section header */}
          <div style={{ marginBottom: 48 }}>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 10,
                color: "var(--academia-crimson)",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: 12,
              }}
            >
              Volume I — The Frontier Climb
            </span>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 36,
                fontWeight: 500,
                color: "var(--academia-foreground)",
              }}
            >
              How far behind has each category caught up?
            </h2>
            <hr className="ornate-divider" style={{ width: 120, marginLeft: 0, marginTop: 20 }} />
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 15,
                color: "var(--academia-muted-foreground)",
                maxWidth: 700,
                lineHeight: 1.7,
                marginTop: 16,
              }}
            >
              The graph below shows the remarkable climb of open-weight models through hardware
              categories. Each point represents a model you can run locally today that matches the
              frontier AI of months past. From laptop to datacenter, see where your hardware slots
              into the timeline.
            </p>
          </div>

          {/* The Graph */}
          <FrontierTimelineGraph />
        </div>
      </div>

      {/* Thesis Section */}
      <div
        style={{
          borderBottom: "1px solid var(--academia-border)",
          padding: "80px 0",
        }}
      >
        <div className="container">
          {/* Section header */}
          <div style={{ marginBottom: 48 }}>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 10,
                color: "var(--academia-accent)",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: 12,
              }}
            >
              Volume II — The Thesis
            </span>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 36,
                fontWeight: 500,
                color: "var(--academia-foreground)",
              }}
            >
              What we found
            </h2>
            <hr className="ornate-divider" style={{ width: 120, marginLeft: 0, marginTop: 20 }} />
          </div>

          {/* Thesis cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 1,
              background: "var(--academia-border)",
            }}
          >
            {THESIS_POINTS.map((p, i) => (
              <div
                key={p.id}
                className="card corner-flourish"
                style={{
                  background: "var(--academia-background-alt)",
                  borderRadius: 0,
                  height: "100%",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 10,
                    color: "var(--academia-accent)",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    marginBottom: 16,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: 18,
                    fontWeight: 500,
                    marginBottom: 12,
                    lineHeight: 1.35,
                    color: "var(--academia-foreground)",
                  }}
                >
                  {p.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 14,
                    color: "var(--academia-muted-foreground)",
                    lineHeight: 1.75,
                  }}
                >
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Models Section */}
      <div
        style={{
          borderBottom: "1px solid var(--academia-border)",
          padding: "80px 0",
        }}
      >
        <div className="container">
          {/* Section header */}
          <div
            style={{
              marginBottom: 48,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              flexWrap: "wrap",
              gap: 20,
            }}
          >
            <div>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 10,
                  color: "var(--academia-accent)",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  display: "block",
                  marginBottom: 12,
                }}
              >
                Volume II — Models Under Investigation
              </span>
              <h2
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: 36,
                  fontWeight: 500,
                  color: "var(--academia-foreground)",
                }}
              >
                Self-host viability analysis
              </h2>
            </div>
            <Link
              to="/models"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 11,
                color: "var(--academia-accent)",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                textDecoration: "none",
                borderBottom: "1px solid var(--academia-accent)",
                paddingBottom: 4,
                transition: "color 0.3s ease-out",
              }}
            >
              View all →
            </Link>
          </div>

          {/* Model cards grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
              gap: 20,
            }}
          >
            {MODELS.map((m) => (
              <ModelCard key={m.id} model={m} />
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div
        style={{
          padding: "96px 0",
          textAlign: "center",
        }}
      >
        <div className="container" style={{ maxWidth: 600 }}>
          {/* Decorative element */}
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 32,
              color: "var(--academia-accent)",
              marginBottom: 24,
            }}
          >
            ❧
          </div>

          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: 36,
              fontWeight: 500,
              marginBottom: 16,
              color: "var(--academia-foreground)",
            }}
          >
            Stop paying the{" "}
            <span style={{ color: "var(--academia-crimson)" }}>token tax</span>
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 16,
              color: "var(--academia-muted-foreground)",
              lineHeight: 1.75,
              marginBottom: 40,
              maxWidth: 520,
              margin: "0 auto 40px",
            }}
          >
            The math is clear. The only question is when your traffic justifies the switch. Use our
            calculator to find your crossover point.
          </p>
          <Link to="/compare" className="btn btn-primary" style={{ textDecoration: "none" }}>
            Find Your Crossover →
          </Link>
        </div>
      </div>
    </div>
  );
}
