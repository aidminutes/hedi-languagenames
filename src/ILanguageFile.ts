export interface ILanguageFile {
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