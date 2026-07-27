import type { ObjectMaterial } from "~scenes";

import {
  PROJECTION_FORMAT,
  PROJECTION_SIZE,
} from "../projections/constants.ts";
import { PROJECTION_DATA_GROUP_INDEX } from "../constants.ts";

import { api, format } from "./system.ts";

export const getPipeline = (
  material: ObjectMaterial,
  depthTextureFormat: GPUTextureFormat,
): GPURenderPipeline => {
  const projectionLayout = api.createBindGroupLayout({
    entries: [{
      binding: PROJECTION_DATA_GROUP_INDEX,
      visibility: GPUShaderStage.VERTEX,
      buffer: { type: "uniform" },
    }],
  });

  const layout = api.createPipelineLayout({
    bindGroupLayouts: [projectionLayout],
  });

  return api.createRenderPipeline({
    layout,
    vertex: {
      module: api.createShaderModule({ code: material[0] }),
      buffers: [{
        arrayStride: PROJECTION_SIZE,
        attributes: [{
          shaderLocation: 0,
          offset: 0,
          format: PROJECTION_FORMAT,
        }],
      }],
    },
    fragment: {
      module: api.createShaderModule({ code: material[1] }),
      targets: [{ format }],
    },
    primitive: {
      cullMode: "back",
    },
    depthStencil: {
      depthWriteEnabled: true,
      depthCompare: "less",
      format: depthTextureFormat,
    },
  });
};
