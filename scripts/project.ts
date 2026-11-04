import { fileURLToPath } from "node:url";
import packageJson from "#/package.json" with { type: "json" };
import { relative } from "node:path";

/** Project-wide facts for the build scripts, each defined once. */

export const packageName = packageJson.name;

export const rootDir = new URL("../", import.meta.url);
// Published output; also listed in package.json "files" and tsconfig.build.json
export const distDir = new URL("dist/", rootDir);
// Generated runtime source, git-ignored; src/palette.ts imports from it
export const generatedDir = new URL("src/generated/", rootDir);

export const jsonIndent = 2;

/** A path relative to the repository root, for messages and package.json. */
export function fromRoot(url: URL): string {
  return relative(fileURLToPath(rootDir), fileURLToPath(url));
}
