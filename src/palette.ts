import {
  type ColorRef,
  type RoleScaleName,
  type Scale,
  type ScaleName,
  type Step,
  roleBindings,
  roleScaleNames
} from "./types.ts";
import { scales } from "./generated/scales.ts";

/** Layer 1: raw colors. Sites use the semantic tokens, not these directly. */

export {
  type ColorRef,
  type ColorScaleName,
  type RoleScaleName,
  type Scale,
  type ScaleName,
  type Step,
  colorScaleNames,
  roleBindings,
  roleScaleNames,
  scaleNames,
  steps
} from "./types.ts";

const roleScales = Object.fromEntries(
  roleScaleNames.map((name) => [name, scales[roleBindings[name]]])
) as Record<RoleScaleName, Scale>;

export const palette = {
  black: "#000000",
  scales: { ...scales, ...roleScales } as Readonly<Record<ScaleName, Scale>>,
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
