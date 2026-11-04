import { colorScaleNames, palette, steps } from "#/src/palette.ts";
import { describe, expect, it } from "vitest";
import { labelColor, previewPage } from "#/scripts/preview/page.ts";
import Color from "colorjs.io";
import { semanticTokens } from "#/src/semantic.ts";

describe("preview page", () => {
  it("carries both CSS layers inline, so it opens from disk with no server", () => {
    const html = previewPage();
    expect(html).toContain("--palette-azure-400: #33b5e5;");
    expect(html).toContain("--color-bg-page: light-dark(");
    expect(html).not.toMatch(/@import|<link|<script|\bsrc=|url\(/u);
  });

  it("shows every step of every color scale", () => {
    const html = previewPage();
    for (const name of colorScaleNames) {
      for (const step of steps) {
        expect(html, `${name}.${step}`).toContain(palette.scales[name][step]);
      }
    }
  });

  it("lists every semantic token with both of its bindings", () => {
    const html = previewPage();
    for (const [name, { dark, light }] of Object.entries(semanticTokens)) {
      expect(html, name).toContain(`<code>${name}</code>`);
      expect(html, `${name} light`).toContain(`<code>${light}</code>`);
      expect(html, `${name} dark`).toContain(`<code>${dark}</code>`);
    }
  });

  it("shows the role each role scale is bound to", () => {
    const html = previewPage();
    expect(html).toMatch(/<code>primary<\/code>.*?<code>azure<\/code>/su);
    expect(html).toMatch(/<code>error<\/code>.*?<code>red<\/code>/su);
  });

  it("draws the terminal in both themes from the terminal tokens", () => {
    const html = previewPage();
    expect(html).toContain("var(--color-terminal-bright-magenta)");
    expect(html.match(/class="terminal"/gu)).toHaveLength(2);
  });

  it("draws every semantic token, even ones no sample was written for", () => {
    const html = previewPage();
    for (const name of Object.keys(semanticTokens)) {
      expect(html, name).toContain(`var(--color-${name})`);
    }
  });

  it("fills a background token left out of the samples, in both themes", () => {
    const fills = previewPage().match(/background:var\(--color-bg-raised\)/gu);
    expect(fills).toHaveLength(2);
  });

  it("refers only to tokens that exist", () => {
    const names = Object.keys(semanticTokens);
    const used = previewPage().matchAll(/var\(--color-(?<name>[a-z-]+)\)/gu);
    for (const { groups } of used) {
      expect(names).toContain(groups?.name);
    }
  });

  it("says when a pairing fails its contrast minimum", () => {
    const html = previewPage([
      { background: "bg-page", foreground: "text-primary", minimum: 22 }
    ]);
    expect(html).toContain("2 of 2 checks fail");
    expect(html).toContain("Fails");
  });

  it("says when every pairing passes", () => {
    const html = previewPage([
      { background: "bg-page", foreground: "text-primary", minimum: 4.5 }
    ]);
    expect(html).toContain("All 2 checks pass");
    expect(html).not.toContain("Fails");
  });

  it("marks a pairing exempt in its exempt theme instead of failing it", () => {
    const html = previewPage([
      {
        background: "terminal-bg",
        exemptTheme: "dark",
        foreground: "terminal-black",
        minimum: 4.5
      }
    ]);
    expect(html).toContain("Exempt");
    expect(html).toContain("All 1 checks pass");
  });

  it("labels every swatch in a color readable on that swatch", () => {
    for (const name of colorScaleNames) {
      for (const step of steps) {
        const hex = palette.scales[name][step];
        expect(
          Color.contrast(labelColor(hex), hex, "WCAG21"),
          `${name}.${step}`
        ).toBeGreaterThanOrEqual(4.5);
      }
    }
  });
});
