# Contributing

## Setup

```bash
npm install
```

## Development

```bash
npm run watch    # Rebuild on file changes
npm run build    # One-time build
npm run typecheck  # TypeScript check (no emit)
```

Load the widget in Figma:
1. Open a FigJam or Figma Design file
2. Menu > Widgets > Development > Import widget from manifest
3. Select `manifest.json`

## Adding a new language

1. Add the locale code to the `Lang` type union
2. Add a full translation object to `TRANSLATIONS` (copy `en` as a template)
3. Add an entry to `LANG_OPTIONS`
4. Build and test

The `TranslationKey` type will ensure all keys are present at compile time.

## Adding a new translation key

1. Add the key + value to `TRANSLATIONS.en`
2. Add the key + value to all other language objects
3. Use it via `t(lang, "yourNewKey")`

If you miss a language, TypeScript won't catch it (the Record allows extra keys), but the `t()` function will fall back to the English value.

## Modifying the export image

The `generateResultImage()` function uses the Figma Plugin API (not widget JSX) to create nodes. It's imperative code — `figma.createText()`, `figma.createEllipse()`, etc.

Key constraints:
- Must use `figma.getNodeByIdAsync()` (not sync `getNodeById`) due to `documentAccess: "dynamic-page"`
- Fonts must be loaded via `figma.loadFontAsync()` before creating text nodes
- `Math.random()` is forbidden in widget render functions

## Modifying the grid

The grid is `GRID_COLS x GRID_ROWS` (default 12x12). Changing these constants will automatically update:
- Cell color pre-computation
- Quadrant boundary detection
- Export image layout
