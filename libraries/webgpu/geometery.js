// 'addTriangle' primitive
// `appendTriangle`??
  // you'd have to pick a line, then append a point

// Line -> point -> point... (assumed previous line - which line tho)

export const create = () => {
  const data = device.createBuffer({
    size: cubeVertexArray.byteLength,
    usage: GPUBufferUsage.VERTEX,
    mappedAtCreation: true,
  });
  new Float32Array(data.getMappedRange()).set(cubeVertexArray);
  data.unmap(); // ?

  return {
    verticies: {
      data,
      count: 0
    }
  }
}
