import * as path from "https://deno.land/std/path/mod.ts";

import { ILanguageFile } from "./ILanguageFile.ts";

const utf8 = new TextDecoder('utf-8');

export async function capitalizeTranslations(dataDir: string, locales = [] as string[]) {

	let counter = 0;
	for await (const dirEntry of Deno.readDir(dataDir)) {
		if (dirEntry.isFile && path.extname(dirEntry.name) === ".json") {
      const filePath = path.join(dataDir, dirEntry.name); 
			const raw = await Deno.readFile(filePath);
			const text = utf8.decode(raw);
			const languageFile = JSON.parse(text) as ILanguageFile;
			languageFile['translated-names'].forEach(entry => {
        entry.translation = capitalizeFirstLetter(entry.translation);
      });
			
			const write = await Deno.writeTextFile(filePath, JSON.stringify(languageFile,null,2));
			console.log('---> capitalized '+dirEntry.name);
			counter++;
		}
	}
	console.log(counter+" translations capitalized");
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}