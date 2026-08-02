import { doTimes } from "~common";
import { BLUE, GREEN, RED, X, XYZ, XYZ_LENGTH, Y, Z } from "~3D";

export const CUBE_FACE_COLORS = [RED, GREEN, BLUE];
export const CUBE_OFFSETS = [-3.5, 0, 3.5];

const CAMERA_SPEED = 2;
export const CAMERA_STARTING_POINT = _move(Z, 1)(2);
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
