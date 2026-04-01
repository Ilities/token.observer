# Planning Document - Sort Models Alphabetically

## Summary of the Problem
Models displayed on the website (Home page, Models page, Compare page) are shown in the order they appear in the JSON data file, not sorted alphabetically. Users expect models to be sorted alphabetically by name for easier navigation and comparison.

## Proposed Solution
Create a sorted version of the MODELS array (`SORTED_MODELS`) in the data layer and use it in all display components. This approach:
- Keeps the original MODELS array intact for any logic that depends on specific ordering
- Provides a consistently sorted array for UI display
- Is a minimal, focused change

## Implementation Steps
1. Add `SORTED_MODELS` export in `src/data/models.js` - alphabetically sorted by model name
2. Update `src/pages/Home.jsx` to import and use `SORTED_MODELS` instead of `MODELS`
3. Update `src/pages/Models.jsx` to import and use `SORTED_MODELS` instead of `MODELS`
4. Update `src/pages/Compare.jsx` to import and use `SORTED_MODELS` instead of `MODELS`

## Files to Modify
1. `src/data/models.js` - Add SORTED_MODELS export
2. `src/pages/Home.jsx` - Use SORTED_MODELS for model cards
3. `src/pages/Models.jsx` - Use SORTED_MODELS for list view and benchmarks
4. `src/pages/Compare.jsx` - Use SORTED_MODELS for model selector

## Testing Strategy
- Verify the build compiles successfully
- Manually check that models appear in alphabetical order on:
  - Home page (model cards section)
  - Models page (list view and benchmarks tab)
  - Compare page (model selector buttons)

## Risks and Mitigations
- **Risk**: Breaking existing functionality that relies on MODELS order
  - **Mitigation**: Original MODELS array is preserved, only display components use SORTED_MODELS
- **Risk**: Missing some components that display models
  - **Mitigation**: Searched for all MODELS.map usages and updated them
