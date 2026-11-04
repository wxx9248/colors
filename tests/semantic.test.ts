import { type SemanticTokenName, semanticTokens } from "#/src/semantic.ts";
import {
  ansiTokens,
  contrastRequirements
} from "#/scripts/contrast-requirements.ts";
import { colorScaleNames, resolve, roleScaleNames } from "#/src/palette.ts";
import { describe, expect, it } from "vitest";
import Color from "colorjs.io";

const themes = ["light", "dark"] as const;

function scalesOf(token: SemanticTokenName): string[] {
  const { dark, light } = semanticTokens[token];
  return [dark, light].map((ref) => ref.split(".")[0] ?? "");
}

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

  it("exempt only the ANSI colors that match a terminal background", () => {
    expect(
      contrastRequirements.flatMap(({ exemptTheme, foreground }) =>
        exemptTheme ? [`${foreground} (${exemptTheme})`] : []
      )
    ).toEqual([
      "terminal-black (dark)",
      "terminal-white (light)",
      "terminal-bright-white (light)"
    ]);
  });

  it("use the blog's steps, so the blog can delete its own copies", () => {
    expect({
      "accent": semanticTokens.accent,
      "text-code": semanticTokens["text-code"],
      "text-heading": semanticTokens["text-heading"],
      "text-highlight": semanticTokens["text-highlight"]
    }).toMatchObject({
      "accent": { dark: "primary.400", light: "primary.700" },
      "text-code": { dark: "info.300", light: "info.700" },
      "text-heading": { dark: "secondary.200", light: "secondary.700" },
      "text-highlight": { dark: "tertiary.200", light: "tertiary.700" }
    });
  });

  it("give www's terminal its exact colors in the dark theme", () => {
    const names = [
      "terminal-bg",
      "terminal-fg",
      "terminal-cursor",
      "terminal-cursor-text",
      "terminal-selection-bg",
      ...ansiTokens
    ] as const;
    expect(
      Object.fromEntries(
        names.map((name) => [name, resolve(semanticTokens[name].dark)])
      )
    ).toEqual({
      "terminal-bg": "#141418",
      "terminal-black": "#141418",
      "terminal-blue": "#6fa8ff",
      "terminal-bright-black": "#8d8d96",
      "terminal-bright-blue": "#a3c6ff",
      "terminal-bright-cyan": "#9be9f2",
      "terminal-bright-green": "#a5e9b2",
      "terminal-bright-magenta": "#e8adff",
      "terminal-bright-red": "#ff6a62",
      "terminal-bright-white": "#ffffff",
      "terminal-bright-yellow": "#ffe57a",
      "terminal-cursor": "#33b5e5",
      "terminal-cursor-text": "#141418",
      "terminal-cyan": "#33b5e5",
      "terminal-fg": "#ececf2",
      "terminal-green": "#7bd88f",
      "terminal-magenta": "#d77bff",
      "terminal-red": "#f34643",
      "terminal-selection-bg": "#004a68",
      "terminal-white": "#ececf2",
      "terminal-yellow": "#f7d02c"
    });
  });

  it("keep ANSI colors off role scales, so rebinding a role can't move them", () => {
    for (const name of ansiTokens) {
      for (const scale of scalesOf(name)) {
        expect(roleScaleNames, name).not.toContain(scale);
      }
    }
  });

  it("keep every other token off the named hues, so it follows its role", () => {
    const ansi: readonly string[] = ansiTokens;
    const hues = colorScaleNames.filter((name) => name !== "gray");
    const names = Object.keys(semanticTokens) as SemanticTokenName[];
    for (const name of names.filter((token) => !ansi.includes(token))) {
      for (const scale of scalesOf(name)) {
        expect(hues, name).not.toContain(scale);
      }
    }
  });

  for (const theme of themes) {
    it(`meet every contrast requirement in the ${theme} theme`, () => {
      const requirements = contrastRequirements.filter(
        ({ exemptTheme }) => exemptTheme !== theme
      );
      for (const { background, foreground, minimum } of requirements) {
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
