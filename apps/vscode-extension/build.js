//@ts-check
"use strict";

const esbuild = require("esbuild");
const path = require("path");

const production = process.argv.includes("--production");
const watch = process.argv.includes("--watch");

/**
 * @type {import('esbuild').Plugin}
 */
const esbuildProblemMatcherPlugin = {
  name: "esbuild-problem-matcher",
  setup(build) {
    let startTime;

    build.onStart(() => {
      startTime = Date.now();
      console.log("[watch] build started");
    });
    build.onEnd((result) => {
      const duration = Date.now() - startTime;

      result.errors.forEach(({ text, location }) => {
        console.error(`✘ [ERROR] ${text}`);
        if (location) {
          console.error(
            `    ${location.file}:${location.line}:${location.column}:`,
          );
        }
      });

      if (result.errors.length === 0) {
        const fs = require("fs");
        try {
          const stats = fs.statSync("dist/extension.js");
          const fileSizeInKB = (stats.size / 1024).toFixed(1);
          console.log(
            `[watch] build finished in ${duration}ms ✓ (${fileSizeInKB} KB)`,
          );
        } catch {
          console.log(`[watch] build finished in ${duration}ms ✓`);
        }
      } else {
        console.log(
          `[watch] build finished in ${duration}ms with ${result.errors.length} error(s)`,
        );
      }
    });
  },
};

/**
 * @type {import('esbuild').Plugin}
 */
const aliasPlugin = {
  name: "alias",
  setup(build) {
    build.onResolve({ filter: /^@repo\/utils$/ }, () => ({
      path: path.resolve(__dirname, "../../packages/utils/src/index.ts"),
    }));
    build.onResolve({ filter: /^@repo\/trpc$/ }, () => ({
      path: path.resolve(__dirname, "../../packages/trpc/src/index.ts"),
    }));
  },
};

async function main() {
  const ctx = await esbuild.context({
    entryPoints: ["src/extension.ts"],

    bundle: true,

    format: "cjs",

    platform: "node",

    outfile: "dist/extension.js",

    minify: production,
    sourcemap: production ? false : true,
    sourcesContent: false,

    external: ["vscode", "express"],

    resolveExtensions: [".ts", ".js", ".cjs"],

    plugins: [esbuildProblemMatcherPlugin, aliasPlugin],

    tsconfig: path.resolve(__dirname, "./tsconfig.json"),

    logLevel: "info",

    target: "node16",
  });

  if (watch) {
    console.log("Watching for changes...");
    await ctx.watch();
  } else {
    const startTime = Date.now();
    await ctx.rebuild();
    const duration = Date.now() - startTime;
    console.log(`Build completed in ${duration}ms ✓`);
    await ctx.dispose();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
