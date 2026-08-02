import { XOMaterial } from "../materials/types.ts";
import { POINT_FORMAT, POINT_SIZE } from "../geometry.ts";

import { device, format } from "./device.ts";
import { DEPTH_TEXTURE_FORMAT } from "./constants.ts";

export const coordinatesLayout = device.createBindGroupLayout({
  entries: [{
    binding: 0,
    visibility: GPUShaderStage.VERTEX,
    buffer: { type: "uniform" },
  }],
});

export const materialsLayout = device.createBindGroupLayout({
  entries: [{
    binding: 0,
    visibility: GPUShaderStage.FRAGMENT,
    buffer: { type: "read-only-storage" },
  }],
});

const pipelineLayout = device.createPipelineLayout({
  bindGroupLayouts: [coordinatesLayout, materialsLayout],
});

const _pipelineCache = new WeakMap();
export const getRenderPipeline = (
  material: XOMaterial,
): GPURenderPipeline => {
  if (_pipelineCache.has(material)) return _pipelineCache.get(material);

  const [vertex, fragment] = material;
  const pipeline = device.createRenderPipeline({
    layout: pipelineLayout,
    vertex: {
      module: device.createShaderModule({ code: vertex }),
      buffers: [{
        arrayStride: POINT_SIZE,
        attributes: [{
          shaderLocation: 0,
          offset: 0,
          format: POINT_FORMAT,
        }],
      }],
    },
    fragment: {
      module: device.createShaderModule({ code: fragment }),
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
