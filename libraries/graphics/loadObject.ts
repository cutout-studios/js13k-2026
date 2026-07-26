import {
  type Object,
  type Transform,
  TRANSFORM_BYTES,
  TRANSFORM_DATA_GROUP_INDEX,
  TRANSFORM_DATA_INSTANCE_INDEX,
  VERTEX_DATA_INDEX,
  type XYZ,
} from "~common";

import { system } from "./system.ts";

export const loadObject = (
  loader: GPURenderPassEncoder,
  { geometry, transform, material }: Object,
) => {
  loader.setPipeline(material);
  loader.setBindGroup(
    TRANSFORM_DATA_GROUP_INDEX,
    _getTransformDataLocation(transform, material),
  );
  loader.setVertexBuffer(VERTEX_DATA_INDEX, _allocateVerticies(geometry));
};

const _transformDataLocations = new WeakMap();
function _getTransformDataLocation(
  transform: Transform,
  material: GPURenderPipeline,
): GPUBindGroup {
  if (_transformDataLocations.has(transform)) {
    return _transformDataLocations.get(transform);
  }

  const buffer = system.createBuffer({
    size: TRANSFORM_BYTES,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  system.queue.writeBuffer(buffer, 0, transform);

  const dataAddress = system.createBindGroup({
    layout: material.getBindGroupLayout(TRANSFORM_DATA_GROUP_INDEX),
    entries: [{ binding: TRANSFORM_DATA_INSTANCE_INDEX, resource: { buffer } }],
  });

  _transformDataLocations.set(transform, dataAddress);

  return dataAddress;
}

function _allocateVerticies(verticies: XYZ[]) {
  const vertexData = new Float32Array(
    verticies.map((xyz) => [...xyz, 1]).flat(),
  ); // TODO: cheaper way to do this?

  const pointerBuffer = system.createBuffer({
    size: vertexData.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_SRC,
    mappedAtCreation: true,
  });

  // NOTE: best for one-time writes vs. "system.queue.writeBuffer"
  new Float32Array(pointerBuffer.getMappedRange()).set(vertexData);
  pointerBuffer.unmap();

  return pointerBuffer;
}
