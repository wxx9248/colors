# @wxx9248/colors

- **Palette** (`--palette-*`): 10-step scales from 50 (lightest) to 900 (darkest). Color scales say what a color looks like: each is generated in OKLCH at one hue on a shared lightness ladder, so the same step looks equally light across hues, and www.wxx9248.top's original colors are kept exactly on their nearest step. Role scales say what a color is for, and each is bound to a color scale.
- **Semantic tokens** (`--color-*`): what a color is for (page background, body text, links, borders, focus, feedback), with a palette step for the light theme and one for the dark theme.

Sites use the semantic tokens. A change to the palette then follows everywhere.

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

Add bindings for your own elements on top, from the palette:

```css
:root {
  --color-text-quote: light-dark(
    var(--palette-secondary-800),
    var(--palette-secondary-200)
  );
}
```

Overriding a `--palette-*` step retunes every token bound to it. A role step follows its color step, so overriding `--palette-azure-400` also moves `--palette-primary-400`, but overriding `--palette-primary-400` leaves `azure` and the tokens bound to it alone.

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

`@wxx9248/colors/tokens.json` has every palette color and semantic token already resolved to hex, as plain JSON.

## The palette

### Color scales

| Scale  | Hue                 | Kept from www.wxx9248.top                  |
| ------ | ------------------- | ------------------------------------------ |
| azure  | water blue          | `#33b5e5` at 400                           |
| cyan   | cyan                | `#9be9f2` at 200                           |
| yellow | yellow              | `#ffe57a` at 100, `#f7d02c` at 200         |
| gray   | cool neutral (286°) | `#f6f6f8` 50, `#8d8d96` 500, `#141418` 900 |
| green  | green               | `#7bd88f` at 300                           |
| amber  | amber               |                                            |
| red    | red                 | `#e3242b` at 600                           |
| blue   | blue                | `#a3c6ff` 300, `#6fa8ff` 400               |
| purple | used sparingly      | `#e8adff` 300, `#d77bff` 400               |

`gray` backs backgrounds, text and borders directly. `purple` has no role.

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

The bindings live in one map, `roleBindings` in `src/types.ts`, so changing a role's color is a one-line edit.

Plus `--palette-white` and `--palette-black`.

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

Each is a `--color-<token>` property. The tests check that text reaches 4.5:1 contrast (WCAG AA) and that input borders, focus rings and status fills reach 3:1, in both themes. That covers the terminal's foreground and ANSI colors on `terminal-bg`, except `terminal-black` in the dark theme and `terminal-white` and `terminal-bright-white` in the light theme, which match the background by design.

A token with a role binds to a role scale, and a token that names a color binds to a color scale. So `accent` uses `primary`, but `terminal-red` uses `red`, and rebinding `error` leaves the terminal alone.

## Development

```sh
pnpm install
pnpm test       # unit tests, including every contrast requirement
pnpm build      # lint, type check, compile and write dist/
```

`src/` holds only what the published package runs; `scripts/` holds what runs at build time.

Scripts and tests import project files from the root with `#/`, e.g. `#/src/semantic.ts`, through the `imports` field in `package.json`. Files in `src/` import each other with relative paths instead, because the compiler rewrites only relative `.ts` imports to `.js` in the published output.

| File                               | Role                                                                     |
| ---------------------------------- | ------------------------------------------------------------------------ |
| `src/index.ts`                     | Public API                                                               |
| `src/palette.ts`                   | `palette` and `resolve()`                                                |
| `src/semantic.ts`                  | Layer 2: each semantic token's palette step per theme                    |
| `src/types.ts`                     | Step and scale names, color reference types                              |
| `src/generated/scales.ts`          | The hex scales, written by `pnpm generate` (git-ignored)                 |
| `scripts/scale-specs.ts`           | Layer 1 definition: hues, chroma, lightness ladder, www.wxx9248.top pins |
| `scripts/scale-generator.ts`       | Turns the specs into hex colors with [Color.js](https://colorjs.io)      |
| `scripts/generate.ts`              | Writes `src/generated/scales.ts`                                         |
| `scripts/render.ts`                | Renders the palette and semantic tokens as CSS and JSON                  |
| `scripts/build.ts`                 | Writes the CSS and JSON into `dist/`                                     |
| `scripts/contrast-requirements.ts` | The contrast every semantic pairing must reach, checked by the tests     |

The generator maps out-of-range colors into sRGB with the CSS Color 4 gamut mapping algorithm. `test`, `typecheck` and `build` run `pnpm generate` first, so you never need to run it yourself. Color.js is a development dependency only: the published package has no runtime dependencies.

## License

AGPL-3.0-only
