import { distDir, fromRoot } from "#/scripts/project.ts";
import { expect, it } from "vitest";
import { outputFiles } from "#/scripts/render.ts";
import packageJson from "#/package.json" with { type: "json" };

it("exports every file the build writes, and nothing else", () => {
  const { ".": entry, ...fileExports } = packageJson.exports;
  expect(entry).toBeDefined();
  expect(fileExports).toEqual(
    Object.fromEntries(
      Object.values(outputFiles).map((file) => [
        `./${file}`,
        `./${fromRoot(distDir)}/${file}`
      ])
    )
  );
});
