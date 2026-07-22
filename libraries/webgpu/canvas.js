const CLEAR_COLOR = [0, 0, 0, 0];

let context;
let depthView;
let hasResized = false;

globalThis.addEventListener("resize", () => hasResized = true);

export const getRenderTargets = (canvas) => {
  _ensureContext(canvas);

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
};

function _ensureContext(canvas) {
  if (context) return context;

  context = canvas.getContext("webgpu");
  context.configure({ device: system, format });

  return context;
}

function _getDepthView(canvas) {
  if (depthView && !hasResized) return depthView;

  depthView?.texture.destroy();
  hasResized = false;
  return (depthView = system.createTexture({
    size: [canvas.width, canvas.height],
    format: DEPTH_PIXELS_FORMAT,
    usage: GPUTextureUsage.RENDER_ATTACHMENT,
  }));
}
