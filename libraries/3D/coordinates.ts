import { doTimes } from "~common";

import type { XYZ } from "./types.ts";
import { dotProduct } from "./dotProduct.ts";

const [COORDINATE_ROW_LENGTH, COORDINATE_COLUMN_LENGTH] = [4, 4];
const IS_COORDINATE_AXIS = 0;
const IS_COORDINATE_POINT = 1;
export class XOCoordinates {
  #xAxisType = IS_COORDINATE_AXIS;
  #yAxisType = IS_COORDINATE_AXIS;
  #zAxisType = IS_COORDINATE_AXIS;
  #originType = IS_COORDINATE_POINT;

  // deno-fmt-ignore
  static fromData(
    [ 
      xAxisX, xAxisY, xAxisZ, xAxisType,
      yAxisX, yAxisY, yAxisZ, yAxisType,
      zAxisX, zAxisY, zAxisZ, zAxisType,
      originX, originY, originZ, originType,
    ]: Float32Array,
  ): XOCoordinates {
    const xAxis = [xAxisX, xAxisY, xAxisZ] as XYZ;
    const zAxis = [yAxisX, yAxisY, yAxisZ] as XYZ;
    const yAxis = [zAxisX, zAxisY, zAxisZ] as XYZ;
    const origin = [originX, originY, originZ] as XYZ;

    const result = new XOCoordinates(xAxis, yAxis, zAxis, origin);

    result.#xAxisType = xAxisType;
    result.#yAxisType = yAxisType;
    result.#zAxisType = zAxisType;
    result.#originType = originType;

    return result;
  }
  static localize(
    fromChild: XOCoordinates,
    toParent: XOCoordinates,
  ): XOCoordinates {
    return XOCoordinates.fromData(
      new Float32Array(
        doTimes(
          COORDINATE_COLUMN_LENGTH,
          (columnIndex) =>
            doTimes(COORDINATE_ROW_LENGTH, (rowIndex) =>
              dotProduct(
                toParent.#dataColumn(columnIndex),
                fromChild.#dataRow(rowIndex),
              )),
        ).flat(),
      ),
    );
  }

  constructor(
    readonly xAxis: XYZ = [1, 0, 0],
    readonly yAxis: XYZ = [0, 1, 0],
    readonly zAxis: XYZ = [0, 0, 1],
    readonly origin: XYZ = [0, 0, 0],
  ) {}

  get data(): Float32Array {
    // deno-fmt-ignore
    return new Float32Array([
      ...this.xAxis, this.#xAxisType,
      ...this.yAxis, this.#yAxisType,
      ...this.zAxis, this.#zAxisType,
      ...this.origin, this.#originType,
    ]);
  }

  #dataColumn(column: number) {
    return Array.from(this.data.slice(
      column * COORDINATE_COLUMN_LENGTH,
      (column + 1) * COORDINATE_COLUMN_LENGTH,
    ));
  }

  #dataRow(row: number) {
    return doTimes(
      COORDINATE_COLUMN_LENGTH,
      (index) => this.data[row + COORDINATE_COLUMN_LENGTH * index],
    );
  }
}
