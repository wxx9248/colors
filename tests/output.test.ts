import { describe, expect, it } from "vitest";
import { palette, scaleNames, steps } from "#/src/palette.ts";
import { paletteCss, semanticCss, tokensJson } from "#/scripts/render.ts";

describe("generated output", () => {
  it("writes color scales as hex --palette-* properties", () => {
    const css = paletteCss();
    expect(css).toContain("--palette-azure-400: #33b5e5;");
    expect(css).toContain("--palette-purple-400: #d77bff;");
    expect(css).toContain("--palette-gray-900: #141418;");
    expect(css).toContain("--palette-white: #ffffff;");
  });

  it("writes role scales as references to their color scales", () => {
    const css = paletteCss();
    expect(css).toContain("--palette-primary-400: var(--palette-azure-400);");
    expect(css).toContain("--palette-error-600: var(--palette-red-600);");
  });

  it("gives every --palette-* property the hex that JavaScript sees", () => {
    const properties = new Map(
      [...paletteCss().matchAll(/(--palette-[a-z0-9-]+): ([^;]+);/gu)].map(
        ([, name = "", value = ""]) => [name, value]
      )
    );
    for (const name of scaleNames) {
      for (const step of steps) {
        const value = properties.get(`--palette-${name}-${step}`) ?? "";
        const target = /^var\((?<property>.+)\)$/u.exec(value)?.groups
          ?.property;
        expect(target ? properties.get(target) : value, `${name}.${step}`).toBe(
          palette.scales[name][step]
        );
      }
    }
  });

  it("writes semantic tokens as light-dark() over palette properties", () => {
    const css = semanticCss();
    expect(css).toContain("color-scheme: light dark;");
    expect(css).toContain(
      "--color-bg-page: light-dark(var(--palette-gray-50), var(--palette-gray-900));"
    );
    expect(css).toContain(
      "--color-text-on-primary: light-dark(var(--palette-white), var(--palette-gray-900));"
    );
  });

  it("exports resolved values and references as JSON", () => {
    const json = tokensJson();
    expect(json.palette.primary[400]).toBe("#33b5e5");
    expect(json.palette.azure[400]).toBe("#33b5e5");
    expect(json.palette.white).toBe("#ffffff");
    expect(json.semantic["bg-page"]).toEqual({
      dark: "#141418",
      darkRef: "gray.900",
      description: "Page background",
      light: "#f6f6f8",
      lightRef: "gray.50"
    });
  });
});
