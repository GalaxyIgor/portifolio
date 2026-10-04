import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import ts from "typescript";

function data(file, name) {
  const dataModule = { exports: {} };
  const { outputText } = ts.transpileModule(readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  });
  runInNewContext(outputText, {
    module: dataModule,
    exports: dataModule.exports,
    process,
  });
  return dataModule.exports[name];
}

process.stdout.write(
  JSON.stringify({
    profile: data("src/data/profile.ts", "profile"),
    experience: data("src/data/experience.ts", "experience"),
    projects: data("src/data/projects.ts", "projects"),
    skills: data("src/data/skills.ts", "skillGroups"),
    certifications: data("src/data/certifications.ts", "certifications"),
    messages: Object.fromEntries(
      ["pt", "en"].map((locale) => [
        locale,
        JSON.parse(readFileSync(`src/messages/${locale}.json`, "utf8")),
      ]),
    ),
  }),
);
