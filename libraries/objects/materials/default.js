import webgpu, { format } from "~webgpu";
import { TRANSFORM_FORMAT, TRANSFORM_SIZE } from "../transforms/all.js";

const TRANSFORM_DATA_GROUP_INDEX = 0;
const TRANSFORM_DATA_INSTANCE_INDEX = 0;

const DEPTH_PIXELS_FORMAT = "depth24plus";

let defaultMaterial;
export const getDefault = () => {
  if (defaultMaterial) return defaultMaterial;

  const transformLayout = webgpu.createBindGroupLayout({
    entries: [{
      binding: TRANSFORM_BINDING,
      visibility: GPUShaderStage.VERTEX,
      buffer: { type: "uniform" },
    }],
  });

  const layout = webgpu.createPipelineLayout({
    bindGroupLayouts: [transformLayout],
  });

  return (defaultMaterial = webgpu.createRenderPipeline({
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
        attributes: {
          shaderLocation: 0,
          offset: 0,
          format: TRANSFORM_FORMAT,
        },
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
      // TODO: depends on "winding" (normals?)
      cullMode: "back",
    },
    depthStencil: {
      depthWriteEnabled: true,
      depthCompare: "less",
      format: DEPTH_PIXELS_FORMAT,
    },
  }));
};
