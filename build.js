const esbuild = require("esbuild");

esbuild
  .build({
    entryPoints: ["src/*.ts"],
    bundle: false,
    outdir: "dist",
    target: ["chrome96"], // or current
    format: "esm",
  })
  .catch(() => process.exit(1));
