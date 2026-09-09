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
  createPaintMaterialWithPalette as paint,
  crossXYZ,
  normalizeXYZ,
  readOrigin,
  scaleXYZ,
  setOrigin,
  subtractXYZ,
  toHSL,
  toRGB,
  XOObject,
  XYZ,
} from "~/3D";
import { cos, hypot, min, PI, round, sin } from "~/alias";
import { Action } from "~/clock";
import { Band, doTimes, interpolate, repeat } from "~/common";
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

// fast near t=0, slowing into t=1 - used for the leg leaving the spawn point
export const EASE_OUT = (t: number) => 1 - (1 - t) ** 4;

// slow out of t=0, fast into t=1 - the mirror of EASE_OUT, used for the leg
// returning to the spawn point, so both legs are fast near the spawn point
// and slow near the field point
export const EASE_IN = (t: number) => 1 - EASE_OUT(1 - t);

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
): Action<
  XOObject
> => ((object: XOObject, _, elapsedTime: number, duration: number) => {
  adjustObject(object, [
    scaleXYZ(
      addXYZ(
        normalizeXYZ(direction),
        doTimes(jitter, (band) => rollBand(band)) as XYZ,
      ),
      speed * curve(elapsedTime / duration),
    ),
  ]);
});

export const createColorTransitionAction = (
  fromColor: number,
  toColor: number,
  curve: (t: number) => number = (t) => t,
): Action<XOObject> => {
  const from = toHSL(fromColor),
    to = toHSL(toColor);

  return (object: XOObject, _, elapsedTime: number, duration: number) => {
    const t = curve(elapsedTime / duration),
      [h, s, l, a] = doTimes(
        4,
        (index: number) => interpolate([from[index], to[index]], t),
      );

    object[2] = paint(toRGB(h, s, l, round(a)));
  };
};
