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

import { XYZ } from "~3D";
import { hypot } from "~alias";

export const add = (
  [x1, y1, z1]: XYZ,
  [x2, y2, z2]: XYZ,
): XYZ => [x1 + x2, y1 + y2, z1 + z2];

export const subtract = (
  [x1, y1, z1]: XYZ,
  [x2, y2, z2]: XYZ,
): XYZ => [x1 - x2, y1 - y2, z1 - z2];

export const scale = (
  [x, y, z]: XYZ,
  s: number,
): XYZ => [x * s, y * s, z * s];

export const cross = (
  [ax, ay, az]: XYZ,
  [bx, by, bz]: XYZ,
): XYZ => [ay * bz - az * by, az * bx - ax * bz, ax * by - ay * bx];

export const normalize = (
  [x, y, z]: XYZ,
): XYZ => {
  const magnitude = hypot(x, y, z) || 1;

  return [x / magnitude, y / magnitude, z / magnitude];
};

// export const dot = <T extends number[]>(left: T, right: T) =>
//   left.reduce(
//     (result, value, index) => result + value * right[index],
//     0,
//   );
