import { ObjectTransform, type Scene } from "~scenes";

import { api, format } from "./gpu/system.ts";
import { getPipeline } from "./gpu/getPipeline.ts";
import { loadObjectGeometry } from "./gpu/loadObjectGeometry.ts";
import { Projection } from "./projections/types.ts";
import { combine } from "./projections/combine.ts";
import { createPerspective } from "./projections/createPerspective.ts";
import { fromTransform } from "./projections/fromTransform.ts";

import { ViewportOptions } from "./types.ts";
import { VIEWPORT_DEFAULT_OPTIONS } from "./constants.ts";

export class Viewport {
  options: ViewportOptions;
  projection: Projection;

  #canvas: HTMLCanvasElement;
  constructor(
    canvas: HTMLCanvasElement,
    { startingProjection, ...options }: Partial<ViewportOptions> = {},
  ) {
    this.#canvas = canvas;
    this.#context.configure({ device: api, format });

    this.projection = startingProjection ??
      VIEWPORT_DEFAULT_OPTIONS.startingProjection;

    this.options = {
      ...VIEWPORT_DEFAULT_OPTIONS,
      ...options,
    };
  }

  get aspectRatio(): number {
    return this.#canvas.width / this.#canvas.height;
  }

  adjust(transform: ObjectTransform) {
    this.projection = combine(this.projection, fromTransform(transform));
  }

  snapshot(scene: Scene) {
    const [width, height] = [innerWidth, innerHeight].map((dimension) =>
      dimension * devicePixelRatio
    );

    this.#canvas.width = width;
    this.#canvas.height = height;

    const commander = api.createCommandEncoder();
    const renderPass = commander.beginRenderPass(this.#renderTargets);

    const passPerspective = createPerspective(
      this.aspectRatio,
      this.options.viewingAngle,
      this.options.safetyCropDistance,
    );

    for (
      const [geometry, transform, material] of scene
    ) {
      loadObjectGeometry(
        renderPass,
        getPipeline(material ?? this.options.missingMaterial),
        combine(
          fromTransform(transform ?? this.options.missingTransform),
          this.projection,
          passPerspective,
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
        view: api.createTexture({
          size: [this.#canvas.width, this.#canvas.height],
          format: this.options.depthTextureFormat,
          usage: GPUTextureUsage.RENDER_ATTACHMENT,
        }),
        depthClearValue: 1,
        depthLoadOp: "clear",
        depthStoreOp: "store",
      },
    };
  }
}
