import type { XYZ } from "~common";

const BIN_TO_BYTES = 8;
const FLOAT_32_BIN = 32;
const FLOAT_32_BYTES = FLOAT_32_BIN / BIN_TO_BYTES;

export const TRANSFORM_WIDTH = 4;
export const TRANSFORM_FORMAT = `float${FLOAT_32_BIN}x${TRANSFORM_WIDTH}`;
export const TRANSFORM_SIZE = TRANSFORM_WIDTH * TRANSFORM_WIDTH;
export const TRANSFORM_BYTES = TRANSFORM_SIZE * FLOAT_32_BYTES;

export const XYZ_WIDTH = 3;

export const DEFAULT_PERSPECTIVE_SAFETY_CROP = 1;

export const DEFAULT_X_AXIS: XYZ = [1, 0, 0];
export const DEFAULT_Y_AXIS: XYZ = [0, 1, 0];
export const DEFAULT_Z_AXIS: XYZ = [0, 0, 1];

export const ORIGIN_COLUMN_INDEX = 3;
export const DEFAULT_ORIGIN: XYZ = [0, 0, 0];

export const IS_AXIS = 0;
export const IS_POINT = 1;
