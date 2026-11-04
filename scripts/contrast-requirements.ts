import { type SemanticTokenName, feedbackStatuses } from "#/src/semantic.ts";

/** The contrast each semantic pairing must reach; the tests check them all. */

export interface ContrastRequirement {
  background: SemanticTokenName;
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
  "link",
  "link-hover",
  "link-visited"
];

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
  ])
];
