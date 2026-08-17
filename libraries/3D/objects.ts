/**
 *    Copyright 2026 Cutout Studios LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { doTimes } from "~common";
import type { AxisAngle, XOGeometry, XOMaterial, XYZ } from "./types.ts";
import { XYZ_LENGTH } from "./constants.ts";
import { createRotation, localize, readOrigin } from "./coordinates.ts";

const POSITION_INDEX = 12;

export class XOObject {
  geometry?: XOGeometry;
  material?: XOMaterial;
  coordinates: Float32Array;

  constructor(
    geometry?: XOGeometry,
    position?: XYZ,
    rotation?: AxisAngle,
    material?: XOMaterial,
  ) {
    this.geometry = geometry;
    this.material = material;
    this.coordinates = createRotation(rotation);

    if (position) this.position = position;
  }

  get position() {
    return readOrigin(this.coordinates);
  }

  set position(input: XYZ) {
    this.coordinates.set(input, POSITION_INDEX);
  }

  set rotation(input: AxisAngle) {
    const next = createRotation(input);

    next.set(this.position, POSITION_INDEX);

    this.coordinates = next;
  }

  adjust(position?: XYZ, rotation?: AxisAngle) {
    if (position) {
      doTimes(
        XYZ_LENGTH,
        (index) => this.coordinates[POSITION_INDEX + index] += position[index],
      );
    }

    if (rotation) {
      this.coordinates = localize(createRotation(rotation), this.coordinates);
    }
  }
}
