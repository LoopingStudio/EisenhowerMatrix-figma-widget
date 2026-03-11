# Architecture

Single-file Figma widget (`widget-src/code.tsx`) built with the Figma Widget API.

## File structure

```
widget-src/code.tsx    # All widget logic (i18n, helpers, render, export)
manifest.json          # Figma widget manifest
dist/code.js           # Built output (esbuild)
```

## Code organization (top to bottom)

| Section | Description |
|---------|-------------|
| **Types** | `VotePosition` interface |
| **i18n** | `Lang` type, `TRANSLATIONS` object, `TranslationKey` type, `t()` helper |
| **Icons** | SVG strings for the property menu |
| **Constants** | Grid dimensions, colors, pre-computed cell colors |
| **Helpers** | Pure functions: color interpolation, initials, quadrant logic, vote averaging |
| **Main Widget** | `EisenhowerMatrix()` — state, property menu, vote handler, image export, grid render, layout |

## Key design decisions

### Pre-computed cell colors
Cell colors are computed once at module scope into a `CELL_COLORS[row][col]` lookup table. The grid is 12x12 with constant quadrant colors, so there's no reason to recompute on every render.

### Vote-by-cell map
When votes are visible, a `Map<"col:row", CellVote[]>` is built once from all votes. Each cell does an O(1) lookup instead of scanning all votes (was O(V * 144)).

### Shared helpers for duplicated logic
- `getQuadrantKey(avgCol, avgRow)` — single source of truth for mapping average position to quadrant
- `computeVoteAverages(votes)` — used by both the widget render and the export
- `formatVoteCount(count, lang)` — used by both the status bar and the export subtitle

### i18n
Type-safe translation keys via `TranslationKey = keyof typeof TRANSLATIONS.en`. Adding a new key to `en` will cause a type error if missing from other languages. The `t()` function falls back to English, then to the raw key.

### Image export
`generateResultImage()` creates a Figma frame with Figma API nodes (rectangles, ellipses, text). Avatars are pre-fetched in parallel via `Promise.all` before the dot rendering loop. Fonts are also loaded concurrently.

## State

All state is synced across collaborators via Figma's widget API:

| State | Type | Description |
|-------|------|-------------|
| `votes` | `SyncedMap<VotePosition>` | Keyed by session ID |
| `showVotes` | `boolean` | Whether votes are visible |
| `topic` | `string` | The topic being evaluated |
| `lang` | `Lang` | Widget language |
