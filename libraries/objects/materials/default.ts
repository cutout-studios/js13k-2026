import {
  DEPTH_PIXELS_FORMAT,
  TRANSFORM_DATA_GROUP_INDEX,
  TRANSFORM_DATA_INSTANCE_INDEX,
  TRANSFORM_FORMAT,
  TRANSFORM_SIZE,
} from "~common";
import { format, system as graphics } from "~graphics";
import { wgsl } from "./wgsl.ts";

let defaultMaterial: GPURenderPipeline | undefined;
export const getDefault = (): GPURenderPipeline => {
  if (defaultMaterial) return defaultMaterial;

  const transformLayout = graphics.createBindGroupLayout({
    entries: [{
      binding: TRANSFORM_DATA_GROUP_INDEX,
      visibility: GPUShaderStage.VERTEX,
      buffer: { type: "uniform" },
    }],
  });

  const layout = graphics.createPipelineLayout({
    bindGroupLayouts: [transformLayout],
  });

  return (defaultMaterial = graphics.createRenderPipeline({
    layout,
    vertex: {
      module: wgsl`
        struct Transforms {
          transform: mat4x4f,
        }

        struct VertexOutput {
          @builtin(position) Position: vec4f,
          @location(0) modelPosition: vec4f
        }

        @group(${TRANSFORM_DATA_GROUP_INDEX}) 
        @binding(${TRANSFORM_DATA_INSTANCE_INDEX})
        var<uniform> object: Transforms;

        @vertex
        fn main(@location(0) position: vec4f) -> VertexOutput {
          var output: VertexOutput;

          output.Position = object.transform * position;
          output.modelPosition = position;

          return output;
        }
      `,
      buffers: [{
        arrayStride: TRANSFORM_SIZE,
        attributes: [{
          shaderLocation: 0,
          offset: 0,
          format: TRANSFORM_FORMAT,
        }],
      }],
    },
    fragment: {
      module: wgsl`
        @fragment
        fn main(@location(0) modelPosition: vec4f) -> @location(0) vec4f {
          return 0.5 * (modelPosition + vec4f(1.0));
        }
      `,
      targets: [{ format }],
    },
    primitive: {
      cullMode: "back",
    },
    depthStencil: {
      depthWriteEnabled: true,
      depthCompare: "less",
      format: DEPTH_PIXELS_FORMAT,
    },
  }));
};
