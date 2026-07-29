import { DIMENSIONS, FLOAT_32_BIN, FLOAT_32_BYTES } from "~common";

export const POINT_SIZE = DIMENSIONS * FLOAT_32_BYTES;
export const POINT_FORMAT: GPUVertexFormat =
  `float${FLOAT_32_BIN}x${DIMENSIONS}`;
