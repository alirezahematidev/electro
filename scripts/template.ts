import fse from "fs-extra";
import path from "path";

const category = process.argv[2];

function transformCase(input: string): string {
  return input.replace(/(?:^|_)(\w)/g, (_, char) => char.toUpperCase());
}

async function newTemplate() {
  if (!category) {
    console.error("expected the category name but received %s", category);
    process.exit(1);
  }

  const normalizedName = transformCase(category);

  const content = `pub trait ${normalizedName} {
    const EN: &'static [&'static str] = &[];
    const FA: &'static [&'static str] = &[];
}

pub struct Fake${normalizedName};

impl ${normalizedName} for Fake${normalizedName} {}
`;

  const dir = path.resolve(process.cwd(), "crates/src/locales", category);

  const file = path.resolve(dir, "mod.rs");

  await fse.ensureDir(dir);
  await fse.ensureFile(file);
  await fse.writeFile(file, content, { encoding: "utf8" });
}

newTemplate().catch(console.error);
