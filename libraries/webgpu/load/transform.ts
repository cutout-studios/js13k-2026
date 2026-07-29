import { PROJECTIVE_TRANSFORM_BYTES, ProjectiveTransform } from "~transforms";

import { api } from "../system.ts";
import { transformsLayout } from "../getRenderPipeline.ts";
import { TRANSFORM_GROUP_ID } from "../constants.ts";

const transformBuffer = api.createBuffer({
  size: PROJECTIVE_TRANSFORM_BYTES,
  usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
});

const transformBindGroup = api.createBindGroup({
  layout: transformsLayout,
  entries: [{
    binding: 0,
    resource: { buffer: transformBuffer },
  }],
});

export const loadTransform = (
  loader: GPURenderPassEncoder,
  transform: ProjectiveTransform,
) => {
  api.queue.writeBuffer(transformBuffer, 0, transform);

  loader.setBindGroup(TRANSFORM_GROUP_ID, transformBindGroup);
};
