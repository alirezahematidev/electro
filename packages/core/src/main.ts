import fse from "fs-extra";
import { resolve } from "path";
import { type RequestOptions, runServer } from "@electro/api";

interface Char {
  type: "char";
  minLength?: number;
  maxLength?: number;
  case?: "lower" | "upper" | "capital";
  transform?: (value: string) => string;
}

interface Email {
  type: "email";
  provider?: "gmail" | "outlook" | "yahoo";
}

interface Name {
  type: "firstname" | "lastname" | "fullname";
}

interface Integer {
  type: "number";
  min?: number;
  max?: number;
  decimal?: boolean;
  negative?: boolean;
}

interface Bool {
  type: "boolean";
  frequency?: number;
}

interface Model<N extends string> {
  name: N;
  count?: number;
  schema: Record<string, Char | Integer | Email | Name | Bool>;
}

interface GlobalOptions {
  typescript?: boolean;
  arrayUniqueId?: boolean;
  uniqueIdGenerator?(): string;
}

interface ConfigOptions<Name extends string> {
  /**
   * @default 'node_modules/.electro'
   */
  output?: string;
  models: Model<Name>[];
  plugins?: string[];
  requestOptions?: RequestOptions<Name>;
  globalOptions?: GlobalOptions;
}

async function defineConfig<Name extends string>(options: ConfigOptions<Name>) {
  try {
    /**
     *  @todo should read all `node_modules` dirs in the project and find the node_modules dir that the `electro` package is installed into it. then create the temp dir into the same node_modules dir.
     */
    const temp = resolve(process.cwd(), "node_modules", ".electro");

    await fse.emptyDir(temp);

    await Promise.all(options.models.map((m) => fse.mkdtemp(resolve(temp, `${m.name}_`))));
  } catch (error) {
    //
  }

  options.requestOptions = options.requestOptions ?? {};

  try {
    if (options.requestOptions.enabled) await runServer(options.requestOptions);
  } catch (error) {
    //
  }

  console.log(options.models);
}

export { defineConfig };
export type { ConfigOptions };
