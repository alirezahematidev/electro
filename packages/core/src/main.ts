import fse from "fs-extra";
import { resolve } from "path";
import { type RequestOptions, runServer } from "@electro/api";
import { Electro } from "./electro.js";
import { ConfigOptions } from "./types";

async function defineConfig<Name extends string>(options: ConfigOptions<Name>) {
  // try {
  //   /**
  //    *  @todo should read all `node_modules` dirs in the project and find the node_modules dir that the `electro` package is installed into it. then create the temp dir into the same node_modules dir.
  //    */
  //   const temp = resolve(process.cwd(), "node_modules", ".electro");

  //   await fse.emptyDir(temp);

  //   await Promise.all(options.models.map((m) => fse.mkdtemp(resolve(temp, `${m.name}_`))));
  // } catch (error) {
  //   //
  // }

  // options.requestOptions = options.requestOptions ?? {};

  // try {
  //   if (options.requestOptions.enabled) await runServer(options.requestOptions);
  // } catch (error) {
  //   //
  // }

  const electro = new Electro<Name>(options);

  await electro.loadFakerModule();

  console.log(electro.firstName());
}

export { defineConfig };
export type { ConfigOptions };
