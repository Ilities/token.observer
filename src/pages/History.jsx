import { useState, useMemo } from "react";
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
} from "../data/history";

const BENCHMARKS = ["mmlu", "mmluPro", "swebench", "gpqa", "humanEval", "aime"];

export default function History() {
  const [selectedBenchmark, setSelectedBenchmark] = useState("mmlu");
  const [chartType, setChartType] = useState("gap"); // 'gap', 'scores', 'models'
  const [selectedFamily, setSelectedFamily] = useState("all");

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

  return (
    <div style={{ padding: "48px 0" }}>
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

        {/* Benchmark selector */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 24,
            flexWrap: "wrap",
          }}
        >
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
              {currentGap?.date?.slice(0, 4)} • {currentGap?.frontierModel} vs{" "}
              {currentGap?.openModel}
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
      </div>
    </div>
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
