import {
  type ColorScaleName,
  type Scale,
  colorScaleNames,
  steps
} from "#/src/types.ts";
import { type ScaleSpec, scaleSpecs } from "./scale-specs.ts";
import Color from "colorjs.io";

// Ladders must give a value for every step; a short one is a spec error
function valueAt(values: readonly number[], index: number): number {
  const value = values[index];
  if (typeof value !== "number") {
    throw new Error(`Scale spec has no value for step ${steps[index]}`);
  }
  return value;
}

/**
 * Builds one step: an OKLCH color mapped into sRGB with the CSS Color 4 gamut
 * mapping algorithm, which lowers chroma while keeping lightness and hue.
 */
function stepColor(spec: ScaleSpec, index: number): string {
  const color = new Color("oklch", [
    valueAt(spec.lightness, index),
    spec.peakChroma * valueAt(spec.chromaCurve, index),
    spec.hue
  ]);
  return color
    .toGamut({ space: "srgb" })
    .to("srgb")
    .toString({ collapse: false, format: "hex" });
}

function generateScale(spec: ScaleSpec): Scale {
  return Object.fromEntries(
    steps.map((step, index) => [
      step,
      spec.pins?.[step] ?? stepColor(spec, index)
    ])
  ) as Scale;
}

export function generateScales(): Record<ColorScaleName, Scale> {
  return Object.fromEntries(
    colorScaleNames.map((name) => [name, generateScale(scaleSpecs[name])])
  ) as Record<ColorScaleName, Scale>;
}
