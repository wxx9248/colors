import { distDir } from "#/scripts/project.ts";
import { rmSync } from "node:fs";

// The TypeScript compiler never deletes old output, so removed files would linger
rmSync(distDir, { force: true, recursive: true });
