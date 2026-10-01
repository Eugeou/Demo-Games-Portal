import type { TelecomPackage } from "@/domain/types";
import type { ITelecomPackagesService } from "./telecom-packages.interface";

const delay = (ms = 160) => new Promise((resolve) => setTimeout(resolve, ms));

const packages: TelecomPackage[] = [
  {
    id: "gttv",
    title: { vi: "Gói GTTV", en: "GTTV pack" },
    shortCode: "97488",
    registerKeyword: "DK GTTV",
    cancelKeyword: "HUY GTTV",
    dailyFee: 3000,
    carrier: "viettel",
  },
  {
    id: "gtt",
    title: { vi: "Gói GTT", en: "GTT pack" },
    shortCode: "97488",
    registerKeyword: "DK GTT",
    cancelKeyword: "HUY GTT",
    dailyFee: 5000,
    carrier: "viettel",
  },
];

export const createTelecomPackagesMock = (): ITelecomPackagesService => ({
  listPackages: async () => {
    await delay();
    return packages;
  },
});
