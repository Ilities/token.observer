import { useState, useMemo } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  HARDWARE_CATEGORIES,
  FRONTIER_TIMELINE,
  OPEN_MODEL_CROSSOVERS,
  getFrontierModel,
  monthsBehind,
  getClimbData,
} from "../data/frontier";

// Custom tooltip component
function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;

  if (data.type === "frontier") {
    return (
      <div
        style={{
          background: "var(--academia-background-alt)",
          border: "2px solid var(--academia-accent)",
          padding: 16,
          borderRadius: 4,
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          maxWidth: 280,
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 14,
            fontWeight: 600,
            color: "var(--academia-accent)",
            marginBottom: 4,
          }}
        >
          🏆 Frontier Model
        </div>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 16,
            fontWeight: 700,
            color: "var(--academia-foreground)",
          }}
        >
          {data.name}
        </div>
        <div style={{ fontSize: 11, color: "var(--academia-muted-foreground)", marginTop: 4 }}>
          {data.family} • {data.date}
        </div>
        <div
          style={{
            marginTop: 8,
            padding: "6px 10px",
            background: "var(--academia-accent)",
            display: "inline-block",
            borderRadius: 2,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 12,
              fontWeight: 700,
              color: "#000",
            }}
          >
            Intelligence: {data.intelligenceScore}
          </span>
        </div>
        {data.note && (
          <div style={{ fontSize: 11, color: "var(--academia-muted-foreground)", marginTop: 8 }}>
            {data.note}
          </div>
        )}
      </div>
    );
  }

  if (data.type === "crossover") {
    return (
      <div
        style={{
          background: "var(--academia-background-alt)",
          border: `2px solid ${data.categoryColor}`,
          padding: 16,
          borderRadius: 4,
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          maxWidth: 340,
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 11,
            fontWeight: 600,
            color: data.categoryColor,
            marginBottom: 4,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {data.categoryIcon} {data.categoryName}
        </div>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 16,
            fontWeight: 700,
            color: "var(--academia-foreground)",
          }}
        >
          {data.modelName}
        </div>
        <div style={{ fontSize: 11, color: "var(--academia-muted-foreground)", marginTop: 4 }}>
          Matches {data.frontierEquivalentName} from {data.frontierDate}
        </div>
        <div
          style={{
            marginTop: 10,
            padding: "8px 12px",
            background: "var(--academia-crimson)",
            borderRadius: 3,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 13,
              fontWeight: 700,
              color: "#fff",
              marginBottom: 2,
            }}
          >
            🕰️ {data.monthsBehind} months behind
          </div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.8)" }}>{data.note}</div>
        </div>
      </div>
    );
  }

  return null;
}

// Custom shape for frontier models
function FrontierShape(props) {
  const { cx, cy, size, payload } = props;
  if (!cx || !cy) return null;

  return (
    <g>
      <circle cx={cx} cy={cy} r={size / 2} fill="var(--academia-accent)" opacity={0.3} />
      <circle cx={cx} cy={cy} r={size / 3} fill="var(--academia-accent)" />
      {payload.intelligenceScore >= 90 && (
        <text x={cx} y={cy - 8} textAnchor="middle" fill="#fff" fontSize={8} fontWeight="700">
          🏆
        </text>
      )}
    </g>
  );
}

// Custom shape for crossover models
function CrossoverShape(props) {
  const { cx, cy, size, payload } = props;
  if (!cx || !cy) return null;

  return (
    <g>
      <circle cx={cx} cy={cy} r={size / 2} fill={payload.categoryColor} opacity={0.2} />
      <circle cx={cx} cy={cy} r={size / 2.5} fill={payload.categoryColor} />
      <text x={cx} y={cy + 4} textAnchor="middle" fill="#fff" fontSize={10} fontWeight="700">
        {payload.categoryIcon}
      </text>
    </g>
  );
}

export default function FrontierTimelineGraph() {
  const [hoveredCategory, setHoveredCategory] = useState(null);

  // Process frontier timeline data
  const frontierData = useMemo(() => {
    return FRONTIER_TIMELINE.filter((m) => m.type === "closed").map((model) => ({
      ...model,
      x: monthsBehind(model.date), // Months behind from current date (March 2026)
      y: model.intelligenceScore,
      type: "frontier",
    }));
  }, []);

  // Process crossover data
  const crossoverData = useMemo(() => {
    return OPEN_MODEL_CROSSOVERS.map((crossover) => {
      const category = HARDWARE_CATEGORIES.find((c) => c.id === crossover.hardwareCategory);
      const frontierModel = getFrontierModel(crossover.frontierEquivalent);

      return {
        ...crossover,
        x: crossover.monthsBehind,
        y: crossover.frontierScore,
        type: "crossover",
        categoryIcon: category?.icon || "📦",
        categoryName: category?.name || "Unknown",
        categoryColor: category?.color || "#888",
        frontierEquivalentName: frontierModel?.name || crossover.frontierEquivalent,
      };
    });
  }, []);

  // Get climb data sorted by months behind
  const climbData = useMemo(() => getClimbData(), []);

  // X-axis labels (time)
  const xAxisTicks = [
    { value: 36, label: "Mar 2023" },
    { value: 24, label: "Mar 2024" },
    { value: 12, label: "Mar 2025" },
    { value: 0, label: "Mar 2026 (Now)" },
  ];

  return (
    <div
      style={{
        background: "var(--academia-background-alt)",
        border: "1px solid var(--academia-border)",
        borderRadius: 4,
        padding: 24,
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h3
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 24,
            fontWeight: 500,
            color: "var(--academia-foreground)",
            marginBottom: 8,
          }}
        >
          The Open-Weight Climb 📈
        </h3>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 14,
            color: "var(--academia-muted-foreground)",
            lineHeight: 1.6,
            maxWidth: 700,
          }}
        >
          Track how open-weight models have climbed through hardware categories, matching frontier
          AI from months past. Each point shows where you can now run that level of intelligence
          locally.
        </p>
      </div>

      {/* Chart */}
      <div style={{ height: 550 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid stroke="var(--academia-border)" strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="x"
              domain={[0, 36]}
              ticks={xAxisTicks.map((t) => t.value)}
              tickFormatter={(val) => xAxisTicks.find((t) => t.value === val)?.label || val}
              tick={{ fill: "var(--academia-muted-foreground)", fontSize: 10 }}
              label={{
                value: "Months Behind Frontier →",
                position: "bottom",
                offset: 40,
                fill: "var(--academia-muted-foreground)",
                fontSize: 11,
                fontFamily: "var(--font-display)",
              }}
              reversed={true}
            />
            <YAxis
              type="number"
              dataKey="y"
              domain={[40, 100]}
              tick={{ fill: "var(--academia-muted-foreground)", fontSize: 10 }}
              label={{
                value: "Intelligence Score",
                angle: -90,
                position: "insideLeft",
                fill: "var(--academia-muted-foreground)",
                fontSize: 11,
                fontFamily: "var(--font-display)",
              }}
            />
            <ZAxis type="number" range={[60, 120]} />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "var(--academia-accent)", strokeWidth: 1 }}
            />

            {/* Frontier models line */}
            <Scatter
              name="Frontier Models"
              data={frontierData}
              shape={<FrontierShape />}
              fill="var(--academia-accent)"
            />

            {/* Crossover models - grouped by hardware category */}
            {HARDWARE_CATEGORIES.map((category) => (
              <Scatter
                key={category.id}
                name={category.name}
                data={crossoverData.filter((c) => c.hardwareCategory === category.id)}
                shape={<CrossoverShape />}
                fill={category.color}
                onMouseEnter={() => setHoveredCategory(category.id)}
                onMouseLeave={() => setHoveredCategory(null)}
              />
            ))}

            {/* Reference lines for hardware categories */}
            {HARDWARE_CATEGORIES.map((category) => {
              const categoryCrossovers = crossoverData.filter(
                (c) => c.hardwareCategory === category.id,
              );
              if (categoryCrossovers.length === 0) return null;

              const avgY =
                categoryCrossovers.reduce((sum, c) => sum + c.y, 0) / categoryCrossovers.length;

              return (
                <ReferenceLine
                  key={category.id}
                  y={avgY}
                  stroke={category.color}
                  strokeDasharray="3 3"
                  opacity={hoveredCategory === category.id ? 1 : 0.3}
                  label={{
                    value: `${category.icon} ${category.name}`,
                    position: "right",
                    fill: category.color,
                    fontSize: 10,
                    fontFamily: "var(--font-display)",
                  }}
                />
              );
            })}
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          marginTop: 24,
          paddingTop: 16,
          borderTop: "1px solid var(--academia-border)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 12px",
            background: "var(--academia-accent)",
            borderRadius: 2,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#fff",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 11,
              fontWeight: 600,
              color: "#000",
            }}
          >
            🏆 Frontier (Closed)
          </span>
        </div>

        {HARDWARE_CATEGORIES.map((category) => {
          const count = crossoverData.filter((c) => c.hardwareCategory === category.id).length;
          if (count === 0) return null;

          return (
            <div
              key={category.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 12px",
                background: hoveredCategory === category.id ? category.color : "transparent",
                borderRadius: 2,
                cursor: "pointer",
                transition: "background 0.2s ease-out",
                border: `1px solid ${category.color}`,
              }}
              onMouseEnter={() => setHoveredCategory(category.id)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: category.color,
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 11,
                  fontWeight: 600,
                  color:
                    hoveredCategory === category.id ? "#000" : "var(--academia-muted-foreground)",
                }}
              >
                {category.icon} {category.name} ({count})
              </span>
            </div>
          );
        })}
      </div>

      {/* Key insights */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 1,
          marginTop: 24,
          background: "var(--academia-border)",
        }}
      >
        {climbData.slice(0, 4).map((climb, i) => (
          <div
            key={climb.modelId + i}
            style={{
              background: "var(--academia-background-alt)",
              padding: 16,
              transition: "background 0.3s ease-out",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--academia-muted)")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "var(--academia-background-alt)")
            }
          >
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 10,
                color: climb.categoryColor,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              {climb.categoryIcon} {climb.categoryName}
            </div>
            <div
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 14,
                fontWeight: 600,
                color: "var(--academia-foreground)",
                marginBottom: 4,
              }}
            >
              {climb.modelName}
            </div>
            <div
              style={{
                fontSize: 12,
                color: "var(--academia-muted-foreground)",
                marginBottom: 8,
              }}
            >
              Matches {climb.frontierModel.name}
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 18,
                fontWeight: 700,
                color: "var(--academia-accent)",
              }}
            >
              {climb.monthsBehind} months caught up
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
