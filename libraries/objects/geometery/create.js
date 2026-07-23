import device from "~graphics";

import { VERTICIES_PER_TRIANGLE } from "./polygons.js";

export const create = (triangles) => ({
  data: _allocVertexData(new Float32Array(triangles.flat())),
  count: triangles.length * VERTICIES_PER_TRIANGLE,
});

function _allocVertexData(verticies) {
  const data = device.createBuffer({
    size: verticies.byteLength,
    usage: GPUBufferUsage.VERTEX,
    // NOTE: best for one-time writes vs. "system.queue.writeBuffer"
    mappedAtCreation: true,
  });

  new Float32Array(data.getMappedRange()).set(verticies);
  data.unmap();

  return data;
}
