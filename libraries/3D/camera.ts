import type { GPURenderTarget } from "./types.ts";
import {
  DEFAULT_CAMERA_SAFETY_CROP,
  DEFAULT_CAMERA_VIEWING_RADIANS,
} from "./constants.ts";
import { loadObject } from "./webgpu/loadObject.ts";
import { XOObject } from "./objects.ts";
import { XOCoordinates } from "./coordinates.ts";

export class XOCamera extends XOObject {
  viewingRadians: number = DEFAULT_CAMERA_VIEWING_RADIANS;
  safetyCropDistance: number = DEFAULT_CAMERA_SAFETY_CROP;

  render(objects: XOObject[], target: GPURenderTarget) {
    target.render((process) => {
      const viewingCoordinates = XOCoordinates.localize(
        this.coordinates.orthonormalInverse,
        this.#makePerspectiveCoordinates(target.aspectRatio),
      );

      for (const object of objects) {
        // skip null/invisible objects
        if (!object.geometry || !object.material) continue;

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

  #makePerspectiveCoordinates(aspectRatio: number): XOCoordinates {
    const viewportHeight = Math.tan(Math.PI / 2 - this.viewingRadians / 2);

    return new XOCoordinates(
      // deno-fmt-ignore
      new Float32Array([
        viewportHeight / aspectRatio, 0, 0, 0,
        0, viewportHeight, 0, 0,
        0, 0, -1, -1,
        0, 0, -2 * this.safetyCropDistance, 0
      ]),
    );
  }
}
