// Frontier timeline data for comparing open-weight models against historical frontier models
// Sources: Artificial Analysis Intelligence Index, Vellum, LMSys
// Last updated: March 2026

// Hardware categories - SAME as hardware.json for consistency
export const HARDWARE_CATEGORIES = [
  {
    id: "laptop",
    name: "Laptop",
    icon: "💻",
    description: "Thin-and-light, mainstream laptops with integrated or entry discrete GPU",
    maxVram: 16, // GB shared (MacBook Pro M3 Pro 36GB)
    color: "#60a5fa", // blue
    yPosition: 1,
  },
  {
    id: "gaming-rig",
    name: "Gaming Rig",
    icon: "🎮",
    description: "Mid-range desktop gaming PCs with single consumer GPU",
    maxVram: 24, // GB (RTX 4090 used)
    color: "#a78bfa", // purple
    yPosition: 2,
  },
  {
    id: "top-end-gaming",
    name: "Top-End Gaming Rig",
    icon: "🖥️",
    description: "Enthusiast gaming PCs with flagship consumer GPUs",
    maxVram: 64, // GB (2× RTX 5090 or 2× RTX 3090 NVLink)
    color: "#c084fc", // darker purple
    yPosition: 3,
  },
  {
    id: "unified-memory",
    name: "Unified Memory Boxes",
    icon: "🍎",
    description: "Apple Silicon and AMD Strix Halo with unified memory architecture",
    maxVram: 512, // GB (Mac Studio M3 Ultra 512GB)
    color: "#f472b6", // pink
    yPosition: 4,
  },
  {
    id: "inference-cards",
    name: "Inference Cards",
    icon: "🃏",
    description: "Single datacenter inference GPUs for professional deployment",
    maxVram: 141, // GB (H200)
    color: "#fb923c", // orange
    yPosition: 5,
  },
  {
    id: "smb-inference",
    name: "SMB Inference Servers",
    icon: "🏢",
    description: "Small/medium business deployment - multi-GPU workstations and servers",
    maxVram: 640, // GB (8× H100 80GB or 8× RTX 5090)
    color: "#f87171", // red
    yPosition: 6,
  },
  {
    id: "enterprise-inference",
    name: "Enterprise Inference Servers",
    icon: "🏭",
    description: "Large-scale enterprise deployment - HGX systems and multi-rack",
    maxVram: 1128, // GB (8× H200 141GB)
    color: "#ef4444", // darker red
    yPosition: 7,
  },
  {
    id: "datacenter",
    name: "A Fucking Datacenter",
    icon: "🔥",
    description: "Hyperscale deployment - you are the infrastructure",
    maxVram: 13000, // GB (GB200 NVL72 rack-scale)
    color: "#dc2626", // deepest red
    yPosition: 8,
  },
];

// Historical frontier models with their intelligence scores and dates
export const FRONTIER_TIMELINE = [
  // 2023
  {
    id: "gpt-3.5-turbo",
    name: "GPT-3.5 Turbo",
    family: "OpenAI",
    date: "2023-03",
    intelligenceScore: 45,
    type: "closed",
    note: "ChatGPT launch",
  },
  {
    id: "gpt-4",
    name: "GPT-4",
    family: "OpenAI",
    date: "2023-06",
    intelligenceScore: 68,
    type: "closed",
    note: "Multimodal GPT-4V",
  },
  {
    id: "claude-2",
    name: "Claude 2",
    family: "Anthropic",
    date: "2023-07",
    intelligenceScore: 58,
    type: "closed",
  },
  {
    id: "llama-2-70b",
    name: "Llama 2 70B",
    family: "Meta",
    date: "2023-07",
    intelligenceScore: 52,
    type: "open",
    note: "First viable open model",
  },
  {
    id: "claude-3-opus",
    name: "Claude 3 Opus",
    family: "Anthropic",
    date: "2024-03",
    intelligenceScore: 78,
    type: "closed",
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    family: "OpenAI",
    date: "2024-05",
    intelligenceScore: 80,
    type: "closed",
  },
  {
    id: "llama-3-70b",
    name: "Llama 3 70B",
    family: "Meta",
    date: "2024-04",
    intelligenceScore: 72,
    type: "open",
    note: "Matches GPT-3.5 Turbo",
  },
  {
    id: "claude-3.5-sonnet",
    name: "Claude 3.5 Sonnet",
    family: "Anthropic",
    date: "2024-06",
    intelligenceScore: 85,
    type: "closed",
  },
  {
    id: "llama-3.1-405b",
    name: "Llama 3.1 405B",
    family: "Meta",
    date: "2024-07",
    intelligenceScore: 82,
    type: "open",
    note: "First open 400B+ model",
  },
  {
    id: "gemini-1.5-pro",
    name: "Gemini 1.5 Pro",
    family: "Google",
    date: "2024-09",
    intelligenceScore: 84,
    type: "closed",
  },
  {
    id: "claude-3.5-sonnet-oct",
    name: "Claude 3.5 Sonnet (Oct)",
    family: "Anthropic",
    date: "2024-10",
    intelligenceScore: 87,
    type: "closed",
  },
  {
    id: "grok-2",
    name: "Grok-2",
    family: "xAI",
    date: "2024-08",
    intelligenceScore: 83,
    type: "closed",
  },
  {
    id: "qwen-2.5-72b",
    name: "Qwen 2.5 72B",
    family: "Alibaba",
    date: "2024-09",
    intelligenceScore: 78,
    type: "open",
  },
  {
    id: "deepseek-v3",
    name: "DeepSeek V3",
    family: "DeepSeek",
    date: "2024-12",
    intelligenceScore: 88,
    type: "open",
    note: "Matches Claude 3.5 Sonnet",
  },
  {
    id: "claude-3.7-sonnet",
    name: "Claude 3.7 Sonnet",
    family: "Anthropic",
    date: "2025-02",
    intelligenceScore: 90,
    type: "closed",
  },
  {
    id: "gpt-4.5",
    name: "GPT-4.5",
    family: "OpenAI",
    date: "2025-02",
    intelligenceScore: 89,
    type: "closed",
  },
  {
    id: "gemini-2.5-pro",
    name: "Gemini 2.5 Pro",
    family: "Google",
    date: "2025-03",
    intelligenceScore: 91,
    type: "closed",
  },
  {
    id: "qwen-3-235b",
    name: "Qwen3 235B",
    family: "Alibaba",
    date: "2025-04",
    intelligenceScore: 89,
    type: "open",
    note: "Matches GPT-4.5",
  },
  {
    id: "claude-4-opus",
    name: "Claude 4 Opus",
    family: "Anthropic",
    date: "2025-05",
    intelligenceScore: 93,
    type: "closed",
  },
  {
    id: "gpt-5",
    name: "GPT-5",
    family: "OpenAI",
    date: "2025-07",
    intelligenceScore: 95,
    type: "closed",
  },
  {
    id: "deepseek-v3.2",
    name: "DeepSeek V3.2",
    family: "DeepSeek",
    date: "2025-08",
    intelligenceScore: 92,
    type: "open",
    note: "Matches GPT-5 on coding",
  },
  {
    id: "gemini-2.5-ultra",
    name: "Gemini 2.5 Ultra",
    family: "Google",
    date: "2025-09",
    intelligenceScore: 96,
    type: "closed",
  },
  {
    id: "kimi-k2.5",
    name: "Kimi K2.5",
    family: "Moonshot",
    date: "2025-10",
    intelligenceScore: 94,
    type: "open",
    note: "1T parameter MoE",
  },
  {
    id: "claude-4.5-opus",
    name: "Claude 4.5 Opus",
    family: "Anthropic",
    date: "2025-11",
    intelligenceScore: 97,
    type: "closed",
  },
  {
    id: "qwen-3.5-397b",
    name: "Qwen3.5 397B",
    family: "Alibaba",
    date: "2025-11",
    intelligenceScore: 95,
    type: "open",
    note: "Matches Claude 4 Opus",
  },
  {
    id: "gpt-5.2",
    name: "GPT-5.2",
    family: "OpenAI",
    date: "2025-12",
    intelligenceScore: 98,
    type: "closed",
  },
  // 2026
  {
    id: "claude-5-sonnet",
    name: "Claude 5 Sonnet",
    family: "Anthropic",
    date: "2026-01",
    intelligenceScore: 99,
    type: "closed",
  },
  {
    id: "qwen-3.5-235b-a22b",
    name: "Qwen3.5 235B-A22B",
    family: "Alibaba",
    date: "2026-02",
    intelligenceScore: 96,
    type: "open",
    note: "Best open model for workstation",
  },
  {
    id: "deepseek-r2",
    name: "DeepSeek R2",
    family: "DeepSeek",
    date: "2026-02",
    intelligenceScore: 97,
    type: "open",
    note: "Reasoning specialist",
  },
  {
    id: "gemini-3-pro",
    name: "Gemini 3 Pro",
    family: "Google",
    date: "2026-03",
    intelligenceScore: 100,
    type: "closed",
  },
];

// Open weight models mapped to hardware categories with frontier equivalence
// Using the SAME hardware category IDs as hardware.json
export const OPEN_MODEL_CROSSOVERS = [
  {
    modelId: "qwen35-9b",
    modelName: "Qwen3.5 9B",
    hardwareCategory: "laptop",
    frontierEquivalent: "gpt-3.5-turbo",
    frontierDate: "2023-03",
    frontierScore: 45,
    modelScore: 82.5,
    note: "Now you can run GPT-3.5-level AI on a laptop",
  },
  {
    modelId: "qwen35-27b",
    modelName: "Qwen3.5 27B",
    hardwareCategory: "gaming-rig",
    frontierEquivalent: "claude-2",
    frontierDate: "2023-07",
    frontierScore: 58,
    modelScore: 85.3,
    note: "RTX 4090 gives you better-than-Claude-2 performance",
  },
  {
    modelId: "qwen35-35b",
    modelName: "Qwen3.5 35B-A3B",
    hardwareCategory: "gaming-rig",
    frontierEquivalent: "llama-3-70b",
    frontierDate: "2024-04",
    frontierScore: 72,
    modelScore: 85.8,
    note: "Gaming rig now matches mid-2024 frontier",
  },
  {
    modelId: "gpt-oss-20b",
    modelName: "GPT-OSS 20B",
    hardwareCategory: "gaming-rig",
    frontierEquivalent: "gpt-4o",
    frontierDate: "2024-05",
    frontierScore: 80,
    modelScore: 78,
    note: "Open weights match early-2024 frontier on gaming GPU",
  },
  {
    modelId: "qwen35-122b",
    modelName: "Qwen3.5 122B-A10B",
    hardwareCategory: "top-end-gaming",
    frontierEquivalent: "claude-3.5-sonnet",
    frontierDate: "2024-06",
    frontierScore: 85,
    modelScore: 86.1,
    note: "Dual 3090 or RTX 5090 matches Claude 3.5 Sonnet",
  },
  {
    modelId: "gpt-oss-120b",
    modelName: "GPT-OSS 120B",
    hardwareCategory: "unified-memory",
    frontierEquivalent: "claude-3.5-sonnet-oct",
    frontierDate: "2024-10",
    frontierScore: 87,
    modelScore: 85,
    note: "Mac Studio runs near-frontier from late 2024",
  },
  {
    modelId: "qwen35-235b",
    modelName: "Qwen3.5 235B-A22B",
    hardwareCategory: "unified-memory",
    frontierEquivalent: "gpt-5",
    frontierDate: "2025-07",
    frontierScore: 95,
    modelScore: 96,
    note: "Mac Studio M3 Ultra matches GPT-5 from summer 2025",
  },
  {
    modelId: "qwen35-122b",
    modelName: "Qwen3.5 122B-A10B",
    hardwareCategory: "inference-cards",
    frontierEquivalent: "claude-3.5-sonnet",
    frontierDate: "2024-06",
    frontierScore: 85,
    modelScore: 86.1,
    note: "Single H100 matches Claude 3.5 Sonnet from mid-2024",
  },
  {
    modelId: "glm-4.7",
    modelName: "GLM-4.7",
    hardwareCategory: "smb-inference",
    frontierEquivalent: "claude-3.7-sonnet",
    frontierDate: "2025-02",
    frontierScore: 90,
    modelScore: 90.1,
    note: "4× H100 cluster matches early-2025 frontier",
  },
  {
    modelId: "deepseek-v3.2",
    modelName: "DeepSeek V3.2",
    hardwareCategory: "smb-inference",
    frontierEquivalent: "gemini-2.5-ultra",
    frontierDate: "2025-09",
    frontierScore: 96,
    modelScore: 92,
    note: "8× H100 runs near-frontier quality locally",
  },
  {
    modelId: "kimi-k2.5",
    modelName: "Kimi K2.5",
    hardwareCategory: "enterprise-inference",
    frontierEquivalent: "claude-4.5-opus",
    frontierDate: "2025-11",
    frontierScore: 97,
    modelScore: 92,
    note: "8× H200 runs 1T parameter model rivaling late-2025 frontier",
  },
  {
    modelId: "qwen35-397b",
    modelName: "Qwen3.5 397B",
    hardwareCategory: "enterprise-inference",
    frontierEquivalent: "claude-4-opus",
    frontierDate: "2025-05",
    frontierScore: 93,
    modelScore: 95,
    note: "8× H100 cluster matches mid-2025 frontier",
  },
  {
    modelId: "deepseek-r1",
    modelName: "DeepSeek R1",
    hardwareCategory: "datacenter",
    frontierEquivalent: "o3 Pro",
    frontierDate: "2025-01",
    frontierScore: 94,
    modelScore: 90.8,
    note: "Rack-scale deployment for reasoning specialist",
  },
];

// Helper function to get frontier model by ID
export function getFrontierModel(id) {
  return FRONTIER_TIMELINE.find((m) => m.id === id);
}

// Helper to get open model crossover by model ID
export function getOpenModelCrossover(modelId) {
  return OPEN_MODEL_CROSSOVERS.find((c) => c.modelId === modelId);
}

// Get all crossovers for a hardware category
export function getCrossoversForCategory(categoryId) {
  return OPEN_MODEL_CROSSOVERS.filter((c) => c.hardwareCategory === categoryId);
}

// Calculate months between frontier date and current date
export function monthsBehind(frontierDate, currentDate = "2026-03") {
  const [fYear, fMonth] = frontierDate.split("-").map(Number);
  const [cYear, cMonth] = currentDate.split("-").map(Number);
  return (cYear - fYear) * 12 + (cMonth - fMonth);
}

// Get timeline data for chart
export function getTimelineData() {
  return FRONTIER_TIMELINE.map((model) => ({
    ...model,
    monthsBehind: monthsBehind(model.date),
    isFrontier: model.type === "closed" && model.intelligenceScore >= 90,
  }));
}

// Get the "climb" data - showing how open models progressed through hardware categories
export function getClimbData() {
  const climb = [];
  const categories = HARDWARE_CATEGORIES.sort((a, b) => a.yPosition - b.yPosition);

  categories.forEach((category) => {
    const crossovers = getCrossoversForCategory(category.id);
    crossovers.forEach((crossover) => {
      const frontierModel = getFrontierModel(crossover.frontierEquivalent);
      if (frontierModel) {
        climb.push({
          ...crossover,
          category,
          frontierModel,
          monthsBehind: monthsBehind(crossover.frontierDate),
        });
      }
    });
  });

  return climb.sort((a, b) => a.monthsBehind - b.monthsBehind);
}
