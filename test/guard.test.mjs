// Deterministic tests for getHeatMap's extraction and error behavior.
// Serves synthetic player markup from a local HTTP server, so no network
// access to YouTube is needed and results don't depend on YouTube's uptime.
import http from "node:http";
import { getHeatMap } from "../index.js";

const REAL_PATH =
  "M 0,100 C 1,97 2,95 5.0,90 C 8,85 9,80 15.0,60 C 20,50 25,40 25.0,30";

const page = (body) =>
  `<html><body><svg class="ytp-heat-map-svg" viewBox="0 0 1000 100">${body}</svg></body></html>`;
const legacy = (d) => `<path class="ytp-heat-map-path" d="${d}"></path>`;
const modern = (d) => `<path class="ytp-modern-heat-map" d="${d}"></path>`;

const cases = [
  { route: "/modern-populated", html: page(modern(REAL_PATH)), expect: "returns 1 path" },
  { route: "/legacy-populated", html: page(legacy(REAL_PATH)), expect: "returns 1 path" },
  // Real YouTube pages contain an always-empty legacy stub next to the
  // populated modern path; only the modern one should come back.
  { route: "/stub-plus-modern", html: page(legacy("") + modern(REAL_PATH)), expect: "returns 1 path" },
  { route: "/empty", html: page(legacy("")), expect: "throws" },
  { route: "/whitespace", html: page(legacy("   ")), expect: "throws" },
  { route: "/missing-attr", html: page(`<path class="ytp-heat-map-path"></path>`), expect: "throws" },
];

const server = http.createServer((req, res) => {
  const match = cases.find((c) => c.route === req.url);
  res.writeHead(match ? 200 : 404, { "Content-Type": "text/html" });
  res.end(match ? match.html : "not found");
});
await new Promise((resolve) => server.listen(0, resolve));
const { port } = server.address();

let failures = 0;
for (const c of cases) {
  let actual;
  try {
    const paths = await getHeatMap(`http://localhost:${port}${c.route}`, {
      timeout: 4000,
    });
    actual = `returns ${paths.length} path${paths.length === 1 ? "" : "s"}`;
  } catch {
    actual = "throws";
  }
  const ok = actual === c.expect;
  if (!ok) failures++;
  console.log(
    `${ok ? "PASS" : "FAIL"}  ${c.route.padEnd(20)} expected: ${c.expect.padEnd(16)} actual: ${actual}`
  );
}

server.close();
console.log(failures ? `\n${failures} test(s) failed` : "\nAll tests passed");
process.exitCode = failures ? 1 : 0;
