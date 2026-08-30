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

  const context = _getCanvasContext(canvas),
    depth = _getCanvasDepth(canvas),
    colorAttachment = {
      clearValue: [0, 0, 0, 1],
      loadOp: "clear",
      storeOp: "store", // 'view' is set in the render call
    } as unknown as GPURenderPassColorAttachment,
    descriptor: GPURenderPassDescriptor = {
      colorAttachments: [colorAttachment],
      depthStencilAttachment: {
        view: depth,
        depthClearValue: 1,
        depthLoadOp: "clear",
        depthStoreOp: "store",
      },
    };

  return [
    canvas.width / canvas.height,
    descriptor,
    (action) => {
      colorAttachment.view = context.getCurrentTexture().createView();

      const encoder = device.createCommandEncoder(),
        pass = encoder.beginRenderPass(descriptor);

      action(pass);

      pass.end();
      device.queue.submit([encoder.finish()]);
    },
  ];
};
