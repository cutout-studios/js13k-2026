import { doTimes } from "~common";

import type { XYZ } from "./types.ts";
import { COORDINATE_SIDE_LENGTH, XYZ_LENGTH } from "./constants.ts";
import { dotProduct } from "./dotProduct.ts";

const IS_COORDINATE_AXIS = 0;
const IS_COORDINATE_POINT = 1;
export class XOCoordinates {
  readonly data: Float32Array;

  static localize(
    fromChild: XOCoordinates,
    toParent: XOCoordinates,
  ): XOCoordinates {
    const [childColumns, parentRows] = [
      doTimes(
        COORDINATE_SIDE_LENGTH,
        (index) =>
          fromChild.#readLine(
            index * COORDINATE_SIDE_LENGTH,
            1,
            COORDINATE_SIDE_LENGTH,
          ),
      ),
      doTimes(
        COORDINATE_SIDE_LENGTH,
        (index) =>
          toParent.#readLine(
            index,
            COORDINATE_SIDE_LENGTH,
            COORDINATE_SIDE_LENGTH,
          ),
      ),
    ];

    return new XOCoordinates(
      new Float32Array(
        doTimes(
          COORDINATE_SIDE_LENGTH,
          (columnIndex) =>
            doTimes(
              COORDINATE_SIDE_LENGTH,
              (rowIndex) =>
                dotProduct(childColumns[columnIndex], parentRows[rowIndex]),
            ),
        ).flat(),
      ),
    );
  }

  constructor(data: Float32Array);
  constructor(xAxis?: XYZ, yAxis?: XYZ, zAxis?: XYZ, origin?: XYZ);
  constructor(
    xAxisOrData: Float32Array | XYZ = [1, 0, 0],
    yAxis: XYZ = [0, 1, 0],
    zAxis: XYZ = [0, 0, 1],
    origin: XYZ = [0, 0, 0],
  ) {
    this.data = xAxisOrData instanceof Float32Array
      ? xAxisOrData
      : new Float32Array([
        ...xAxisOrData,
        IS_COORDINATE_AXIS,
        ...yAxis,
        IS_COORDINATE_AXIS,
        ...zAxis,
        IS_COORDINATE_AXIS,
        ...origin,
        IS_COORDINATE_POINT,
      ]);
  }

  get xAxis() {
    return this.#readLine(0) as XYZ;
  }

  get yAxis() {
    return this.#readLine(4) as XYZ;
  }

  get zAxis() {
    return this.#readLine(8) as XYZ;
  }

  get origin() {
    return this.#readLine(12) as XYZ;
  }

  get orthonormalInverse(): XOCoordinates {
    const { origin } = this;

    return new XOCoordinates(
      ...(doTimes(
        XYZ_LENGTH,
        (index) => this.#readLine(index, COORDINATE_SIDE_LENGTH),
      ) as [XYZ, XYZ, XYZ]),
      doTimes(
        XYZ_LENGTH,
        (index) =>
          -dotProduct(this.#readLine(index * COORDINATE_SIDE_LENGTH), origin),
      ) as XYZ,
    );
  }

  #readLine(
    start: number,
    stride: number = 1,
    length: number = XYZ_LENGTH,
  ) {
    return doTimes(
      length,
      (index) => this.data[start + stride * index],
    );
  }
}
