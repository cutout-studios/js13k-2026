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

import { XOMaterial } from "../types.ts";
import {
  DEPTH_TEXTURE_FORMAT,
  VERTEX_DATA_FORMAT,
  VERTEX_DATA_SIZE,
} from "../constants.ts";

import { device, format, pipelineLayout } from "./setupDevice.ts";

const _pipelineCache = new WeakMap();
export const getRenderPipeline = (
  material: XOMaterial,
): GPURenderPipeline => {
  if (_pipelineCache.has(material)) return _pipelineCache.get(material);

  const [vertex, fragment] = material;
  const pipeline = device.createRenderPipeline({
    layout: pipelineLayout,
    vertex: {
      module: device.createShaderModule({ code: vertex }),
      buffers: [{
        arrayStride: VERTEX_DATA_SIZE,
        attributes: [{
          shaderLocation: 0,
          offset: 0,
          format: VERTEX_DATA_FORMAT,
        }],
      }],
    },
    fragment: {
      module: device.createShaderModule({ code: fragment }),
      targets: [{ format }],
    },
    primitive: {
      cullMode: "back",
    },
    depthStencil: {
      depthWriteEnabled: true,
      depthCompare: "less",
      format: DEPTH_TEXTURE_FORMAT,
    },
  });

  _pipelineCache.set(material, pipeline);

  return pipeline;
};
