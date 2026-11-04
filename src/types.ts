/** Shared names for palette steps, scales and color references. */

// eslint-disable-next-line no-magic-numbers -- These numbers are the step names
export const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;
export type Step = (typeof steps)[number];

export const scaleNames = [
  "primary",
  "secondary",
  "tertiary",
  "gray",
  "success",
  "warning",
  "error",
  "info"
] as const;
export type ScaleName = (typeof scaleNames)[number];

export type Scale = Readonly<Record<Step, string>>;
export type ColorRef = `${ScaleName}.${Step}` | "black" | "white";
