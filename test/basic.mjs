import { test } from 'tap'
import { readFileSync } from 'fs'
import { open } from 'node:fs/promises';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { concatArray, concatString, arrayToStream } from './utils/helpers.mjs'
import geojsonStream from '../src/index.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url));

test('geojson-stream: read', async function(t) {
  const result = JSON.parse(readFileSync(`${__dirname}/data/featurecollection.result`, 'utf8'))
  const file = await open(`${__dirname}/data/featurecollection.geojson`);
  
  const readStream = file.readableWebStream()
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(geojsonStream.parse())
    .pipeThrough(concatArray())
  
  for await (const d of readStream) {
    t.same(d,result);
    t.end();
  }  
});


test('geojson-stream: write', async function(t) {
    const pt = {
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [0, 0]
        },
        properties: {}
    };

    const {readable, writable} = geojsonStream.stringify();
    
    const readStream = readable
      .pipeThrough(concatString())      

    const writer = writable.getWriter();
    writer.write(pt);
    writer.close();
    
    for await (const result of readStream) {
      t.same(JSON.parse(result), {
          type: 'FeatureCollection',
          features: [pt]
      });
      t.end();
    }  
});

// This is the same write test as above, however we are reading from an array 
// (pull style) instead of writing to the writable side of the transform stream
test('geojson-stream: write from iterator', async function(t) {
    const pt_array = [{
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [0, 0]
        },
        properties: {}
    }];
    
    const readStream = arrayToStream(pt_array)
      .pipeThrough(geojsonStream.stringify())
      .pipeThrough(concatString())  
      
    const { value } = await readStream.getReader().read()
    
    t.same(JSON.parse(value), {
        type: 'FeatureCollection',
        features: pt_array
    });
    t.end();
});