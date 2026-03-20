import { useState } from "react";
import { MODELS, TIERS } from "../data/models";

// Provider URLs for linking (direct to pricing pages)
const PROVIDER_URLS = {
  "Alibaba Cloud": "https://www.aliyun.com/product/bailian/pricing",
  OpenRouter: "https://openrouter.ai/models",
  DeepInfra: "https://deepinfra.com/pricing",
  Groq: "https://groq.com/pricing",
  Hyperbolic: "https://app.hyperbolic.xyz/pricing",
  Fireworks: "https://fireworks.ai/pricing",
  "Together AI": "https://www.together.ai/pricing",
  "Lepton AI": "https://www.lepton.ai/playground",
  SambaNova: "https://cloud.sambanova.ai/plans/pricing",
  Novita: "https://novita.ai/pricing",
  Replicate: "https://replicate.com/pricing",
  FriendliAI: "https://friendli.ai/pricing",
  SiliconFlow: "https://siliconflow.cn/pricing",
  Anyscale: "https://anyscale.com/pricing",
  Cerebras: "https://www.cerebras.ai/pricing",
  "Zhipu Official": "https://open.bigmodel.cn/pricing",
  "MiniMax Official": "https://www.minimaxi.com/price",
  "DeepSeek Official": "https://www.deepseek.com/pricing",
  "Moonshot Official": "https://platform.moonshot.cn/pricing",
};

export default function Compare() {
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);

  const model = MODELS.find((m) => m.id === selectedModel);
  const tier = TIERS[model.tier];

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
            Cost Reference
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
            API pricing comparison
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
            Compare API pricing across providers for each open-weight model. All prices verified as
            of March 2026.
          </p>
        </div>

        {/* Model selector */}
        <div style={{ marginBottom: 48 }}>
          <span
            style={{
              fontSize: 11,
              color: "var(--academia-muted-foreground)",
              display: "block",
              marginBottom: 12,
              fontFamily: "var(--font-display)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            Select Model
          </span>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {MODELS.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedModel(m.id)}
                style={{
                  padding: "8px 20px",
                  fontFamily: "var(--font-display)",
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: "0.1em",
                  cursor: "pointer",
                  background: selectedModel === m.id ? "var(--academia-accent)" : "transparent",
                  color:
                    selectedModel === m.id
                      ? "var(--academia-background)"
                      : "var(--academia-muted-foreground)",
                  border:
                    selectedModel === m.id
                      ? "1px solid var(--academia-accent)"
                      : "1px solid var(--academia-border)",
                  transition: "all 0.3s ease-out",
                  borderRadius: "4px",
                }}
              >
                {m.name}
              </button>
            ))}
          </div>
        </div>

        {/* Model summary bar */}
        <div
          className="card corner-flourish"
          style={{
            marginBottom: 40,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 24,
            background: "var(--academia-background-alt)",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 10,
                color: "var(--academia-muted-foreground)",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                marginBottom: 8,
                fontFamily: "var(--font-display)",
              }}
            >
              Model
            </div>
            <div
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 600,
                fontSize: 16,
                color: "var(--academia-foreground)",
              }}
            >
              {model.name}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--academia-muted-foreground)",
                marginTop: 4,
                fontFamily: "var(--font-display)",
              }}
            >
              {model.type} · {model.totalParams}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: 10,
                color: "var(--academia-muted-foreground)",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                marginBottom: 8,
                fontFamily: "var(--font-display)",
              }}
            >
              Quality Tier
            </div>
            <div
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 600,
                fontSize: 16,
                color: tier?.color || "var(--academia-foreground)",
              }}
            >
              {tier?.label}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--academia-muted-foreground)",
                marginTop: 4,
              }}
            >
              {tier?.closedApiName}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: 10,
                color: "var(--academia-muted-foreground)",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                marginBottom: 8,
                fontFamily: "var(--font-display)",
              }}
            >
              Release
            </div>
            <div
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 600,
                fontSize: 16,
                color: "var(--academia-foreground)",
              }}
            >
              {model.releaseDate}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--academia-muted-foreground)",
                marginTop: 4,
              }}
            >
              {model.license}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: 10,
                color: "var(--academia-muted-foreground)",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                marginBottom: 8,
                fontFamily: "var(--font-display)",
              }}
            >
              Context
            </div>
            <div
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 600,
                fontSize: 16,
                color: "var(--academia-foreground)",
              }}
            >
              {model.context}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--academia-muted-foreground)",
                marginTop: 4,
              }}
            >
              {model.closestApi}
            </div>
          </div>
        </div>

        {/* All API providers */}
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
            API providers for {model.name}
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
                {(() => {
                  // Sort providers by blended price (cheapest first)
                  const sortedProviders = [...model.apiProviders].sort((a, b) => {
                    const aBlended = a.input && a.output ? (a.input + a.output) / 2 : Infinity;
                    const bBlended = b.input && b.output ? (b.input + b.output) / 2 : Infinity;
                    return aBlended - bBlended;
                  });

                  return sortedProviders.map((p, i) => {
                    const bl = p.input && p.output ? (p.input + p.output) / 2 : null;
                    const isCheapest = i === 0 && bl !== null;
                    const providerUrl = PROVIDER_URLS[p.name];
                    return (
                      <tr key={i}>
                        <td
                          style={{
                            fontWeight: isCheapest ? 600 : 400,
                            color: isCheapest
                              ? "var(--academia-accent)"
                              : "var(--academia-foreground)",
                            fontFamily: "var(--font-heading)",
                          }}
                        >
                          {providerUrl ? (
                            <a
                              href={providerUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: isCheapest
                                  ? "var(--academia-accent)"
                                  : "var(--academia-foreground)",
                                textDecoration: "none",
                                borderBottom: `1px solid ${isCheapest ? "var(--academia-accent)" : "var(--academia-muted-foreground)"}`,
                              }}
                            >
                              {p.name}
                            </a>
                          ) : (
                            p.name
                          )}{" "}
                          {isCheapest && (
                            <span
                              style={{
                                fontSize: 9,
                                color: "var(--academia-accent)",
                                marginLeft: 8,
                                fontFamily: "var(--font-display)",
                                letterSpacing: "0.1em",
                              }}
                            >
                              CHEAPEST
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
                            color: isCheapest
                              ? "var(--academia-accent)"
                              : "var(--academia-foreground)",
                            fontFamily: "var(--font-heading)",
                            fontWeight: isCheapest ? 600 : 400,
                          }}
                        >
                          {bl ? `$${bl.toFixed(2)}` : "—"}
                        </td>
                        <td
                          style={{
                            color: "var(--academia-muted-foreground)",
                            fontSize: 13,
                            fontFamily: "var(--font-body)",
                          }}
                        >
                          {p.note || "—"}
                        </td>
                      </tr>
                    );
                  });
                })()}
              </tbody>
            </table>
          </div>
        </div>

        {/* Purchase options */}
        {model.purchaseOptions && model.purchaseOptions.length > 0 && (
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
              Self-host options
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 16,
              }}
            >
              {model.purchaseOptions.map((opt, i) => (
                <div
                  key={i}
                  className="card corner-flourish"
                  style={{
                    background: "var(--academia-background-alt)",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--academia-foreground)",
                      marginBottom: 12,
                    }}
                  >
                    {opt.name}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--academia-muted-foreground)",
                      marginBottom: 16,
                    }}
                  >
                    {opt.totalVram} VRAM
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 12,
                      marginBottom: 16,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 9,
                          color: "var(--academia-muted-foreground)",
                          textTransform: "uppercase",
                          marginBottom: 4,
                        }}
                      >
                        New
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-heading)",
                          fontSize: 18,
                          fontWeight: 600,
                          color: "var(--academia-foreground)",
                        }}
                      >
                        ${opt.purchaseCost.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 9,
                          color: "var(--academia-muted-foreground)",
                          textTransform: "uppercase",
                          marginBottom: 4,
                        }}
                      >
                        Used
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-heading)",
                          fontSize: 18,
                          fontWeight: 600,
                          color: opt.usedCost
                            ? "var(--academia-accent)"
                            : "var(--academia-muted-foreground)",
                        }}
                      >
                        {opt.usedCost ? `$${opt.usedCost.toLocaleString()}` : "—"}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--academia-muted-foreground)",
                      lineHeight: 1.6,
                    }}
                  >
                    <div>{opt.canRunModel}</div>
                    <div style={{ marginTop: 4 }}>{opt.quality}</div>
                    <div style={{ marginTop: 4 }}>Electricity: ~${opt.monthlyElectricity}/mo</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rental options */}
        {model.rentalOptions && model.rentalOptions.length > 0 && (
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
              GPU rental options
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 16,
              }}
            >
              {model.rentalOptions.map((opt, i) => (
                <div
                  key={i}
                  className="card corner-flourish"
                  style={{
                    background: "var(--academia-background-alt)",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--academia-foreground)",
                      marginBottom: 8,
                    }}
                  >
                    {opt.name}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--academia-muted-foreground)",
                      marginBottom: 12,
                    }}
                  >
                    {opt.provider}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: 24,
                      fontWeight: 600,
                      color: "var(--academia-accent-dark)",
                    }}
                  >
                    ${opt.costPerHr}/hr
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--academia-muted-foreground)",
                      marginTop: 4,
                    }}
                  >
                    ${opt.costPerDay24}/day (24h)
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
