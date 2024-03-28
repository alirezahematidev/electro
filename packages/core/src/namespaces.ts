import type { BaseType, MinMax, PickOf, Separate, TupleOf } from "./utils";

export namespace PersonNS {
  type PersonModule = import("@faker-js/faker").PersonModule;

  type SexType = import("@faker-js/faker").SexType;

  type TPerson = TupleOf<PersonModule, "firstName" | "lastName" | "middleName" | "fullName">;

  type TSeparated = Separate<PersonModule, TPerson[0], "fullName">;

  interface Person_$1 extends BaseType<"person", TSeparated[0]> {
    sex?: SexType;
  }

  interface Person_$2 extends BaseType<"person", TSeparated[1]> {
    firstName?: string;
    lastName?: string;
    sex?: SexType;
  }

  interface Person_$3 extends BaseType<"person", TPerson[1]> {}

  export type Definition = Person_$1 | Person_$2 | Person_$3;
}

export namespace WordNS {
  type WordModule = import("@faker-js/faker").WordModule;

  type TWord = TupleOf<WordModule, "words">;

  interface Word_$1 extends BaseType<"word", TWord[1]> {
    length?: number | MinMax;
    strategy?: "fail" | "closest" | "shortest" | "longest" | "any-length";
    transform?(value: string): string;
  }

  interface Word_$2 extends BaseType<"word", TWord[0]> {
    count?: number | MinMax;
  }

  export type Definition = Word_$1 | Word_$2;
}

// word(options?: number | {
//     /**
//      * The expected length of the word.
//      *
//      * @default 1
//      */
//     length?: number | {
//         /**
//          * The minimum length of the word.
//          */
//         min: number;
//         /**
//          * The maximum length of the word.
//          */
//         max: number;
//     };
//     /**
//      * The strategy to apply when no words with a matching length are found.
//      *
//      * Available error handling strategies:
//      *
//      * - `fail`: Throws an error if no words with the given length are found.
//      * - `shortest`: Returns any of the shortest words.
//      * - `closest`: Returns any of the words closest to the given length.
//      * - `longest`: Returns any of the longest words.
//      * - `any-length`: Returns a word with any length.
//      *
//      * @default 'any-length'
//      */
//     strategy?: 'fail' | 'closest' | 'shortest' | 'longest' | 'any-length';
// }): string;

export namespace LoremNS {
  type LoremModule = import("@faker-js/faker").LoremModule;

  type TWord = PickOf<LoremModule, "word">;
}
