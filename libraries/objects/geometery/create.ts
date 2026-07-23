import { XYZ } from "~common";
import { system } from "~graphics";

import { VERTICIES_PER_TRIANGLE } from "./polygons.ts";

export const create = (verticies: XYZ[]) => ({
  data: _allocVertexData(new Float32Array(verticies.flat())),
  count: verticies.length * VERTICIES_PER_TRIANGLE,
});

function _allocVertexData(vertexData: Float32Array) {
  const buffer = system.createBuffer({
    size: vertexData.byteLength,
    usage: GPUBufferUsage.VERTEX,
    mappedAtCreation: true,
  });

  // NOTE: best for one-time writes vs. "system.queue.writeBuffer"
  new Float32Array(buffer.getMappedRange()).set(vertexData);
  buffer.unmap();

  return buffer;
}
