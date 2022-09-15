# youtube-heatmap

Easily retrieve data about “most replayed” graph for videos on Youtube.


## Description

YouTube's implementation on the web page is relatively straight forward and easy to extract (using an extension inject). A SVG tag on the page (`svg.ytp-heat-map-svg` 1000x100) contains a path defined with [cubic Bézier curves](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d#cubic_b%C3%A9zier_curve) (a `C` followed by three `x,y` pairs).

Every third `x,y` parameter after a `C`, where `x` ends with `5.0`, is a usable data point:

`x` is the time stamp in percent. Just compute `(x-5)/1000` for a value from 0 to 1.

`y` is the heat value for this time period. Just compute `(100-y)/100` for a value from 0 to 1.

## Options

Internally puppeteer is used, so you can pass optional parameters as the second parameter, they are documented [here](https://pptr.dev/next/api/puppeteer.waitforselectoroptions).


## JavaScript Usage

```javascript
var search = require('youtube-heatmap');

getHeatMap('https://www.youtube.com/watch?v=_lEzN8C5c7k')
    .then(heatMap => {
        console.log(heatMap)
    })

```

## TypeScript Usage

A TypeScript definition file is included so that 'youtube-search' can be used
easily from TypeScript.

```typescript
import { getHeatMap } from 'youtube-heatmap'

const heatMap = await getHeatMap('https://www.youtube.com/watch?v=_lEzN8C5c7k')
console.log(heatMap)
```
