import { useState, useMemo } from "react";
import { MODELS } from "../data/models";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const BENCHMARKS = [
  { key: "mmlu", name: "MMLU", description: "Knowledge & reasoning", max: 100 },
  { key: "mmluPro", name: "MMLU-Pro", description: "Advanced reasoning", max: 100 },
  { key: "swebench", name: "SWE-bench", description: "Software engineering", max: 100 },
  { key: "gpqa", name: "GPQA", description: "Graduate-level QA", max: 100 },
  { key: "livecodebench", name: "LiveCodeBench", description: "Coding ability", max: 100 },
  { key: "aime", name: "AIME", description: "Math competition", max: 100 },
  { key: "arena", name: "LMArena", description: "Human preference (Elo)", max: 1500, scale: 0.067 },
];

const SORT_OPTIONS = [
  { value: "mmlu", label: "MMLU" },
  { value: "mmluPro", label: "MMLU-Pro" },
  { value: "swebench", label: "SWE-bench" },
  { value: "gpqa", label: "GPQA" },
  { value: "livecodebench", label: "LiveCodeBench" },
  { value: "aime", label: "AIME" },
  { value: "arena", label: "LMArena Elo" },
  { value: "name", label: "Name" },
  { value: "family", label: "Family" },
  { value: "params", label: "Parameters" },
];

function normalizeScore(value, benchmark) {
  const scale = benchmark.scale || 1;
  const max = benchmark.max * scale;
  return Math.min(((value * scale) / max) * 100, 100);
}

function formatScore(value, benchmark) {
  if (benchmark.key === "arena") return Math.round(value).toLocaleString();
  return value.toFixed(1);
}

export default function Benchmarks() {
  const [selectedBenchmark, setSelectedBenchmark] = useState("mmlu");
  const [sortBy, setSortBy] = useState("mmlu");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedModels, setSelectedModels] = useState([]);
  const [viewMode, setViewMode] = useState("both");

  const chartData = useMemo(() => {
    return MODELS.map((model) => {
      const data = { name: model.name, family: model.family };
      BENCHMARKS.forEach((bench) => {
        if (model.benchmarks[bench.key]) {
          data[bench.key] = normalizeScore(model.benchmarks[bench.key], bench);
          data[`${bench.key}Raw`] = model.benchmarks[bench.key];
        }
      });
      return data;
    });
  }, []);

  const sortedModels = useMemo(() => {
    let models = [...MODELS];
    if (selectedModels.length > 0) {
      models = models.filter((m) => selectedModels.includes(m.id));
    }
    models.sort((a, b) => {
      let aVal, bVal;
      if (sortBy === "name") {
        aVal = a.name;
        bVal = b.name;
      } else if (sortBy === "family") {
        aVal = a.family;
        bVal = b.family;
      } else if (sortBy === "params") {
        const aNum = parseFloat(a.totalParams) || 0;
        const bNum = parseFloat(b.totalParams) || 0;
        aVal = aNum;
        bVal = bNum;
      } else {
        aVal = a.benchmarks[sortBy] || 0;
        bVal = b.benchmarks[sortBy] || 0;
      }
      if (typeof aVal === "string") {
        return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    });
    return models;
  }, [selectedModels, sortBy, sortOrder]);

  const toggleModel = (id) => {
    setSelectedModels((prev) => (prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]));
  };

  const toggleSort = (key) => {
    if (sortBy === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortOrder("desc");
    }
  };

  const topModels = useMemo(() => {
    const ranked = {};
    BENCHMARKS.forEach((bench) => {
      const sorted = [...MODELS].sort((a, b) => {
        const aVal = a.benchmarks[bench.key] || 0;
        const bVal = b.benchmarks[bench.key] || 0;
        return bVal - aVal;
      });
      ranked[bench.key] = sorted
        .slice(0, 3)
        .map((m) => ({ name: m.name, score: m.benchmarks[bench.key] }));
    });
    return ranked;
  }, []);

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
            Volume III — Model Capabilities
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
            Benchmark Leaderboard
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
            Compare model performance across key benchmarks. Higher scores indicate better
            performance.
          </p>
        </div>

        {/* Top performers */}
        <div style={{ marginBottom: 48 }}>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: 20,
              fontWeight: 500,
              marginBottom: 24,
              color: "var(--academia-foreground)",
            }}
          >
            Top Performers
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 1,
              background: "var(--academia-border)",
            }}
          >
            {BENCHMARKS.slice(0, 4).map((bench) => (
              <div
                key={bench.key}
                style={{ background: "var(--academia-background-alt)", padding: 24 }}
              >
                <div
                  style={{
                    fontSize: 10,
                    color: "var(--academia-muted-foreground)",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    marginBottom: 12,
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {bench.name}
                </div>
                {topModels[bench.key]?.map((m, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 13,
                      padding: "6px 0",
                      borderBottom:
                        i < topModels[bench.key].length - 1
                          ? "1px solid var(--academia-border)"
                          : "none",
                    }}
                  >
                    <span
                      style={{
                        color: i === 0 ? "var(--academia-accent)" : "var(--academia-foreground)",
                      }}
                    >
                      {i === 0 ? "Ⅰ " : i === 1 ? "Ⅱ " : "Ⅲ "}
                      {m.name}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontWeight: 600,
                        color: "var(--academia-foreground)",
                      }}
                    >
                      {formatScore(m.score, bench)}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* View mode toggle */}
        <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
          {[
            { value: "both", label: "Chart + Table" },
            { value: "chart", label: "Chart Only" },
            { value: "table", label: "Table Only" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setViewMode(opt.value)}
              className="btn btn-secondary"
              style={{
                padding: "8px 16px",
                fontSize: 11,
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Chart and Table */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: viewMode === "both" ? "1fr 1fr" : "1fr",
            gap: 32,
          }}
        >
          {/* Radar Chart */}
          {(viewMode === "both" || viewMode === "chart") && (
            <div
              className="card corner-flourish"
              style={{
                background: "var(--academia-background-alt)",
                display: viewMode === "chart" ? "grid-column: 1 / -1" : undefined,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: 18,
                    fontWeight: 500,
                    color: "var(--academia-foreground)",
                  }}
                >
                  Model Comparison
                </h3>
                <span
                  style={{
                    fontSize: 11,
                    color: "var(--academia-muted-foreground)",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  Select models to compare
                </span>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
                {MODELS.slice(0, 8).map((m) => (
                  <button
                    key={m.id}
                    onClick={() => toggleModel(m.id)}
                    className="btn btn-secondary btn-sm"
                    style={{
                      fontSize: 10,
                      padding: "6px 12px",
                    }}
                  >
                    {m.name}
                  </button>
                ))}
              </div>

              <div style={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart
                    data={
                      selectedModels.length > 0
                        ? chartData.filter((d) =>
                            selectedModels.some(
                              (id) => MODELS.find((m) => m.id === id)?.name === d.name,
                            ),
                          )
                        : chartData.slice(0, 5)
                    }
                  >
                    <PolarGrid stroke="var(--academia-border)" />
                    <PolarAngleAxis
                      dataKey="name"
                      tick={{ fill: "var(--academia-foreground)", fontSize: 11 }}
                      style={{ fontFamily: "var(--font-display)" }}
                    />
                    <PolarRadiusAxis
                      angle={90}
                      domain={[0, 100]}
                      tick={{ fill: "var(--academia-muted-foreground)", fontSize: 10 }}
                    />
                    {BENCHMARKS.slice(0, 4).map((bench, i) => (
                      <Radar
                        key={bench.key}
                        name={bench.name}
                        dataKey={bench.key}
                        stroke={`hsl(${i * 60}, 70%, 50%)`}
                        fill={`hsl(${i * 60}, 70%, 50%)`}
                        fillOpacity={0.2}
                      />
                    ))}
                    <Legend />
                    <Tooltip
                      contentStyle={{
                        background: "var(--academia-background-alt)",
                        border: "1px solid var(--academia-border)",
                        fontSize: 11,
                      }}
                      labelStyle={{
                        color: "var(--academia-foreground)",
                        fontFamily: "var(--font-heading)",
                        fontWeight: 600,
                      }}
                      formatter={(value, name, props) => {
                        const bench = BENCHMARKS.find((b) => b.key === name);
                        return [formatScore(props.payload[`${name}Raw`] || 0, bench), name];
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Sortable Table */}
          {(viewMode === "both" || viewMode === "table") && (
            <div
              className="card corner-flourish"
              style={{
                background: "var(--academia-background-alt)",
                display: viewMode === "table" ? "grid-column: 1 / -1" : undefined,
              }}
            >
              <div
                style={{
                  padding: "20px 28px",
                  borderBottom: "1px solid var(--academia-border)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: 18,
                    fontWeight: 500,
                    color: "var(--academia-foreground)",
                  }}
                >
                  All Models
                </h3>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span
                    style={{
                      fontSize: 11,
                      color: "var(--academia-muted-foreground)",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    Sort by:
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{
                      padding: "6px 10px",
                      fontSize: 12,
                      background: "var(--academia-muted)",
                      color: "var(--academia-foreground)",
                      border: "1px solid var(--academia-border)",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
                    style={{
                      padding: "6px 10px",
                      fontSize: 12,
                      background: "var(--academia-muted)",
                      color: "var(--academia-foreground)",
                      border: "1px solid var(--academia-border)",
                      cursor: "pointer",
                    }}
                  >
                    {sortOrder === "asc" ? "↑" : "↓"}
                  </button>
                </div>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table>
                  <thead>
                    <tr>
                      <th onClick={() => toggleSort("name")} style={{ cursor: "pointer" }}>
                        Model
                      </th>
                      <th onClick={() => toggleSort("family")} style={{ cursor: "pointer" }}>
                        Family
                      </th>
                      <th onClick={() => toggleSort("params")} style={{ cursor: "pointer" }}>
                        Params
                      </th>
                      <th>Type</th>
                      {BENCHMARKS.map((bench) => (
                        <th
                          key={bench.key}
                          onClick={() => toggleSort(bench.key)}
                          style={{ cursor: "pointer", textAlign: "right" }}
                          title={bench.description}
                        >
                          {bench.name}{" "}
                          {sortBy === bench.key ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sortedModels.map((model) => (
                      <tr key={model.id}>
                        <td
                          style={{
                            fontWeight: 600,
                            fontFamily: "var(--font-heading)",
                            fontSize: 14,
                            color: "var(--academia-foreground)",
                          }}
                        >
                          {model.name}
                        </td>
                        <td style={{ color: "var(--academia-muted-foreground)" }}>
                          {model.family}
                        </td>
                        <td style={{ color: "var(--academia-muted-foreground)" }}>
                          {model.totalParams}
                        </td>
                        <td>
                          <span
                            className={`tag tag-${model.type === "MoE" ? "viable" : "hard"}`}
                            style={{ fontSize: 10 }}
                          >
                            {model.type}
                          </span>
                        </td>
                        {BENCHMARKS.map((bench) => {
                          const score = model.benchmarks[bench.key];
                          const maxInCol = Math.max(
                            ...MODELS.map((m) => m.benchmarks[bench.key] || 0),
                          );
                          const isTop = score && score >= maxInCol * 0.95;
                          return (
                            <td
                              key={bench.key}
                              style={{
                                textAlign: "right",
                                fontFamily: "var(--font-heading)",
                                fontWeight: isTop ? 600 : 400,
                                color: isTop
                                  ? "var(--academia-accent)"
                                  : "var(--academia-foreground)",
                              }}
                            >
                              {score ? formatScore(score, bench) : "—"}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Benchmark info */}
        <div
          className="card corner-flourish"
          style={{
            marginTop: 48,
            background: "var(--academia-background-alt)",
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: 18,
              fontWeight: 500,
              marginBottom: 20,
              color: "var(--academia-foreground)",
            }}
          >
            About Benchmarks
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 20,
            }}
          >
            {BENCHMARKS.map((bench) => (
              <div key={bench.key}>
                <div
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontWeight: 600,
                    fontSize: 14,
                    marginBottom: 6,
                    color: "var(--academia-foreground)",
                  }}
                >
                  {bench.name}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--academia-muted-foreground)",
                    fontFamily: "var(--font-body)",
                    lineHeight: 1.6,
                  }}
                >
                  {bench.description}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--academia-muted-foreground)",
                    marginTop: 6,
                    fontFamily: "var(--font-display)",
                  }}
                >
                  Max: {bench.max}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
