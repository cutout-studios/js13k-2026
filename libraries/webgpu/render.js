import { device } from "./device.js";
import { format } from "./gpu.js";

const getRenderPassDescriptor = (textureView) => ({
  colorAttachments: [ // TODO: ?
    {
      view: textureView,
      clearValue: [0, 0, 0, 0],
      loadOp: "clear",
      storeOp: "store",
    },
  ],
});

let context;
let previousCanvas;
export function render(canvas, pipeline) {
  if (canvas !== previousCanvas || !context) {
    previousCanvas = canvas;
    context = canvas.getContext("webgpu");
    context.configure({ device, format });
  }

  const commandEncoder = device.createCommandEncoder();
  const passEncoder = commandEncoder.beginRenderPass(
    getRenderPassDescriptor(canvas.getCurrentTexture().createView()),
  );

  passEncoder.setPipeline(pipeline);
  passEncoder.draw(3); // TODO: ?
  passEncoder.end();

  device.queue.submit([commandEncoder.finish()]);
}
