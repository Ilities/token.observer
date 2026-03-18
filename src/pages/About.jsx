export default function About() {
  return (
    <div style={{ padding: "64px 0" }}>
      <div className="container" style={{ maxWidth: 800 }}>
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
            About token.observer
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
            What is token.observer?
          </h1>
          <hr
            className="ornate-divider"
            style={{ width: 120, marginLeft: 0, marginTop: 24, border: "none" }}
          />
        </div>

        {/* Content sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          {/* The Premise */}
          <div
            className="card corner-flourish"
            style={{
              background: "var(--academia-background-alt)",
              borderLeft: "3px solid var(--academia-accent)",
              borderRadius: "4px",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 20,
                fontWeight: 500,
                marginBottom: 16,
                color: "var(--academia-foreground)",
              }}
            >
              The Premise
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 15,
                color: "var(--academia-muted-foreground)",
                lineHeight: 1.8,
              }}
            >
              Every token you send to Anthropic, OpenAI, or Google is a rent payment on intelligence
              that is rapidly becoming available for free. We believe this is the most important
              infrastructure shift in the current AI cycle — and that most developers and companies
              are dramatically overpaying as a result of inertia, not necessity.
            </p>
          </div>

          {/* Three Paths to Inference */}
          <div>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 24,
                fontWeight: 500,
                marginBottom: 24,
                color: "var(--academia-foreground)",
              }}
            >
              Three paths to inference
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                {
                  label: "01 — Pay per token",
                  desc: "Send requests to Anthropic, OpenAI, Google, etc. Zero ops overhead. High cost at scale. Your data goes to a third party. Pricing can change at any time.",
                  color: "var(--academia-crimson)",
                },
                {
                  label: "02 — Rent GPU by the second",
                  desc: "Deploy open-weight models on RunPod, Vast.ai, Lambda, or similar. You control the model and data. Cost depends entirely on your traffic — low utilization kills the economics.",
                  color: "var(--academia-accent-dark)",
                },
                {
                  label: "03 — Run locally",
                  desc: "Buy or already own GPUs. Run models 24/7 with zero per-token cost. Best economics at very high throughput. Capital-intensive upfront.",
                  color: "var(--academia-accent)",
                },
              ].map((p) => (
                <div
                  key={p.label}
                  className="card corner-flourish"
                  style={{
                    background: "var(--academia-background-alt)",
                    borderLeft: `3px solid ${p.color}`,
                    borderRadius: "4px",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      color: p.color,
                      marginBottom: 10,
                      fontSize: 13,
                      letterSpacing: "0.1em",
                    }}
                  >
                    {p.label}
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 14,
                      color: "var(--academia-muted-foreground)",
                      lineHeight: 1.75,
                    }}
                  >
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Methodology */}
          <div
            className="card corner-flourish"
            style={{
              background: "var(--academia-background-alt)",
              borderLeft: "3px solid var(--academia-muted)",
              borderRadius: "4px",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 20,
                fontWeight: 500,
                marginBottom: 16,
                color: "var(--academia-foreground)",
              }}
            >
              Methodology
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 15,
                color: "var(--academia-muted-foreground)",
                lineHeight: 1.8,
                marginBottom: 12,
              }}
            >
              All GPU pricing sourced from RunPod Community Cloud (March 2026). API prices verified
              from provider pricing pages and Artificial Analysis. Crossover calculations assume
              100% GPU utilization — real-world numbers will be higher due to idle time, cold
              starts, and bursty traffic.
            </p>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 15,
                color: "var(--academia-muted-foreground)",
                lineHeight: 1.8,
              }}
            >
              GPU billing is per-second on most platforms (RunPod, Vast.ai, Lambda). The per-minute
              and per-hour figures shown are conversions for readability.
            </p>
          </div>

          {/* Contribute */}
          <div
            className="card corner-flourish"
            style={{
              background: "var(--academia-background-alt)",
              borderLeft: "3px solid var(--academia-muted)",
              borderRadius: "4px",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 20,
                fontWeight: 500,
                marginBottom: 16,
                color: "var(--academia-foreground)",
              }}
            >
              Contribute
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 15,
                color: "var(--academia-muted-foreground)",
                lineHeight: 1.8,
              }}
            >
              Pricing changes fast. If you spot an error, have newer benchmark data, or want to add
              a model — open a PR. This site is built to be updated as the landscape shifts.
            </p>
          </div>

          {/* Disclaimer box */}
          <div
            className="card corner-flourish"
            style={{
              background: "var(--academia-background-alt)",
              borderTop: "3px solid var(--academia-accent)",
              borderRadius: "4px",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 600,
                fontSize: 14,
                marginBottom: 8,
                color: "var(--academia-foreground)",
              }}
            >
              Prices verified: March 2026
            </p>
            <p
              style={{
                fontSize: 12,
                color: "var(--academia-muted-foreground)",
                fontFamily: "var(--font-body)",
                lineHeight: 1.6,
              }}
            >
              LLM pricing changes frequently. Always verify current rates on provider websites
              before making infrastructure decisions. This is not financial advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
