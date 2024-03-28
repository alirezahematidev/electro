import { type RequestOptions } from "@electro/api";
import { PersonNS, WordNS } from "./namespaces";

// export interface LoremOptions {
//   type: Lorem;
// }

// export interface IntegerOptions {
//   type: Integer;
//   min?: number;
//   max?: number;
//   decimal?: boolean;
//   negative?: boolean;
// }

export interface Bool {
  type: "boolean";
  frequency?: number;
}

export interface Model<N extends string> {
  name: N;
  count?: number;
  schema: Record<string, WordNS.Definition | PersonNS.Definition>;
}

export interface GlobalOptions {
  typescript?: boolean;
  arrayUniqueId?: boolean;
  uniqueIdGenerator?(): string;
}

export interface ConfigOptions<Name extends string> {
  /**
   * @default 'node_modules/.electro'
   */
  output?: string;
  locale?: "fa" | "en" | (() => import("@faker-js/faker").LocaleDefinition);
  localeFallback?: "fa" | "en";
  models: Model<Name>[];
  plugins?: string[];
  requestOptions?: RequestOptions<Name>;
  globalOptions?: GlobalOptions;
}
