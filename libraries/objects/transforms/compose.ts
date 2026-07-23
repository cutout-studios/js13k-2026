import { doTimes, type Transform, TRANSFORM_WIDTH } from "~common";
import { dotProduct } from "./dotProduct.ts";
import { getColumn, getRow } from "./getters.ts";

export const compose = (...transforms: Transform[]): Transform =>
  transforms.reduce((left, right) =>
    new Float32Array(
      doTimes(
        TRANSFORM_WIDTH,
        (columnIndex) =>
          doTimes(TRANSFORM_WIDTH, (rowIndex) =>
            dotProduct(
              getColumn(left, columnIndex),
              getRow(right, rowIndex),
            )),
      ).flat(),
    )
  );
