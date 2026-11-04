import type { ColorRef, Scale, ScaleName, Step } from "./types.ts";
import { scales } from "./generated/scales.ts";

/** Layer 1: raw colors. Sites use the semantic tokens, not these directly. */

export {
  type ColorRef,
  type Scale,
  type ScaleName,
  type Step,
  scaleNames,
  steps
} from "./types.ts";

export const palette = {
  black: "#000000",
  scales: scales as Readonly<Record<ScaleName, Scale>>,
  white: "#ffffff"
} as const;

/** Looks up a palette color by reference, e.g. "primary.400" or "white". */
export function resolve(ref: ColorRef): string {
  if (ref === "black" || ref === "white") {
    return palette[ref];
  }
  const [name, step] = ref.split(".") as [ScaleName, `${Step}`];
  return palette.scales[name][Number(step) as Step];
}
