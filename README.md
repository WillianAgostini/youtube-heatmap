# youtube-heatmap

Easily retrieve data about “most replayed” graph for videos on Youtube.

![most replayed](most-replayed.png)

## Description

YouTube's player draws the “most replayed” graph as an SVG path on the watch
page. In the current player the curve data lives in `path.ytp-modern-heat-map`
(inside `svg.ytp-heat-map-svg`, 1000x100); the older `.ytp-heat-map-path`
element still exists in the DOM but only as a permanently empty stub. This
library matches both, waits until one of them actually contains data, and
returns the raw path string(s).

The path is defined with [cubic Bézier curves](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d#cubic_b%C3%A9zier_curve)
(a `C` followed by three `x,y` pairs).

Every third `x,y` parameter after a `C`, where `x` ends with `5.0`, is a usable data point:

`x` is the time stamp in percent. Just compute `(x-5)/1000` for a value from 0 to 1.

`y` is the heat value for this time period. Just compute `(100-y)/100` for a value from 0 to 1.

## Usage

This is an ES module (`"type": "module"`), so use `import` — `require()` is
not supported.

```javascript
import { getHeatMap } from 'youtube-heatmap';

const heatMap = await getHeatMap('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
console.log(heatMap);
```

A TypeScript definition file is included so that `youtube-heatmap` can be used
easily from TypeScript with the same API.

## Options

Internally puppeteer is used. An optional second parameter is forwarded to
puppeteer's wait for the heat map data, e.g. to adjust the timeout (default
30 seconds):

```javascript
const heatMap = await getHeatMap(url, { timeout: 60000 });
```

If the video has no heat map (or YouTube changes its player markup again),
the promise rejects — either with a timeout or with a "not found or is empty"
error — rather than resolving with empty data.

## Testing

```bash
npm test          # fast, deterministic suite against synthetic markup (no network)
npm run test:live # end-to-end fetch of a real video's heat map
```

`npm run test:live` accepts an optional video URL argument. If the live test
fails while `npm test` passes, YouTube has likely changed its player markup —
check the heat map element's class name first.
