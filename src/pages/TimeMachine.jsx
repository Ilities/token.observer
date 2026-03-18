import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { getTimeMachineComparison, HISTORICAL_MODELS, BENCHMARK_INFO } from "../data/history";
import { MODELS as CURRENT_MODELS } from "../data/models";

const BENCHMARKS = ["mmlu", "mmluPro", "swebench", "gpqa", "humanEval", "aime"];

export default function TimeMachine() {
  const [selectedBenchmark, setSelectedBenchmark] = useState("mmlu");
  const [selectedModel, setSelectedModel] = useState(null);

  // Get comparisons
  const comparisons = useMemo(() => {
    const results = [];
    for (const model of CURRENT_MODELS) {
      const historicalMatch = HISTORICAL_MODELS.find((m) => m.id === model.id);
      if (!historicalMatch?.benchmarks[selectedBenchmark]) continue;

      const comparison = getTimeMachineComparison(model.id, selectedBenchmark);
      if (comparison) {
        results.push({ model, comparison });
      }
    }
    return results;
  }, [selectedBenchmark]);

  console.log("Comparisons:", comparisons.length);

  const topCatches = useMemo(() => {
    return [...comparisons]
      .filter((c) => c.comparison.monthsBehind > 0)
      .sort((a, b) => b.comparison.monthsBehind - a.comparison.monthsBehind)
      .slice(0, 5);
  }, [comparisons]);

  return (
    <div style={{ padding: "48px 0", color: "var(--text)" }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 11,
              color: "var(--text-muted)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Time Machine
          </span>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 36,
              fontWeight: 700,
              marginTop: 8,
            }}
          >
            "This Open Model Matches That Closed Model from When?" 🕰️
          </h1>
          <p style={{ color: "var(--text-muted)", marginTop: 8, maxWidth: 600 }}>
            Compare today&apos;s open-weight models against the frontier models of the past.
          </p>
        </div>

        {/* Debug info */}
        <div
          style={{
            padding: 20,
            background: "var(--surface)",
            border: "1px solid var(--border)",
            marginBottom: 24,
          }}
        >
          <div>Total models: {CURRENT_MODELS.length}</div>
          <div>Comparisons found: {comparisons.length}</div>
          <div>Top catches: {topCatches.length}</div>
          <div>Selected benchmark: {selectedBenchmark}</div>
        </div>

        {/* Benchmark selector */}
        <div style={{ display: "flex", gap: 8, marginBottom: 32, flexWrap: "wrap" }}>
          {BENCHMARKS.map((bench) => (
            <button
              key={bench}
              onClick={() => setSelectedBenchmark(bench)}
              style={{
                padding: "8px 16px",
                fontFamily: "var(--font-display)",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                background: selectedBenchmark === bench ? "var(--accent)" : "var(--surface)",
                color: selectedBenchmark === bench ? "#000" : "var(--text-muted)",
                border:
                  selectedBenchmark === bench
                    ? "1px solid var(--accent)"
                    : "1px solid var(--border)",
              }}
            >
              {BENCHMARK_INFO[bench]?.name || bench}
            </button>
          ))}
        </div>

        {/* Top catches */}
        {topCatches.length > 0 ? (
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              padding: 24,
              marginBottom: 32,
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 18,
                fontWeight: 700,
                marginBottom: 8,
              }}
            >
              🏆 Biggest Time Catches
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 16,
              }}
            >
              {topCatches.map((catchData, i) => (
                <div
                  key={catchData.model.id}
                  style={{ padding: 16, border: "1px solid var(--border)" }}
                >
                  <div
                    style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase" }}
                  >
                    #{i + 1}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 16,
                      fontWeight: 700,
                      color: "var(--green)",
                    }}
                  >
                    {catchData.model.name}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", margin: "8px 0" }}>
                    Matches {catchData.comparison.matchedClosedModel.name}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 24,
                      fontWeight: 700,
                      color: "var(--accent)",
                    }}
                  >
                    {catchData.comparison.yearsBehind} years behind
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                    {catchData.comparison.monthsBehind} months
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>
            No comparisons found. Try a different benchmark.
          </div>
        )}

        {/* All comparisons */}
        <div
          style={{ background: "var(--surface)", border: "1px solid var(--border)", padding: 24 }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 18,
              fontWeight: 700,
              marginBottom: 16,
            }}
          >
            📊 All Comparisons
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 12,
            }}
          >
            {comparisons.map(({ model, comparison }) => (
              <div
                key={model.id}
                onClick={() => setSelectedModel(selectedModel === model.id ? null : model.id)}
                style={{
                  padding: 16,
                  border:
                    selectedModel === model.id
                      ? "2px solid var(--accent)"
                      : "1px solid var(--border)",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "var(--green)",
                  }}
                >
                  {model.name}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", margin: "4px 0" }}>
                  {comparison.openScore.toFixed(1)} pts
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                  Matches {comparison.matchedClosedModel.name} from{" "}
                  {comparison.closedReleaseDate.slice(0, 4)}
                </div>
                <div style={{ fontSize: 12, color: "var(--accent)", marginTop: 8 }}>
                  {comparison.yearsBehind} years caught up
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detail modal */}
        {selectedModel &&
          (() => {
            const { model, comparison } =
              comparisons.find((c) => c.model.id === selectedModel) || {};
            if (!model || !comparison) return null;

            return (
              <div
                onClick={() => setSelectedModel(null)}
                style={{
                  position: "fixed",
                  inset: 0,
                  background: "rgba(0,0,0,0.8)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1000,
                  padding: 24,
                }}
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    padding: 32,
                    maxWidth: 600,
                    width: "100%",
                    maxHeight: "80vh",
                    overflow: "auto",
                  }}
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}
                  >
                    <h2
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 20,
                        fontWeight: 700,
                        margin: 0,
                      }}
                    >
                      Time Machine Comparison
                    </h2>
                    <button
                      onClick={() => setSelectedModel(null)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--text)",
                        fontSize: 24,
                        cursor: "pointer",
                      }}
                    >
                      ×
                    </button>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto 1fr",
                      gap: 24,
                      alignItems: "center",
                      marginBottom: 24,
                    }}
                  >
                    <div style={{ textAlign: "center" }}>
                      <div
                        style={{
                          fontSize: 11,
                          color: "var(--text-muted)",
                          textTransform: "uppercase",
                          marginBottom: 8,
                        }}
                      >
                        Open Model
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: 18,
                          fontWeight: 700,
                          color: "var(--green)",
                        }}
                      >
                        {model.name}
                      </div>
                      <div
                        style={{
                          marginTop: 12,
                          padding: "8px 16px",
                          background: "var(--green-dim)",
                          border: "1px solid var(--green)",
                          display: "inline-block",
                        }}
                      >
                        <div
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: 24,
                            fontWeight: 700,
                            color: "var(--green)",
                          }}
                        >
                          {comparison.openScore.toFixed(1)}
                        </div>
                        <div style={{ fontSize: 10, color: "var(--text-muted)" }}>
                          {BENCHMARK_INFO[selectedBenchmark]?.name}
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 24,
                        fontWeight: 700,
                        color: "var(--text-muted)",
                      }}
                    >
                      =
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div
                        style={{
                          fontSize: 11,
                          color: "var(--text-muted)",
                          textTransform: "uppercase",
                          marginBottom: 8,
                        }}
                      >
                        Frontier ({comparison.yearsBehind}y ago)
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: 18,
                          fontWeight: 700,
                          color: "var(--red)",
                        }}
                      >
                        {comparison.matchedClosedModel.name}
                      </div>
                      <div
                        style={{
                          marginTop: 12,
                          padding: "8px 16px",
                          background: "var(--red-dim)",
                          border: "1px solid var(--red)",
                          display: "inline-block",
                        }}
                      >
                        <div
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: 24,
                            fontWeight: 700,
                            color: "var(--red)",
                          }}
                        >
                          {comparison.closedScore.toFixed(1)}
                        </div>
                        <div style={{ fontSize: 10, color: "var(--text-muted)" }}>
                          {BENCHMARK_INFO[selectedBenchmark]?.name}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      background: "var(--accent-dim)",
                      border: "1px solid var(--accent)",
                      padding: 20,
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 36,
                        fontWeight: 700,
                        color: "var(--accent)",
                      }}
                    >
                      {comparison.monthsBehind} months
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      That&apos;s how far behind this model has caught up!
                    </div>
                  </div>

                  <div style={{ marginTop: 24, textAlign: "center" }}>
                    <Link
                      to={`/models/${model.id}`}
                      style={{
                        background: "var(--accent)",
                        color: "#000",
                        padding: "10px 20px",
                        fontFamily: "var(--font-display)",
                        fontSize: 12,
                        fontWeight: 700,
                        textDecoration: "none",
                      }}
                    >
                      View Model →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })()}
      </div>
    </div>
  );
}
