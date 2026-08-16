/**
 *    Copyright 2026 Cutout Studios LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { memo } from "~common";
import { DEPTH_TEXTURE_FORMAT } from "../constants.ts";
import { GPURenderTarget } from "../types.ts";
import { device, format } from "./setupDevice.ts";

const _getCanvasContext = memo((canvas: HTMLCanvasElement) => {
  const context = canvas.getContext("webgpu")! as GPUCanvasContext;

  context.configure({ device, format });

  return context;
});

let cacheKey: string | undefined, cacheDepth: GPUTexture | undefined;
const _getCanvasDepth = (canvas: HTMLCanvasElement): GPUTexture => {
  const key = `${canvas.width}x${canvas.height}`;

  if (key === cacheKey) return cacheDepth!;

  cacheKey = key;
  cacheDepth?.destroy();

  return (cacheDepth = device.createTexture({
    size: [canvas.width, canvas.height],
    format: DEPTH_TEXTURE_FORMAT,
    usage: GPUTextureUsage.RENDER_ATTACHMENT,
  }));
};

export const createRenderTarget = (
  canvas: HTMLCanvasElement,
): GPURenderTarget => {
  [canvas.width, canvas.height] = [
    canvas.clientWidth * devicePixelRatio,
    canvas.clientHeight * devicePixelRatio,
  ];

  const [context, depth] = [
    _getCanvasContext(canvas),
    _getCanvasDepth(canvas),
  ];

  return {
    aspectRatio: canvas.width / canvas.height,
    render(action) {
      const encoder = device.createCommandEncoder();
      const pass = encoder.beginRenderPass(this.descriptor);

      action(pass);

      pass.end();
      device.queue.submit([encoder.finish()]);
    },
    descriptor: {
      colorAttachments: [ // Main, user-facing pixels
        {
          view: context.getCurrentTexture().createView(),
          clearValue: [0, 0, 0, 1],
          loadOp: "clear",
          storeOp: "store",
        },
      ],
      depthStencilAttachment: { // Depth computation pixels
        view: depth,
        depthClearValue: 1,
        depthLoadOp: "clear",
        depthStoreOp: "store",
      },
    },
  };
};
