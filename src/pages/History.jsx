import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  ReferenceLine,
} from "recharts";
import {
  HISTORICAL_MODELS,
  getGapHistory,
  getFrontierModels,
  getOpenModels,
  BENCHMARK_INFO,
  getTimeMachineComparison,
} from "../data/history";
import { MODELS as CURRENT_MODELS } from "../data/models";

const BENCHMARKS = ["mmlu", "mmluPro", "swebench", "gpqa", "humanEval", "aime"];

export default function History() {
  const [activeTab, setActiveTab] = useState("timeline");
  const [selectedBenchmark, setSelectedBenchmark] = useState("mmlu");

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
            Historical Analysis
          </span>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 36,
              fontWeight: 700,
              marginTop: 8,
            }}
          >
            The Gap is Closing 📈
          </h1>
          <p style={{ color: "var(--text-muted)", marginTop: 8, maxWidth: 600 }}>
            Track how open-weight models have evolved from 2023 to 2026, and how they're rapidly
            catching up to frontier closed models.
          </p>
        </div>

        {/* Tab navigation */}
        <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
          {[
            { value: "timeline", label: "📈 Gap Timeline" },
            { value: "timemachine", label: "🕰️ Time Machine" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              style={{
                padding: "10px 20px",
                fontFamily: "var(--font-display)",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                background: activeTab === tab.value ? "var(--accent)" : "var(--surface)",
                color: activeTab === tab.value ? "#000" : "var(--text-muted)",
                border:
                  activeTab === tab.value ? "1px solid var(--accent)" : "1px solid var(--border)",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Benchmark selector */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
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

        {activeTab === "timeline" && <TimelineTab selectedBenchmark={selectedBenchmark} />}
        {activeTab === "timemachine" && <TimeMachineTab selectedBenchmark={selectedBenchmark} />}
      </div>
    </div>
  );
}

function TimelineTab({ selectedBenchmark }) {
  // Process data for charts
  const chartData = useMemo(() => {
    const models = HISTORICAL_MODELS.filter((m) => m.benchmarks[selectedBenchmark] != null).sort(
      (a, b) => new Date(a.releaseDate) - new Date(b.releaseDate),
    );

    // Group by month for smoother lines
    const byMonth = {};
    models.forEach((model) => {
      const date = new Date(model.releaseDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (!byMonth[monthKey]) byMonth[monthKey] = { date: monthKey, models: [] };
      byMonth[monthKey].models.push(model);
    });

    return Object.values(byMonth).map((month) => {
      const frontier = month.models
        .filter((m) => m.type === "closed")
        .sort((a, b) => b.benchmarks[selectedBenchmark] - a.benchmarks[selectedBenchmark])[0];
      const open = month.models
        .filter((m) => m.type === "open")
        .sort((a, b) => b.benchmarks[selectedBenchmark] - a.benchmarks[selectedBenchmark])[0];

      return {
        date: month.date,
        frontierScore: frontier?.benchmarks[selectedBenchmark] || null,
        frontierModel: frontier?.name || null,
        openScore: open?.benchmarks[selectedBenchmark] || null,
        openModel: open?.name || null,
        gap:
          frontier && open
            ? frontier.benchmarks[selectedBenchmark] - open.benchmarks[selectedBenchmark]
            : null,
      };
    });
  }, [selectedBenchmark]);

  // Gap history data
  const gapData = useMemo(() => getGapHistory(selectedBenchmark), [selectedBenchmark]);

  // Family-based data
  const familyData = useMemo(() => {
    const families = [...new Set(HISTORICAL_MODELS.map((m) => m.family))];
    return families.map((family) => {
      const models = HISTORICAL_MODELS.filter(
        (m) => m.family === family && m.benchmarks[selectedBenchmark] != null,
      ).sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));

      return {
        family,
        models: models.map((m) => ({
          date: m.releaseDate.slice(0, 7),
          name: m.name,
          score: m.benchmarks[selectedBenchmark],
          type: m.type,
        })),
      };
    });
  }, [selectedBenchmark]);

  const currentGap = gapData[gapData.length - 1];
  const firstGap = gapData[0];
  const gapReduction = firstGap && currentGap ? firstGap.gap - currentGap.gap : 0;

  const [chartType, setChartType] = useState("gap");

  return (
    <>
      {/* Gap summary cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 1,
          background: "var(--border)",
          marginBottom: 32,
        }}
      >
        <div style={{ background: "var(--surface)", padding: 24 }}>
          <div
            style={{
              fontSize: 11,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 8,
            }}
          >
            First Recorded Gap
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 28,
              fontWeight: 700,
              color: "var(--red)",
            }}
          >
            {firstGap ? `${firstGap.gap.toFixed(1)} pts` : "N/A"}
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
            {firstGap?.date?.slice(0, 4)} • {firstGap?.frontierModel} vs {firstGap?.openModel}
          </div>
        </div>
        <div style={{ background: "var(--surface)", padding: 24 }}>
          <div
            style={{
              fontSize: 11,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 8,
            }}
          >
            Current Gap
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 28,
              fontWeight: 700,
              color: "var(--orange)",
            }}
          >
            {currentGap ? `${currentGap.gap.toFixed(1)} pts` : "N/A"}
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
            {currentGap?.date?.slice(0, 4)} • {currentGap?.frontierModel} vs {currentGap?.openModel}
          </div>
        </div>
        <div style={{ background: "var(--surface)", padding: 24 }}>
          <div
            style={{
              fontSize: 11,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 8,
            }}
          >
            Gap Reduced
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 28,
              fontWeight: 700,
              color: "var(--green)",
            }}
          >
            {gapReduction ? `${gapReduction.toFixed(1)} pts` : "N/A"}
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
            {firstGap && currentGap
              ? `${((gapReduction / firstGap.gap) * 100).toFixed(0)}% reduction`
              : ""}
          </div>
        </div>
        <div style={{ background: "var(--surface)", padding: 24 }}>
          <div
            style={{
              fontSize: 11,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 8,
            }}
          >
            Current Leader
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 16,
              fontWeight: 700,
              color: "var(--accent)",
            }}
          >
            {currentGap?.openModel || "N/A"}
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
            {currentGap?.openScore?.toFixed(1)} pts ({BENCHMARK_INFO[selectedBenchmark]?.name})
          </div>
        </div>
      </div>

      {/* Chart type selector */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 16,
        }}
      >
        {[
          { value: "gap", label: "Gap Over Time" },
          { value: "scores", label: "Score Comparison" },
          { value: "models", label: "All Models" },
        ].map((opt) => (
          <button
            key={opt.value}
            onClick={() => setChartType(opt.value)}
            style={{
              padding: "8px 16px",
              fontFamily: "var(--font-display)",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              background: chartType === opt.value ? "var(--accent)" : "var(--surface)",
              color: chartType === opt.value ? "#000" : "var(--text-muted)",
              border:
                chartType === opt.value ? "1px solid var(--accent)" : "1px solid var(--border)",
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Charts */}
      {chartType === "gap" && <GapChart data={gapData} benchmark={selectedBenchmark} />}
      {chartType === "scores" && <ScoresChart data={chartData} benchmark={selectedBenchmark} />}
      {chartType === "models" && <ModelsChart data={familyData} benchmark={selectedBenchmark} />}

      {/* Benchmark info */}
      <div
        style={{
          marginTop: 40,
          padding: 24,
          background: "var(--surface)",
          border: "1px solid var(--border)",
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 14,
            fontWeight: 700,
            marginBottom: 12,
          }}
        >
          📚 About {BENCHMARK_INFO[selectedBenchmark]?.name}
        </h3>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>
          {BENCHMARK_INFO[selectedBenchmark]?.fullName}
        </p>
        <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
          {BENCHMARK_INFO[selectedBenchmark]?.description}
        </p>
      </div>

      {/* Key milestones */}
      <div
        style={{
          marginTop: 40,
          padding: 24,
          background: "var(--surface)",
          border: "1px solid var(--border)",
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 14,
            fontWeight: 700,
            marginBottom: 16,
          }}
        >
          🏆 Key Milestones in {BENCHMARK_INFO[selectedBenchmark]?.name}
        </h3>
        <Milestones benchmark={selectedBenchmark} />
      </div>
    </>
  );
}

function TimeMachineTab({ selectedBenchmark }) {
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

  const [selectedModel, setSelectedModel] = useState(null);

  const topCatches = useMemo(() => {
    return [...comparisons]
      .filter((c) => c.comparison.monthsBehind > 0)
      .sort((a, b) => b.comparison.monthsBehind - a.comparison.monthsBehind)
      .slice(0, 5);
  }, [comparisons]);

  return (
    <>
      <div style={{ marginBottom: 32 }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 24,
            fontWeight: 700,
            marginBottom: 16,
          }}
        >
          "This Open Model Matches That Closed Model from When?" 🕰️
        </h2>
        <p style={{ color: "var(--text-muted)", maxWidth: 600 }}>
          Compare today&apos;s open-weight models against the frontier models of the past.
        </p>
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
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", padding: 24 }}>
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
          const { model, comparison } = comparisons.find((c) => c.model.id === selectedModel) || {};
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
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
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
    </>
  );
}

function GapChart({ data, benchmark }) {
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        padding: 24,
        marginBottom: 32,
      }}
    >
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 16,
          fontWeight: 700,
          marginBottom: 16,
        }}
      >
        Gap Between Frontier & Open Models
      </h3>
      <div style={{ height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="gapGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--red)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--red)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fill: "var(--text-muted)", fontSize: 11 }}
              tickFormatter={(date) => date.slice(5)}
            />
            <YAxis
              tick={{ fill: "var(--text-muted)", fontSize: 11 }}
              label={{
                value: "Gap (points)",
                angle: -90,
                position: "insideLeft",
                fill: "var(--text-muted)",
                fontSize: 11,
              }}
            />
            <Tooltip
              contentStyle={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
              }}
              formatter={(value, name) => [`${value.toFixed(1)} pts`, name]}
            />
            <Area
              type="monotone"
              dataKey="gap"
              stroke="var(--red)"
              fill="url(#gapGradient)"
              strokeWidth={2}
              name="Gap"
            />
            <ReferenceLine
              y={0}
              stroke="var(--green)"
              strokeDasharray="3 3"
              label={{ value: "Parity", fill: "var(--green)", fontSize: 11 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 16 }}>
        The gap has been steadily decreasing as open models improve. At current trends, open models
        may reach parity with frontier models by late 2026.
      </p>
    </div>
  );
}

function ScoresChart({ data, benchmark }) {
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        padding: 24,
        marginBottom: 32,
      }}
    >
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 16,
          fontWeight: 700,
          marginBottom: 16,
        }}
      >
        Frontier vs Open: Best Scores Over Time
      </h3>
      <div style={{ height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fill: "var(--text-muted)", fontSize: 11 }}
              tickFormatter={(date) => date.slice(5)}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: "var(--text-muted)", fontSize: 11 }}
              label={{
                value: "Score",
                angle: -90,
                position: "insideLeft",
                fill: "var(--text-muted)",
                fontSize: 11,
              }}
            />
            <Tooltip
              contentStyle={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
              }}
              formatter={(value, name) => [`${value?.toFixed(1) ?? "N/A"} pts`, name]}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="frontierScore"
              stroke="var(--red)"
              strokeWidth={2}
              dot={false}
              name="Frontier (Closed)"
            />
            <Line
              type="monotone"
              dataKey="openScore"
              stroke="var(--green)"
              strokeWidth={2}
              dot={false}
              name="Open Weight"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 16 }}>
        Open models started ~20-30 points behind in 2023. By 2026, the gap has narrowed to single
        digits on most benchmarks.
      </p>
    </div>
  );
}

function ModelsChart({ data, benchmark }) {
  const [selectedFamily, setSelectedFamily] = useState("all");

  const filteredData =
    selectedFamily === "all" ? data : data.filter((f) => f.family === selectedFamily);

  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        padding: 24,
        marginBottom: 32,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 16,
            fontWeight: 700,
          }}
        >
          All Models by Family
        </h3>
        <select
          value={selectedFamily}
          onChange={(e) => setSelectedFamily(e.target.value)}
          style={{
            padding: "8px 12px",
            fontSize: 12,
            background: "var(--surface)",
            color: "var(--text)",
            border: "1px solid var(--border)",
            fontFamily: "var(--font-display)",
          }}
        >
          <option value="all">All Families</option>
          {data.map((f) => (
            <option key={f.family} value={f.family}>
              {f.family}
            </option>
          ))}
        </select>
      </div>
      <div style={{ height: 500 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData.flatMap((f) => f.models)}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fill: "var(--text-muted)", fontSize: 10 }}
              tickFormatter={(date) => date.slice(5)}
            />
            <YAxis domain={[0, 100]} tick={{ fill: "var(--text-muted)", fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                fontSize: 11,
              }}
            />
            {filteredData.map((family, i) => (
              <Line
                key={family.family}
                type="monotone"
                dataKey="score"
                data={family.models}
                stroke={`hsl(${i * 45}, 70%, 50%)`}
                strokeWidth={2}
                dot={{ r: 3 }}
                name={family.family}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function Milestones({ benchmark }) {
  const milestones = useMemo(() => {
    const models = HISTORICAL_MODELS.filter((m) => m.benchmarks[benchmark] != null).sort(
      (a, b) => b.benchmarks[benchmark] - a.benchmarks[benchmark],
    );

    const openMilestones = models
      .filter((m) => m.type === "open")
      .slice(0, 5)
      .map((m, i) => ({
        rank: i + 1,
        model: m.name,
        family: m.family,
        score: m.benchmarks[benchmark],
        date: m.releaseDate,
        type: "open",
      }));

    const frontierMilestones = models
      .filter((m) => m.type === "closed")
      .slice(0, 5)
      .map((m, i) => ({
        rank: i + 1,
        model: m.name,
        family: m.family,
        score: m.benchmarks[benchmark],
        date: m.releaseDate,
        type: "frontier",
      }));

    return { open: openMilestones, frontier: frontierMilestones };
  }, [benchmark]);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 24,
      }}
    >
      <div>
        <h4
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 13,
            fontWeight: 700,
            color: "var(--green)",
            marginBottom: 12,
          }}
        >
          🟢 Top Open Models
        </h4>
        {milestones.open.map((m) => (
          <div
            key={m.model}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                #{m.rank} {m.model}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                {m.date.slice(0, 4)} • {m.family}
              </div>
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 16,
                fontWeight: 700,
                color: "var(--green)",
              }}
            >
              {m.score.toFixed(1)}
            </div>
          </div>
        ))}
      </div>
      <div>
        <h4
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 13,
            fontWeight: 700,
            color: "var(--red)",
            marginBottom: 12,
          }}
        >
          🔴 Top Frontier Models
        </h4>
        {milestones.frontier.map((m) => (
          <div
            key={m.model}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                #{m.rank} {m.model}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                {m.date.slice(0, 4)} • {m.family}
              </div>
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 16,
                fontWeight: 700,
                color: "var(--red)",
              }}
            >
              {m.score.toFixed(1)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
