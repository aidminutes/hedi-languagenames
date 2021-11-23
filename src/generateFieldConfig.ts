import { existsSync } from "https://deno.land/std/fs/mod.ts";
import * as path from "https://deno.land/std/path/mod.ts";

const utf8 = new TextDecoder('utf-8');

export async function generateFieldConfig(dataDir: string, exportDir: string, locales = [] as string[]) {
	const exportFolder = path.join(exportDir, 'config','install');
	if (!existsSync(exportFolder))
		Deno.mkdirSync(exportFolder, {recursive : true});

	for await (const dirEntry of Deno.readDir(dataDir)) {
		if (dirEntry.isFile && path.extname(dirEntry.name) === ".json") {
			const raw = await Deno.readFile(path.join(dataDir, dirEntry.name));
			const text = utf8.decode(raw);
			const locale = JSON.parse(text)['langcode-1'];
			if (locales.length === 0 || locales.includes(locale)) {
				const code = locale.replace('-','').toLowerCase();

				generateStorageYml(code, exportFolder);
				generateFieldYml(code, exportFolder);
			}
		}
	}
}

function generateStorageYml(code: string, exportFolder: string) {
	const config = `langcode: de
status: true
dependencies:
  module:
    - hedi_language
id: hedi_language.field_${code}
field_name: field_${code}
entity_type: hedi_language
type: string
settings:
  max_length: 255
	is_ascii: false
  case_sensitive: true
module: core
cardinality: 1
translatable: true
indexes: {  }
`;
	const filename = `field.storage.hedi_language.field_${code}.yml`;
	Deno.writeTextFile(path.join(exportFolder,filename), config).then(() => console.log('generated '+filename));
}

function generateFieldYml(code: string, exportFolder: string) {
	const config = `langcode: de
status: true
dependencies:
  config:
    - field.storage.hedi_language.field_${code}
  module:
    - hedi_language
id: hedi_language.hedi_language.field_${code}
field_name: field_${code}
entity_type: hedi_language
bundle: hedi_language
label: ${code}
field_type: string
default_value: {  }
default_value_callback: ''
settings: {  }
`;
	const filename = `field.field.hedi_language.hedi_language.field_${code}.yml`;
	Deno.writeTextFile(path.join(exportFolder,filename), config).then(() => console.log('generated '+filename));
}