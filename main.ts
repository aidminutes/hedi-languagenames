import { compactData } from "./src/compactData.ts";
import { generateFieldConfig } from "./src/generateFieldConfig.ts";

const dataDir = "data";
const exportDir = "export";

run();

async function run() {
	const args:string[] = Deno.args;
	if (args?.length !== 0) {
		if (args.includes('compactData')) {
			console.log(':: running compactData')
			await compactData(dataDir, exportDir);
		}
		if (args.includes('generateFieldConfig')) {
			console.log(':: running generateFieldConfig')
			await generateFieldConfig(dataDir, exportDir);
		}

	} else {
		console.log(`Language Data Converter
---
run with options:
- "compactData"
- "generateFieldConfig"
`);
	}
}