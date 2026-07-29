import {
  GEOMETRY_POINT_FORMAT,
  GEOMETRY_POINT_SIZE,
  type ObjectMaterial,
} from "~objects";

import { TRANSFORM_DATA_INSTANCE_INDEX } from "../constants.ts";

import { api, format } from "./system.ts";

const _pipelineCache = new WeakMap();
let _lastTextureFormat;
export const getPipeline = (
  material: ObjectMaterial,
  depthTextureFormat: GPUTextureFormat,
): GPURenderPipeline => {
  _lastTextureFormat ??= depthTextureFormat;

  if (_lastTextureFormat !== depthTextureFormat) {
    _pipelineCache.delete(material);
    _lastTextureFormat = depthTextureFormat;
  }

  if (_pipelineCache.has(material)) return _pipelineCache.get(material);

  const projectionLayout = api.createBindGroupLayout({
    entries: [{
      binding: TRANSFORM_DATA_INSTANCE_INDEX,
      visibility: GPUShaderStage.VERTEX,
      buffer: { type: "uniform" },
    }],
  });

  const layout = api.createPipelineLayout({
    bindGroupLayouts: [projectionLayout],
  });

  const pipeline = api.createRenderPipeline({
    layout,
    vertex: {
      module: api.createShaderModule({ code: material[0] }),
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

  _pipelineCache.set(material, pipeline);

  return pipeline;
};
