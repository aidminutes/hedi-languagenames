import { existsSync } from "https://deno.land/std/fs/mod.ts";
import * as path from "https://deno.land/std/path/mod.ts";

import { ILanguageFile } from "./ILanguageFile.ts";

const utf8 = new TextDecoder("utf-8");

interface IGermanCSVRecord {
  lang_code: string;
  Name: string;
  Original: string;
  Englisch: string;
  dir: string;
}

export async function generateGermanCSV(dataDir: string, exportDir: string) {
  const exportFolder = path.join(exportDir, "csv");
  if (!existsSync(exportFolder))
    Deno.mkdirSync(exportFolder, { recursive: true });

  const record: IGermanCSVRecord = {
    lang_code: "",
    Name: "",
    Original: "",
    Englisch: "",
    dir: "",
  };

  let rawCSV = Object.keys(record).join(",") + "\r\n";

  const languages: any[] = [];
  for await (const dirEntry of Deno.readDir(dataDir)) {
    if (dirEntry.isFile && path.extname(dirEntry.name) === ".json") {
      const raw = await Deno.readFile(path.join(dataDir, dirEntry.name));
      const text = utf8.decode(raw);
      const languageFile = JSON.parse(text) as ILanguageFile;
      const germanName = languageFile["translated-names"].find(
        (t) => t.langcode === "de"
      )?.translation;
      if (germanName) {
        const codes = [
          languageFile["langcode-1"],
          languageFile["langcode-2"],
          languageFile["langcode-3"],
        ];

        const data: IGermanCSVRecord = {
          lang_code: codes[0],
          Name: germanName,
          Original: languageFile.native ?? languageFile.english,
          Englisch: languageFile.english,
          dir: languageFile.direction,
        };

        rawCSV += serializeDataRecord(data) + "\r\n";
      }
    }
  }

  const exportFile = path.join(exportFolder, "FullGermanList.csv");
  const write = await Deno.writeTextFile(exportFile, rawCSV);
  console.log("German csv written");
}

function serializeDataRecord(data: IGermanCSVRecord) {
  return `${data.lang_code},"${data.Name}","${data.Original}","${data.Englisch}",${data.dir}`;
}
