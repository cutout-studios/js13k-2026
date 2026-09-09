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

import { memo } from "~/common";
import { DEPTH_TEXTURE_FORMAT } from "../constants.ts";
import { GPURenderTarget } from "../types.ts";
import { device, format } from "./setupDevice.ts";

const _getCanvasContext = memo((canvas: HTMLCanvasElement) => {
  const context = canvas.getContext("webgpu")! as GPUCanvasContext;

  context.configure({ device, format, alphaMode: "premultiplied" });

  return context;
});

let cacheKey: string | undefined, cacheDepth: GPUTexture | undefined;

export const createRenderTarget = (
  canvas: HTMLCanvasElement,
): GPURenderTarget => {
  [canvas.width, canvas.height] = [
    canvas.clientWidth * devicePixelRatio,
    canvas.clientHeight * devicePixelRatio,
  ];

  const context = _getCanvasContext(canvas),
    colorAttachment = {
      clearValue: [0, 0, 0, 0],
      loadOp: "clear",
      storeOp: "store",
    } as unknown as GPURenderPassColorAttachment,
    depthStencilAttachment = {
      depthClearValue: 1,
      depthLoadOp: "clear",
      depthStoreOp: "store",
    } as unknown as GPURenderPassDepthStencilAttachment,
    descriptor: GPURenderPassDescriptor = {
      colorAttachments: [colorAttachment],
      depthStencilAttachment,
    };
  return [
    canvas.width / canvas.height,
    descriptor,
    (action) => {
      colorAttachment.view = context.getCurrentTexture().createView();

      const depthKey = `${canvas.width}x${canvas.height}`;
      if (depthKey != cacheKey) {
        cacheKey = depthKey;
        cacheDepth?.destroy();
        cacheDepth = device.createTexture({
          size: [canvas.width, canvas.height],
          format: DEPTH_TEXTURE_FORMAT,
          usage: GPUTextureUsage.RENDER_ATTACHMENT,
        });
      }
      depthStencilAttachment.view = cacheDepth!.createView();

      const encoder = device.createCommandEncoder(),
        pass = encoder.beginRenderPass(descriptor);
      action(pass);
      pass.end();
      device.queue.submit([encoder.finish()]);
    },
  ];
};
