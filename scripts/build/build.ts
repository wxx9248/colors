import { distDir, fromRoot, jsonIndent } from "#/scripts/project.ts";
import {
  indexCss,
  outputFiles,
  paletteCss,
  semanticCss,
  tokensJson
} from "./render.ts";
import { mkdirSync, writeFileSync } from "node:fs";

// Runs after tsc, which writes the JavaScript entry point into the same folder
mkdirSync(distDir, { recursive: true });
const files: Record<string, string> = {
  [outputFiles.index]: indexCss(),
  [outputFiles.palette]: paletteCss(),
  [outputFiles.semantic]: semanticCss(),
  [outputFiles.tokens]: `${JSON.stringify(tokensJson(), null, jsonIndent)}\n`
};
for (const [name, content] of Object.entries(files)) {
  writeFileSync(new URL(name, distDir), content);
}
console.log(`Wrote ${Object.keys(files).join(", ")} to ${fromRoot(distDir)}/`);
