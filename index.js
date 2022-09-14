import cheerio from "cheerio";
import puppeteer from "puppeteer";

export async function getHeatMap(url) {
  const html = await getHtml(url);
  return getHeatMapFromHtml(html);
}

const cssHeatMapPath = ".ytp-heat-map-path";

async function getHtml(url, options) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url);
  await page?.waitForSelector(cssHeatMapPath, options);

  const html = await page.content();
  await page?.close({ runBeforeUnload: true });
  await browser?.close();
  return html;
}

function getHeatMapFromHtml(html) {
  const $ = cheerio.load(html);
  const d = $(cssHeatMapPath).map(function () {
    return $(this).attr("d");
  });

  if (!d.length)
    throw new Error(`Tag '${cssHeatMapPath}' not found or is empty.`);

  return d.toArray();
}
