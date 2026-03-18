import { useState } from "react";
import { Link } from "react-router-dom";
import {
  HARDWARE_CATEGORIES,
  MODEL_VRAM_MAP,
  GGUF_SIZES,
  estimateVram,
  getRunnableModels,
  getBestModelForCategory,
} from "../data/hardware";
import { MODELS } from "../data/models";

const QUANT_OPTIONS = [
  { value: "q3_k_m", label: "Q3_K_M (70% size, -0.8% acc)" },
  { value: "q4_k_m", label: "Q4_K_M (75% size, -0.3% acc) ⭐ Recommended" },
  { value: "q5_k_m", label: "Q5_K_M (85% size, -0.1% acc)" },
  { value: "q6_k", label: "Q6_K (95% size, ~0% acc)" },
  { value: "q8_0", label: "Q8_0 (110% size, lossless)" },
];

export default function Hardware() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [quantType, setQuantType] = useState("q4_k_m");
  const [showVramCalculator, setShowVramCalculator] = useState(false);

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
            Hardware Guide
          </span>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 36,
              fontWeight: 700,
              marginTop: 8,
            }}
          >
            What Can You Run? 🖥️
          </h1>
          <p style={{ color: "var(--text-muted)", marginTop: 8, maxWidth: 600 }}>
            Find the best model for your hardware. All sizes assume GGUF quantization - the
            practical way to run LLMs locally.
          </p>
        </div>

        {/* Quantization selector */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
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
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
              Affects VRAM requirements and quality
            </div>
          </div>
          <select
            value={quantType}
            onChange={(e) => setQuantType(e.target.value)}
            style={{
              padding: "10px 16px",
              fontSize: 13,
              background: "var(--surface)",
              color: "var(--text)",
              border: "1px solid var(--border)",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
            }}
          >
            {QUANT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowVramCalculator(!showVramCalculator)}
            style={{
              padding: "10px 20px",
              fontFamily: "var(--font-display)",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              background: showVramCalculator ? "var(--accent)" : "var(--surface)",
              color: showVramCalculator ? "#000" : "var(--text-muted)",
              border: showVramCalculator ? "1px solid var(--accent)" : "1px solid var(--border)",
            }}
          >
            {showVramCalculator ? "Hide VRAM Calculator" : "VRAM Calculator"}
          </button>
        </div>

        {/* VRAM Calculator */}
        {showVramCalculator && (
          <VramCalculator quantType={quantType} onClose={() => setShowVramCalculator(false)} />
        )}

        {/* Category Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 1,
            background: "var(--border)",
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
                background: "var(--surface)",
                padding: 24,
                cursor: "pointer",
                border:
                  selectedCategory === category.id
                    ? "2px solid var(--accent)"
                    : "1px solid var(--border)",
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
                  fontFamily: "var(--font-display)",
                  fontSize: 18,
                  fontWeight: 700,
                  marginBottom: 8,
                }}
              >
                {category.name}
              </h3>
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 16 }}>
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
                <span style={{ color: "var(--text-muted)" }}>
                  Max: {category.maxPracticalParams}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    color: "var(--accent)",
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

        {/* Quick Reference */}
        <div
          style={{
            marginTop: 48,
            background: "var(--surface)",
            border: "1px solid var(--border)",
            padding: 24,
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 18,
              fontWeight: 700,
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
                    <td style={{ color: "var(--text)" }}>
                      {estimateVram(row.params, "q3_k_m")} GB
                    </td>
                    <td style={{ color: "var(--accent)", fontWeight: 700 }}>
                      {estimateVram(row.params, "q4_k_m")} GB
                    </td>
                    <td style={{ color: "var(--text)" }}>
                      {estimateVram(row.params, "q5_k_m")} GB
                    </td>
                    <td style={{ color: "var(--text)" }}>{estimateVram(row.params, "q6_k")} GB</td>
                    <td style={{ color: "var(--text)" }}>{estimateVram(row.params, "q8_0")} GB</td>
                    <td style={{ fontSize: 11, color: "var(--text-muted)" }}>
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
          <div style={{ marginTop: 16, fontSize: 12, color: "var(--text-muted)" }}>
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
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderLeft: "4px solid var(--accent)",
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
              fontFamily: "var(--font-display)",
              fontSize: 24,
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            {category.icon} {category.name}
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: 13 }}>{category.notes}</p>
        </div>
        <Link
          to={`/models/${category.bestModel}`}
          style={{
            background: "var(--accent)",
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
          background: "var(--border)",
          marginBottom: 24,
        }}
      >
        {category.tiers.map((tier, i) => (
          <div key={i} style={{ background: "var(--surface)", padding: 16 }}>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 11,
                color: "var(--text-muted)",
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
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>
              <strong>RAM:</strong> {tier.systemRam}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>
              <strong>Bandwidth:</strong> {tier.bandwidth}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-dim)", marginBottom: 8 }}>
              <strong>TDP:</strong> {tier.tdp}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
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
            fontFamily: "var(--font-display)",
            fontSize: 16,
            fontWeight: 700,
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
                background: model.fits ? "var(--surface)" : "#ff000008",
                border: model.fits ? "1px solid var(--border)" : "1px solid var(--red)",
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
                    color: model.fits ? "var(--text)" : "var(--red)",
                    textDecoration: "none",
                  }}
                >
                  {model.name}
                  {model.id === category.bestModel && (
                    <span
                      style={{
                        marginLeft: 8,
                        fontSize: 10,
                        background: "var(--accent)",
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
                      color: "var(--red)",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    NEEDS {model.requiredVram}GB
                  </span>
                )}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 8 }}>
                {model.totalParams} {model.type === "MoE" && `(${model.activeParams} active)`} •{" "}
                {model.context} context
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
                VRAM:{" "}
                <strong style={{ color: model.fits ? "var(--green)" : "var(--red)" }}>
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
            background: "var(--accent-dim)",
            border: "1px solid var(--accent)",
            padding: 20,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 11,
              color: "var(--accent)",
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
              color: "var(--text)",
              textDecoration: "none",
            }}
          >
            {bestModel.name}
          </Link>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 8, marginBottom: 0 }}>
            {bestModel.verdictNote}
          </p>
        </div>
      )}
    </div>
  );
}

function VramCalculator({ quantType, onClose }) {
  const [params, setParams] = useState(70);

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
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 16,
            fontWeight: 700,
          }}
        >
          🧮 VRAM Calculator
        </h3>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "var(--text-muted)",
            cursor: "pointer",
            fontSize: 18,
          }}
        >
          ×
        </button>
      </div>
      <div style={{ display: "flex", gap: 16, alignItems: "end", flexWrap: "wrap" }}>
        <div>
          <label
            style={{
              display: "block",
              fontSize: 12,
              color: "var(--text-muted)",
              marginBottom: 4,
            }}
          >
            Model Parameters (B)
          </label>
          <input
            type="number"
            value={params}
            onChange={(e) => setParams(parseFloat(e.target.value) || 0)}
            style={{
              padding: "10px 14px",
              fontSize: 14,
              background: "var(--surface)",
              color: "var(--text)",
              border: "1px solid var(--border)",
              width: 120,
            }}
          />
        </div>
        <div>
          <label
            style={{
              display: "block",
              fontSize: 12,
              color: "var(--text-muted)",
              marginBottom: 4,
            }}
          >
            Quantization
          </label>
          <div
            style={{
              padding: "10px 14px",
              fontSize: 14,
              fontFamily: "var(--font-display)",
              fontWeight: 700,
            }}
          >
            {quantType.toUpperCase()}
          </div>
        </div>
        <div
          style={{
            padding: "10px 20px",
            background: "var(--accent-dim)",
            border: "1px solid var(--accent)",
          }}
        >
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 2 }}>
            Required VRAM
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 24,
              fontWeight: 700,
              color: "var(--accent)",
            }}
          >
            {estimateVram(params, quantType)} GB
          </div>
        </div>
      </div>
      <div style={{ marginTop: 16, fontSize: 12, color: "var(--text-muted)" }}>
        Formula: VRAM = Params(B) × {GGUF_SIZES[quantType]} bytes × 1.2 (20% overhead for KV cache
        and runtime)
      </div>
    </div>
  );
}
