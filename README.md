# Eisenhower Matrix — FigJam Widget

A collaborative Eisenhower Matrix widget for FigJam. Let your team vote on how urgent and important a topic is, then reveal results together.

[**Get it on Figma Community**](https://www.figma.com/community/widget/1613562891307840777/eisenhower-matrix)

## Features

- **Collaborative voting** — Each participant clicks on the matrix to place their vote. Votes stay hidden until revealed.
- **Reveal & average** — Toggle vote visibility to see where everyone landed. The widget computes the group average and shows the resulting action (Do, Schedule, Delegate, or Eliminate).
- **Export result image** — Generate a clean summary frame with all votes, the average marker, and the result label — ready to screenshot or share.
- **Multi-language** — Available in 6 languages: English, French, Spanish, German, Japanese, Portuguese. Selectable via the property menu.
- **Custom topic** — Set a topic name directly on the widget to give context to the vote.

## Getting started

### Install dependencies

```bash
npm install
```

### Build

```bash
npm run build
```

### Development (watch mode)

```bash
npm run watch
```

### Type checking

```bash
npm run typecheck
```

## Usage in FigJam

1. Add the widget to your FigJam board
2. Set a topic (optional)
3. Each participant clicks on the matrix to place their vote
4. Select the widget and use the property menu to:
   - **Reveal votes** — show all votes and the average result
   - **Generate result image** — create a shareable summary frame
   - **Reset votes** — clear all votes
   - **Language** — switch between EN, FR, ES, DE, JA, PT

## Project structure

```
├── manifest.json          # Figma widget manifest
├── package.json
├── tsconfig.json
├── widget-src/
│   └── code.tsx           # Widget source code
└── dist/
    └── code.js            # Built output
```

## How it works

The matrix is a 12x12 grid with four color-coded quadrants:

|                | Not Urgent (left) | Urgent (right) |
|----------------|-------------------|----------------|
| **Important** (top)     | Schedule (blue)   | Do (red)       |
| **Not Important** (bottom) | Eliminate (green) | Delegate (yellow) |

Each cell is clickable. Votes are stored per user session using Figma's `useSyncedMap`. When votes are revealed, each voter appears as a colored dot with their initials (or avatar). The average position determines the collective result.

## License

MIT
