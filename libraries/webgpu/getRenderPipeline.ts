import {
  GEOMETRY_POINT_FORMAT,
  GEOMETRY_POINT_SIZE,
  type ObjectMaterial,
} from "~objects";

import { api, format } from "./system.ts";
import { DEPTH_TEXTURE_FORMAT } from "./constants.ts";

export const transformsLayout = api.createBindGroupLayout({
  entries: [{
    binding: 0,
    visibility: GPUShaderStage.VERTEX,
    buffer: { type: "uniform" },
  }],
});

export const materialsLayout = api.createBindGroupLayout({
  entries: [{
    binding: 0,
    visibility: GPUShaderStage.FRAGMENT,
  }],
});

const pipelineLayout = api.createPipelineLayout({
  bindGroupLayouts: [transformsLayout, materialsLayout],
});

const _pipelineCache = new WeakMap();
export const getRenderPipeline = (
  material: ObjectMaterial,
): GPURenderPipeline => {
  if (_pipelineCache.has(material)) return _pipelineCache.get(material);

  const [vertex, fragment] = material;
  const pipeline = api.createRenderPipeline({
    layout: pipelineLayout,
    vertex: {
      module: api.createShaderModule({ code: vertex }),
      buffers: [{
        arrayStride: GEOMETRY_POINT_SIZE,
        attributes: [{
          shaderLocation: 0,
          offset: 0,
          format: GEOMETRY_POINT_FORMAT,
        }],
      }],
    },
    fragment: {
      module: api.createShaderModule({ code: fragment }),
      targets: [{ format }],
    },
    primitive: {
      cullMode: "back",
    },
    depthStencil: {
      depthWriteEnabled: true,
      depthCompare: "less",
      format: DEPTH_TEXTURE_FORMAT,
    },
  });

  _pipelineCache.set(material, pipeline);

  return pipeline;
};
