# geojson-stream-whatwg

Stream features into and out of [GeoJSON](http://geojson.org/) objects
and Feature Collections. Little more than [@streamparser/json](https://github.com/juanjoDiaz/streamparser-json)
with pre-filled settings.

This package is a simple rewrite of Tom MacWrights [geojson-stream](https://github.com/node-geojson/geojson-stream) build on the [Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API). 

## Installation
```
npm install geojson-stream-whatwg
```

## API

### `geojsonStream.stringify()`

Returns a transform stream that accepts GeoJSON Feature objects and emits
a stringified FeatureCollection.

### `geojsonStream.parse()`

Returns a transform stream that accepts a GeoJSON FeatureCollection as a stream
and emits Feature objects.

## Example

```js
const response = await fetch('https://example.com/buildings.geojson');
const readableStream = response.body
  .pipeThrough(new TextDecoderStream())
  .pipeThrough(geojsonStream.parse())

  for await (const feature of readStream) {
    console.log(feature)
  }  
```

Please consult the test file located at test/basic.mjs for more examples.

## License
MIT