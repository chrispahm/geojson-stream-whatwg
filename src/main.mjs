import { JSONParser } from '@streamparser/json';

function parse() {
  const jsonparser = new JSONParser({
    paths: ["$.features.*"],
    keepStack: false
  });

  let super_controller;
  
  jsonparser.onValue = (feature) => {
    super_controller.enqueue(feature);
  };
  
  return new TransformStream({
    transform(chunk, controller) {
      super_controller = controller;
      jsonparser.write(chunk);
    }
  });
}

function stringify() {
  let first = true
  let sep = '\n'
  return new TransformStream({
    start(controller) {
      controller.enqueue('{"type":"FeatureCollection","features":[')
    },
    transform(feature, controller) {
      controller.enqueue(sep + JSON.stringify(feature));
      if (first) {
        first = false
        sep = '\n,\n'
      }
    },
    flush(controller) {
      controller.enqueue('\n]}')
    }
  });
}

export default {parse, stringify};
