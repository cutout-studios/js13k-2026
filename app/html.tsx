import { api, canvasFormat } from "~webgpu";
import { documentFragment as fragment } from "~web";

type RenderTarget = GPURenderPassDescriptor & {
  aspectRatio: number;
};

// TODO: hoist into webgpu
const canvasNode = fragment(<canvas></canvas>);
const canvasElement = canvasNode.querySelector("canvas")!;
const canvasContext = canvasElement.getContext("webgpu")! as GPUCanvasContext;

canvasContext.configure({ device: api, format: canvasFormat });

const depthView = api.createTexture({
  size: [canvasElement.width, canvasElement.height],
  format: "depth24plus",
  usage: GPUTextureUsage.RENDER_ATTACHMENT,
});

export const canvasTarget = (): RenderTarget => ({
  aspectRatio: canvasElement.width / canvasElement.height,
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
});

document.body.appendChild(fragment(
  <>
    <style>
      {/* css */ `
      html, body, main, main * { 
        all: initial;
        box-sizing: border-box;
        font-family: system-ui;
        overflow: hidden;
      }
      main {
        position: relative;
      }
      main, canvas, nav {
        display: block;
        width: 100vw;
        height: 100svh;
      }
      nav {
        pointer-events: none;
        position: absolute;
        top: 0;
        left: 0;
      }
    `}
    </style>
    <main>
      {canvasNode}
      <nav>
        {/* TBD: gui here */}
      </nav>
    </main>
  </>,
));
