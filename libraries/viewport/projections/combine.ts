import { doTimes, dotProduct } from "~common";

import type { Projection } from "./types.ts";

import { PROJECTION_WIDTH } from "./constants.ts";

export const combine = (...projections: Projection[]): Projection =>
  projections.reduce((right, left) =>
    new Float32Array(
      doTimes(
        PROJECTION_WIDTH,
        (columnIndex) =>
          doTimes(PROJECTION_WIDTH, (rowIndex) =>
            dotProduct(
              [...right.slice(
                columnIndex * PROJECTION_WIDTH,
                (columnIndex + 1) * PROJECTION_WIDTH,
              )],
              doTimes(
                PROJECTION_WIDTH,
                (index) => left[rowIndex + PROJECTION_WIDTH * index],
              ),
            )),
      ).flat(),
    )
  );
