import { PROJECTIVE_TRANSFORM_BYTES, ProjectiveTransform } from "~transforms";
import { transformsLayout } from "../getRenderPipeline.ts";
import { TRANSFORM_GROUP_ID } from "../constants.ts";
import type { Object } from "~objects";
import { getDataContainer, writeData } from "./writeData.ts";

export const loadTransform = (
  loader: GPURenderPassEncoder,
  object: Object,
  transform: ProjectiveTransform,
) =>
  writeData({
    loader,
    data: transform,
    container: getDataContainer(
      object,
      transformsLayout,
      PROJECTIVE_TRANSFORM_BYTES,
      GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    ),
    groupID: TRANSFORM_GROUP_ID,
  });
