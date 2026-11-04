/* eslint-disable no-magic-numbers -- This file is the palette definition: hues, lightness ladders and chroma curves */
import type { ColorScaleName, Step } from "#/src/types.ts";

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

export const scaleSpecs: Readonly<Record<ColorScaleName, ScaleSpec>> = {
  amber: hueScale({
    description: "Amber",
    hue: 68,
    peakChroma: 0.16
  }),
  azure: hueScale({
    description: "Azure (water blue)",
    hue: 228,
    peakChroma: 0.13,
    pins: { 400: "#33b5e5" }
  }),
  blue: hueScale({
    description: "Blue",
    hue: 259,
    peakChroma: 0.14,
    pins: { 300: "#a3c6ff", 400: "#6fa8ff" }
  }),
  cyan: hueScale({
    description: "Cyan",
    hue: 205,
    peakChroma: 0.1,
    pins: { 200: "#9be9f2" }
  }),
  gray: {
    chromaCurve: grayChroma,
    description: "Cool neutral",
    hue: 286,
    lightness: grayLightness,
    peakChroma: 0.013,
    pins: { 50: "#f6f6f8", 500: "#8d8d96", 900: "#141418" }
  },
  green: hueScale({
    description: "Green",
    hue: 150,
    peakChroma: 0.15,
    pins: { 300: "#7bd88f" }
  }),
  purple: hueScale({
    description: "Purple, used sparingly",
    hue: 315,
    peakChroma: 0.2,
    pins: { 300: "#e8adff", 400: "#d77bff" }
  }),
  red: hueScale({
    description: "Red",
    hue: 26,
    peakChroma: 0.21,
    pins: { 600: "#e3242b" }
  }),
  yellow: hueScale({
    description: "Yellow",
    hue: 94,
    peakChroma: 0.17,
    pins: { 100: "#ffe57a", 200: "#f7d02c" }
  })
};
