import { DEPTH_PIXELS_FORMAT } from "~common";

import { format, system } from "./system.ts";

import { DEFAULT_CLEAR_COLOR } from "./constants.ts";
import { WebGPUCanvas } from "./types.ts";

let hasResized = false;

globalThis.addEventListener("resize", () => hasResized = true);

export const getRenderTargets = (
  canvas: WebGPUCanvas,
): GPURenderPassDescriptor => {
  _ensureContext(canvas);

  return {
    colorAttachments: [ // Main, user-facing pixels
      {
        view: canvas.getCurrentTexture().createView(),
        clearValue: DEFAULT_CLEAR_COLOR,
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
};

let context: GPUCanvasContext;
function _ensureContext(canvas: WebGPUCanvas) {
  if (context) return context;

  context = canvas.getContext("webgpu")! as GPUCanvasContext;
  context.configure({ device: system, format });

  return context;
}

let depthView: GPUTexture;
function _getDepthView(canvas: HTMLCanvasElement) {
  if (depthView && !hasResized) return depthView;

  depthView?.destroy();
  hasResized = false;
  return (depthView = system.createTexture({
    size: [canvas.width, canvas.height],
    format: DEPTH_PIXELS_FORMAT,
    usage: GPUTextureUsage.RENDER_ATTACHMENT,
  }));
}
