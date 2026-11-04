import { describe, expect, it } from "vitest";
import { palette, resolve, scaleNames, steps } from "#/src/palette.ts";
import Color from "colorjs.io";

describe("palette", () => {
  it("has ten #rrggbb steps per scale, from 50 to 900", () => {
    expect(steps).toEqual([50, 100, 200, 300, 400, 500, 600, 700, 800, 900]);
    for (const name of scaleNames) {
      for (const step of steps) {
        expect(palette.scales[name][step], `${name}.${step}`).toMatch(
          /^#[0-9a-f]{6}$/u
        );
      }
    }
  });

  it("keeps www.wxx9248.top's colors exactly", () => {
    expect({
      "error.600": resolve("error.600"),
      "gray.50": resolve("gray.50"),
      "gray.500": resolve("gray.500"),
      "gray.900": resolve("gray.900"),
      "info.300": resolve("info.300"),
      "info.400": resolve("info.400"),
      "primary.400": resolve("primary.400"),
      "secondary.200": resolve("secondary.200"),
      "success.300": resolve("success.300"),
      "tertiary.200": resolve("tertiary.200")
    }).toEqual({
      "error.600": "#e3242b",
      "gray.50": "#f6f6f8",
      "gray.500": "#8d8d96",
      "gray.900": "#141418",
      "info.300": "#a3c6ff",
      "info.400": "#6fa8ff",
      "primary.400": "#33b5e5",
      "secondary.200": "#9be9f2",
      "success.300": "#7bd88f",
      "tertiary.200": "#f7d02c"
    });
  });

  it("gets darker at every step of every scale", () => {
    for (const name of scaleNames) {
      const lightness = steps.map(
        (step) =>
          new Color(palette.scales[name][step]).to("oklch").coords[0] ?? 0
      );
      for (let index = 1; index < lightness.length; index += 1) {
        expect(
          lightness[index],
          `${name}.${steps[index]} vs ${steps[index - 1]}`
        ).toBeLessThan(lightness[index - 1] ?? 0);
      }
    }
  });

  it("resolves white and black", () => {
    expect(resolve("white")).toBe("#ffffff");
    expect(resolve("black")).toBe("#000000");
  });
});
