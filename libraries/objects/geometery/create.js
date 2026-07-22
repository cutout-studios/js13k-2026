// TODO
export const create = (vertexArray) => {
  const data = device.createBuffer({
    size: vertexArray.byteLength,
    usage: GPUBufferUsage.VERTEX,
    mappedAtCreation: true,
  });
  new Float32Array(data.getMappedRange()).set(vertexArray);
  data.unmap(); // ?

  return {
    data,
    count: 0,
  };
};
