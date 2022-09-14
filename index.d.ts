import { WaitForSelectorOptions } from "puppeteer";

export function getHeatMap(
  url: string,
  options: WaitForSelectorOptions
): Promise<string[]>;
