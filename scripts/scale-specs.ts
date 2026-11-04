/* eslint-disable no-magic-numbers -- This file is the palette definition: hues, lightness ladders and chroma curves */
import type { ScaleName, Step } from "#/src/types.ts";

/**
 * Layer 1 definition, used at build time only. pnpm generate turns these specs
 * into the hex scales in src/generated/scales.ts.
 */

export interface ScaleSpec {
  // Relative chroma per step, so the ends are muted and the middle is vivid
  chromaCurve: readonly number[];
  description: string;
  hue: number;
  // OKLCH lightness per step, light to dark
  lightness: readonly number[];
  peakChroma: number;
  // Exact colors kept from www.wxx9248.top, in place of the generated step
  pins?: Partial<Record<Step, string>>;
}

// One ladder for every hue, so the same step looks equally light across scales
const hueLightness = [
  0.975, 0.935, 0.875, 0.8, 0.725, 0.645, 0.56, 0.47, 0.38, 0.29
] as const;
const hueChroma = [
  0.22, 0.42, 0.68, 0.88, 1, 1, 0.94, 0.84, 0.7, 0.56
] as const;
// Neutrals reach further into the dark end, for dark-theme pages and surfaces
const grayLightness = [
  0.974, 0.946, 0.885, 0.8, 0.72, 0.646, 0.52, 0.42, 0.27, 0.193
] as const;
const grayChroma = [0.35, 0.6, 0.8, 0.9, 1, 1, 1, 1, 0.9, 0.8] as const;

const hueScale = (
  spec: Omit<ScaleSpec, "chromaCurve" | "lightness">
): ScaleSpec => ({
  ...spec,
  chromaCurve: hueChroma,
  lightness: hueLightness
});

export const scaleSpecs: Readonly<Record<ScaleName, ScaleSpec>> = {
  error: hueScale({
    description: "Red: errors and destructive actions",
    hue: 26,
    peakChroma: 0.21,
    pins: { 600: "#e3242b" }
  }),
  gray: {
    chromaCurve: grayChroma,
    description: "Cool neutral: backgrounds, text and borders",
    hue: 286,
    lightness: grayLightness,
    peakChroma: 0.013,
    pins: { 50: "#f6f6f8", 500: "#8d8d96", 900: "#141418" }
  },
  info: hueScale({
    description: "Blue: information, also suited to inline code",
    hue: 259,
    peakChroma: 0.14,
    pins: { 300: "#a3c6ff", 400: "#6fa8ff" }
  }),
  primary: hueScale({
    description: "Azure (water blue): links, actions and focus",
    hue: 228,
    peakChroma: 0.13,
    pins: { 400: "#33b5e5" }
  }),
  secondary: hueScale({
    description: "Cyan: headings and secondary emphasis",
    hue: 205,
    peakChroma: 0.1,
    pins: { 200: "#9be9f2" }
  }),
  success: hueScale({
    description: "Green: success and confirmations",
    hue: 150,
    peakChroma: 0.15,
    pins: { 300: "#7bd88f" }
  }),
  tertiary: hueScale({
    description: "Yellow: highlights and accents used sparingly",
    hue: 94,
    peakChroma: 0.17,
    pins: { 200: "#f7d02c" }
  }),
  warning: hueScale({
    description: "Amber: warnings",
    hue: 68,
    peakChroma: 0.16
  })
};
