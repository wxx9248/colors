import { fromRoot, previewDir } from "#/scripts/project.ts";
import { mkdirSync, writeFileSync } from "node:fs";
import { previewPage } from "./page.ts";

const target = new URL("index.html", previewDir);

mkdirSync(previewDir, { recursive: true });
writeFileSync(target, previewPage());
console.log(`Wrote ${fromRoot(target)}. Open ${target.href} in a browser.`);
