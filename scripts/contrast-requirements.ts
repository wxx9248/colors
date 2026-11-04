import { type SemanticTokenName, feedbackStatuses } from "#/src/semantic.ts";

/** The contrast each semantic pairing must reach; the tests check them all. */

type Theme = "dark" | "light";

export interface ContrastRequirement {
  background: SemanticTokenName;
  // The theme where the two match by design, so the minimum doesn't apply
  exemptTheme?: Theme | undefined;
  foreground: SemanticTokenName;
  // WCAG 2: 4.5 for text, 3 for UI components such as borders and focus rings
  minimum: number;
}

const textContrast = 4.5;
const componentContrast = 3;

const readableOnPage: SemanticTokenName[] = [
  "text-primary",
  "text-secondary",
  "text-muted",
  "text-placeholder",
  "text-heading",
  "text-code",
  "text-highlight",
  "text-error",
  "accent",
  "link",
  "link-hover",
  "link-visited"
];

const ansiColors = [
  "black",
  "red",
  "green",
  "yellow",
  "blue",
  "magenta",
  "cyan",
  "white"
] as const;

/** The 16 ANSI colors. Each names a color, so it binds to a color scale. */
export const ansiTokens = ansiColors.flatMap(
  (color) => [`terminal-${color}`, `terminal-bright-${color}`] as const
);

// ANSI black and white are the terminal's own backgrounds in one theme
const ansiExemptions: Partial<Record<(typeof ansiTokens)[number], Theme>> = {
  "terminal-black": "dark",
  "terminal-bright-white": "light",
  "terminal-white": "light"
};

export const contrastRequirements: readonly ContrastRequirement[] = [
  ...readableOnPage.map((foreground) => ({
    background: "bg-page" as const,
    foreground,
    minimum: textContrast
  })),
  ...(["text-primary", "text-secondary", "link"] as const).map(
    (foreground) => ({
      background: "bg-surface" as const,
      foreground,
      minimum: textContrast
    })
  ),
  {
    background: "action-primary",
    foreground: "text-on-primary",
    minimum: textContrast
  },
  {
    background: "action-primary-hover",
    foreground: "text-on-primary",
    minimum: textContrast
  },
  {
    background: "bg-page",
    foreground: "border-input",
    minimum: componentContrast
  },
  {
    background: "bg-page",
    foreground: "focus-ring",
    minimum: componentContrast
  },
  ...feedbackStatuses.flatMap((status): ContrastRequirement[] => [
    {
      background: `${status}-bg`,
      foreground: `${status}-text`,
      minimum: textContrast
    },
    {
      background: "bg-page",
      foreground: `${status}-solid`,
      minimum: componentContrast
    }
  ]),
  {
    background: "terminal-bg",
    foreground: "terminal-fg",
    minimum: textContrast
  },
  ...ansiTokens.map((foreground) => ({
    background: "terminal-bg" as const,
    exemptTheme: ansiExemptions[foreground],
    foreground,
    minimum: textContrast
  })),
  {
    background: "terminal-bg",
    foreground: "terminal-cursor",
    minimum: componentContrast
  },
  {
    background: "terminal-selection-bg",
    foreground: "terminal-fg",
    minimum: textContrast
  }
];
