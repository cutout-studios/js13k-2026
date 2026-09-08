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
  // aimObject,
  createPaintMaterialWithPalette as paint,
  normalizeXYZ,
  // readOrigin,
  scaleXYZ,
  // subtractXYZ,
  toHSL,
  toRGB,
  XOObject,
  XYZ,
  Z_AXIS,
} from "~/3D";
import { /* PI, */ round, /* sin, */ TAU } from "~/alias";
import { Action } from "~/clock";
import { Band, doTimes, interpolate, repeat } from "~/common";
import { rollBand } from "~/random";

export const orbitAction: Action<XOObject> = (object: XOObject, tickLength) =>
  adjustObject(object, [undefined, [
    repeat(3, tickLength) as XYZ,
    tickLength,
  ]]);

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

export const createRollAction = (
  rotations: number,
  curve: (value: number) => number = (n) => n,
): Action<XOObject> =>
(object: XOObject, _, elapsedTime, duration) =>
  adjustObject(object, [undefined, [
    Z_AXIS,
    curve(elapsedTime / duration) * rotations * TAU,
  ]]);

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

// export const createSwoopAction = (
//   target: XYZ,
//   depth: number,
//   speed: number,
//   depthAxis: XYZ = Z_AXIS,
// ): Action<XOObject> => {

//   return (
//     object: XOObject,
//     tickLength,
//     elapsedTime: number,
//     duration: number,
//   ) => {
//     const swoopCurve = sin(PI * (elapsedTime / duration)),
//       waypoint = addXYZ(target, scaleXYZ(depthAxis, depth * swoopCurve)),
//       direction = subtractXYZ(waypoint, readOrigin(object[0]));

//     createPullAction(direction, speed, (progress) => sin(PI * progress))(
//       object,
//       tickLength,
//       elapsedTime,
//       duration,
//     );
//     aimObject(object, waypoint);
//   };
// };
