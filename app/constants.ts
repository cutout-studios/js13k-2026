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
import { BLUE, GREEN, RED, X, XYZ, XYZ_LENGTH, Y, Z } from "~3D";

export const CUBE_FACE_COLORS = [RED, GREEN, BLUE];
export const CUBE_OFFSETS = [-3.5, 0, 3.5];

const CAMERA_SPEED = 2;
export const CAMERA_STARTING_POINT: XYZ = [0, 0, 5];
export const CAMERA_CONTROLLER_MAP: Record<
  string,
  (delta: number) => [XYZ | undefined, [XYZ, number] | undefined]
> = {
  // NOTE: Browser key codes ignore keyboard layout.
  KeyW: _look(X, 1),
  KeyS: _look(X, -1),
  KeyA: _look(Y, 1),
  KeyD: _look(Y, -1),
  ArrowUp: _move(Z, -1),
  ArrowDown: _move(Z, 1),
  ArrowLeft: _move(X, -1),
  ArrowRight: _move(X, 1),
};

function _direction(axis: number, magnitude: number) {
  return doTimes(
    XYZ_LENGTH,
    (index) => index === axis ? magnitude : 0,
  ) as XYZ;
}

function _move(axis: number, sign: number) {
  return (
    delta: number,
  ): [XYZ | undefined, [XYZ, number] | undefined] => [
    _direction(axis, sign * CAMERA_SPEED * delta),
    undefined,
  ];
}

function _look(axis: number, sign: number) {
  return (
    delta: number,
  ): [XYZ | undefined, [XYZ, number] | undefined] => [
    undefined,
    [_direction(axis, 1), sign * delta * Math.PI / 2],
  ];
}
