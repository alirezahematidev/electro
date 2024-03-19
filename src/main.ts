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

interface Model {
  name: string;
  count?: number;
  schema: Record<string, Char | Integer | Email | Name | Bool>;
}

interface RequestOptions {
  methods?: ["get", "post", "put", "patch", "delete"];
}

interface GlobalOptions {
  arrayUniqueId?: boolean;
  uniqueIdGenerator?(): string;
}

interface ConfigOptions {
  output: string;
  model: Model;
  requestOptions?: RequestOptions;
  globalOptions?: GlobalOptions;
}

function defineConfig(options: ConfigOptions) {
  console.log(options);
}

export { defineConfig };
export type { ConfigOptions };
