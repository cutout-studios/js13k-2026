import system, { format } from "./system.js";

const TRANSFORM_DATA_INDEX = 0;
const VERTEX_DATA_INDEX = 0;
const DEPTH_PIXELS_FORMAT = "depth24plus-stencil8"; // TODO: do I need stencil?
const CLEAR_COLOR = [0, 0, 0, 0];

let context;
export function render(canvas, objects) {
  if (!context) {
    previousCanvas = canvas;
    context = canvas.getContext("webgpu");
    context.configure({ device: system, format });
  }

  const pipeline = system.createRenderPipeline(_getPipelineDescriptor());
  const commandEncoder = system.createCommandEncoder();
  const renderPass = commandEncoder.beginRenderPass(_getRenderTargets(canvas));

  renderPass.setPipeline(pipeline);
  renderPass.setBindGroup(
    TRANSFORM_DATA_INDEX,
    _getTransformAllocation(pipeline, objects.length),
  );

  for (const object of objects) {
    _loadObject(renderPass, object);
    renderPass.draw(object.geometry.verticies.count);
  }

  renderPass.end();
  system.queue.submit([commandEncoder.finish()]);
}

// TODO: fragment shader?
function _loadObject(renderPass, { geometry, transform }) {
  renderPass.setBindGroup(TRANSFORM_DATA_INDEX, transform);
  renderPass.setVertexBuffer(VERTEX_DATA_INDEX, geometry.verticies.data);
}

function _getPipelineDescriptor() {
  return {
    layout: "auto",
    vertex: wgsl`
        struct Transforms {
          transform: mat4x4f,
        }

        struct VertexOutput {
          @builtin(position) Position: vec4f,
        }

        @binding(${TRANSFORM_DATA_INDEX})
        @group(0) 
        var<uniform> object: Transforms;

        @vertex
        fn main(@location(0) position: vec4f) -> VertexOutput {
          var output: VertexOutput;

          output.Position = object.transform * position;

          return output;
        }
      `,
    fragment: {
      ...wgsl`
        @fragment
        fn main(@builtin(position) Position: vec4f) -> @location(0) vec4f {
          return 0.5 * (position + vec4(1.0, 1.0, 1.0, 1.0));
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
  };
}

let transformData;
const PAGE_SIZE = 256;
function _getTransformAllocation(pipeline) {
  if (transformData) return transformData;

  const buffer = system.createBuffer({
    size: PAGE_SIZE,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  return (transformData = system.createBindGroup({
    layout: pipeline.getBindGroupLayout(TRANSFORM_DATA_INDEX),
    entries: [{ binding: TRANSFORM_DATA_INDEX, resource: { buffer } }],
  }));
}

function _getRenderTargets(canvas) {
  return {
    colorAttachments: [ // Main, user-facing pixels
      {
        view: canvas.getCurrentTexture().createView(),
        clearValue: CLEAR_COLOR,
        loadOp: "clear",
        storeOp: "store",
      },
    ],
    depthStencilAttachment: { // Depth computation pixels
      view: _getDepthView(canvas),
      depthClearValue: 1,
      depthLoadOp: "clear",
      depthStoreOp: "store",
    },
  };
}

let depthView;
let hasResized = false;
function _getDepthView(canvas) {
  if (depthView && !hasResized) return depthView;

  hasResized = false;

  return (depthView = system.createTexture({
    size: [canvas.width, canvas.height],
    format: DEPTH_PIXELS_FORMAT,
    usage: GPUTextureUsage.RENDER_ATTACHMENT,
  }));
}

globalThis.addEventListener("resize", () => hasResized = true);
