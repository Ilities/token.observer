import { useState } from "react";
import { Link } from "react-router-dom";
import { MODELS, SORTED_MODELS, TIERS } from "../data/models";
import ModelCard from "../components/ModelCard";
import FrontierTimelineGraph from "../components/FrontierTimelineGraph";
import { HARDWARE_CATEGORIES, MODEL_VRAM_MAP, GGUF_SIZES, estimateVram } from "../data/hardware";

function Ticker() {
  const items = [
    "Qwen3.5 122B = Claude Sonnet 4.6 quality at $0.20/M input",
    "MiniMax M2.5 = Claude Opus 4.6 speed at 1/10th the cost",
    "MiniMax M2.7 = Self-improving agentic model at $0.30/M input",
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
            <Link to="/compare" className="btn btn-primary" style={{ textDecoration: "none" }}>
              Run The Numbers →
            </Link>
            <Link to="/models" className="btn btn-secondary" style={{ textDecoration: "none" }}>
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
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--academia-muted)")}
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

      {/* Hardware Section */}
      <HardwareSection />

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
            {SORTED_MODELS.map((m) => (
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
            Stop paying the <span style={{ color: "var(--academia-crimson)" }}>token tax</span>
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

function HardwareSection() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [quantType, setQuantType] = useState("q4_k_m");

  const getCategoryModelDetails = (category) => {
    return category.recommendedModels
      .map((modelId) => {
        const model = MODELS.find((m) => m.id === modelId);
        const vramData = MODEL_VRAM_MAP[modelId];
        if (!model || !vramData) return null;

        const requiredVram = estimateVram(vramData.params, quantType);
        const maxVram = parseInt(category.tiers[category.tiers.length - 1].vram);
        const fits = requiredVram <= maxVram;

        return {
          ...model,
          requiredVram,
          fits,
          params: vramData.params,
          activeParams: vramData.active,
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.params - b.params);
  };

  return (
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
              color: "var(--academia-accent)",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              display: "block",
              marginBottom: 12,
            }}
          >
            Volume III — Hardware Guide
          </span>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: 36,
              fontWeight: 500,
              color: "var(--academia-foreground)",
            }}
          >
            What Can You Run? 🖥️
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
            Find the best model for your hardware. All sizes assume GGUF quantization - the
            practical way to run LLMs locally.
          </p>
        </div>

        {/* Quantization selector */}
        <div
          style={{
            background: "var(--academia-background-alt)",
            border: "1px solid var(--academia-border)",
            padding: "20px 24px",
            marginBottom: 32,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 14,
                fontWeight: 700,
                marginBottom: 4,
              }}
            >
              Quantization Level
            </div>
            <div style={{ fontSize: 12, color: "var(--academia-muted-foreground)" }}>
              Affects VRAM requirements and quality
            </div>
          </div>
          <select
            value={quantType}
            onChange={(e) => setQuantType(e.target.value)}
            style={{
              padding: "10px 16px",
              fontSize: 13,
              background: "var(--academia-background-alt)",
              color: "var(--academia-foreground)",
              border: "1px solid var(--academia-border)",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
            }}
          >
            {[
              { value: "q3_k_m", label: "Q3_K_M (70% size, -0.8% acc)" },
              { value: "q4_k_m", label: "Q4_K_M (75% size, -0.3% acc) ⭐" },
              { value: "q5_k_m", label: "Q5_K_M (85% size, -0.1% acc)" },
              { value: "q6_k", label: "Q6_K (95% size, ~0% acc)" },
              { value: "q8_0", label: "Q8_0 (110% size, lossless)" },
            ].map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Category Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 1,
            background: "var(--academia-border)",
            marginBottom: 40,
          }}
        >
          {HARDWARE_CATEGORIES.map((category) => (
            <div
              key={category.id}
              onClick={() =>
                setSelectedCategory(selectedCategory === category.id ? null : category.id)
              }
              style={{
                background: "var(--academia-background-alt)",
                padding: 24,
                cursor: "pointer",
                border:
                  selectedCategory === category.id
                    ? "2px solid var(--academia-accent)"
                    : "1px solid var(--academia-border)",
                transition: "all 0.15s",
              }}
            >
              <div
                style={{
                  fontSize: 32,
                  marginBottom: 12,
                }}
              >
                {category.icon}
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: 18,
                  fontWeight: 600,
                  marginBottom: 8,
                }}
              >
                {category.name}
              </h3>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--academia-muted-foreground)",
                  marginBottom: 16,
                }}
              >
                {category.description}
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: 11,
                }}
              >
                <span style={{ color: "var(--academia-muted-foreground)" }}>
                  Max: {category.maxPracticalParams}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    color: "var(--academia-accent)",
                  }}
                >
                  Best: {MODELS.find((m) => m.id === category.bestModel)?.name || "N/A"}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Category Detail */}
        {selectedCategory && (
          <CategoryDetail
            category={HARDWARE_CATEGORIES.find((c) => c.id === selectedCategory)}
            quantType={quantType}
            getModelDetails={getCategoryModelDetails}
          />
        )}

        {/* Quick Reference Table */}
        <div
          style={{
            background: "var(--academia-background-alt)",
            border: "1px solid var(--academia-border)",
            padding: 24,
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: 18,
              fontWeight: 600,
              marginBottom: 16,
            }}
          >
            📊 Quick Reference: Model Size vs VRAM
          </h3>
          <div style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>Model Size</th>
                  <th>Q3_K_M</th>
                  <th>Q4_K_M ⭐</th>
                  <th>Q5_K_M</th>
                  <th>Q6_K</th>
                  <th>Q8_0</th>
                  <th>Min GPU</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { size: "9B", params: 9 },
                  { size: "14B", params: 14 },
                  { size: "20B", params: 20 },
                  { size: "32B", params: 32 },
                  { size: "35B (MoE)", params: 35 },
                  { size: "49B", params: 49 },
                  { size: "70B", params: 70 },
                  { size: "120B", params: 120 },
                  { size: "235B (MoE)", params: 235 },
                  { size: "400B+", params: 400 },
                ].map((row) => (
                  <tr key={row.size}>
                    <td style={{ fontWeight: 700 }}>{row.size}</td>
                    <td style={{ color: "var(--academia-foreground)" }}>
                      {estimateVram(row.params, "q3_k_m")} GB
                    </td>
                    <td style={{ color: "var(--academia-accent)", fontWeight: 700 }}>
                      {estimateVram(row.params, "q4_k_m")} GB
                    </td>
                    <td style={{ color: "var(--academia-foreground)" }}>
                      {estimateVram(row.params, "q5_k_m")} GB
                    </td>
                    <td style={{ color: "var(--academia-foreground)" }}>
                      {estimateVram(row.params, "q6_k")} GB
                    </td>
                    <td style={{ color: "var(--academia-foreground)" }}>
                      {estimateVram(row.params, "q8_0")} GB
                    </td>
                    <td style={{ fontSize: 11, color: "var(--academia-muted-foreground)" }}>
                      {row.params <= 14 && "RTX 4070 12GB"}
                      {row.params > 14 && row.params <= 32 && "RTX 4090 24GB"}
                      {row.params > 32 && row.params <= 70 && "2× RTX 5090"}
                      {row.params > 70 && row.params <= 120 && "H100 80GB"}
                      {row.params > 120 && row.params <= 235 && "4× H100"}
                      {row.params > 235 && "8× H100 / Mac 512GB"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 16, fontSize: 12, color: "var(--academia-muted-foreground)" }}>
            💡 <strong>Note:</strong> MoE (Mixture of Experts) models only load active parameters
            during inference, but VRAM must hold all weights. KV cache requires additional 2-8GB
            depending on context length.
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryDetail({ category, quantType, getModelDetails }) {
  const modelDetails = getModelDetails(category);
  const bestModel = MODELS.find((m) => m.id === category.bestModel);

  return (
    <div
      style={{
        background: "var(--academia-background-alt)",
        border: "1px solid var(--academia-border)",
        borderLeft: "4px solid var(--academia-accent)",
        padding: 24,
        marginBottom: 32,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
          marginBottom: 24,
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: 24,
              fontWeight: 600,
              marginBottom: 8,
            }}
          >
            {category.icon} {category.name}
          </h2>
          <p style={{ color: "var(--academia-muted-foreground)", fontSize: 13 }}>
            {category.notes}
          </p>
        </div>
        <Link
          to={`/models/${category.bestModel}`}
          style={{
            background: "var(--academia-accent)",
            color: "#000",
            padding: "10px 20px",
            fontFamily: "var(--font-display)",
            fontSize: 12,
            fontWeight: 700,
            textDecoration: "none",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          View Best Model →
        </Link>
      </div>

      {/* Hardware Tiers */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 1,
          background: "var(--academia-border)",
          marginBottom: 24,
        }}
      >
        {category.tiers.map((tier, i) => (
          <div key={i} style={{ background: "var(--academia-background-alt)", padding: 16 }}>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 11,
                color: "var(--academia-muted-foreground)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 8,
              }}
            >
              {tier.name}
            </div>
            <div style={{ fontSize: 13, marginBottom: 4 }}>
              <strong>VRAM:</strong> {tier.vram}
            </div>
            <div
              style={{ fontSize: 12, color: "var(--academia-muted-foreground)", marginBottom: 4 }}
            >
              <strong>RAM:</strong> {tier.systemRam}
            </div>
            <div
              style={{ fontSize: 12, color: "var(--academia-muted-foreground)", marginBottom: 4 }}
            >
              <strong>Bandwidth:</strong> {tier.bandwidth}
            </div>
            <div style={{ fontSize: 11, color: "var(--academia-muted)", marginBottom: 8 }}>
              <strong>TDP:</strong> {tier.tdp}
            </div>
            <div
              style={{ fontSize: 11, color: "var(--academia-muted-foreground)", marginBottom: 0 }}
            >
              <strong>Examples:</strong>
              <br />
              {tier.examples.join(", ")}
            </div>
          </div>
        ))}
      </div>

      {/* Recommended Models */}
      <div style={{ marginBottom: 24 }}>
        <h3
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 16,
            fontWeight: 600,
            marginBottom: 12,
          }}
        >
          🎯 Recommended Models ({quantType.toUpperCase()})
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 12,
          }}
        >
          {modelDetails.map((model) => (
            <div
              key={model.id}
              style={{
                background: model.fits ? "var(--academia-background-alt)" : "#ff000008",
                border: model.fits ? "1px solid var(--academia-border)" : "1px solid #ef4444",
                padding: 16,
                opacity: model.fits ? 1 : 0.6,
              }}
            >
              <div
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <Link
                  to={`/models/${model.id}`}
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 14,
                    fontWeight: 700,
                    color: model.fits ? "var(--academia-foreground)" : "#ef4444",
                    textDecoration: "none",
                  }}
                >
                  {model.name}
                  {model.id === category.bestModel && (
                    <span
                      style={{
                        marginLeft: 8,
                        fontSize: 10,
                        background: "var(--academia-accent)",
                        color: "#000",
                        padding: "2px 6px",
                      }}
                    >
                      BEST
                    </span>
                  )}
                </Link>
                {!model.fits && (
                  <span
                    style={{
                      fontSize: 10,
                      color: "#ef4444",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    NEEDS {model.requiredVram}GB
                  </span>
                )}
              </div>
              <div
                style={{ fontSize: 11, color: "var(--academia-muted-foreground)", marginTop: 8 }}
              >
                {model.totalParams} {model.type === "MoE" && `(${model.activeParams} active)`} •{" "}
                {model.context} context
              </div>
              <div
                style={{ fontSize: 11, color: "var(--academia-muted-foreground)", marginTop: 4 }}
              >
                VRAM:{" "}
                <strong style={{ color: model.fits ? "var(--academia-accent)" : "#ef4444" }}>
                  {model.requiredVram}GB
                </strong>{" "}
                @ {quantType.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Best Model Highlight */}
      {bestModel && (
        <div
          style={{
            background: "rgba(255, 200, 100, 0.1)",
            border: "1px solid var(--academia-accent)",
            padding: 20,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 11,
              color: "var(--academia-accent)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: 8,
            }}
          >
            🏆 Best for {category.name}
          </div>
          <Link
            to={`/models/${bestModel.id}`}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 20,
              fontWeight: 700,
              color: "var(--academia-foreground)",
              textDecoration: "none",
            }}
          >
            {bestModel.name}
          </Link>
          <p
            style={{
              fontSize: 13,
              color: "var(--academia-muted-foreground)",
              marginTop: 8,
              marginBottom: 0,
            }}
          >
            {bestModel.verdictNote}
          </p>
        </div>
      )}
    </div>
  );
}
