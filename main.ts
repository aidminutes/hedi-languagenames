import { compactData } from "./src/compactData.ts";

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

	} else {
		console.log(`Language Data Converter
---
run with options:
- "compactData"
`);
	}
}