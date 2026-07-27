import type { ObjectGeometry } from "~scenes";

import {
  IS_PROJECTION_POINT,
  PROJECTION_BYTES,
} from "../projections/constants.ts";
import type { Projection } from "../projections/types.ts";

import { api } from "./system.ts";

import {
  PROJECTION_DATA_GROUP_INDEX,
  PROJECTION_DATA_INSTANCE_INDEX,
} from "../constants.ts";

export const loadObjectGeometry = (
  loader: GPURenderPassEncoder,
  pipeline: GPURenderPipeline,
  projection: Projection,
  geometry: ObjectGeometry,
) => {
  loader.setPipeline(pipeline);
  loader.setBindGroup(
    PROJECTION_DATA_GROUP_INDEX,
    _getProjectionDataLocation(projection, pipeline),
  );

  // NOTE: clobbers existing geometry buffer every time.
  loader.setVertexBuffer(0, _allocateGeometry(geometry));
};

function _getProjectionDataLocation(
  projection: Projection,
  pipeline: GPURenderPipeline,
): GPUBindGroup {
  const buffer = api.createBuffer({
    size: PROJECTION_BYTES,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  api.queue.writeBuffer(buffer, 0, projection);

  return api.createBindGroup({
    layout: pipeline.getBindGroupLayout(PROJECTION_DATA_GROUP_INDEX),
    entries: [{
      binding: PROJECTION_DATA_INSTANCE_INDEX,
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
    geometry.map((point) => [...point, IS_PROJECTION_POINT]).flat(),
  );

  const pointerBuffer = api.createBuffer({
    size: geometryData.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_SRC,
    mappedAtCreation: true,
  });

  // NOTE: best for one-time writes vs. "system.queue.writeBuffer"
  new Float32Array(pointerBuffer.getMappedRange()).set(geometryData);
  pointerBuffer.unmap();

  _geometryData.set(geometry, pointerBuffer);

  return pointerBuffer;
}
