import type { ObjectGeometry } from "~objects";

import {
  PROJECTIVE_TRANSFORM_BYTES,
  type ProjectiveTransform,
} from "~transforms";

import { api } from "./system.ts";

import {
  TRANSFORM_DATA_GROUP_INDEX,
  TRANSFORM_DATA_INSTANCE_INDEX,
} from "../constants.ts";

export const loadObjectGeometry = (
  loader: GPURenderPassEncoder,
  pipeline: GPURenderPipeline,
  transform: ProjectiveTransform,
  geometry: ObjectGeometry,
) => {
  loader.setPipeline(pipeline);
  loader.setBindGroup(
    TRANSFORM_DATA_GROUP_INDEX,
    _allocateTransform(transform, pipeline),
  );

  // NOTE: only supports one piece of geometry per frame.
  loader.setVertexBuffer(0, _allocateGeometry(geometry));
};

function _allocateTransform(
  transform: ProjectiveTransform,
  pipeline: GPURenderPipeline,
): GPUBindGroup {
  const buffer = api.createBuffer({
    size: PROJECTIVE_TRANSFORM_BYTES,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  api.queue.writeBuffer(buffer, 0, transform);

  return api.createBindGroup({
    layout: pipeline.getBindGroupLayout(TRANSFORM_DATA_GROUP_INDEX),
    entries: [{
      binding: TRANSFORM_DATA_INSTANCE_INDEX,
      resource: { buffer },
    }],
  });
}

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
