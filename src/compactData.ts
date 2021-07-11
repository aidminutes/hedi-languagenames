import { existsSync } from "https://deno.land/std/fs/mod.ts";
import * as path from "https://deno.land/std/path/mod.ts";

const utf8 = new TextDecoder('utf-8');

interface ILanguageFile {
	native?: string;
	english: string;
	wikipedia?: string;
	direction: "ltr" | "rtl";
	"langcode-1": string;
	"langcode-2": string;
	"langcode-3": string;
	"translated-names": [{
		langcode: string;
		translation: string;
	}]
}

export async function compactData(dataDir: string, exportDir: string, locales = [] as string[]) {
	const exportFolder = path.join(exportDir, 'artifacts');
	if (!existsSync(exportFolder))
		Deno.mkdirSync(exportFolder, {recursive : true});

	let counter = 0;
	for await (const dirEntry of Deno.readDir(dataDir)) {
		if (dirEntry.isFile && path.extname(dirEntry.name) === ".json") {
			const raw = await Deno.readFile(path.join(dataDir, dirEntry.name));
			const text = utf8.decode(raw);
			const languageFile = JSON.parse(text) as ILanguageFile;
			const labels = languageFile['translated-names'].reduce((acc, val) => { 
				if (locales.length === 0 || locales.includes(val.langcode)) {
					acc[val.langcode] = val.translation; 
				}
				return acc; 
			}, 
			{} as Record<string,string>);
			const codes = [
				languageFile['langcode-1'],
				languageFile['langcode-2'],
				languageFile['langcode-3'],
			];
			const result = {
				code: codes[0],
				direction: languageFile.direction,
				codes,
				labels,
			};
			
			const exportFile = path.join(exportFolder,result.code+".json");
			const write = await Deno.writeTextFile(exportFile, JSON.stringify(result,null,2));
			console.log('---> '+exportFile);
			counter++;
		}
	}
	console.log(counter+" data exports written");
}