import { useParams, Link } from "react-router-dom";
import { MODELS, TIERS } from "../data/models";
import ModelCard from "../components/ModelCard";

export function ModelsList() {
  return (
    <div style={{ padding: "64px 0" }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 56 }}>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 10,
              color: "var(--academia-accent)",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              display: "block",
              marginBottom: 16,
            }}
          >
            Volume II — Models Under Investigation
          </span>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: 42,
              fontWeight: 500,
              color: "var(--academia-foreground)",
              lineHeight: 1.1,
            }}
          >
            Open model viability tracker
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body)",
              color: "var(--academia-muted-foreground)",
              marginTop: 16,
              maxWidth: 640,
              fontSize: 16,
              lineHeight: 1.75,
            }}
          >
            Can these open-weight models replace your Anthropic/OpenAI API subscription? We track
            quality, cost, and self-host viability.
          </p>
        </div>

        {/* Quick comparison table */}
        <div
          className="card corner-flourish"
          style={{
            marginBottom: 48,
            overflowX: "auto",
            background: "var(--academia-background-alt)",
          }}
        >
          <div
            style={{
              padding: "20px 28px",
              borderBottom: "1px solid var(--academia-border)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 500,
                fontSize: 18,
                color: "var(--academia-foreground)",
              }}
            >
              Quick comparison — all models
            </span>
          </div>
          <table>
            <thead>
              <tr>
                <th>Model</th>
                <th>Tier</th>
                <th>Closes Competitor</th>
                <th>Cheapest API</th>
                <th>Hardware</th>
                <th>Self-host?</th>
              </tr>
            </thead>
            <tbody>
              {MODELS.map((m) => {
                const tier = TIERS[m.tier];
                const cheapest = m.apiProviders.find((p) => p.input && p.output);
                const hardware = m.purchaseOptions[0];
                return (
                  <tr key={m.id}>
                    <td>
                      <Link
                        to={`/models/${m.id}`}
                        style={{
                          fontFamily: "var(--font-heading)",
                          fontWeight: 600,
                          color: "var(--academia-accent)",
                          textDecoration: "none",
                          fontSize: 15,
                        }}
                      >
                        {m.name}
                      </Link>
                    </td>
                    <td>
                      <span
                        style={{
                          color: tier?.color || "var(--academia-foreground)",
                          fontWeight: 600,
                          fontFamily: "var(--font-heading)",
                        }}
                      >
                        {tier?.label}
                      </span>
                    </td>
                    <td
                      style={{
                        color: "var(--academia-muted-foreground)",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {m.closestApi}
                    </td>
                    <td
                      style={{
                        color: "var(--academia-accent)",
                        fontFamily: "var(--font-heading)",
                        fontWeight: 600,
                      }}
                    >
                      {cheapest
                        ? `$${cheapest.input.toFixed(2)}/${cheapest.output.toFixed(2)}/M`
                        : "—"}
                    </td>
                    <td
                      style={{
                        color: "var(--academia-muted-foreground)",
                        fontSize: 13,
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {hardware?.name}
                    </td>
                    <td>
                      <span className={`tag tag-${m.verdict.toLowerCase()}`}>{m.verdict}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Cards */}
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
  );
}

export function ModelDetail() {
  const { id } = useParams();
  const model = MODELS.find((m) => m.id === id);
  const tier = TIERS[model?.tier];

  if (!model)
    return (
      <div className="container" style={{ padding: "96px 0", textAlign: "center" }}>
        <h2
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 28,
            color: "var(--academia-foreground)",
          }}
        >
          Model not found
        </h2>
        <Link
          to="/models"
          style={{
            color: "var(--academia-accent)",
            fontFamily: "var(--font-display)",
            fontSize: 12,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            textDecoration: "none",
            display: "inline-block",
            marginTop: 16,
          }}
        >
          ← All Models
        </Link>
      </div>
    );

  const cheapest = model.apiProviders.find((p) => p.input && p.output);
  const hardware = model.purchaseOptions[0];

  return (
    <div style={{ padding: "64px 0" }}>
      <div className="container">
        {/* Back link */}
        <Link
          to="/models"
          style={{
            fontSize: 11,
            color: "var(--academia-muted-foreground)",
            fontFamily: "var(--font-display)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            textDecoration: "none",
            display: "inline-block",
            marginBottom: 32,
            transition: "color 0.3s ease-out",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--academia-accent)")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--academia-muted-foreground)")
          }
        >
          ← All Models
        </Link>

        {/* Header */}
        <div
          style={{
            marginBottom: 48,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 20,
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 48,
                fontWeight: 500,
                color: "var(--academia-foreground)",
                lineHeight: 1.05,
                marginBottom: 12,
              }}
            >
              {model.name}
            </h1>
            <div
              style={{
                color: "var(--academia-muted-foreground)",
                fontSize: 13,
                fontFamily: "var(--font-display)",
                letterSpacing: "0.08em",
              }}
            >
              {model.type} · {model.totalParams} total · {model.activeParams} active ·{" "}
              {model.releaseDate}
            </div>
          </div>
          <span
            className={`tag tag-${model.verdict.toLowerCase()}`}
            style={{ fontSize: 12, padding: "6px 14px" }}
          >
            {model.verdict}
          </span>
        </div>

        {/* Specs grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 1,
            background: "var(--academia-border)",
            marginBottom: 48,
          }}
        >
          {[
            { label: "Architecture", value: model.type },
            { label: "Context Window", value: model.context },
            { label: "Quality Tier", value: tier?.label, color: tier?.color },
            { label: "Tier Equivalent", value: tier?.closedApiName },
            {
              label: "Cheapest API",
              value: cheapest
                ? `$${cheapest.input.toFixed(2)}/${cheapest.output.toFixed(2)}/M`
                : "—",
              color: "var(--academia-accent)",
            },
            { label: "Hardware", value: hardware?.name, color: "var(--academia-foreground)" },
          ].map((s, i) => (
            <div key={i} style={{ background: "var(--academia-background-alt)", padding: "24px" }}>
              <div
                style={{
                  fontSize: 10,
                  color: "var(--academia-muted-foreground)",
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  marginBottom: 10,
                  fontFamily: "var(--font-display)",
                }}
              >
                {s.label}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 600,
                  color: s.color || "var(--academia-foreground)",
                  fontSize: 15,
                  lineHeight: 1.3,
                }}
              >
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* Benchmarks */}
        {Object.keys(model.benchmarks).length > 0 && (
          <div style={{ marginBottom: 48 }}>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 24,
                fontWeight: 500,
                marginBottom: 24,
                color: "var(--academia-foreground)",
              }}
            >
              Benchmarks
            </h2>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {Object.entries(model.benchmarks).map(([key, val]) => (
                <div
                  key={key}
                  className="card corner-flourish"
                  style={{
                    background: "var(--academia-background-alt)",
                    minWidth: 150,
                    padding: "20px 28px",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: 32,
                      fontWeight: 600,
                      color: "var(--academia-accent)",
                      marginBottom: 6,
                      lineHeight: 1.1,
                    }}
                  >
                    {val}%
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "var(--academia-muted-foreground)",
                      textTransform: "uppercase",
                      letterSpacing: "0.15em",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    {key.replace(/_/g, " ")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All providers */}
        <div style={{ marginBottom: 48 }}>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: 24,
              fontWeight: 500,
              marginBottom: 24,
              color: "var(--academia-foreground)",
            }}
          >
            API providers
          </h2>
          <div
            className="card corner-flourish"
            style={{
              background: "var(--academia-background-alt)",
              overflowX: "auto",
            }}
          >
            <table>
              <thead>
                <tr>
                  <th>Provider</th>
                  <th>Input $/M</th>
                  <th>Output $/M</th>
                  <th>Blended $/M</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {model.apiProviders.map((p, i) => {
                  const bl = p.input && p.output ? (p.input + p.output) / 2 : null;
                  return (
                    <tr key={i}>
                      <td
                        style={{
                          fontFamily: "var(--font-heading)",
                          fontWeight: i === 0 ? 600 : 400,
                          color: i === 0 ? "var(--academia-accent)" : "var(--academia-foreground)",
                          fontSize: 15,
                        }}
                      >
                        {p.name}{" "}
                        {i === 0 && (
                          <span
                            className="tag tag-viable"
                            style={{ marginLeft: 8, fontSize: 9 }}
                          >
                            CHEAPEST
                          </span>
                        )}
                        {p.note && (
                          <span
                            style={{
                              fontSize: 12,
                              color: "var(--academia-muted-foreground)",
                              marginLeft: 8,
                            }}
                          >
                            {p.note}
                          </span>
                        )}
                      </td>
                      <td
                        style={{
                          color: "var(--academia-muted-foreground)",
                          fontFamily: "var(--font-body)",
                        }}
                      >
                        {p.input ? `$${p.input}` : "—"}
                      </td>
                      <td
                        style={{
                          color: "var(--academia-muted-foreground)",
                          fontFamily: "var(--font-body)",
                        }}
                      >
                        {p.output ? `$${p.output}` : "—"}
                      </td>
                      <td
                        style={{
                          fontFamily: "var(--font-heading)",
                          color: i === 0 ? "var(--academia-accent)" : "var(--academia-foreground)",
                          fontWeight: i === 0 ? 600 : 400,
                        }}
                      >
                        {bl ? `$${bl.toFixed(2)}` : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Hardware options */}
        <div style={{ marginBottom: 48 }}>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: 24,
              fontWeight: 500,
              marginBottom: 24,
              color: "var(--academia-foreground)",
            }}
          >
            Purchase options
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 20,
            }}
          >
            {model.purchaseOptions.map((hw, i) => (
              <div
                key={i}
                className="card corner-flourish"
                style={{
                  background: "var(--academia-background-alt)",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: 18,
                    fontWeight: 600,
                    color: "var(--academia-foreground)",
                    marginBottom: 8,
                  }}
                >
                  {hw.name}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--academia-muted-foreground)",
                    marginBottom: 16,
                    fontFamily: "var(--font-display)",
                    letterSpacing: "0.08em",
                  }}
                >
                  {hw.totalVram} VRAM
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
                        fontSize: 9,
                        color: "var(--academia-muted-foreground)",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        marginBottom: 6,
                        fontFamily: "var(--font-display)",
                      }}
                    >
                      New
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: 22,
                        fontWeight: 600,
                        color: "var(--academia-foreground)",
                      }}
                    >
                      ${hw.purchaseCost.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 9,
                        color: "var(--academia-muted-foreground)",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        marginBottom: 6,
                        fontFamily: "var(--font-display)",
                      }}
                    >
                      Used
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: 22,
                        fontWeight: 600,
                        color: "var(--academia-foreground)",
                      }}
                    >
                      ${hw.usedCost?.toLocaleString() || "N/A"}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--academia-muted-foreground)",
                    marginBottom: 12,
                    fontFamily: "var(--font-display)",
                  }}
                >
                  ${hw.monthlyElectricity}/mo electricity
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--academia-foreground)",
                    borderTop: "1px solid var(--academia-border)",
                    paddingTop: 12,
                    lineHeight: 1.6,
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {hw.canRunModel}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--academia-muted-foreground)",
                    marginTop: 8,
                    fontFamily: "var(--font-display)",
                  }}
                >
                  Quality: {hw.quality}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rental options */}
        <div style={{ marginBottom: 48 }}>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: 24,
              fontWeight: 500,
              marginBottom: 24,
              color: "var(--academia-foreground)",
            }}
          >
            Rental options
          </h2>
          <div
            className="card corner-flourish"
            style={{
              background: "var(--academia-background-alt)",
              overflowX: "auto",
            }}
          >
            <table>
              <thead>
                <tr>
                  <th>Provider</th>
                  <th>$/hr</th>
                  <th>$/day (24hr)</th>
                </tr>
              </thead>
              <tbody>
                {model.rentalOptions.map((r, i) => (
                  <tr key={i}>
                    <td
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontWeight: 600,
                        color: "var(--academia-foreground)",
                        fontSize: 15,
                      }}
                    >
                      {r.name}
                    </td>
                    <td
                      style={{
                        color: "var(--academia-accent-dark)",
                        fontFamily: "var(--font-heading)",
                        fontWeight: 600,
                        fontSize: 15,
                      }}
                    >
                      ${r.costPerHr.toFixed(2)}
                    </td>
                    <td
                      style={{
                        color: "var(--academia-muted-foreground)",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      ${r.costPerDay24.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Verdict */}
        <div
          className="card corner-flourish"
          style={{
            background: "var(--academia-background-alt)",
            borderLeft: `4px solid ${model.verdict === "VIABLE" ? "var(--academia-accent)" : model.verdict === "HARD" ? "var(--academia-accent-dark)" : "var(--academia-crimson)"}`,
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: 18,
              fontWeight: 500,
              marginBottom: 12,
              color: "var(--academia-foreground)",
            }}
          >
            Verdict
          </h3>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 15,
              color: "var(--academia-muted-foreground)",
              lineHeight: 1.75,
            }}
          >
            {model.verdictNote}
          </p>
        </div>
      </div>
    </div>
  );
}
