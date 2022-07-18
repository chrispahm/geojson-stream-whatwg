export function concatArray() {
  const chunks = []
  
  return new TransformStream({
    transform(chunk) {
      chunks.push(chunk)
    },
    flush(controller) {
      controller.enqueue(chunks)
    }
  });
}

export function concatString() {
  let string = ""
  
  return new TransformStream({
    transform(chunk) {
      string += chunk
    },
    flush(controller) {
      controller.enqueue(string)
    }
  });
}

export function arrayToStream(array) {
  let i = 0;
  return new ReadableStream({
    start(controller) {
      if (!array.length) controller.close()
    },
    pull(controller) {
      controller.enqueue(array[i])
      i++        
      if (i === array.length) {
        controller.close()
      }
    }
  })
}

export default { concatArray, concatString }