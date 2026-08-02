import { doTimes, dotProduct, XYZ, XYZ_LENGTH } from "~common";

import type { GPURenderTarget } from "./webgpu/createRenderTarget.ts";
import { loadObject } from "./webgpu/loadObject.ts";
import { XOObject } from "./objects.ts";
import { XOCoordinates } from "./coordinates.ts";

const DEFAULT_PERSPECTIVE_SAFETY_CROP = 0.1;
const DEFAULT_VIEWING_RADIANS = Math.PI / 2;
export class XOCamera extends XOObject {
  viewingRadians: number = DEFAULT_VIEWING_RADIANS;
  safetyCropDistance: number = DEFAULT_PERSPECTIVE_SAFETY_CROP;

  get invertedCoordinates(): XOCoordinates {
    return new XOCoordinates(
      ...(doTimes(
        XYZ_LENGTH,
        (
          index,
        ) => [
          this.coordinates.xAxis[index],
          this.coordinates.yAxis[index],
          this.coordinates.zAxis[index],
        ],
      ) as XYZ[]),
      [this.coordinates.xAxis, this.coordinates.yAxis, this.coordinates.zAxis]
        .map((axis) => -dotProduct(axis, this.coordinates.origin)) as XYZ,
    );
  }

  render(objects: XOObject[], target: GPURenderTarget) {
    target.render((process) => {
      const viewingCoordinates = XOCoordinates.localize(
        XOCoordinates.fromData(this.#makePerspectiveData(target.aspectRatio)),
        this.invertedCoordinates,
      );

      for (const object of objects) {
        if (!object.geometry || !object.material) continue; // skip nul1/invisible objects

        loadObject(
          process,
          object.geometry,
          XOCoordinates.localize(object.coordinates, viewingCoordinates),
          object.material,
        );

        process.draw(object.geometry.length);
      }
    });
  }

  #makePerspectiveData(aspectRatio: number): Float32Array {
    const viewportHeight = Math.tan(Math.PI / 2 - this.viewingRadians / 2);

    // deno-fmt-ignore
    return new Float32Array([
      viewportHeight / aspectRatio, 0, 0, 0,
      0, viewportHeight, 0, 0,
      0, 0, -1, -1,
      0, 0, -2 * this.safetyCropDistance, 0
    ]);
  }
}
