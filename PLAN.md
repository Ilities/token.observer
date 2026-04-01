# Plan: Add GLM 5.1 Model to Comparison

## Summary of the Problem

The token.observer application displays open-weight LLM models for cost comparison, but is missing the new GLM 5.1 model from Zhipu AI (released March 27, 2026). GLM 5.1 is an improved version of GLM-5 with better coding performance.

## Proposed Solution

Add GLM 5.1 model to the data files so it appears in the Compare page. Based on web search, GLM 5.1:
- Released: March 2026
- Type: MoE (similar architecture to GLM-5)
- Improvements: Better coding capabilities than GLM-5
- Should be in "top" tier (similar to GLM-5)
- API pricing available from Zhipu Official and OpenRouter

## Implementation Steps

1. **Add GLM 5.1 to `src/data/models.json`** in the MODELS array
   - Add as new entry with id: `glm-5.1`
   - Place after GLM-5 entry (around line 1875)
   - Use "top" tier since it's a flagship model
   - Include API providers: Zhipu Official, OpenRouter, DeepInfra, Fireworks, Groq, Together AI, etc.

2. **Add GLM 5.1 to `src/data/hardware.json`** 
   - Add entry to MODEL_VRAM_MAP
   - Include in recommendedModels arrays for 4× H100 and enterprise tiers

3. **Add GLM 5.1 to `src/data/history.json`**
   - Add historical entry with benchmarks

4. **Verify the changes**
   - Run `vp check` to validate code
   - Ensure model appears in Compare page dropdown

## Files to Modify

1. `src/data/models.json` - Add GLM 5.1 model entry
2. `src/data/hardware.json` - Add to MODEL_VRAM_MAP and recommendedModels
3. `src/data/history.json` - Add historical entry with benchmarks

## Testing Strategy

- Run `vp check` and `vp test` to validate the changes
- Verify GLM 5.1 appears in the Compare page model selector
- Verify API providers and pricing data is correct
- Check that self-host options are appropriate for the model size

## Risks and Mitigations

- **API Pricing Accuracy**: Use similar pricing to GLM-5 as baseline, can be updated via automated price fetching
- **Benchmarks**: Use available public benchmarks; some fields may be estimates
- **Hardware Requirements**: GLM 5.1 should require similar specs to GLM-5 (8× H100)
