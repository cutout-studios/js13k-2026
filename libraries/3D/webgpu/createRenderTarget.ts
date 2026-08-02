import { device, format } from "./device.ts";

export type GPURenderTarget = {
  aspectRatio: number;
  descriptor: GPURenderPassDescriptor;
  render(process: (encorder: GPURenderPassEncoder) => void): void;
};

// TODO: restore resize behavior
export const createRenderTarget = (
  canvasElement: HTMLCanvasElement,
): GPURenderTarget => {
  const canvasContext = canvasElement.getContext("webgpu")! as GPUCanvasContext;

  canvasContext.configure({ device: device, format });

  const depthView = device.createTexture({
    size: [canvasElement.width, canvasElement.height],
    format: "depth24plus",
    usage: GPUTextureUsage.RENDER_ATTACHMENT,
  });

  return {
    aspectRatio: canvasElement.width / canvasElement.height,
    render(func) {
      const encoder = device.createCommandEncoder();
      const process = encoder.beginRenderPass(this.descriptor);
      func(process);
      process.end();
      // todo device.write([encorder end]) or whatever
    },
    descriptor: {
      colorAttachments: [ // Main, user-facing pixels
        {
          view: canvasContext.getCurrentTexture().createView(),
          clearValue: [0, 0, 0, 1],
          loadOp: "clear",
          storeOp: "store",
        },
      ],
      depthStencilAttachment: { // Depth computation pixels
        view: depthView,
        depthClearValue: 1,
        depthLoadOp: "clear",
        depthStoreOp: "store",
      },
    },
  };
};
