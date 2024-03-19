import glob from "fast-glob";
import ts from "typescript";
import fse from "fs-extra";
import { resolve } from "node:path";
import crypto from "node:crypto";
import { fileURLToPath, pathToFileURL } from "url";
import path from "path";
import { defineConfig } from "./main.js";
import extensions from "./extensions.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type TypeDef<T> = T extends ReadonlyArray<infer K extends string> ? `.${K}` : never;

function createConfigHash() {
  return crypto.randomBytes(8).toString("hex");
}

async function compileConfig(filePath: string) {
  try {
    const compilerOptions: ts.CompilerOptions = {
      target: ts.ScriptTarget.ESNext,
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Node10,
    };

    const sourceCode = await fse.readFile(filePath, "utf8");
    const result = ts.transpileModule(sourceCode, { compilerOptions });

    return result.outputText;
  } catch (error) {
    throw error;
    //
  }
}

async function json5Config(file: string) {
  const config = await fse.readFile(file, { encoding: "utf8" });

  const json5 = (await import("json5")).default;

  const options = json5.parse(config);

  defineConfig(options);
}

enum ModuleType {
  TYPESCRIPT,
  JAVASCRIPT,
  JSON,
  JSON5,
}

class Loader {
  private file: string;

  constructor(file: string) {
    this.file = file;
  }

  private href(file: string, base = process.cwd()) {
    return pathToFileURL(resolve(base, file)).href;
  }

  private getModuleType(): ModuleType {
    const extension = path.extname(this.file) as TypeDef<typeof extensions>;

    if (/^.(c|m)?ts/.test(extension)) return ModuleType.TYPESCRIPT;
    else if (/^.(m)?js/.test(extension)) return ModuleType.JAVASCRIPT;
    else if (/^.json/.test(extension)) return ModuleType.JSON;
    else return ModuleType.JSON5;
  }

  private async js() {
    const options = this.href(this.file);
    await import(options);
  }

  private async ts() {
    const hash = createConfigHash();

    let output = await compileConfig(this.file);

    output = output.replace("./dist/main", "./main.js");

    const dest = resolve(process.cwd(), `dist/${hash}.js`);

    await fse.writeFile(dest, output);

    const options = this.href(`${hash}.js`, __dirname);

    await import(options);

    return fse.unlink(`dist/${hash}.js`);
  }

  private async json() {
    const options = await fse.readJSON(this.file, { encoding: "utf8" });
    defineConfig(options);
  }

  private async json5() {
    const config = await fse.readFile(this.file, { encoding: "utf8" });

    const json5 = (await import("json5")).default;

    const options = json5.parse(config);

    defineConfig(options);
  }

  async load() {
    const moduleType = this.getModuleType();

    switch (moduleType) {
      case ModuleType.TYPESCRIPT:
        return this.ts();
      case ModuleType.JAVASCRIPT:
        return this.js();
      case ModuleType.JSON:
        return this.json();
      case ModuleType.JSON5:
        return this.json5();
      default:
        throw new Error("cannot load the file");
    }
  }
}

async function tryLoadConfig() {
  try {
    const [file] = await glob(`**/electro.config.{${extensions.join(",")}}`);

    if (!file) throw new Error("no config file found");

    console.log(`${file} config has been detected.`);

    const loader = new Loader(file);

    await loader.load();
  } catch (error) {
    console.error(error);
  }
}

tryLoadConfig().catch(console.log);
