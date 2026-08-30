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

import { F32 } from "~/alias";

import { memo } from "~/common";
import {
  COORDINATES_DATA_GROUP_ID,
  MATERIALS_DATA_GROUP_ID,
} from "../constants.ts";

import type { GPUDataContainer, XOGeometry, XOMaterial } from "../types.ts";
import { getRenderPipeline } from "./getRenderPipeline.ts";
import { device } from "./setupDevice.ts";
import { coordinatesLayout, materialsLayout } from "./setupDevice.ts";

const _allocateGeometryBuffer = memo(([, vertices]: XOGeometry) => {
  const geometryData = new F32(vertices.flat());

  const buffer = device.createBuffer({
    size: geometryData.byteLength,
    usage: GPUBufferUsage.VERTEX,
    mappedAtCreation: true,
  });

  // NOTE: best for one-time writes vs. "system.queue.writeBuffer"
  new F32(buffer.getMappedRange()).set(geometryData);
  buffer.unmap();

  return buffer;
});

const _writeDataToContainer = (
  loader: GPURenderPassEncoder,
  data: Float32Array,
  [buffer, bindGroup]: GPUDataContainer,
  groupID: number,
) => {
  device.queue.writeBuffer(buffer, 0, data);
  loader.setBindGroup(groupID, bindGroup);
};

const _containerCache = new WeakMap<object, GPUDataContainer>();
const _getDataContainer = (
  objectKey: object,
  layout: GPUBindGroupLayout,
  size: number,
  usage: number,
): GPUDataContainer => {
  let container = _containerCache.get(objectKey);

  if (!container || container[0].size < size) {
    container?.[0].destroy();

    const buffer = device.createBuffer({ size, usage });

    _containerCache.set(
      objectKey,
      container = [
        buffer,
        device.createBindGroup({
          layout,
          entries: [{ binding: 0, resource: { buffer } }],
        }),
      ],
    );
  }

  return container;
};

export const loadObject = (
  renderPass: GPURenderPassEncoder,
  coordinates: Float32Array,
  geometry: XOGeometry,
  material: XOMaterial,
) => {
  renderPass.setVertexBuffer(0, _allocateGeometryBuffer(geometry));

  renderPass.setPipeline(getRenderPipeline(material));
  const [, materialData] = material;
  _writeDataToContainer(
    renderPass,
    materialData,
    _getDataContainer(
      material,
      materialsLayout,
      materialData.byteLength,
      GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    ),
    MATERIALS_DATA_GROUP_ID,
  );

  _writeDataToContainer(
    renderPass,
    coordinates,
    _getDataContainer(
      coordinates,
      coordinatesLayout,
      coordinates.byteLength,
      GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    ),
    COORDINATES_DATA_GROUP_ID,
  );
};
