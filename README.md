# @wxx9248/colors

[![npm](https://img.shields.io/npm/v/@wxx9248/colors)](https://www.npmjs.com/package/@wxx9248/colors)

The color system shared across wxx9248's sites. It has two layers:

- **Palette** (`--palette-*`): 10-step scales from 50 (lightest) to 900 (darkest). Color scales hold the values. Each is generated in OKLCH at one hue on a shared lightness ladder, so a step looks equally light across hues, and some steps are pinned to exact colors. Role scales bind a purpose to a color scale.
- **Semantic tokens** (`--color-*`): what a color is for (page background, body text, links, borders, focus, feedback), with a palette step for the light theme and one for the dark theme.

Sites use the semantic tokens, so a palette change reaches all of them.

## Install

```sh
pnpm add @wxx9248/colors
```

## Use in CSS

```css
@import "@wxx9248/colors/index.css";

body {
  background: var(--color-bg-page);
  color: var(--color-text-primary);
}

a {
  color: var(--color-link);
}
```

`index.css` imports `palette.css` and `semantic.css`; import either one alone if you need only that layer.

### Light and dark

Every semantic token is `light-dark(<light step>, <dark step>)`, so the browser picks a side from `color-scheme`. The package sets `color-scheme: light dark` on `:root`, which follows the reader's system setting. To pin a theme, set `color-scheme` yourself after the import:

```css
/* A dark-only site */
:root {
  color-scheme: dark;
}

/* A theme toggle that sets data-theme on <html> */
:root[data-theme="light"] {
  color-scheme: light;
}
:root[data-theme="dark"] {
  color-scheme: dark;
}
```

### Site-specific tokens

Add your own tokens on top of the palette:

```css
:root {
  --color-text-quote: light-dark(
    var(--palette-secondary-800),
    var(--palette-secondary-200)
  );
}
```

Overriding a `--palette-*` step changes every token bound to it. Role steps follow their color steps: overriding `--palette-azure-400` also changes `--palette-primary-400`, but not the other way round.

## Use in JavaScript

For code that needs raw values, such as a terminal theme or a canvas:

```ts
import { palette, resolve, semanticTokens } from "@wxx9248/colors";

resolve("azure.400"); // "#33b5e5"
resolve("primary.400"); // "#33b5e5"
palette.scales.gray[900]; // "#141418"
semanticTokens["bg-page"]; // { light: "gray.50", dark: "gray.900", … }
resolve(semanticTokens["bg-page"].dark); // "#141418"
resolve(semanticTokens["terminal-red"].dark); // "#f34643"
```

`@wxx9248/colors/tokens.json` has every palette color and semantic token as hex.

## The palette

### Color scales

| Scale  | Hue                 | Pinned steps                               |
| ------ | ------------------- | ------------------------------------------ |
| azure  | water blue          | `#33b5e5` at 400                           |
| cyan   | cyan                | `#9be9f2` at 200                           |
| yellow | yellow              | `#ffe57a` at 100, `#f7d02c` at 200         |
| gray   | cool neutral (286°) | `#f6f6f8` 50, `#8d8d96` 500, `#141418` 900 |
| green  | green               | `#7bd88f` at 300                           |
| amber  | amber               |                                            |
| red    | red                 | `#e3242b` at 600                           |
| blue   | blue                | `#a3c6ff` 300, `#6fa8ff` 400               |
| purple | purple              | `#e8adff` 300, `#d77bff` 400               |

A pinned step keeps an exact color in place of the generated one. `gray` is used directly for backgrounds, text and borders. `purple` has no role and is used sparingly.

### Role scales

| Scale     | Bound to | Used for                     |
| --------- | -------- | ---------------------------- |
| primary   | azure    | links, actions, focus        |
| secondary | cyan     | headings, secondary emphasis |
| tertiary  | yellow   | highlights, used sparingly   |
| success   | green    | success                      |
| warning   | amber    | warnings                     |
| error     | red      | errors, destructive actions  |
| info      | blue     | information, inline code     |

To change a role's color, edit its line in `roleBindings` in `src/types.ts`.

The palette also has `--palette-white` and `--palette-black`.

## Semantic tokens

| Group       | Tokens                                                                                                                                                                     |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Background  | `bg-page`, `bg-surface`, `bg-raised`, `bg-sunken`                                                                                                                          |
| Text        | `text-primary`, `text-secondary`, `text-muted`, `text-placeholder`, `text-disabled`, `text-on-primary`, `text-heading`, `text-code`, `text-highlight`, `text-error`        |
| Accent      | `accent`                                                                                                                                                                   |
| Link        | `link`, `link-hover`, `link-visited`                                                                                                                                       |
| Border      | `border-subtle`, `border-default`, `border-input`                                                                                                                          |
| Action      | `action-primary`, `action-primary-hover`, `action-primary-pressed`                                                                                                         |
| Interaction | `focus-ring`, `selection-bg`, `hover-bg`                                                                                                                                   |
| Feedback    | `success-*`, `warning-*`, `error-*`, `info-*`, each with `-bg`, `-border`, `-text` and `-solid`                                                                            |
| Terminal    | `terminal-bg`, `terminal-fg`, `terminal-cursor`, `terminal-cursor-text`, `terminal-selection-bg`, and `terminal-<color>` and `terminal-bright-<color>` for the ANSI colors |

Each is a `--color-<token>` property. In both themes, the tests check that text reaches 4.5:1 contrast (WCAG AA), and that input borders, focus rings and status fills reach 3:1. Terminal text counts too, except `terminal-black` in the dark theme and `terminal-white` and `terminal-bright-white` in the light theme, which match the background by design.

Tokens with a role bind to a role scale, and tokens that name a color bind to a color scale. `accent` uses `primary` and `terminal-red` uses `red`, so rebinding `error` leaves the terminal alone.

## Development

```sh
pnpm install
pnpm test       # unit tests, including every contrast requirement
pnpm build      # lint, type check, compile and write dist/
pnpm preview    # write preview/index.html, a page showing every color
```

`src/` holds only what the published package runs; `scripts/` holds what runs at build time.

Scripts and tests import from the project root with `#/`, as in `#/src/semantic.ts` (set up by `imports` in `package.json`), and use `./` only within a folder. ESLint rejects `../` there. Files in `src/` use relative imports, because the compiler rewrites only those from `.ts` to `.js` in the published output.

| File                               | Role                                                                 |
| ---------------------------------- | -------------------------------------------------------------------- |
| `src/index.ts`                     | Public API                                                           |
| `src/palette.ts`                   | `palette` and `resolve()`                                            |
| `src/semantic.ts`                  | Layer 2: each semantic token's palette step per theme                |
| `src/types.ts`                     | Step and scale names, role bindings, color reference types           |
| `src/generated/scales.ts`          | The hex scales, written by `pnpm generate` (git-ignored)             |
| `scripts/scales/specs.ts`          | Layer 1 definition: hues, chroma, lightness ladder, pinned colors    |
| `scripts/scales/generator.ts`      | Turns the specs into hex colors with [Color.js](https://colorjs.io)  |
| `scripts/scales/generate.ts`       | Writes `src/generated/scales.ts`                                     |
| `scripts/build/render.ts`          | Renders the palette and semantic tokens as CSS and JSON              |
| `scripts/build/build.ts`           | Writes the CSS and JSON into `dist/`                                 |
| `scripts/build/clean.ts`           | Deletes `dist/` before a build                                       |
| `scripts/preview/page.ts`          | Renders the preview page, styled by `page.css`                       |
| `scripts/preview/preview.ts`       | Writes `preview/index.html`                                          |
| `scripts/contrast-requirements.ts` | The contrast every semantic pairing must reach, checked by the tests |
| `scripts/project.ts`               | Project paths and package facts shared by the scripts                |

The generator maps out-of-range colors into sRGB with the CSS Color 4 gamut mapping algorithm. `test`, `typecheck`, `build` and `preview` run `pnpm generate` first, so you don't need to run it yourself. The published package has no runtime dependencies; Color.js is only a development dependency.

## License

AGPL-3.0-only
