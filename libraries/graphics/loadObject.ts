import {
  type Object,
  type Transform,
  TRANSFORM_BYTES,
  TRANSFORM_DATA_GROUP_INDEX,
  TRANSFORM_DATA_INSTANCE_INDEX,
  VERTEX_DATA_INDEX,
} from "~common";

import { system } from "./system.ts";

export const loadObject = (
  loader: GPURenderPassEncoder,
  { geometry: geometery, transform, material }: Object,
) => {
  loader.setPipeline(material);
  loader.setBindGroup(
    TRANSFORM_DATA_GROUP_INDEX,
    _getTransformDataLocation(transform, material),
  );
  loader.setVertexBuffer(VERTEX_DATA_INDEX, geometery.data);
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
