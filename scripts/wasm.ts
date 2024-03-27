import { execa } from "execa";
import path from "path";

const cwd = path.resolve(process.cwd(), "crates");

const args = ["build"];

// set target
args.push(...["--target", "nodejs"]);

// set out name
args.push(...["--out-name", "main"]);

// set out directory
const out = path.resolve(process.cwd(), "packages/generator");
args.push(...["--out-dir", out]);

// set scope
args.push(...["--scope", "electro"]);

execa("wasm-pack", args, { stdio: "inherit", encoding: "utf8", cwd });
