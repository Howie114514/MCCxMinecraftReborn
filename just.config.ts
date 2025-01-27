import { argv, parallel, series, task, tscTask } from "just-scripts";
import {
  BundleTaskParameters,
  CopyTaskParameters,
  bundleTask,
  cleanTask,
  cleanCollateralTask,
  copyTask,
  coreLint,
  mcaddonTask,
  setupEnvironment,
  ZipTaskParameters,
  STANDARD_CLEAN_PATHS,
  DEFAULT_CLEAN_DIRECTORIES,
  getOrThrowFromProcess,
  watchTask,
  zipTask,
} from "@minecraft/core-build-tasks";
import { execSync } from "child_process";

import path from "path";
import mctemplate from "./mccr-build-tasks/mctemplate";
import http from "http";

// Setup env variables
setupEnvironment(path.resolve(__dirname, ".env"));
const projectName = getOrThrowFromProcess("PROJECT_NAME");

const bundleTaskOptions: BundleTaskParameters = {
  entryPoint: path.join(__dirname, "./scripts/main.ts"),
  external: ["@minecraft/server", "@minecraft/server-ui"],
  outfile: path.resolve(__dirname, "./dist/scripts/main.js"),
  minifyWhitespace: false,
  sourcemap: true,
  outputSourcemapPath: path.resolve(__dirname, "./dist/debug"),
};

const copyTaskOptions: CopyTaskParameters = {
  copyToBehaviorPacks: [`./behavior_packs/${projectName}`],
  copyToScripts: ["./dist/scripts"],
  copyToResourcePacks: [`./resource_packs/${projectName}`],
};

const mcaddonTaskOptions: ZipTaskParameters = {
  ...copyTaskOptions,
  outputFile: `./dist/packages/${projectName}.mcaddon`,
};

// Lint
task("lint", coreLint(["scripts/**/*.ts"], argv().fix));

// Build
task("generateData", () => {
  console.log(execSync("python mcdataCompiler.py").toString("utf-8"));
});
task("typescript", tscTask());
task("bundle", bundleTask(bundleTaskOptions));
task("build", series("generateData", "typescript", "bundle"));

// Clean
task("clean-local", cleanTask(DEFAULT_CLEAN_DIRECTORIES));
task("clean-collateral", cleanCollateralTask(STANDARD_CLEAN_PATHS));
task("clean", parallel("clean-local", "clean-collateral"));

// Package
task("copyArtifacts", copyTask(copyTaskOptions));
task("package", series("clean-collateral", "copyArtifacts"));

// Local Deploy used for deploying local changes directly to output via the bundler. It does a full build and package first just in case.
task("set-dev-environment", () => {
  execSync("python setEnv.py true");
});
task("reload", () => {
  try {
    execSync("curl http://localhost:3000");
  } catch (err) {
    console.warn("[自动重载] 无法执行reload");
  }
});
task(
  "local-deploy",
  watchTask(
    ["scripts/**/*.ts", "behavior_packs/**/*.{json,lang,png}", "resource_packs/**/*.{json,lang,png}"],
    series("clean-local", "set-dev-environment", "build", "package", "reload")
  )
);
task("set-environment", () => {
  execSync("python setEnv.py false");
});
// Mcaddon
task("createMcaddonFile", mcaddonTask(mcaddonTaskOptions));
task("mcaddon", series("clean-local", "set-environment", "build", "createMcaddonFile"));

//MCTemplate
task("createMCTemplateFile", mctemplate);
task("Compress", zipTask("./dist/MCC X Minecraft.mctemplate", [{ contents: ["./dist/mctemplate/"] }]));
task("Compress1", zipTask("./dist/MCC X Minecraft.mcworld", [{ contents: ["./dist/mctemplate/"] }]));
task("mctemplate", series("clean-local", "set-environment", "build", "createMCTemplateFile", "Compress", "Compress1"));
