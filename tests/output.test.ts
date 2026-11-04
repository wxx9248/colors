import { describe, expect, it } from "vitest";
import { paletteCss, semanticCss, tokensJson } from "#/scripts/render.ts";

describe("generated output", () => {
  it("writes the palette as --palette-* properties", () => {
    const css = paletteCss();
    expect(css).toContain("--palette-primary-400: #33b5e5;");
    expect(css).toContain("--palette-gray-900: #141418;");
    expect(css).toContain("--palette-white: #ffffff;");
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
