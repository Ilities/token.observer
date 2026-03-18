import { Link } from "react-router-dom";
import { TIERS } from "../data/models";

export default function ModelCard({ model }) {
  const tier = TIERS[model.tier];
  const cheapest = model.apiProviders.find((p) => p.input && p.output);
  const hardware = model.purchaseOptions[0];

  const verdictColors = {
    VIABLE: "var(--academia-accent)",
    HARD: "var(--academia-accent-dark)",
    IMPRACTICAL: "var(--academia-crimson)",
  };

  return (
    <Link to={`/models/${model.id}`} style={{ textDecoration: "none" }}>
      <div
        className="card corner-flourish"
        style={{
          borderTop: `3px solid ${verdictColors[model.verdict] || "var(--academia-border)"}`,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 20,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 600,
                fontSize: 20,
                color: "var(--academia-foreground)",
                marginBottom: 6,
              }}
            >
              {model.name}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--academia-muted-foreground)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontFamily: "var(--font-display)",
              }}
            >
              {model.type} · {model.totalParams} total · {model.activeParams} active
            </div>
          </div>
          <span className={`tag tag-${model.verdict.toLowerCase()}`}>{model.verdict}</span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            marginBottom: 20,
            flex: 1,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 10,
                color: "var(--academia-muted-foreground)",
                marginBottom: 6,
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                fontFamily: "var(--font-display)",
              }}
            >
              Tier Equivalent
            </div>
            <div
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 14,
                color: "var(--academia-foreground)",
              }}
            >
              {tier?.closedApiName || "—"}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--academia-muted-foreground)",
                marginTop: 4,
              }}
            >
              ${tier?.closedApiCost.input.toFixed(2)}/${tier?.closedApiCost.output.toFixed(2)} per
              1M
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: 10,
                color: "var(--academia-muted-foreground)",
                marginBottom: 6,
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                fontFamily: "var(--font-display)",
              }}
            >
              Cheapest Open API
            </div>
            <div
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 16,
                color: "var(--academia-accent)",
              }}
            >
              ${cheapest ? cheapest.input.toFixed(2) : "—"}
              <span
                style={{ fontSize: 11, color: "var(--academia-muted-foreground)", marginLeft: 2 }}
              >
                /${cheapest ? cheapest.output.toFixed(2) : "—"}
              </span>
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--academia-muted-foreground)",
                marginTop: 4,
              }}
            >
              {cheapest?.name}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            marginBottom: 16,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 10,
                color: "var(--academia-muted-foreground)",
                marginBottom: 6,
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                fontFamily: "var(--font-display)",
              }}
            >
              Hardware
            </div>
            <div
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 14,
                color: "var(--academia-foreground)",
              }}
            >
              {hardware?.name || "—"}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--academia-muted-foreground)",
                marginTop: 4,
              }}
            >
              ${hardware?.purchaseCost.toLocaleString()} new
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: 10,
                color: "var(--academia-muted-foreground)",
                marginBottom: 6,
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                fontFamily: "var(--font-display)",
              }}
            >
              Electricity
            </div>
            <div
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 15,
                color: "var(--academia-foreground)",
              }}
            >
              ${hardware?.monthlyElectricity}/mo
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--academia-muted-foreground)",
                marginTop: 4,
              }}
            >
              {hardware?.canRunModel}
            </div>
          </div>
        </div>

        <div
          style={{
            paddingTop: 16,
            borderTop: "1px solid var(--academia-border)",
            fontSize: 12,
            color: "var(--academia-muted-foreground)",
            lineHeight: 1.6,
          }}
        >
          {model.verdictNote}
        </div>

        {tier && (
          <div
            style={{
              marginTop: 12,
              fontSize: 12,
              color: "var(--academia-muted-foreground)",
            }}
          >
            <span style={{ color: tier.color, fontWeight: 600 }}>{tier.label}</span>
            <span style={{ marginLeft: 8 }}>— {tier.description}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
