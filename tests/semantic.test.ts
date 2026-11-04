import { describe, expect, it } from "vitest";
import Color from "colorjs.io";
import { contrastRequirements } from "#/scripts/contrast-requirements.ts";
import { resolve } from "#/src/palette.ts";
import { semanticTokens } from "#/src/semantic.ts";

const themes = ["light", "dark"] as const;

describe("semantic tokens", () => {
  it("bind every token to a palette color in both themes", () => {
    for (const [name, token] of Object.entries(semanticTokens)) {
      for (const theme of themes) {
        expect(resolve(token[theme]), `${name} (${theme})`).toMatch(
          /^#[0-9a-f]{6}$/u
        );
      }
    }
  });

  it("check contrast only between tokens that exist", () => {
    for (const { background, foreground } of contrastRequirements) {
      expect(semanticTokens).toHaveProperty(foreground);
      expect(semanticTokens).toHaveProperty(background);
    }
  });

  for (const theme of themes) {
    it(`meet every contrast requirement in the ${theme} theme`, () => {
      for (const { background, foreground, minimum } of contrastRequirements) {
        const ratio = Color.contrast(
          resolve(semanticTokens[foreground][theme]),
          resolve(semanticTokens[background][theme]),
          "WCAG21"
        );
        expect(ratio, `${foreground} on ${background}`).toBeGreaterThanOrEqual(
          minimum
        );
      }
    });
  }
});
