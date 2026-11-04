import {
  type ColorScaleName,
  colorScaleNames,
  palette,
  resolve,
  roleBindings,
  roleScaleNames,
  steps
} from "#/src/palette.ts";
import {
  type ContrastRequirement,
  ansiTokens,
  contrastRequirements
} from "#/scripts/contrast-requirements.ts";
import {
  type SemanticToken,
  feedbackStatuses,
  semanticTokens
} from "#/src/semantic.ts";
import { packageName, packageVersion } from "#/scripts/project.ts";
import { paletteCss, semanticCss } from "#/scripts/build/render.ts";
import Color from "colorjs.io";
import { readFileSync } from "node:fs";
import { scaleSpecs } from "#/scripts/scales/specs.ts";

const themes = ["light", "dark"] as const;
type Theme = (typeof themes)[number];

const ratioDigits = 2;

const stylesheet = readFileSync(new URL("page.css", import.meta.url), "utf8");

// Hues in spectral order, then the neutral
const wallRows: readonly ColorScaleName[] = [
  ...colorScaleNames
    .filter((name) => name !== "gray")
    .toSorted(
      (first, second) => scaleSpecs[first].hue - scaleSpecs[second].hue
    ),
  "gray"
];

/** Black or white, whichever reads better on the given color. */
export function labelColor(hex: string): string {
  const onWhite = Color.contrast(palette.white, hex, "WCAG21");
  const onBlack = Color.contrast(palette.black, hex, "WCAG21");
  return onWhite > onBlack ? palette.white : palette.black;
}

function scrollable(label: string, content: string): string {
  return `<div class="scroll" role="region" aria-label="${label}" tabindex="0">${content}</div>`;
}

function colorWall(): string {
  const heads = steps.map((step) => `<th scope="col">${step}</th>`).join("");
  const rows = wallRows.map((name) => {
    const cells = steps.map((step) => {
      const hex = palette.scales[name][step];
      const kept = scaleSpecs[name].pins?.[step] ? " kept" : "";
      return `<td class="swatch${kept}" style="background:${hex};color:${labelColor(hex)}">${hex}</td>`;
    });
    return `<tr><th scope="row">${name}</th>${cells.join("")}</tr>`;
  });
  return scrollable(
    "Color scales",
    `<table class="wall"><thead><tr><td></td>${heads}</tr></thead><tbody>${rows.join("")}</tbody></table>`
  );
}

function roleTable(): string {
  const rows = roleScaleNames.map((role) => {
    const color = roleBindings[role];
    const strip = steps
      .map(
        (step) => `<i style="background:${palette.scales[color][step]}"></i>`
      )
      .join("");
    return `<tr><td><code>${role}</code></td><td><code>${color}</code></td><td><div class="strip">${strip}</div></td></tr>`;
  });
  return scrollable(
    "Role scales",
    `<table><thead><tr><th scope="col">Role</th><th scope="col">Bound to</th><th scope="col">Steps 50 to 900</th></tr></thead><tbody>${rows.join("")}</tbody></table>`
  );
}

function feedbackMessage(status: (typeof feedbackStatuses)[number]): string {
  const text = semanticTokens[`${status}-text`].description;
  return `<p class="message" style="background:var(--color-${status}-bg);border-color:var(--color-${status}-border);color:var(--color-${status}-text)"><i style="background:var(--color-${status}-solid)"></i>${text}</p>`;
}

function interfaceSample(theme: Theme): string {
  return `<section class="half" style="color-scheme:${theme}" aria-label="Interface in the ${theme} theme">
<h3>Colors on a ${theme} page</h3>
<p>Body text sits on the page with a <a href="#top">link</a>, a <a class="hovered" href="#top">hovered link</a> and a <a class="visited" href="#top">visited link</a>. Inline code looks like <code class="inline">resolve("azure.400")</code>, and a search match looks like <mark>this</mark>.</p>
<p class="secondary">Supporting text, such as a date or a byline.</p>
<p class="muted">The least important text on the page.</p>
<p><span class="accent">Accent</span> marks prompts, tags and indicators.</p>
<div class="surface">
<p class="buttons"><button type="button">Primary</button><button type="button" class="hovered">Hovered</button><button type="button" class="pressed">Pressed</button><button type="button" disabled>Disabled</button></p>
<p class="field"><label>Input<input type="text" placeholder="Placeholder text"></label></p>
<p class="field"><label>Focused input<input type="text" class="focused" value="Shows the focus ring"></label></p>
<p class="error">Error text directly on a surface.</p>
</div>
${feedbackStatuses.map(feedbackMessage).join("\n")}
</section>`;
}

function ansi(color: string, text: string): string {
  return `<span style="color:var(--color-terminal-${color})">${text}</span>`;
}

function terminal(theme: Theme): string {
  const swatches = ansiTokens.map((token) => {
    const name = token.replace("terminal-", "");
    return `<span style="color:var(--color-${token})">${name}</span>`;
  });
  return `<section class="half terminal-half" style="color-scheme:${theme}" aria-label="Terminal in the ${theme} theme">
<div class="terminal"><pre>${ansi("bright-black", "~/colors")} ${ansi("green", "master")} ${ansi("yellow", "$")} git status --short
 ${ansi("red", "M")} src/semantic.ts
${ansi("green", "A")}  tests/preview.test.ts
${ansi("yellow", "$")} pnpm test
 ${ansi("bright-green", "✓")} tests/palette.test.ts ${ansi("bright-black", "(6 tests)")}
 ${ansi("bright-red", "×")} tests/output.test.ts ${ansi("bright-black", "(1 failed)")}
${ansi("cyan", "info")}  ${ansi("bright-cyan", "see")} <span class="selected">the selected text</span>
${ansi("magenta", "note")}  ${ansi("bright-magenta", "bright magenta")}, ${ansi("blue", "blue")}, ${ansi("bright-blue", "bright blue")}
${ansi("yellow", "$")} <span class="cursor">c</span></pre>
<p class="ansi">${swatches.join("")}</p></div>
</section>`;
}

/** One token on its own, painted the way its name says it's used. */
function specimen(name: string, token: SemanticToken, theme: Theme): string {
  const value = `var(--color-${name})`;
  const label = `<code>${name}</code> ${token.description}`;
  if (/^bg-|-bg$|-solid$|^action-/u.test(name)) {
    return `<p class="specimen" style="background:${value};color:${labelColor(resolve(token[theme]))}">${label}</p>`;
  }
  if (/border|ring/u.test(name)) {
    return `<p class="specimen" style="border-color:${value}">${label}</p>`;
  }
  return `<p class="specimen" style="color:${value}">${label}</p>`;
}

/** Draws whatever the hand-written samples and page styles don't use. */
function otherTokens(samples: string): string {
  const used = new Set(
    [...samples.matchAll(/var\(--color-(?<name>[a-z-]+)\)/gu)].map(
      ({ groups }) => groups?.name
    )
  );
  const tokens = Object.entries(semanticTokens).filter(
    ([name]) => !used.has(name)
  );
  const halves = themes.map((theme) => {
    const specimens = tokens.map(([name, token]: [string, SemanticToken]) =>
      specimen(name, token, theme)
    );
    return `<section class="half" style="color-scheme:${theme}" aria-label="Other tokens in the ${theme} theme">${specimens.join("")}</section>`;
  });
  return tokens.length
    ? `<section class="band"><h2 class="block-title">Other tokens</h2><div class="halves">${halves.join("")}</div></section>`
    : "";
}

function binding(token: SemanticToken, theme: Theme): string {
  const ref = token[theme];
  const hex = resolve(ref);
  return `<td><i class="chip" style="background:${hex}"></i><code>${ref}</code> <code class="hex">${hex}</code></td>`;
}

function tokenTable(): string {
  const rows = Object.entries(semanticTokens).map(
    ([name, token]: [string, SemanticToken]) =>
      `<tr><td><code>${name}</code></td>${binding(token, "light")}${binding(token, "dark")}<td>${token.description}</td></tr>`
  );
  return scrollable(
    "Semantic tokens",
    `<table><thead><tr><th scope="col">Token</th><th scope="col">Light</th><th scope="col">Dark</th><th scope="col">Used for</th></tr></thead><tbody>${rows.join("")}</tbody></table>`
  );
}

interface ContrastCheck {
  html: string;
  outcome: "exempt" | "fail" | "pass";
}

function contrastCheck(
  { background, exemptTheme, foreground, minimum }: ContrastRequirement,
  theme: Theme
): ContrastCheck {
  if (exemptTheme === theme) {
    return { html: `<td class="exempt">Exempt</td>`, outcome: "exempt" };
  }
  const ratio = Color.contrast(
    resolve(semanticTokens[foreground][theme]),
    resolve(semanticTokens[background][theme]),
    "WCAG21"
  );
  const shown = ratio.toFixed(ratioDigits);
  return ratio >= minimum
    ? { html: `<td class="number">${shown}</td>`, outcome: "pass" }
    : {
        html: `<td class="number fail">${shown} Fails</td>`,
        outcome: "fail"
      };
}

function contrastSection(requirements: readonly ContrastRequirement[]): string {
  const checks = requirements.map((requirement) => ({
    requirement,
    results: themes.map((theme) => contrastCheck(requirement, theme))
  }));
  const outcomes = checks.flatMap(({ results }) =>
    results.map(({ outcome }) => outcome)
  );
  const total = outcomes.filter((outcome) => outcome !== "exempt").length;
  const failed = outcomes.filter((outcome) => outcome === "fail").length;
  const summary = outcomes.includes("fail")
    ? `<strong class="fail">${failed} of ${total} checks fail.</strong>`
    : `All ${total} checks pass.`;
  const rows = checks.map(
    ({ requirement: { background, foreground, minimum }, results }) =>
      `<tr><td><code>${foreground}</code></td><td><code>${background}</code></td><td class="number">${minimum}:1</td>${results.map(({ html }) => html).join("")}</tr>`
  );
  return `<p>${summary} Each pairing is measured with WCAG 2 contrast in both themes.</p>
${scrollable(
  "Contrast checks",
  `<table><thead><tr><th scope="col">Foreground</th><th scope="col">Background</th><th scope="col" class="number">Minimum</th><th scope="col" class="number">Light</th><th scope="col" class="number">Dark</th></tr></thead><tbody>${rows.join("")}</tbody></table>`
)}`;
}

function themePicker(): string {
  const options = [
    ["system", "Follow system"],
    ["light", "Light"],
    ["dark", "Dark"]
  ].map(
    ([value, label]) =>
      `<label><input type="radio" name="theme" id="theme-${value}"${value === "system" ? " checked" : ""}>${label}</label>`
  );
  return `<fieldset class="picker"><legend>Page theme</legend>${options.join("")}</fieldset>`;
}

/** The whole preview as one HTML file with its CSS inline. */
export function previewPage(
  requirements: readonly ContrastRequirement[] = contrastRequirements
): string {
  const interfaces = themes.map(interfaceSample).join("");
  const terminals = themes.map(terminal).join("");
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${packageName} ${packageVersion} preview</title>
<style>
${paletteCss()}
${semanticCss()}
${stylesheet}
</style>
</head>
<body id="top">
<header class="masthead">
<h1>${packageName} <span>${packageVersion}</span></h1>
${themePicker()}
</header>
<main>
${colorWall()}
<p class="note">A dot marks a color kept exactly from www.wxx9248.top. The same step should look equally light down each column.</p>
<section class="block"><h2>Role scales</h2>${roleTable()}</section>
<section class="band"><h2 class="block-title">Light and dark</h2><div class="halves">${interfaces}</div></section>
<section class="band"><h2 class="block-title">Terminal</h2><div class="halves">${terminals}</div>
<p class="note">ANSI black disappears in the dark theme, and ANSI white and bright white nearly disappear in the light theme. Each matches a background by design.</p></section>
${otherTokens(`${interfaces}${terminals}${stylesheet}`)}
<section class="block"><h2>Semantic tokens</h2>${tokenTable()}</section>
<section class="block"><h2>Contrast</h2>${contrastSection(requirements)}</section>
</main>
</body>
</html>
`;
}
