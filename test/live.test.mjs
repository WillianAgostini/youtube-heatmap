// End-to-end smoke test against live YouTube. Needs network access and takes
// ~10-15s. A failure here with a passing guard suite usually means YouTube
// changed its player markup again — check the heat map element's class name.
import { getHeatMap } from "../index.js";

const url = process.argv[2] ?? "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
console.log(`Fetching heat map for ${url} ...`);
const started = Date.now();

const paths = await getHeatMap(url);
const elapsed = ((Date.now() - started) / 1000).toFixed(1);

if (!paths.length || !paths[0].startsWith("M "))
  throw new Error(
    `Unexpected result: ${JSON.stringify(paths).slice(0, 120)}`
  );

console.log(`OK in ${elapsed}s — ${paths.length} path(s), ${paths[0].length} chars`);
console.log(`starts: ${paths[0].slice(0, 80)}`);
