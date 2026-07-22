import { device } from "./device.js";
import { format } from "./gpu.js";

const BIN_SPACE = 2;
const FRAME_DATA_INDEX = 0;
const STENCIL_FORMAT = "depth24plus-stencil8";
const CLEAR_COLOR = [0, 0, 0, 0];

let context;
let previousCanvas;
export function render(canvas, objects) {
  if (canvas !== previousCanvas || !context) {
    previousCanvas = canvas;
    context = canvas.getContext("webgpu");
    context.configure({ device, format });
  }

  const pipeline = device.createRenderPipeline(_getPipelineDescriptor());
  const commandEncoder = device.createCommandEncoder();
  const renderPass = commandEncoder.beginRenderPass(
    _getRenderPassDescriptor(
      canvas.getCurrentTexture().createView(),
      device.createTexture({
        size: [canvas.width, canvas.height],
        format: "depth24plus-stencil8",
        usage: GPUTextureUsage.RENDER_ATTACHMENT,
      }),
    ),
  );

  renderPass.setPipeline(pipeline);
  renderPass.setBindGroup(
    FRAME_DATA_INDEX,
    _getFrameDataAllocation(pipeline, objects.length),
  );

  for (const object of objects) {
    renderPass.setBindGroup(FRAME_DATA_INDEX, object.frame); // ?
    renderPass.draw(object.size);
  }

  renderPass.end();
  device.queue.submit([commandEncoder.finish()]);
}

function _getPipelineDescriptor() {
  return {
    layout: "auto",
    vertex: wgsl`
        struct Uniforms {
          modelViewProjectionMatrix: mat4x4f,
        }

        @binding(${FRAME_DATA_INDEX}) @group(0) var<uniform> uniforms: Uniforms;
        struct VertexOutput {
          @builtin(position) Position: vec4f,
          @location(0) fragUV: vec2f,
          @location(1) fragPosition: vec4f,
        }

        @vertex
        fn main(
          @location(0) position: vec4f,
          @location(1) uv: vec2f
        ) -> VertexOutput {
          var output: VertexOutput;

          output.Position = uniforms.modelViewProjectionMatrix * position;
          output.fragUV = uv;
          output.fragPosition = 0.5 * (position + vec4(1.0, 1.0, 1.0, 1.0));

          return output;
        }
      `,
    fragment: {
      ...wgsl`
        @fragment
        fn main(
          @location(0) fragUV: vec2f,
          @location(1) fragPosition: vec4f
        ) -> @location(0) vec4f {
          return fragPosition;
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
      format: STENCIL_FORMAT,
    },
  };
}

let frameData;
let frameCount = 0;
function _getFrameDataAllocation(pipeline, objectCount = 1) {
  if (frameCount >= objectCount && frameData) return frameData;

  let nextPow2 = BIN_SPACE;
  while (nextPow2 < objectCount) nextPow2 **= BIN_SPACE;

  frameCount = nextPow2;
  const buffer = device.createBuffer({
    size: nextPow2 * FRAME_BYTES,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  return (frameData = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(FRAME_DATA_INDEX),
    entries: [{ binding: FRAME_DATA_INDEX, resource: { buffer } }],
  }));
}

function _getRenderPassDescriptor(textureView, depthView) {
  return {
    colorAttachments: [ // TODO: ?
      {
        view: textureView,
        clearValue: CLEAR_COLOR,
        loadOp: "clear",
        storeOp: "store",
      },
    ],
    depthStencilAttachment: {
      view: depthView,
      depthClearValue: 1,
      depthLoadOp: "clear",
      depthStoreOp: "store",
    },
  };
}
