/** Shared names for palette steps, scales and color references. */

// eslint-disable-next-line no-magic-numbers -- These numbers are the step names
export const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;
export type Step = (typeof steps)[number];

/** Scales named for how they look. These hold the hex values. */
export const colorScaleNames = [
  "azure",
  "cyan",
  "yellow",
  "gray",
  "green",
  "amber",
  "red",
  "blue",
  "purple"
] as const;
export type ColorScaleName = (typeof colorScaleNames)[number];

/** Scales named for what they're for. Change a role's color here. */
export const roleBindings = {
  error: "red",
  info: "blue",
  primary: "azure",
  secondary: "cyan",
  success: "green",
  tertiary: "yellow",
  warning: "amber"
} as const satisfies Record<string, ColorScaleName>;
export type RoleScaleName = keyof typeof roleBindings;
export const roleScaleNames = Object.keys(roleBindings) as RoleScaleName[];

export type ScaleName = ColorScaleName | RoleScaleName;
export const scaleNames: readonly ScaleName[] = [
  ...colorScaleNames,
  ...roleScaleNames
];

export type Scale = Readonly<Record<Step, string>>;
export type ColorRef = `${ScaleName}.${Step}` | "black" | "white";
