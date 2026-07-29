import { DIMENSIONS, doTimes } from "~common";
import {
  createRotation,
  createTranslation,
  type RigidTransform,
  type RigidTransformDirection,
} from "~transforms";

export const POLYGONS_PER_CUBE_FACE = 2;
const [RED, GREEN, BLUE] = [0xff0000, 0x00ff00, 0x0000ff];
export const CUBE_FACE_COLORS = [RED, GREEN, BLUE];
export const CUBE_OFFSETS = [-3.5, 0, 3.5];

const [X, Y, Z] = [0, 1, 2];

const VIEWPORT_SPEED = 2;

export const VIEWPORT_STARTING_POINT = _move(Z, 1)(2);
export const VIEWPORT_CONTROLLER_MAP: Record<
  string,
  (delta: number) => RigidTransform
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

export const MUSICBOX_TEST_TEMPO = 200;
export const MUSICBOX_TEST_SCORE = `
  melody: A5 * C#5 * E5 * C#5 * | A5  * D5 * -     -  E5 B5
  chords: AM * *   * *  * *   * | D3M * *  * E3M7  *  *  *  
  bass:   A2 * *   * *  * *   * | D1  * *  * E1    *  *  * 
`;

function _direction(axis: number, magnitude: number) {
  return doTimes(
    DIMENSIONS,
    (index) => index === axis ? magnitude : 0,
  ) as RigidTransformDirection;
}

function _move(axis: number, sign: number) {
  return (delta: number) =>
    createTranslation(_direction(axis, sign * VIEWPORT_SPEED * delta));
}

function _look(axis: number, sign: number) {
  return (delta: number) =>
    createRotation(_direction(axis, 1), sign * VIEWPORT_SPEED * delta);
}
