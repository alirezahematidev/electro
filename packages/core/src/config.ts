import glob from "fast-glob";
import ts from "typescript";
import fse from "fs-extra";
import { resolve } from "node:path";
import crypto from "node:crypto";
import { fileURLToPath, pathToFileURL } from "url";
import path from "path";
import { defineConfig } from "./main.js";

const EXTS = ["js", "cjs", "mjs", "ts", "cts", "mts", "json", "json5"] as const;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type TypeDef<T> = T extends ReadonlyArray<infer K extends string> ? `.${K}` : never;

enum ModuleType {
  TYPESCRIPT,
  JAVASCRIPT,
  JAVASCRIPT_ESM,
  JSON,
  JSON5,
}

function tryGetTempFiles(file: string) {
  try {
    return /^[0-9A-Fa-f]+\.temp\.(c)?js$/.test(file);
  } catch (error) {
    return false;
  }
}

class Loader {
  private file: string;

  constructor(file: string) {
    this.file = file;
  }

  private createConfigHash() {
    return crypto.randomBytes(8).toString("hex");
  }

  private async compileConfig(filePath: string) {
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

  private getTempName(hash: string) {
    return hash + ".temp.js";
  }

  private tempFilePath(hash: string, base = process.cwd()) {
    return resolve(base, "dist", this.getTempName(hash));
  }

  private href(file: string, base = process.cwd()) {
    return pathToFileURL(resolve(base, file)).href;
  }

  private getModuleType(): ModuleType {
    const ext = path.extname(this.file) as TypeDef<typeof EXTS>;

    if (/^.(c|m)?ts$/.test(ext)) return ModuleType.TYPESCRIPT;
    else if (/^.(m)?js$/.test(ext)) return ModuleType.JAVASCRIPT_ESM;
    else if (/^.cjs$/.test(ext)) return ModuleType.JAVASCRIPT;
    else if (/^.json$/.test(ext)) return ModuleType.JSON;
    else if (/^.json5$/.test(ext)) return ModuleType.JSON5;
    else throw new Error("got unsupported config file extension");
  }

  private async js() {
    const hash = this.createConfigHash();

    const tempFilePath = this.tempFilePath(hash);

    let output = await fse.readFile(this.file, "utf8");

    output = output.replace("./dist/main.js", "./main.js");

    const dest = resolve(process.cwd(), tempFilePath);

    await fse.writeFile(dest, output);

    const options = this.href(this.getTempName(hash), __dirname);

    await import(options);
  }

  private async jsESM() {
    const options = this.href(this.file);

    await import(options);
  }

  private async ts() {
    const hash = this.createConfigHash();

    const filePath = this.tempFilePath(hash);

    let output = await this.compileConfig(this.file);

    output = output.replace("./dist/main", "./main.js");

    const dest = resolve(process.cwd(), filePath);

    await fse.writeFile(dest, output);

    const options = this.href(this.getTempName(hash), __dirname);

    await import(options);
  }

  private async json() {
    const options = await fse.readJSON(this.file, { encoding: "utf8" });
    await defineConfig(options);
  }

  private async json5() {
    const config = await fse.readFile(this.file, { encoding: "utf8" });

    const json5 = (await import("json5")).default;

    const options = json5.parse(config);

    await defineConfig(options);
  }

  async flush() {
    const dir = resolve(process.cwd(), __dirname);

    const files = await fse.readdir(dir);

    const tempFiles = files.filter(tryGetTempFiles);

    await Promise.all(tempFiles.map((file) => fse.remove(resolve(dir, file))));
  }

  async load() {
    const moduleType = this.getModuleType();

    switch (moduleType) {
      case ModuleType.TYPESCRIPT:
        return this.ts();
      case ModuleType.JAVASCRIPT:
        return this.js();
      case ModuleType.JAVASCRIPT_ESM:
        return this.jsESM();
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
    const [file] = await glob(`**/electro.config.{${EXTS.join(",")}}`);

    if (!file) throw new Error("no config file found");

    console.log(`${file} config has been detected.`);

    const loader = new Loader(file);

    await loader.load().finally(loader.flush);
  } catch (error) {
    console.error(error);
  }
}

tryLoadConfig().catch(console.log);
