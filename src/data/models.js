// aitoken.tax — data layer v2
// March 2026 — rebuilt around quality tiers + payback calculator
// VRAM requirements sourced from Unsloth.ai documentation

// ─────────────────────────────────────────────
// QUALITY TIERS
// ─────────────────────────────────────────────

export const TIERS = {
  top: {
    id: "top",
    label: "Top",
    description: "Complex reasoning, coding agents, hard multi-step problems",
    useCases: [
      "Autonomous coding agents (SWE-bench level)",
      "Multi-file codebase edits",
      "Hard math / science reasoning",
      "Long-horizon agentic tasks",
    ],
    closedApiEquivalent: "Claude Opus 4.6 / GPT-5",
    closedApiCost: { input: 5, output: 25 },
    closedApiName: "Claude Opus 4.6",
    color: "#ff3c3c",
  },
  mid: {
    id: "mid",
    label: "Mid",
    description: "Everyday coding, writing, analysis, RAG, chat",
    useCases: [
      "Coding assistance (autocomplete, explain, refactor)",
      "Writing and editing",
      "Document analysis",
      "Conversational AI",
      "RAG pipelines",
    ],
    closedApiEquivalent: "Claude Sonnet 4.6 / GPT-4o",
    closedApiCost: { input: 3, output: 15 },
    closedApiName: "Claude Sonnet 4.6",
    color: "#ffe500",
  },
  fast: {
    id: "fast",
    label: "Fast / Cheap",
    description: "Simple tasks, summarization, classification, quick answers",
    useCases: ["Summarization", "Classification", "Simple Q&A", "Data extraction", "Translation"],
    closedApiEquivalent: "GPT-4o Mini / Claude Haiku",
    closedApiCost: { input: 0.15, output: 0.6 },
    closedApiName: "GPT-4o Mini",
    color: "#00ff88",
  },
};

// ─────────────────────────────────────────────
// GPU CONFIGS (preserved for Hardware page)
// ─────────────────────────────────────────────

export const GPU_CONFIGS = {
  rtx4090: {
    name: "RTX 4090",
    vram: "24GB",
    costPerHr: 0.48,
    provider: "RunPod Community",
    notes: "Small models only (<20B Q4)",
  },
  rtx5090: {
    name: "RTX 5090",
    vram: "32GB",
    costPerHr: 0.65,
    provider: "Vast.ai",
    notes: "Latest consumer GPU, better for 20-35B models",
  },
  a10: {
    name: "A10 24GB",
    vram: "24GB",
    costPerHr: 0.6,
    provider: "RunPod Secure",
    notes: "Datacenter reliability, same VRAM as 4090",
  },
  a100: {
    name: "A100 80GB",
    vram: "80GB",
    costPerHr: 1.33,
    provider: "RunPod Community",
    notes: "Best value datacenter GPU",
  },
  l40s: {
    name: "L40S 48GB",
    vram: "48GB",
    costPerHr: 1.1,
    provider: "Lambda Labs",
    notes: "Good mid-range, 48GB sweet spot",
  },
  h100: {
    name: "H100 80GB",
    vram: "80GB",
    costPerHr: 2.17,
    provider: "RunPod Community",
    notes: "Best single-GPU inference",
  },
  h100x4: {
    name: "4× H100 80GB",
    vram: "320GB",
    costPerHr: 8.68,
    provider: "RunPod Community",
    notes: "Required for large MoE models",
  },
  h100x8: {
    name: "8× H100 80GB",
    vram: "640GB",
    costPerHr: 17.36,
    provider: "RunPod Community",
    notes: "Full precision large MoE",
  },
  b200: {
    name: "B200 180GB",
    vram: "180GB",
    costPerHr: 3.5,
    provider: "Lambda Labs",
    notes: "Next-gen, massive VRAM for large models",
  },
  gb200: {
    name: "GB200 NVL72",
    vram: "13TB (shared)",
    costPerHr: 45.0,
    provider: "Oracle Cloud",
    notes: "Rack-scale, ultimate inference cluster",
  },
};

// ─────────────────────────────────────────────
// OPEN MODELS PER TIER
// VRAM requirements from Unsloth.ai documentation
// ─────────────────────────────────────────────

export const MODELS = [
  // FAST TIER - Small models for consumer hardware
  {
    id: "qwen35-9b",
    tier: "fast",
    name: "Qwen3.5 9B",
    family: "Qwen / Alibaba",
    type: "Dense",
    totalParams: "9B",
    activeParams: "9B",
    releaseDate: "Feb 2026",
    license: "Apache 2.0",
    context: "262K",
    architecture: "Dense transformer, optimized for edge",
    closestApi: "GPT-4o Mini",
    verdict: "VIABLE",
    verdictNote: "Fits on consumer GPU. Excellent for edge deployment and low-latency apps.",
    benchmarks: {
      mmlu: 82.5,
      mmluPro: 78.2,
      swebench: 65.8,
      gpqa: 79.5,
      livecodebench: 71.2,
      arena: 1185,
    },
    apiProviders: [
      { name: "Alibaba Cloud", input: 0.05, output: 0.2 },
      { name: "OpenRouter", input: 0.07, output: 0.28 },
      { name: "DeepInfra", input: 0.06, output: 0.24 },
    ],
    purchaseOptions: [
      {
        name: "1× RTX 4090 (24GB)",
        totalVram: "24GB",
        purchaseCost: 1800,
        usedCost: 1100,
        monthlyElectricity: 15,
        canRunModel: "Q4 at ~80-120 t/s",
        quality: "Full quality — 6.5GB VRAM at Q4",
      },
      {
        name: "1× RTX 3090 (24GB)",
        totalVram: "24GB",
        purchaseCost: 800,
        usedCost: 550,
        monthlyElectricity: 18,
        canRunModel: "Q4 at ~60-90 t/s",
        quality: "Full quality",
      },
    ],
    rentalOptions: [
      { name: "Vast.ai RTX 4090", costPerHr: 0.35, costPerDay24: 8.4, provider: "Vast.ai" },
      { name: "RunPod RTX 4090", costPerHr: 0.48, costPerDay24: 11.52, provider: "RunPod" },
    ],
  },
  {
    id: "qwen35-27b",
    tier: "fast",
    name: "Qwen3.5 27B",
    family: "Qwen / Alibaba",
    type: "Dense",
    totalParams: "27B",
    activeParams: "27B",
    releaseDate: "Feb 2026",
    license: "Apache 2.0",
    context: "262K",
    architecture: "Dense transformer with optimized attention",
    closestApi: "GPT-4o Mini",
    verdict: "VIABLE",
    verdictNote:
      "Fits on a single RTX 4090 or Mac with 18GB+ unified memory. Best entry point for self-hosting.",
    benchmarks: {
      "MMLU-Pro": 85.3,
      "GPQA Diamond": 84.2,
      "SWE-Bench": 72.0,
    },
    apiProviders: [
      { name: "Alibaba Cloud", input: 0.1625, output: 1.3 },
      { name: "OpenRouter", input: 0.195, output: 1.56 },
    ],
    purchaseOptions: [
      {
        name: "1× RTX 4090 (24GB)",
        totalVram: "24GB",
        purchaseCost: 1800,
        usedCost: 1100,
        monthlyElectricity: 15,
        canRunModel: "Q4 at ~50-80 t/s — 17GB VRAM required",
        quality: "Good for most tasks",
      },
      {
        name: "1× RTX 3090 (24GB)",
        totalVram: "24GB",
        purchaseCost: 800,
        usedCost: 550,
        monthlyElectricity: 18,
        canRunModel: "Q4 at ~40-60 t/s",
        quality: "Good for most tasks",
      },
      {
        name: "Mac Mini M4 Pro (48GB)",
        totalVram: "48GB unified",
        purchaseCost: 1400,
        usedCost: null,
        monthlyElectricity: 4,
        canRunModel: "Q4 at ~25-35 t/s via MLX",
        quality: "Very good — 18GB+ required",
      },
      {
        name: "1× A100 80GB",
        totalVram: "80GB",
        purchaseCost: 10000,
        usedCost: 6000,
        monthlyElectricity: 20,
        canRunModel: "FP16 at ~150-200 t/s — 54GB VRAM",
        quality: "Full quality",
      },
    ],
    rentalOptions: [
      { name: "Vast.ai RTX 4090", costPerHr: 0.35, costPerDay24: 8.4, provider: "Vast.ai" },
      { name: "RunPod RTX 4090", costPerHr: 0.48, costPerDay24: 11.52, provider: "RunPod" },
      { name: "RunPod A100 Community", costPerHr: 1.33, costPerDay24: 31.92, provider: "RunPod" },
    ],
  },
  {
    id: "qwen35-35b",
    tier: "fast",
    name: "Qwen3.5 35B-A3B",
    family: "Qwen / Alibaba",
    type: "MoE",
    totalParams: "35B",
    activeParams: "3B",
    releaseDate: "Feb 2026",
    license: "Apache 2.0",
    context: "262K",
    architecture: "Sparse MoE, hybrid attention",
    closestApi: "Claude Haiku 4.5",
    verdict: "VIABLE",
    verdictNote: "Only 3B active params make it very fast. Fits on 24GB GPU at Q4.",
    benchmarks: {
      mmlu: 85.8,
      mmluPro: 82.4,
      swebench: 71.5,
      gpqa: 83.8,
      livecodebench: 74.6,
      arena: 1225,
    },
    apiProviders: [
      { name: "Alibaba Cloud", input: 0.14, output: 0.56 },
      { name: "OpenRouter", input: 0.18, output: 0.72 },
      { name: "Fireworks", input: 0.16, output: 0.64 },
    ],
    purchaseOptions: [
      {
        name: "1× RTX 4090 (24GB)",
        totalVram: "24GB",
        purchaseCost: 1800,
        usedCost: 1100,
        monthlyElectricity: 15,
        canRunModel: "Q4 at ~60-90 t/s — 22GB VRAM",
        quality: "Very good",
      },
      {
        name: "1× A100 80GB",
        totalVram: "80GB",
        purchaseCost: 10000,
        usedCost: 6000,
        monthlyElectricity: 20,
        canRunModel: "FP16 at ~80-120 t/s — 70GB VRAM",
        quality: "Full quality",
      },
    ],
    rentalOptions: [
      { name: "RunPod A100 Community", costPerHr: 1.33, costPerDay24: 31.92, provider: "RunPod" },
      { name: "RunPod H100 Community", costPerHr: 2.17, costPerDay24: 52.08, provider: "RunPod" },
    ],
  },
  {
    id: "glm-4.5-air",
    tier: "fast",
    name: "GLM-4.5 Air",
    family: "Zhipu AI",
    type: "Dense",
    totalParams: "14B",
    activeParams: "14B",
    releaseDate: "Jul 2025",
    license: "Apache 2.0",
    context: "128K",
    architecture: "Dense transformer, optimized for speed",
    closestApi: "GPT-4o Mini",
    verdict: "VIABLE",
    verdictNote: "Budget option. Fits on consumer GPU with 12GB+ VRAM.",
    benchmarks: {
      mmlu: 80.5,
      mmluPro: 75.2,
      swebench: 60.8,
      gpqa: 76.5,
      livecodebench: 62.4,
      arena: 1095,
    },
    apiProviders: [
      { name: "Zhipu Official", input: 0.04, output: 0.16 },
      { name: "OpenRouter", input: 0.06, output: 0.24 },
    ],
    purchaseOptions: [
      {
        name: "1× RTX 4070 Ti (16GB)",
        totalVram: "16GB",
        purchaseCost: 800,
        usedCost: 500,
        monthlyElectricity: 12,
        canRunModel: "Q4 at ~70-100 t/s",
        quality: "Full quality",
      },
    ],
    rentalOptions: [
      { name: "Vast.ai RTX 4090", costPerHr: 0.35, costPerDay24: 8.4, provider: "Vast.ai" },
    ],
  },

  // MID TIER - Mid-size models for single datacenter GPU
  {
    id: "qwen35-122b",
    tier: "mid",
    name: "Qwen3.5 122B-A10B",
    family: "Qwen / Alibaba",
    type: "MoE",
    totalParams: "122B",
    activeParams: "10B",
    releaseDate: "Feb 2026",
    license: "Apache 2.0",
    context: "262K",
    architecture: "MoE with 256 experts and hybrid gated DeltaNet attention",
    closestApi: "Claude Sonnet 4.6",
    verdict: "HARD",
    verdictNote:
      "Requires 73-80GB VRAM at Q4 — fits on single H100/A100 80GB. Excellent Sonnet-level quality.",
    benchmarks: {
      "MMLU-Pro": 86.1,
      "GPQA Diamond": 85.5,
      "SWE-Bench": 72.4,
    },
    apiProviders: [
      { name: "Alibaba Cloud", input: 0.195, output: 1.56 },
      { name: "OpenRouter", input: 0.26, output: 2.08 },
      { name: "Novita", input: 0.4, output: 3.2 },
    ],
    purchaseOptions: [
      {
        name: "1× H100 80GB PCIe",
        totalVram: "80GB",
        purchaseCost: 25000,
        usedCost: 16000,
        monthlyElectricity: 20,
        canRunModel: "Q4_K_M at ~50 t/s — 73GB VRAM",
        quality: "Very good — recommended quant",
      },
      {
        name: "1× A100 80GB PCIe",
        totalVram: "80GB",
        purchaseCost: 10000,
        usedCost: 6000,
        monthlyElectricity: 18,
        canRunModel: "Q4_K_M at ~40 t/s",
        quality: "Very good",
      },
      {
        name: "2× RTX 3090 (NVLink)",
        totalVram: "48GB",
        purchaseCost: 1800,
        usedCost: 1200,
        monthlyElectricity: 28,
        canRunModel: "Q3 with CPU offload — not recommended",
        quality: "Poor — insufficient VRAM",
      },
    ],
    rentalOptions: [
      { name: "RunPod H100 Community", costPerHr: 2.17, costPerDay24: 52.08, provider: "RunPod" },
      { name: "RunPod A100 Community", costPerHr: 1.33, costPerDay24: 31.92, provider: "RunPod" },
      { name: "Vast.ai H100", costPerHr: 1.8, costPerDay24: 43.2, provider: "Vast.ai" },
    ],
  },
  {
    id: "glm-4.7",
    tier: "mid",
    name: "GLM-4.7",
    family: "Zhipu AI",
    type: "MoE",
    totalParams: "355B",
    activeParams: "32B",
    releaseDate: "Dec 2025",
    license: "MIT",
    context: "256K",
    architecture: "MoE with hybrid attention, agent mode",
    closestApi: "Claude Opus 4.6",
    verdict: "HARD",
    verdictNote:
      "Requires 4× H100 or equivalent. Top-tier Chinese model with excellent coding/reasoning.",
    benchmarks: {
      mmlu: 90.1,
      mmluPro: 84.3,
      swebench: 73.8,
      gpqa: 85.7,
      livecodebench: 84.9,
      aime: 95.7,
      ifeval: 88.0,
      arena: 1445,
    },
    apiProviders: [
      { name: "Zhipu Official", input: 0.2, output: 0.8 },
      { name: "OpenRouter", input: 0.26, output: 1.04 },
      { name: "Fireworks", input: 0.24, output: 0.96 },
    ],
    purchaseOptions: [
      {
        name: "4× H100 80GB",
        totalVram: "320GB",
        purchaseCost: 100000,
        usedCost: 60000,
        monthlyElectricity: 80,
        canRunModel: "Q4 at ~35-50 t/s",
        quality: "Very good",
      },
    ],
    rentalOptions: [
      {
        name: "RunPod 4× H100 Community",
        costPerHr: 8.68,
        costPerDay24: 208.32,
        provider: "RunPod",
      },
    ],
  },
  {
    id: "glm-4.7-flash",
    tier: "mid",
    name: "GLM-4.7 Flash",
    family: "Zhipu AI",
    type: "MoE",
    totalParams: "30B",
    activeParams: "3.6B",
    releaseDate: "Dec 2025",
    license: "MIT",
    context: "256K",
    architecture: "MoE with reasoning mode, 3.6B active params",
    closestApi: "Claude Sonnet 4.6",
    verdict: "VIABLE",
    verdictNote: "Only 3.6B active params. Fits on single A100 80GB or 24GB GPU + RAM offload.",
    benchmarks: {
      mmlu: 84.5,
      mmluPro: 78.2,
      swebench: 59.2,
      gpqa: 75.2,
      livecodebench: 72.5,
      arena: 1280,
    },
    apiProviders: [
      { name: "Zhipu Official", input: 0.14, output: 0.56 },
      { name: "OpenRouter", input: 0.18, output: 0.72 },
    ],
    purchaseOptions: [
      {
        name: "1× A100 80GB",
        totalVram: "80GB",
        purchaseCost: 10000,
        usedCost: 6000,
        monthlyElectricity: 20,
        canRunModel: "FP16 at ~60-90 t/s — 60GB VRAM",
        quality: "Full quality",
      },
      {
        name: "1× RTX 4090 (24GB) + RAM",
        totalVram: "24GB + 64GB RAM",
        purchaseCost: 2200,
        usedCost: 1500,
        monthlyElectricity: 18,
        canRunModel: "Q4 with offload at ~15-25 t/s",
        quality: "Good",
      },
    ],
    rentalOptions: [
      { name: "RunPod A100 Community", costPerHr: 1.33, costPerDay24: 31.92, provider: "RunPod" },
    ],
  },

  // TOP TIER - Large models requiring multiple GPUs
  {
    id: "minimax-m25",
    tier: "top",
    name: "MiniMax M2.5",
    family: "MiniMax",
    type: "MoE",
    totalParams: "230B",
    activeParams: "10B",
    releaseDate: "Feb 2026",
    license: "Apache 2.0",
    context: "200K",
    architecture: "MoE with hybrid attention and multi-token prediction",
    closestApi: "Claude Opus 4.6",
    verdict: "HARD",
    verdictNote:
      "Requires 101GB VRAM at Q3 or 243GB at Q8. Best on 4× H100 or Mac with 128GB+ unified memory.",
    benchmarks: {
      "SWE-Bench": 80.2,
      "Multi-SWE-Bench": 51.3,
      BrowseComp: 76.3,
    },
    apiProviders: [
      { name: "SiliconFlow (FP8)", input: 0.2, output: 1.0, note: "FP8 quantized" },
      { name: "FriendliAI", input: 0.3, output: 1.2 },
      { name: "MiniMax Official", input: 0.3, output: 1.2 },
      { name: "OpenRouter", input: 0.25, output: 1.2 },
      {
        name: "SambaNova",
        input: null,
        output: null,
        note: "Fastest — 396 t/s, contact for pricing",
      },
    ],
    purchaseOptions: [
      {
        name: "Mac Studio M2 Ultra (192GB)",
        totalVram: "192GB unified",
        purchaseCost: 6500,
        usedCost: 4500,
        monthlyElectricity: 8,
        canRunModel: "Q3 at ~15-25 t/s via MLX — 101GB required",
        quality: "Very good",
      },
      {
        name: "4× H100 80GB",
        totalVram: "320GB",
        purchaseCost: 100000,
        usedCost: 60000,
        monthlyElectricity: 80,
        canRunModel: "Q8 at ~40-60 t/s — 243GB VRAM",
        quality: "Full quality",
      },
      {
        name: "2× A100 80GB + RAM offload",
        totalVram: "160GB + 128GB RAM",
        purchaseCost: 25000,
        usedCost: 15000,
        monthlyElectricity: 45,
        canRunModel: "Q3 with offload at ~10-20 t/s",
        quality: "Good",
      },
    ],
    rentalOptions: [
      {
        name: "RunPod 4× H100 Community",
        costPerHr: 8.68,
        costPerDay24: 208.32,
        provider: "RunPod",
      },
      { name: "Lambda 4× H100", costPerHr: 12.0, costPerDay24: 288.0, provider: "Lambda" },
    ],
  },
  {
    id: "minimax-m27",
    tier: "top",
    name: "MiniMax M2.7",
    family: "MiniMax",
    type: "MoE",
    totalParams: "Undisclosed",
    activeParams: "Undisclosed",
    releaseDate: "Mar 2026",
    license: "Proprietary",
    context: "204K",
    architecture: "Agentic multi-agent collaboration architecture with continuous improvement",
    closestApi: "Claude Opus 4.6",
    verdict: "HARD",
    verdictNote: "API-only model. Designed for autonomous workflows and production tasks.",
    benchmarks: {
      "SWE-Pro": 56.2,
      "Terminal Bench 2": 57.0,
      "GDPval-AA (ELO)": 1495,
    },
    apiProviders: [
      { name: "OpenRouter", input: 0.3, output: 1.2 },
      { name: "MiniMax Official", input: 0.3, output: 1.2 },
    ],
    purchaseOptions: [],
    rentalOptions: [],
  },
  {
    id: "deepseek-v3.2",
    tier: "top",
    name: "DeepSeek V3.2",
    family: "DeepSeek",
    type: "MoE",
    totalParams: "671B",
    activeParams: "37B",
    releaseDate: "Feb 2026",
    license: "MIT",
    context: "256K",
    architecture: "MoE, Multi-token prediction, MLA attention",
    closestApi: "Claude Opus 4.7",
    verdict: "HARD",
    verdictNote:
      "671B total params but only 37B active. Requires 8× H100 for Q4. Best open-weight model.",
    benchmarks: {
      mmlu: 88.5,
      mmluPro: 85.0,
      swebench: 67.8,
      gpqa: 79.9,
      livecodebench: 74.1,
      aime: 89.3,
      arena: 1421,
    },
    apiProviders: [
      { name: "DeepSeek Official", input: 0.14, output: 0.56 },
      { name: "OpenRouter", input: 0.18, output: 0.72 },
      { name: "Together AI", input: 0.2, output: 0.8 },
      { name: "Fireworks", input: 0.19, output: 0.76 },
    ],
    purchaseOptions: [
      {
        name: "8× H100 80GB",
        totalVram: "640GB",
        purchaseCost: 200000,
        usedCost: 120000,
        monthlyElectricity: 150,
        canRunModel: "Q4 at ~20-35 t/s",
        quality: "Very good",
      },
    ],
    rentalOptions: [
      { name: "RunPod 8× H100", costPerHr: 17.36, costPerDay24: 416.64, provider: "RunPod" },
    ],
  },
  {
    id: "deepseek-r1",
    tier: "top",
    name: "DeepSeek R1",
    family: "DeepSeek",
    type: "MoE",
    totalParams: "671B",
    activeParams: "37B",
    releaseDate: "Jan 2025",
    license: "MIT",
    context: "128K",
    architecture: "MoE, Chain-of-thought RL, MLA attention",
    closestApi: "o3 Pro",
    verdict: "HARD",
    verdictNote: "Reasoning specialist. Same architecture as V3. Requires 8× H100.",
    benchmarks: {
      mmlu: 90.8,
      mmluPro: 84.0,
      swebench: 65.2,
      gpqa: 71.5,
      livecodebench: 65.9,
      aime: 87.5,
      arena: 1398,
    },
    apiProviders: [
      { name: "DeepSeek Official", input: 0.16, output: 0.64 },
      { name: "OpenRouter", input: 0.2, output: 0.8 },
    ],
    purchaseOptions: [
      {
        name: "8× H100 80GB",
        totalVram: "640GB",
        purchaseCost: 200000,
        usedCost: 120000,
        monthlyElectricity: 150,
        canRunModel: "Q4 at ~15-25 t/s",
        quality: "Very good",
      },
    ],
    rentalOptions: [
      { name: "RunPod 8× H100", costPerHr: 17.36, costPerDay24: 416.64, provider: "RunPod" },
    ],
  },
  {
    id: "kimi-k2",
    tier: "top",
    name: "Kimi K2",
    family: "Moonshot AI",
    type: "MoE",
    totalParams: "1T",
    activeParams: "Not disclosed",
    releaseDate: "Jul 2025",
    license: "MIT",
    context: "256K",
    architecture: "MoE with hybrid attention",
    closestApi: "Claude Opus 4.6",
    verdict: "IMPRACTICAL",
    verdictNote:
      "1T parameter MoE. Requires 247GB+ for Q2. ⚠️ Mac Studio can load at Q2 but runs at ~20 t/s — experimentation only. Production needs 8× H100.",
    benchmarks: {
      mmlu: 84.2,
      mmluPro: 79.5,
      swebench: 68.5,
      gpqa: 81.3,
      livecodebench: 65.2,
      arena: 1165,
    },
    apiProviders: [
      { name: "Moonshot Official", input: 0.12, output: 0.48 },
      { name: "OpenRouter", input: 0.16, output: 0.64 },
    ],
    purchaseOptions: [
      {
        name: "8× H100 80GB",
        totalVram: "640GB",
        purchaseCost: 200000,
        usedCost: 120000,
        monthlyElectricity: 150,
        canRunModel: "Q3-Q4 at ~15-25 t/s — 247GB minimum",
        quality: "Good at Q3+",
      },
    ],
    rentalOptions: [
      { name: "RunPod 8× H100", costPerHr: 17.36, costPerDay24: 416.64, provider: "RunPod" },
    ],
  },
  {
    id: "kimi-k2.5",
    tier: "top",
    name: "Kimi K2.5",
    family: "Moonshot AI",
    type: "MoE",
    totalParams: "1T",
    activeParams: "32B",
    releaseDate: "Feb 2026",
    license: "MIT",
    context: "256K",
    architecture: "MoE, Agent Swarm, vision-language",
    closestApi: "GPT-5.2",
    verdict: "IMPRACTICAL",
    verdictNote:
      "1T parameter MoE. Requires 240GB+ for Q2 quant. ⚠️ Mac Studio can load at Q1-Q2 but runs at ~20 t/s — experimentation only. Production needs 8× H100/H200.",
    benchmarks: {
      mmlu: 92.0,
      mmluPro: 87.1,
      swebench: 76.8,
      gpqa: 87.6,
      livecodebench: 85.0,
      aime: 96.1,
      ifeval: 94.0,
      arena: 1447,
    },
    apiProviders: [
      { name: "Moonshot Official", input: 0.35, output: 1.4 },
      { name: "OpenRouter", input: 0.42, output: 1.68 },
      { name: "Fireworks", input: 0.4, output: 1.6 },
    ],
    purchaseOptions: [
      {
        name: "8× H200 141GB",
        totalVram: "1.1TB",
        purchaseCost: 280000,
        usedCost: null,
        monthlyElectricity: 180,
        canRunModel: "FP8/Q4 at ~20-40 t/s",
        quality: "Full quality",
      },
      {
        name: "8× H100 80GB",
        totalVram: "640GB",
        purchaseCost: 200000,
        usedCost: 120000,
        monthlyElectricity: 150,
        canRunModel: "Q2-Q3 at ~15-30 t/s — 240GB minimum",
        quality: "Acceptable at Q2-Q3",
      },
    ],
    rentalOptions: [
      { name: "RunPod 8× H200", costPerHr: 25.0, costPerDay24: 600.0, provider: "RunPod" },
      { name: "RunPod 8× H100", costPerHr: 17.36, costPerDay24: 416.64, provider: "RunPod" },
    ],
  },
  {
    id: "glm-5",
    tier: "top",
    name: "GLM-5",
    family: "Zhipu AI",
    type: "MoE",
    totalParams: "744B",
    activeParams: "40B",
    releaseDate: "Feb 2026",
    license: "MIT",
    context: "256K",
    architecture: "Large-scale MoE, native agent, multimodal",
    closestApi: "Claude Opus 4.6",
    verdict: "IMPRACTICAL",
    verdictNote:
      "744B params, 40B active. Requires 176GB at Q2 or 805GB at Q8. ⚠️ Mac Studio can load at Q1-Q2 but runs at ~20 t/s — experimentation only. Production needs 8× H100/H200.",
    benchmarks: {
      mmlu: 85.0,
      mmluPro: 70.4,
      swebench: 77.8,
      gpqa: 86.0,
      livecodebench: 52.0,
      aime: 84.0,
      ifeval: 88.0,
      arena: 1451,
    },
    apiProviders: [
      { name: "Zhipu Official", input: 0.28, output: 1.12 },
      { name: "OpenRouter", input: 0.35, output: 1.4 },
    ],
    purchaseOptions: [
      {
        name: "8× H100 80GB",
        totalVram: "640GB",
        purchaseCost: 200000,
        usedCost: 120000,
        monthlyElectricity: 150,
        canRunModel: "Q2-Q3 at ~15-30 t/s — 241GB minimum",
        quality: "Acceptable at Q2-Q3",
      },
    ],
    rentalOptions: [
      { name: "RunPod 8× H100", costPerHr: 17.36, costPerDay24: 416.64, provider: "RunPod" },
    ],
  },
];

// ─────────────────────────────────────────────
// USAGE PROFILES
// ─────────────────────────────────────────────

export const USAGE_PROFILES = [
  {
    id: "light",
    label: "Light",
    description: "Occasional use — quick questions, short tasks",
    tokensPerDay: 50_000,
    hoursActivePerDay: 0.5,
    examples: ["Occasional Q&A", "Quick summarization", "Casual chat"],
  },
  {
    id: "moderate",
    label: "Moderate",
    description: "Daily driver — writing, some coding",
    tokensPerDay: 200_000,
    hoursActivePerDay: 1.5,
    examples: ["Daily writing assistant", "Light coding help", "Research"],
  },
  {
    id: "heavy",
    label: "Heavy",
    description: "Power user — coding all day, long contexts",
    tokensPerDay: 500_000,
    hoursActivePerDay: 4,
    examples: ["Full-day coding assistant", "Long document analysis", "Agentic workflows"],
  },
  {
    id: "team",
    label: "Small Team (5 people)",
    description: "5 moderate users sharing infrastructure",
    tokensPerDay: 1_000_000,
    hoursActivePerDay: 8,
    examples: ["Shared dev team assistant", "Internal tooling", "Small SaaS"],
  },
  {
    id: "product",
    label: "Product",
    description: "Customer-facing product with real traffic",
    tokensPerDay: 10_000_000,
    hoursActivePerDay: 16,
    examples: ["B2C chatbot", "Coding copilot", "API product"],
  },
];

// ─────────────────────────────────────────────
// COST CALCULATION HELPERS
// ─────────────────────────────────────────────

export function monthlyApiCost(tokensPerDay, pricing, inputRatio = 0.7) {
  const inputTokensPerDay = tokensPerDay * inputRatio;
  const outputTokensPerDay = tokensPerDay * (1 - inputRatio);
  const dailyCost =
    (inputTokensPerDay / 1_000_000) * pricing.input +
    (outputTokensPerDay / 1_000_000) * pricing.output;
  return dailyCost * 30;
}

export function monthlyRentalCost(hoursActivePerDay, costPerHr) {
  return hoursActivePerDay * costPerHr * 30;
}

export function paybackMonths(hardwareCost, monthlyElectricity, monthlyApiCostSaved) {
  const monthlySavings = monthlyApiCostSaved - monthlyElectricity;
  if (monthlySavings <= 0) return Infinity;
  return hardwareCost / monthlySavings;
}

export function compareOptions(modelId, usageProfileId, hardwareIndex = 0) {
  const model = MODELS.find((m) => m.id === modelId);
  const usage = USAGE_PROFILES.find((u) => u.id === usageProfileId);
  const tier = TIERS[model.tier];
  if (!model || !usage) return null;

  const cheapestProvider = model.apiProviders.find((p) => p.input && p.output);
  const cheapestRental = model.rentalOptions[0];
  const hardware = model.purchaseOptions[hardwareIndex];

  const closedApiMonthly = monthlyApiCost(usage.tokensPerDay, tier.closedApiCost);
  const openApiMonthly = monthlyApiCost(usage.tokensPerDay, cheapestProvider);
  const rentalMonthly = monthlyRentalCost(usage.hoursActivePerDay, cheapestRental.costPerHr);
  const ownedMonthly = hardware.monthlyElectricity;

  const paybackVsClosed = paybackMonths(
    hardware.usedCost || hardware.purchaseCost,
    ownedMonthly,
    closedApiMonthly,
  );
  const paybackVsOpen = paybackMonths(
    hardware.usedCost || hardware.purchaseCost,
    ownedMonthly,
    openApiMonthly,
  );

  return {
    model,
    usage,
    tier,
    costs: {
      closedApi: {
        label: tier.closedApiName,
        monthly: closedApiMonthly,
        daily: closedApiMonthly / 30,
      },
      openApi: {
        label: `${model.name} via ${cheapestProvider.name}`,
        monthly: openApiMonthly,
        daily: openApiMonthly / 30,
        provider: cheapestProvider.name,
      },
      rental: {
        label: `${model.name} — ${cheapestRental.name}`,
        monthly: rentalMonthly,
        daily: rentalMonthly / 30,
        note: `${usage.hoursActivePerDay}hr active/day @ $${cheapestRental.costPerHr}/hr`,
        caveat:
          "Rental only makes sense if your usage is predictable and sustained. Idle time is waste.",
      },
      owned: {
        label: hardware.name,
        upfront: hardware.purchaseCost,
        usedUpfront: hardware.usedCost,
        monthly: ownedMonthly,
        daily: ownedMonthly / 30,
        canRun: hardware.canRunModel,
        quality: hardware.quality,
        paybackVsClosed: paybackVsClosed === Infinity ? null : paybackVsClosed,
        paybackVsOpen: paybackVsOpen === Infinity ? null : paybackVsOpen,
      },
    },
    savings: {
      openVsClosed: closedApiMonthly - openApiMonthly,
      rentalVsClosed: closedApiMonthly - rentalMonthly,
      ownedVsClosed: closedApiMonthly - ownedMonthly,
    },
    verdict: getVerdict({
      openApiMonthly,
      rentalMonthly,
      ownedMonthly,
      hardware,
      paybackVsClosed,
      paybackVsOpen,
    }),
  };
}

function getVerdict({
  openApiMonthly,
  rentalMonthly,
  ownedMonthly,
  hardware,
  paybackVsClosed,
  paybackVsOpen,
}) {
  if (openApiMonthly < 10)
    return {
      recommendation: "api",
      reason:
        "Your usage is low — even the cheapest open API costs under $10/month. Not worth the ops overhead of any infrastructure.",
    };
  if (openApiMonthly < 30)
    return {
      recommendation: "api",
      reason: "Open API is the right call. Under $30/month is too low to justify hardware.",
    };
  if (paybackVsOpen !== null && paybackVsOpen < 18)
    return {
      recommendation: "buy_hardware",
      reason: `Hardware (${hardware.name}) pays back in ${paybackVsOpen.toFixed(0)} months vs the open API. Buy used.`,
    };
  if (paybackVsClosed !== null && paybackVsClosed < 24)
    return {
      recommendation: "buy_hardware",
      reason: `If you're currently paying ${hardware.name.closedApiName || "closed API"} rates, hardware pays back in ${paybackVsClosed.toFixed(0)} months.`,
    };
  return {
    recommendation: "api",
    reason: "Open API is still cheapest at your usage level — no infrastructure overhead.",
  };
}

export function buildCostTable(modelId) {
  const model = MODELS.find((m) => m.id === modelId);
  const tier = TIERS[model.tier];
  const cheapestOpen = model.apiProviders.find((p) => p.input && p.output);
  const cheapestRental = model.rentalOptions[0];
  const bestHardware = model.purchaseOptions[0];

  return USAGE_PROFILES.map((usage) => {
    const closedMonthly = monthlyApiCost(usage.tokensPerDay, tier.closedApiCost);
    const openMonthly = monthlyApiCost(usage.tokensPerDay, cheapestOpen);
    const rentalMonthly = monthlyRentalCost(usage.hoursActivePerDay, cheapestRental.costPerHr);
    const ownedMonthly = bestHardware.monthlyElectricity;
    const payback = paybackMonths(
      bestHardware.usedCost || bestHardware.purchaseCost,
      ownedMonthly,
      closedMonthly,
    );

    const costs = { closedMonthly, openMonthly, rentalMonthly, ownedMonthly };
    const winner = Object.entries(costs).reduce((a, b) => (a[1] < b[1] ? a : b))[0];

    return {
      usageLabel: usage.label,
      tokensPerDay: usage.tokensPerDay,
      closedApiMonthly: closedMonthly,
      openApiMonthly: openMonthly,
      rentalMonthly: rentalMonthly,
      ownedMonthly: ownedMonthly,
      savingsOpenVsClosed: closedMonthly - openMonthly,
      paybackMonthsUsed: payback === Infinity ? null : payback,
      winner,
      cheapestHardware: bestHardware.name,
      cheapestHardwareCost: bestHardware.usedCost || bestHardware.purchaseCost,
    };
  });
}

// ─────────────────────────────────────────────
// THESIS POINTS
// ─────────────────────────────────────────────

export const THESIS_POINTS = [
  {
    id: "commodity",
    title: "Models are becoming commodities",
    body: 'Qwen3.5 122B matches Claude Sonnet 4.6 on most benchmarks at $0.20/M input tokens — 15x cheaper. The gap between "frontier" and "open" is closing every 3 months.',
  },
  {
    id: "tax",
    title: "Token APIs are a tax on intelligence",
    body: "Every token you send to Anthropic, OpenAI, or Google is a rent payment on weights you could be running yourself. At scale, this is a 90%+ margin business disguised as infrastructure.",
  },
  {
    id: "local",
    title: "Local is the endgame",
    body: "Qwen3.5 27B fits on a single RTX 4090 (17GB VRAM at Q4). For high-traffic workloads, local wins.",
  },
  {
    id: "race",
    title: "The race to zero is real",
    body: 'LLM API prices dropped ~80% from 2025 to 2026. The gap between "cheap" and "premium" is now 1,000x. Commodity inference is here.',
  },
];
