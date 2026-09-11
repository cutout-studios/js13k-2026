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

import {
  addXYZ,
  adjustObject,
  aimObject,
  crossXYZ,
  normalizeXYZ,
  readOrigin,
  scaleXYZ,
  setOrigin,
  subtractXYZ,
  XOObject,
  XYZ,
} from "~/3D";
import { cos, hypot, min, PI, sin } from "~/alias";
import { Action } from "~/clock";
import { Band, doTimes, repeat } from "~/common";
import { rollBand } from "~/random";

export const spinAction: Action<XOObject> = (object: XOObject, tickLength) =>
  adjustObject(object, [undefined, [
    repeat(3, tickLength) as XYZ,
    tickLength,
  ]]);

export const createOrbitAction = (
  targetPoint: XYZ,
  referencePoint: XYZ,
  curve: (value: number) => number = (t) => t,
): Action<XOObject> => {
  let startingPoint: XYZ | undefined;

  return (object: XOObject, _, elapsedTime: number, duration: number) => {
    startingPoint ??= readOrigin(object[0]);

    const center = scaleXYZ(addXYZ(startingPoint, targetPoint), 0.5),
      radiusVector = subtractXYZ(startingPoint, center),
      radius = hypot(...radiusVector),
      planeNormal = normalizeXYZ(
        crossXYZ(
          subtractXYZ(targetPoint, startingPoint),
          subtractXYZ(referencePoint, startingPoint),
        ),
      ),
      perpendicular = scaleXYZ(
        normalizeXYZ(crossXYZ(radiusVector, planeNormal)),
        radius,
      ),
      angle = PI * curve(elapsedTime / duration);

    setOrigin(
      object[0],
      addXYZ(
        center,
        addXYZ(
          scaleXYZ(radiusVector, cos(angle)),
          scaleXYZ(perpendicular, sin(angle)),
        ),
      ),
    );
  };
};

export const createAimAction = (
  aim: XYZ,
  getTarget: () => XYZ,
  getAimTime: () => number,
  getRoll: () => number = () => 0,
): Action<XOObject> =>
(object: XOObject, tickLength: number) => {
  doTimes(3, (index: number) =>
    aim[index] += scaleXYZ(
      subtractXYZ(getTarget(), aim),
      min(1, tickLength / getAimTime()),
    )[index]);

  aimObject(object, aim, getRoll());
};

export const createPullAction = (
  direction: XYZ,
  speed: number,
  curve: (value: number) => number = () => 1,
  jitter: [Band, Band, Band] = [[0, 0], [0, 0], [0, 0]],
): Action<XOObject> =>
(
  object: XOObject,
  tickLength: number,
  elapsedTime: number,
  duration: number,
) => {
  adjustObject(object, [
    scaleXYZ(
      addXYZ(
        normalizeXYZ(direction),
        doTimes(jitter, (band) => rollBand(band)) as XYZ,
      ),
      speed * curve(elapsedTime / duration) * tickLength,
    ),
  ]);
};
