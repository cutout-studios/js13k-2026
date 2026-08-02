import { XOGeometry } from "../geometry.ts";
import { COORDINATE_DATA_BYTES, XOCoordinates } from "../coordinates.ts";
import { XOMaterial } from "../materials/types.ts";

import { COORDINATE_GROUP_ID, MATERIALS_GROUP_ID } from "./constants.ts";
import { device } from "./device.ts";
import {
  coordinatesLayout,
  getRenderPipeline,
  materialsLayout,
} from "./getRenderPipeline.ts";

const MATERIAL_DATA = 2;

export function loadObject(
  renderPass: GPURenderPassEncoder,
  geometry: XOGeometry,
  coordinates: XOCoordinates,
  material: XOMaterial,
) {
  renderPass.setVertexBuffer(0, _allocateGeometryBuffer(geometry));

  renderPass.setPipeline(getRenderPipeline(material));
  writeData(
    renderPass,
    material[MATERIAL_DATA],
    getDataContainer(
      material,
      materialsLayout,
      material[MATERIAL_DATA].byteLength,
      GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    ),
    MATERIALS_GROUP_ID,
  );

  writeData(
    renderPass,
    coordinates.data,
    getDataContainer(
      coordinates,
      coordinatesLayout,
      COORDINATE_DATA_BYTES,
      GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    ),
    COORDINATE_GROUP_ID,
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

type DataContainer = [buffer: GPUBuffer, bindGroup: GPUBindGroup];

const _containerCache = new WeakMap<
  object,
  [buffer: GPUBuffer, bindGroup: GPUBindGroup]
>();

export const writeData = (
  loader: GPURenderPassEncoder,
  data: Float32Array,
  [buffer, bindGroup]: DataContainer,
  groupID: number,
) => {
  device.queue.writeBuffer(buffer, 0, data);
  loader.setBindGroup(groupID, bindGroup);
};

export const getDataContainer = (
  objectKey: object,
  layout: GPUPipelineLayout,
  size: number,
  usage: number,
): DataContainer => {
  let [buffer, bindGroup] = _containerCache.get(objectKey) ?? [];

  if (!buffer || buffer && buffer.size < size) {
    buffer = device.createBuffer({ size, usage });
  }

  bindGroup ??= device.createBindGroup({
    layout,
    entries: [{ binding: 0, resource: buffer }],
  });

  const binding: DataContainer = [
    buffer,
    bindGroup,
  ];

  _containerCache.set(objectKey, binding);

  return binding;
};
