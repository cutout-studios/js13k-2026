import { DIMENSIONS, doTimes, XYZ } from "~common";
import { type RigidTransformDirection } from "~transforms";

export const POLYGONS_PER_CUBE_FACE = 2;
const [RED, GREEN, BLUE] = [0xff0000, 0x00ff00, 0x0000ff];
export const CUBE_FACE_COLORS = [RED, GREEN, BLUE];
export const CUBE_OFFSETS = [-3.5, 0, 3.5];

const [X, Y, Z] = [0, 1, 2];

const VIEWPORT_SPEED = 2;

export const VIEWPORT_STARTING_POINT = _move(Z, 1)(2);
export const VIEWPORT_CONTROLLER_MAP: Record<
  string,
  (delta: number) => [XYZ | undefined, XYZ | undefined]
> = {
  // NOTE: Browser key codes ignore keyboard layout.
  KeyW: _look(X, 1),
  KeyS: _look(X, -1),
  KeyA: _look(Y, 1),
  KeyD: _look(Y, -1),
  KeyQ: _look(Z, 1),
  KeyE: _look(Z, -1),
  ArrowUp: _move(Z, -1),
  ArrowDown: _move(Z, 1),
  ArrowLeft: _move(X, -1),
  ArrowRight: _move(X, 1),
};

function _direction(axis: number, magnitude: number) {
  return doTimes(
    DIMENSIONS,
    (index) => index === axis ? magnitude : 0,
  ) as RigidTransformDirection;
}

function _move(axis: number, sign: number) {
  return (
    delta: number,
  ): [XYZ | undefined, XYZ | undefined] => [
    _direction(axis, sign * VIEWPORT_SPEED * delta),
    undefined,
  ];
}

function _look(axis: number, sign: number) {
  return (
    delta: number,
  ): [XYZ | undefined, XYZ | undefined] => [
    undefined,
    _direction(axis, sign * delta * Math.PI / 2),
  ];
}
