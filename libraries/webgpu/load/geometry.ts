import type { ObjectGeometry } from "~objects";
import { api } from "../system.ts";

export const loadGeometry = (
  loader: GPURenderPassEncoder,
  geometry: ObjectGeometry,
) => loader.setVertexBuffer(0, _allocateGeometry(geometry));

const _geometryData = new WeakMap();
function _allocateGeometry(geometry: ObjectGeometry) {
  if (_geometryData.has(geometry)) {
    return _geometryData.get(geometry);
  }

  const geometryData = new Float32Array(
    geometry.flat(),
  );

  const pointerBuffer = api.createBuffer({
    size: geometryData.byteLength,
    usage: GPUBufferUsage.VERTEX,
    mappedAtCreation: true,
  });

  // NOTE: best for one-time writes vs. "system.queue.writeBuffer"
  new Float32Array(pointerBuffer.getMappedRange()).set(geometryData);
  pointerBuffer.unmap();

  _geometryData.set(geometry, pointerBuffer);

  return pointerBuffer;
}
