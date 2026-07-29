import { FLOAT_32_BIN } from "~common";
import { ObjectMaterial } from "~objects";
import { getRenderPipeline, materialsLayout } from "../getRenderPipeline.ts";
import { MATERIALS_GROUP_ID } from "../constants.ts";
import { api } from "../system.ts";

let materialBuffer = _makeBuffer();
let materialBindGroup = _makeBindGroup(materialBuffer);

export const loadMaterial = (
  loader: GPURenderPassEncoder,
  material: ObjectMaterial,
) => {
  loader.setPipeline(getRenderPipeline(material));

  const [, , data] = material;

  if (materialBuffer.size < data.byteLength) {
    materialBuffer = _makeBuffer(data.byteLength);
    materialBindGroup = _makeBindGroup(materialBuffer);
  }

  api.queue.writeBuffer(materialBuffer, 0, data);
  loader.setBindGroup(MATERIALS_GROUP_ID, materialBindGroup);
};

function _makeBuffer(size: number = FLOAT_32_BIN) {
  return api.createBuffer({
    size,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });
}

function _makeBindGroup(buffer: GPUBuffer) {
  return api.createBindGroup({
    layout: materialsLayout,
    entries: [{
      binding: 0,
      resource: buffer,
    }],
  });
}
