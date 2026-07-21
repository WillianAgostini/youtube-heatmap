import { load } from "cheerio";
import puppeteer from "puppeteer";

// YouTube's redesigned player draws the heat map in `path.ytp-modern-heat-map`;
// `.ytp-heat-map-path` remains in the DOM as an always-empty clipPath stub.
const cssHeatMapPath = "path.ytp-modern-heat-map, .ytp-heat-map-path";

async function getHtml(url, options) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url);
  // The empty stub mounts before the curve data arrives, so waiting for the
  // selector alone can snapshot too early — wait for a populated path instead.
  await page.waitForFunction(
    (selector) =>
      Array.from(document.querySelectorAll(selector)).some((el) =>
        (el.getAttribute("d") || "").trim()
      ),
    options,
    cssHeatMapPath
  );

  const html = await page.content();
  await page?.close();
  await browser?.close();
  return html;
}

function getHeatMapFromHtml(html) {
  const $ = load(html);
  const d = $(cssHeatMapPath)
    .map(function () {
      return $(this).attr("d");
    })
    .toArray()
    .filter((path) => path && path.trim());

  if (!d.length)
    throw new Error(`Tag '${cssHeatMapPath}' not found or is empty.`);

  return d;
}

export async function getHeatMap(url, options) {
  const html = await getHtml(url, options);
  return getHeatMapFromHtml(html);
}
