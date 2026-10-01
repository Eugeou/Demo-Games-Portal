export interface TelecomPackage {
  id: string;
  title: { vi: string; en: string };
  shortCode: string;
  registerKeyword: string;
  cancelKeyword: string;
  dailyFee: number;
  carrier: "viettel";
}

export function pickPackageTitle(pack: TelecomPackage, language: string) {
  return language.toLowerCase().startsWith("en") ? pack.title.en : pack.title.vi;
}
