import { FLOAT_32_BIN, FLOAT_32_BYTES } from "~common";

export const XYZ_LENGTH = 3;
export const [X, Y, Z] = [0, 1, 2];

export type RGBA = [r: number, b: number, g: number, a: number];
export const [RED, GREEN, BLUE] = [0xff0000, 0x00ff00, 0x0000ff];

export const COORDINATES_DATA_GROUP_ID = 0;
export const [COORDINATE_ROW_LENGTH, COORDINATE_COLUMN_LENGTH] = [4, 4];
export const COORDINATE_DATA_LENGTH = COORDINATE_ROW_LENGTH *
  COORDINATE_COLUMN_LENGTH;
export const COORDINATE_DATA_SIZE = COORDINATE_DATA_LENGTH * FLOAT_32_BYTES;

export const VERTEX_DATA_SIZE = XYZ_LENGTH * FLOAT_32_BYTES;
export const VERTEX_DATA_FORMAT: GPUVertexFormat =
  `float${FLOAT_32_BIN}x${XYZ_LENGTH}`;
export const TRIANGLES_PER_SQUARE = 2;

export const DEPTH_TEXTURE_FORMAT = "depth24plus";

export const MATERIALS_DATA_GROUP_ID = 1;
