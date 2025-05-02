//@ts-check
import { execSync, spawnSync } from "child_process";
import esbuild from "esbuild";
import { cp, cpSync, existsSync, linkSync, mkdirSync, readFileSync, rm, rmSync, symlinkSync } from "fs";
import parseArg from "minimist";
import watch from "node-watch";
import path, { resolve } from "path";
import { Zip } from "zip-lib";

const args = parseArg(process.argv);
const subcommand = args._[2];
const dirname = import.meta.dirname;

const worldDir = "MCCxMCReborn+";
const mcdir = `${process.env["localappdata"]}\\Packages\\Microsoft.MinecraftUWP_8wekyb3d8bbwe\\LocalState\\games\\com.mojang\\`;
const bpPath =
  args.mode == "dev" && subcommand == "watch"
    ? path.join(mcdir, "development_behavior_packs/mccr")
    : resolve("./build/bp/mccr");
const rpPath =
  args.mode == "dev" && subcommand == "watch"
    ? path.join(mcdir, "development_resource_packs/mccr")
    : resolve("./build/rp/mccr");

async function compress(output, content) {
  const zip = new Zip();
  zip.addFolder(path.resolve(content));
  await zip.archive(output).then(
    () => {
      console.log(`> Compressed: ${content} -> ${output}`);
    },
    (e) => {
      console.error(`Compressed file failed to be created at ${output} : ${e}`);
    }
  );
}

function cleanIfExists(p) {
  if (existsSync(p)) {
    rmSync(p, { recursive: true });
  }
  mkdirSync(p, { recursive: true });
}

/**@type {import("esbuild").BuildOptions} */
const config = {
  sourcemap: args.mode == "dev",
  entryPoints: [path.resolve("./scripts/main.ts")],
  minify: !(args.mode == "dev"),
  bundle: true,
  external: ["@minecraft/server", "@minecraft/server-ui"],
  format: "esm",
  define: {
    isDevMode: args.mode == "dev" ? "true" : "false",
  },
  outfile: resolve(path.join(bpPath, "scripts/main.js")),
  plugins: [
    {
      name: "mcpack",
      setup(build) {
        let buildTimes = 0;
        let startTime = 0;
        build.onStart(() => {
          startTime = new Date().getTime();
          if (subcommand == "build" || (subcommand == "watch" && buildTimes == 0)) {
            console.log("> Clean");
            cleanIfExists(bpPath);
            cleanIfExists(rpPath);
            console.log("> Copy data");
            cpSync(resolve("./behavior_packs/mccr"), bpPath, { recursive: true });
            cpSync(resolve("./resource_packs/mccr"), rpPath, { recursive: true });
          }
          if (args.release) {
            console.log("> Copy world");
            cpSync(resolve("./world"), resolve("./build/world"), { recursive: true });
            cpSync(resolve("./world_template"), resolve("./build/world"), { recursive: true });
          }
        });
        build.onEnd(async (r) => {
          if (r.errors.length == 0) {
            if (subcommand == "build" && args.release) {
              cpSync(bpPath, resolve("./build/world/behavior_packs"));
              cpSync(rpPath, resolve("./build/world/resource_packs"));
              await compress(resolve("./dist/mccr_bp.mcpack"), bpPath);
              await compress(resolve("./dist/mccr_rp.mcpack"), rpPath);
              await compress(resolve("./dist/MCCxMinecraft.mcworld"), resolve("./build/world"));
              await compress(resolve("./dist/MCCxMinecraft.mctemplate"), resolve("./build/world"));
            }
            buildTimes++;
            console.log(`\x1b[1;32mBuilt in ${new Date().getTime() - startTime}ms\x1b[0m`);
          } else {
            console.log(`\x1b[1;31mBuild failed. ${r.errors.length} errors found.\x1b[0m`);
          }
        });
      },
    },
  ],
};

function generateData() {
  console.log(execSync("python " + path.join(dirname, "mcdataCompiler.py"), { cwd: resolve(".") }).toString());
}

async function fetchMCPackageVersion(p) {
  let pkg = JSON.parse(readFileSync(resolve("package.json")).toString());
  const registry = await (await fetch("https://registry.npmmirror.com/" + p)).json();
  const versions = Object.keys(registry.versions);
  let beta_stable = versions.filter((v) => /.*-beta.*-stable/.test(v));
  let latest = beta_stable[beta_stable.length - 1];
  let latest_version = latest.match(/.*-beta\.(.*)-stable/)?.[1];
  let latest_id = latest.match(/(.*-beta).*-stable/)?.[1];
  console.log(
    `\x1b[1;35mPackage: ${p}\x1b[0m\n\x1b[1;32mDependency version: \x1b[0m`,
    latest,
    "\n\x1b[1;32mMinecraft version: \x1b[0m",
    latest_version,
    "\n\x1b[1;32mManifest detail: \x1b[0m",
    latest_id,
    "\n\x1b[1;34mCurrent: \x1b[0m",
    pkg.dependencies[p],
    "\n"
  );
  return `${p}@${latest}`;
}

const subcommands = {
  build: async () => {
    generateData();
    esbuild.build(config).catch((e) => undefined);
  },
  watch: async () => {
    generateData();
    const ctx = await esbuild.context(config);
    await ctx.watch();
    watch(resolve("./behavior_packs/mccr"), { recursive: true }).on("change", (e, fn) => {
      const relpath = path.relative(resolve("./behavior_packs/mccr"), fn.toString());
      if (e == "update") {
        cpSync(fn.toString(), path.join(bpPath, relpath), { recursive: true });
        console.log("[\x1b[1;34mupdate\x1b[0m] BP\\", relpath);
      } else {
        rmSync(path.join(bpPath, relpath), { recursive: true });
        console.log("[\x1b[1;31mremove\x1b[0m] BP\\", relpath);
      }
    });
    watch(resolve("./resource_packs/mccr"), { recursive: true }).on("change", (e, fn) => {
      const relpath = path.relative(resolve("./resource_packs/mccr"), fn.toString());
      if (e == "update") {
        cpSync(fn.toString(), path.join(rpPath, relpath), { recursive: true });
        console.log("[\x1b[1;34mupdate\x1b[0m] RP\\", relpath);
      } else {
        rmSync(path.join(rpPath, relpath), { recursive: true });
        console.log("[\x1b[1;31mremove\x1b[0m] RP\\", relpath);
      }
    });
    watch(resolve("./mcdata"), { recursive: true }).on("change", (e, fn) => {
      console.log("[\x1b[1;34mupdate\x1b[0m] Compile data files");
      generateData();
    });
    console.log("\x1b[1;32mWatching for file changes...\x1b[0m");
  },
  "sync-world": () => {
    if (existsSync(path.join(mcdir, "minecraftWorlds", worldDir))) {
      cpSync(path.join(mcdir, "minecraftWorlds", worldDir), resolve("./world"), { recursive: true });
    } else {
      cpSync(resolve("./world"), path.join(mcdir, "minecraftWorlds", worldDir), { recursive: true });
    }
  },
  "check-update": async () => {
    let v = [await fetchMCPackageVersion("@minecraft/server"), await fetchMCPackageVersion("@minecraft/server-ui")];
    console.log(`\x1b[1mRun 'npm i ${v.join(" ")} --force' to update\x1b[0m`);
  },
};

if (subcommands[subcommand]) {
  subcommands[subcommand]();
} else {
  console.error("Invalid subcommand.");
}
