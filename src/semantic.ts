import type { ColorRef } from "./types.ts";

/** Layer 2: what each color is for, as a palette reference per theme. */

export interface SemanticToken {
  dark: ColorRef;
  description: string;
  light: ColorRef;
}

export const feedbackStatuses = [
  "success",
  "warning",
  "error",
  "info"
] as const;
type FeedbackStatus = (typeof feedbackStatuses)[number];
type FeedbackPart = "bg" | "border" | "solid" | "text";

function feedbackTokens<Status extends FeedbackStatus>(
  status: Status,
  label: string
): Record<`${Status}-${FeedbackPart}`, SemanticToken> {
  return {
    [`${status}-bg`]: {
      dark: `${status}.900`,
      description: `${label} message background`,
      light: `${status}.50`
    },
    [`${status}-border`]: {
      dark: `${status}.700`,
      description: `${label} message border`,
      light: `${status}.300`
    },
    [`${status}-solid`]: {
      dark: `${status}.400`,
      description: `${label} solid fill and icon`,
      light: `${status}.600`
    },
    [`${status}-text`]: {
      dark: `${status}.200`,
      description: `${label} message text`,
      light: `${status}.800`
    }
    // Computed keys widen to string; these four are exactly the declared names
  } as Record<`${Status}-${FeedbackPart}`, SemanticToken>;
}

/**
 * A terminal theme. The ANSI colors name a color, so they bind to color scales:
 * rebinding a role must not change the terminal's red. terminal-cyan is azure
 * because that is how www.wxx9248.top draws the slot.
 */
const terminalTokens = {
  "terminal-bg": {
    dark: "gray.900",
    description: "Terminal background",
    light: "gray.50"
  },
  "terminal-black": {
    dark: "gray.900",
    description: "ANSI black (matches the dark background by design)",
    light: "gray.900"
  },
  "terminal-blue": {
    dark: "blue.400",
    description: "ANSI blue",
    light: "blue.800"
  },
  "terminal-bright-black": {
    dark: "gray.500",
    description: "ANSI bright black",
    light: "gray.700"
  },
  "terminal-bright-blue": {
    dark: "blue.300",
    description: "ANSI bright blue",
    light: "blue.700"
  },
  "terminal-bright-cyan": {
    dark: "cyan.200",
    description: "ANSI bright cyan",
    light: "cyan.700"
  },
  "terminal-bright-green": {
    dark: "green.200",
    description: "ANSI bright green",
    light: "green.700"
  },
  "terminal-bright-magenta": {
    dark: "purple.300",
    description: "ANSI bright magenta",
    light: "purple.700"
  },
  "terminal-bright-red": {
    dark: "red.400",
    description: "ANSI bright red",
    light: "red.700"
  },
  "terminal-bright-white": {
    dark: "white",
    description: "ANSI bright white (matches the light background by design)",
    light: "white"
  },
  "terminal-bright-yellow": {
    dark: "yellow.100",
    description: "ANSI bright yellow",
    light: "yellow.700"
  },
  "terminal-cursor": {
    dark: "primary.400",
    description: "Terminal cursor",
    light: "primary.700"
  },
  "terminal-cursor-text": {
    dark: "gray.900",
    description: "Text under the block cursor",
    light: "white"
  },
  "terminal-cyan": {
    dark: "azure.400",
    description: "ANSI cyan",
    light: "azure.800"
  },
  "terminal-fg": {
    dark: "gray.100",
    description: "Terminal text",
    light: "gray.900"
  },
  "terminal-green": {
    dark: "green.300",
    description: "ANSI green",
    light: "green.800"
  },
  "terminal-magenta": {
    dark: "purple.400",
    description: "ANSI magenta",
    light: "purple.800"
  },
  "terminal-red": {
    dark: "red.500",
    description: "ANSI red",
    light: "red.800"
  },
  "terminal-selection-bg": {
    dark: "primary.800",
    description: "Selected terminal text",
    light: "primary.100"
  },
  "terminal-white": {
    dark: "gray.100",
    description: "ANSI white (near the light background by design)",
    light: "gray.300"
  },
  "terminal-yellow": {
    dark: "yellow.200",
    description: "ANSI yellow",
    light: "yellow.800"
  }
} satisfies Record<string, SemanticToken>;

export const semanticTokens = {
  // Accent
  "accent": {
    dark: "primary.400",
    description: "The brand color: prompts, tags and indicators",
    light: "primary.700"
  },
  // Action
  "action-primary": {
    dark: "primary.400",
    description: "Primary fill, e.g. a status bar or main button",
    light: "primary.700"
  },
  "action-primary-hover": {
    dark: "primary.300",
    description: "Primary fill while hovered",
    light: "primary.800"
  },
  "action-primary-pressed": {
    dark: "primary.500",
    description: "Primary fill while pressed",
    light: "primary.900"
  },
  // Background
  "bg-page": {
    dark: "gray.900",
    description: "Page background",
    light: "gray.50"
  },
  "bg-raised": {
    dark: "gray.800",
    description: "Popovers and menus (pair with a border)",
    light: "white"
  },
  "bg-sunken": {
    dark: "black",
    description: "Inputs and wells",
    light: "gray.100"
  },
  "bg-surface": {
    dark: "gray.800",
    description: "Cards, frames and panels",
    light: "white"
  },
  // Border
  "border-default": {
    dark: "gray.700",
    description: "Frames and cards",
    light: "gray.300"
  },
  "border-input": {
    dark: "gray.600",
    description: "Input borders (3:1 against the page)",
    light: "gray.500"
  },
  "border-subtle": {
    dark: "gray.800",
    description: "Dividers",
    light: "gray.200"
  },
  // Interactive states
  "focus-ring": {
    dark: "primary.400",
    description: "Keyboard focus outline",
    light: "primary.600"
  },
  "hover-bg": {
    dark: "gray.800",
    description: "Hovered rows and menu items",
    light: "gray.100"
  },
  // Link
  "link": { dark: "primary.400", description: "Links", light: "primary.700" },
  "link-hover": {
    dark: "primary.300",
    description: "Hovered links",
    light: "primary.800"
  },
  "link-visited": {
    dark: "primary.500",
    description: "Visited links",
    light: "primary.900"
  },
  "selection-bg": {
    dark: "primary.800",
    description: "Selected text",
    light: "primary.100"
  },
  // Foreground
  "text-code": {
    dark: "info.300",
    description: "Inline code",
    light: "info.700"
  },
  "text-disabled": {
    dark: "gray.600",
    description: "Disabled controls (no contrast minimum)",
    light: "gray.400"
  },
  "text-error": {
    dark: "error.400",
    description: "Error text on the page background",
    light: "error.700"
  },
  "text-heading": {
    dark: "secondary.200",
    description: "Headings",
    light: "secondary.700"
  },
  "text-highlight": {
    dark: "tertiary.200",
    description: "Search matches and similar highlights",
    light: "tertiary.700"
  },
  "text-muted": {
    dark: "gray.500",
    description: "Least important text",
    light: "gray.600"
  },
  "text-on-primary": {
    dark: "gray.900",
    description: "Text on primary fills",
    light: "white"
  },
  "text-placeholder": {
    dark: "gray.500",
    description: "Input placeholders",
    light: "gray.600"
  },
  "text-primary": {
    dark: "gray.100",
    description: "Body text and titles",
    light: "gray.900"
  },
  "text-secondary": {
    dark: "gray.400",
    description: "Supporting text: dates, metadata",
    light: "gray.700"
  },
  // Feedback
  ...feedbackTokens("success", "Success"),
  ...feedbackTokens("warning", "Warning"),
  ...feedbackTokens("error", "Error"),
  ...feedbackTokens("info", "Info"),
  // Terminal
  ...terminalTokens
} satisfies Record<string, SemanticToken>;

export type SemanticTokenName = keyof typeof semanticTokens;
