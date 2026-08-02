import { XOCoordinates } from "../coordinates.ts";
import type { XOGeometry, XOMaterial, GPUDataContainer } from "../types.ts";
import {
  COORDINATE_DATA_SIZE,
  COORDINATES_DATA_GROUP_ID,
  MATERIALS_DATA_GROUP_ID,
} from "../constants.ts";

import { device } from "./device.ts";
import {
  coordinatesLayout,
  getRenderPipeline,
  materialsLayout,
} from "./getRenderPipeline.ts";

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
};

const _containerCache = new WeakMap<
  object,
  [buffer: GPUBuffer, bindGroup: GPUBindGroup]
>();

function _getDataContainer(
  objectKey: object,
  layout: GPUPipelineLayout,
  size: number,
  usage: number,
): GPUDataContainer {
  let [buffer, bindGroup] = _containerCache.get(objectKey) ?? [];

  if (!buffer || buffer && buffer.size < size) {
    buffer = device.createBuffer({ size, usage });
  }

  bindGroup ??= device.createBindGroup({
    layout,
    entries: [{ binding: 0, resource: buffer }],
  });

  const binding: GPUDataContainer = [
    buffer,
    bindGroup,
  ];

  _containerCache.set(objectKey, binding);

  return binding;
};
