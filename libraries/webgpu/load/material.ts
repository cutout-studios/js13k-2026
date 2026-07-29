// loadMaterial.ts
import { MATERIAL_DATA_INDEX, ObjectMaterial } from "~objects";
import { getRenderPipeline, materialsLayout } from "../getRenderPipeline.ts";
import { MATERIALS_GROUP_ID } from "../constants.ts";
import { getDataContainer, writeData } from "./writeData.ts";

export const loadMaterial = (
  loader: GPURenderPassEncoder,
  material: ObjectMaterial,
) => {
  loader.setPipeline(getRenderPipeline(material));

  writeData({
    loader,
    data: material[MATERIAL_DATA_INDEX],
    container: getDataContainer(
      material,
      materialsLayout,
      material[MATERIAL_DATA_INDEX].byteLength,
      GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    ),
    groupID: MATERIALS_GROUP_ID,
  });
};
