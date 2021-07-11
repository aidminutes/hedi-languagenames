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

export async function compactData(dataDir: string, exportDir: string) {
	const exportFolder = path.join(exportDir, 'artifacts');
	if (!existsSync(exportFolder))
		Deno.mkdirSync(exportFolder, {recursive : true});

	for await (const dirEntry of Deno.readDir(dataDir)) {
		if (dirEntry.isFile && path.extname(dirEntry.name) === ".json") {
			const raw = await Deno.readFile(path.join(dataDir, dirEntry.name));
			const text = utf8.decode(raw);
			const languageFile = JSON.parse(text) as ILanguageFile;

			const labels = languageFile['translated-names'].reduce((acc, val) => { acc[val.langcode] = val.translation; return acc; }, {} as Record<string,string>);
			const result = {
				direction: languageFile.direction,
				langcodes: [
					languageFile['langcode-1'],
					languageFile['langcode-2'],
					languageFile['langcode-3'],
				],
				labels
			};
			
			const exportFile = path.join(exportFolder,result.langcodes[0]+".json");
			const write = await Deno.writeTextFile(exportFile, JSON.stringify(result,null,2));
			console.log('---> '+exportFile);
		}
	}
	console.log("data exports written");
}