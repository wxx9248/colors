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

export const semanticTokens = {
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
  "text-disabled": {
    dark: "gray.600",
    description: "Disabled controls (no contrast minimum)",
    light: "gray.400"
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
  ...feedbackTokens("info", "Info")
} satisfies Record<string, SemanticToken>;

export type SemanticTokenName = keyof typeof semanticTokens;
