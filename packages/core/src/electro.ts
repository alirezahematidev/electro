import type { ConfigOptions } from "./types";
import { ElectroModule } from "./utils";

export class Electro<Name extends string> {
  private faker: ElectroModule | null = null;

  private options: ConfigOptions<Name>;

  private locale: NonNullable<ConfigOptions<Name>["locale"]>;
  private localeFallback: NonNullable<ConfigOptions<Name>["localeFallback"]>;

  constructor(options: ConfigOptions<Name>) {
    this.options = options;

    this.locale = options.locale || "en";

    this.localeFallback = options.localeFallback || "en";
  }

  async loadFakerModule() {
    try {
      if (typeof this.locale === "function") {
        //TODO: add rollup bundler to project and treeshake the faker package.
        const { Faker, allLocales, mergeLocales } = await import(`@faker-js/faker`);

        const customDefinition = this.locale();

        const fallbackDefinition = allLocales[this.localeFallback];

        this.faker = new Faker({ locale: mergeLocales([customDefinition, fallbackDefinition]) });
      } else {
        const { faker } = await import(`@faker-js/faker/locale/${this.locale}`);

        this.faker = faker;
      }
    } catch (error) {
      console.error(`Unsupported locale: %s`, this.locale);
    }
  }

  private isFakerLoaded(faker: any): faker is ElectroModule {
    return faker !== null && typeof faker === "object";
  }

  // export type Person = `person.${keyof import("@faker-js/faker").PersonModule}`;
  // export type Location = `location.${keyof import("@faker-js/faker").LocationModule}`;
  // export type Airline = `airline.${keyof import("@faker-js/faker").AirlineModule}`;
  // export type Animal = `animal.${keyof import("@faker-js/faker").AnimalModule}`;
  // export type Color = `color.${keyof import("@faker-js/faker").ColorModule}`;
  // export type Commerce = `commerce.${keyof import("@faker-js/faker").CommerceModule}`;
  // export type Company = `company.${keyof import("@faker-js/faker").CompanyModule}`;
  // export type Database = `database.${keyof import("@faker-js/faker").DatabaseModule}`;
  // export type Datatype = `datatype.${keyof import("@faker-js/faker").DatatypeModule}`;
  // export type Date = `date.${keyof import("@faker-js/faker").DateModule}`;
  // export type Finance = `finance.${keyof import("@faker-js/faker").FinanceModule}`;
  // export type Git = `git.${keyof import("@faker-js/faker").GitModule}`;
  // export type Hacker = `hacker.${keyof import("@faker-js/faker").HackerModule}`;
  // export type Image = `image.${keyof import("@faker-js/faker").ImageModule}`;
  // export type Internet = `internet.${keyof import("@faker-js/faker").InternetModule}`;
  // export type Lorem = `lorem.${keyof import("@faker-js/faker").LoremModule}`;
  // export type Music = `music.${keyof import("@faker-js/faker").MusicModule}`;
  // export type Integer = `number.${keyof import("@faker-js/faker").NumberModule}`;
  // export type Phone = `phone.${keyof import("@faker-js/faker").PhoneModule}`;
  // export type Science = `science.${keyof import("@faker-js/faker").ScienceModule}`;
  // export type Word = `word.${keyof import("@faker-js/faker").WordModule}`;
  // export type Char = `string.${keyof import("@faker-js/faker").StringModule}`;
  // export type Vehicle = `vehicle.${keyof import("@faker-js/faker").VehicleModule}`;
  // export type System = `system.${keyof import("@faker-js/faker").SystemModule}`;

  public firstName() {
    if (!this.isFakerLoaded(this.faker)) throw new Error("cannot load faker module");

    return this.faker.person.firstName();
  }
}
