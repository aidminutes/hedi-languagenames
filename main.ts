import { capitalizeTranslations } from "./src/capitalize.ts";
import { compactData } from "./src/compactData.ts";
import { generateFieldConfig } from "./src/generateFieldConfig.ts";
import { generateGermanCSV } from "./src/generateGermanCSV.ts";

const dataDir = "data";
const exportDir = "export";

run();

async function run() {
	const input = readArgs();
	if (Object.keys(input).length > 0) {
		if ('capitalize' in input) {
			console.log(':: running capitalize')
			await capitalizeTranslations(dataDir, input.compactData);
		}
		if ('compactData' in input) {
			console.log(':: running compactData')
			await compactData(dataDir, exportDir, input.compactData);
		}
		if ('generateFieldConfig' in input) {
			console.log(':: running generateFieldConfig')
			await generateFieldConfig(dataDir, exportDir, input.generateFieldConfig);
		}
		if ('generateGermanCSV' in input) {
			console.log(':: running generateGermanCSV')
			await generateGermanCSV(dataDir, exportDir);
		}

	} else {
		console.log(`Language Data Converter
---
run with options:
- "--compactData" optional whitespace separated locales to include labels for
- "--generateFieldConfig" optional whitespace separated locales generate ymls for
`);
	}
}

function readArgs(): Record<string,string[]> {
	let curCmd = "";
	const input: Record<string,string[]> = {};
	for (const arg of Deno.args) {
		if (arg.startsWith('--')) {
			curCmd = arg.slice(2);
			input[curCmd] = [];
		} else if (curCmd) {
			input[curCmd].push(arg);
		}
	}
	return input;
}