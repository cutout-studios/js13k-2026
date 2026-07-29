import { doTimes, dotProduct } from "~common";
import type { ProjectiveTransform } from "./types.ts";
import { PROJECTIVE_TRANSFORM_WIDTH } from "./constants.ts";

export const multiply = (
  ...transforms: ProjectiveTransform[]
): ProjectiveTransform =>
  transforms.reduce((left, right) =>
    new Float32Array(
      doTimes(
        PROJECTIVE_TRANSFORM_WIDTH,
        (columnIndex) =>
          doTimes(PROJECTIVE_TRANSFORM_WIDTH, (rowIndex) =>
            dotProduct(
              [...right.slice(
                columnIndex * PROJECTIVE_TRANSFORM_WIDTH,
                (columnIndex + 1) * PROJECTIVE_TRANSFORM_WIDTH,
              )],
              doTimes(
                PROJECTIVE_TRANSFORM_WIDTH,
                (index) => left[rowIndex + PROJECTIVE_TRANSFORM_WIDTH * index],
              ),
            )),
      ).flat(),
    )
  );
