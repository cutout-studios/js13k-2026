import {
  createPerspective,
  fromRigid,
  invert,
  multiply,
  type RigidTransform,
  toRigid,
} from "~transforms";
import type { Object } from "~objects";

import { api, format } from "./gpu/system.ts";
import { getPipeline } from "./gpu/getPipeline.ts";
import { loadObjectGeometry } from "./gpu/loadObjectGeometry.ts";

import { ViewportOptions } from "./types.ts";
import { VIEWPORT_DEFAULT_OPTIONS } from "./constants.ts";

export class Viewport {
  options: ViewportOptions;
  transform: RigidTransform;

  #canvas: HTMLCanvasElement;
  constructor(
    canvas: HTMLCanvasElement,
    { startingTransform, ...options }: Partial<ViewportOptions> = {},
  ) {
    this.#canvas = canvas;
    this.#context.configure({ device: api, format });

    this.transform = startingTransform ??
      VIEWPORT_DEFAULT_OPTIONS.startingTransform!;

    this.options = {
      ...VIEWPORT_DEFAULT_OPTIONS,
      ...options,
    };

    delete this.options.startingTransform;
  }

  get aspectRatio(): number {
    return this.#canvas.width / this.#canvas.height;
  }

  adjust(transform: RigidTransform) {
    const projective = multiply(
      fromRigid(this.transform),
      fromRigid(transform),
    );

    this.transform = toRigid(projective);
  }

  render(scene: Object[]) {
    const { clientWidth, clientHeight } = this.#canvas;
    const [width, height] = [clientWidth, clientHeight].map((dimension) =>
      dimension * devicePixelRatio
    );

    if (this.#canvas.width !== width || this.#canvas.height !== height) {
      this.#canvas.width = width;
      this.#canvas.height = height;
    }

    const commander = api.createCommandEncoder();
    const renderPass = commander.beginRenderPass(this.#renderTargets);

    const projective = multiply(
      createPerspective(
        this.aspectRatio,
        this.options.viewingAngle,
        this.options.safetyCropDistance,
      ),
      fromRigid(invert(this.transform)),
    );

    for (
      const [geometry, transform, material] of scene
    ) {
      loadObjectGeometry(
        renderPass,
        getPipeline(
          material ?? this.options.missingMaterial,
          this.options.depthTextureFormat,
        ),
        multiply(
          projective,
          fromRigid(transform ?? this.options.missingTransform),
        ),
        geometry,
      );

      renderPass.draw(geometry.length);
    }

    renderPass.end();
    api.queue.submit([commander.finish()]);
  }

  #contextCache: GPUCanvasContext | undefined;
  get #context(): GPUCanvasContext {
    if (this.#contextCache) return this.#contextCache;

    return (this.#contextCache = this.#canvas.getContext(
      "webgpu",
    )! as GPUCanvasContext);
  }

  get #renderTargets(): GPURenderPassDescriptor {
    return {
      colorAttachments: [ // Main, user-facing pixels
        {
          view: this.#context.getCurrentTexture().createView(),
          clearValue: this.options.backgroundColor,
          loadOp: "clear",
          storeOp: "store",
        },
      ],
      depthStencilAttachment: { // Depth computation pixels
        view: this.#depthView,
        depthClearValue: 1,
        depthLoadOp: "clear",
        depthStoreOp: "store",
      },
    };
  }

  #depthCache: GPUTexture | undefined;
  #depthKey = "";
  get #depthView(): GPUTexture {
    const key = `${this.#canvas.width}x${this.#canvas.height}`;
    if (key !== this.#depthKey) {
      this.#depthCache?.destroy();
      this.#depthCache = api.createTexture({
        size: [this.#canvas.width, this.#canvas.height],
        format: this.options.depthTextureFormat,
        usage: GPUTextureUsage.RENDER_ATTACHMENT,
      });
      this.#depthKey = key;
    }
    return this.#depthCache!;
  }
}
