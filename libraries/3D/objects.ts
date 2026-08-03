import { doTimes } from "~common";

import type { XOGeometry, XOMaterial, XYZ } from "./types.ts";
import { XYZ_LENGTH } from "./constants.ts";
import { XOCoordinates } from "./coordinates.ts";

export class XOObject {
  geometry?: XOGeometry;
  material?: XOMaterial;

  constructor(
    geometry?: XOGeometry,
    position?: XYZ,
    rotation?: [XYZ, number],
    material?: XOMaterial,
  ) {
    this.geometry = geometry;
    this.material = material;

    this.#positionCoordinates = this.#makePositionCoordinates(position);
    this.#rotationCoordinates = this.#makeRotationCoordinates(rotation);
  }

  #positionCoordinates: XOCoordinates;
  get position(): XYZ {
    return this.#positionCoordinates.origin;
  }

  set position(input: XYZ) {
    this.#positionCoordinates = this.#makePositionCoordinates(input);
  }

  #rotationCoordinates: XOCoordinates;
  // get rotation() {}

  set rotation(input: [XYZ, number]) {
    this.#rotationCoordinates = this.#makeRotationCoordinates(input);
  }

  get coordinates(): XOCoordinates {
    return XOCoordinates.localize(
      this.#rotationCoordinates,
      this.#positionCoordinates,
    );
  }

  adjust(position?: XYZ, rotation?: [XYZ, number]) {
    this.position = doTimes(
      XYZ_LENGTH,
      (index) => this.position[index] + (position?.[index] ?? 0),
    ) as XYZ;

    this.#rotationCoordinates = XOCoordinates.localize(
      this.#makeRotationCoordinates(rotation),
      this.#rotationCoordinates,
    );
  }

  #makePositionCoordinates(position?: XYZ): XOCoordinates {
    return new XOCoordinates(undefined, undefined, undefined, position);
  }

  #makeRotationCoordinates(
    [axis, angle]: [XYZ, number] = [[1, 0, 0], 0],
  ): XOCoordinates {
    const magnitude = Math.hypot(...axis);
    const normalizedAxis = axis.map((value) => value / magnitude) as XYZ;
    const sin = Math.sin(angle), cos = Math.cos(angle);

    return new XOCoordinates(
      ...(doTimes(
        XYZ_LENGTH,
        (columnIndex) =>
          doTimes(XYZ_LENGTH, (rowIndex) => {
            let cell = normalizedAxis[columnIndex] * normalizedAxis[rowIndex] *
              (1 - cos);

            if (columnIndex === rowIndex) {
              cell += cos;
            } else {
              const leftoverIndex = XYZ_LENGTH - columnIndex - rowIndex;
              const sign = (rowIndex + 1) % XYZ_LENGTH === columnIndex ? -1 : 1;
              cell += sin * normalizedAxis[leftoverIndex] * sign;
            }

            return cell;
          }),
      ) as XYZ[]),
    );
  }
}
