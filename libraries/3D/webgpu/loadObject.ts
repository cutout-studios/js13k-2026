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

import { XOCoordinates } from "../coordinates.ts";
import type { GPUDataContainer, XOGeometry, XOMaterial } from "../types.ts";
import {
  COORDINATE_DATA_SIZE,
  COORDINATES_DATA_GROUP_ID,
  MATERIALS_DATA_GROUP_ID,
} from "../constants.ts";

import { device } from "./setupDevice.ts";
import { getRenderPipeline } from "./getRenderPipeline.ts";
import { coordinatesLayout, materialsLayout } from "./setupDevice.ts";

export function loadObject(
  renderPass: GPURenderPassEncoder,
  geometry: XOGeometry,
  coordinates: XOCoordinates,
  material: XOMaterial,
) {
  renderPass.setVertexBuffer(0, _allocateGeometryBuffer(geometry));

  renderPass.setPipeline(getRenderPipeline(material));
  const [, , materialData] = material;
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
    coordinates.data,
    _getDataContainer(
      coordinates,
      coordinatesLayout,
      COORDINATE_DATA_SIZE,
      GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    ),
    COORDINATES_DATA_GROUP_ID,
  );
}

const _geometryData = new WeakMap();
function _allocateGeometryBuffer(geometry: XOGeometry) {
  if (_geometryData.has(geometry)) {
    return _geometryData.get(geometry);
  }

  const geometryData = new Float32Array(geometry.flat());

  const buffer = device.createBuffer({
    size: geometryData.byteLength,
    usage: GPUBufferUsage.VERTEX,
    mappedAtCreation: true,
  });

  // NOTE: best for one-time writes vs. "system.queue.writeBuffer"
  new Float32Array(buffer.getMappedRange()).set(geometryData);
  buffer.unmap();

  _geometryData.set(geometry, buffer);

  return buffer;
}

function _writeDataToContainer(
  loader: GPURenderPassEncoder,
  data: Float32Array,
  [buffer, bindGroup]: GPUDataContainer,
  groupID: number,
) {
  device.queue.writeBuffer(buffer, 0, data);
  loader.setBindGroup(groupID, bindGroup);
}

const _containerCache = new WeakMap<
  object,
  [buffer: GPUBuffer, bindGroup: GPUBindGroup]
>();

function _getDataContainer(
  objectKey: object,
  layout: GPUBindGroupLayout,
  size: number,
  usage: number,
): GPUDataContainer {
  let [buffer, bindGroup] = _containerCache.get(objectKey) ?? [];

  if (!buffer || buffer.size < size) {
    buffer?.destroy();
    buffer = device.createBuffer({ size, usage });
    bindGroup = device.createBindGroup({
      layout,
      entries: [{ binding: 0, resource: { buffer } }],
    });
  }

  const container: GPUDataContainer = [buffer, bindGroup!];

  _containerCache.set(objectKey, container);

  return container;
}
