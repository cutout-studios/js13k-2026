import {
  createPaintMaterialWithPalette as paint,
  flattenObjects,
  XOObject,
} from "~3D";
import { createPrism, createPyramid, createSphere } from "./shapes.ts";

type XOObjectArgs = ConstructorParameters<typeof XOObject>;
type EnemyOption = [paintHex: number, objectArgs: Array<XOObjectArgs>];

export const createEnemy = ([paintHex, objectArgs]: EnemyOption) => {
  const object = flattenObjects(
    ...objectArgs.map((args) => new XOObject(...args)),
  );
  object.material = paint(paintHex);
  return { object };
};

const GREEN_PRONG = createPyramid([0.065, 0.065, 0.095], 12);
const YELLOW_ARM = createPrism([0.2, 0.012, 0.15]);

export default {
  purple: [0x8434D4, [[createPyramid([0.25, 0.25, 0.125])]]],
  green: [0xA0DD27, [
    [createSphere(0.20, 24)],
    [GREEN_PRONG, [0.2, -0.08, 0.15], [[0, 1, -1], 1.25]],
    [GREEN_PRONG, [-0.2, -0.08, 0.15], [[0, 1, -1], -1.25]],
  ]],
  // NOTE: muzzle location is (0, -0.32, 0.63)
  blue: [0x29A9D4, [
    [createSphere(0.52, 32)],
    [createPrism([0.09, 0.09, 0.03], 16), [0, -0.30, 0.42], [[1, 0, 0], 0.57]],
  ]],
  pink: [0xD4349F, [[createSphere(0.10, 20)]]],
  red: [0xEE3030, [[createPyramid([0.11, 0.09, 0.4], 3), undefined, [
    [0, 0, 1],
    -1.61,
  ]]]],
  yellow: [0xF4AD32, [
    [YELLOW_ARM, [0.19, -0.04, 0], [[0, 0, 1], -0.3]],
    [YELLOW_ARM, [-0.19, -0.04, 0], [[0, 0, 1], 0.3]],
    [YELLOW_ARM, [0.52, 0.02, 0], [[0, 0, 1], 0.65]],
    [YELLOW_ARM, [-0.52, 0.02, 0], [[0, 0, 1], -0.65]],
  ]],
} satisfies Record<string, EnemyOption>;
