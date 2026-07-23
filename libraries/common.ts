export type XYZ = [x: number, y: number, z: number];

export type Transform = Float32Array;

export type Object = {
  geometry: {
    data: GPUBuffer;
    count: number;
  };
  material: GPURenderPipeline;
  transform: Transform;
};

export const doTimes = <T>(count: number, action: (count: number) => T): T[] =>
  Array(count).fill(null).map((_, index) => action(index));

export const TRANSFORM_DATA_GROUP_INDEX = 0;
export const TRANSFORM_DATA_INSTANCE_INDEX = 0;
export const VERTEX_DATA_INDEX = 0;
export const DEPTH_PIXELS_FORMAT = "depth24plus";

const BIN_TO_BYTES = 8;
const FLOAT_32_BIN = 32;
const FLOAT_32_BYTES = FLOAT_32_BIN / BIN_TO_BYTES;

export const TRANSFORM_WIDTH = 4;
export const TRANSFORM_FORMAT = `float${FLOAT_32_BIN}x${TRANSFORM_WIDTH}`;
export const TRANSFORM_SIZE = TRANSFORM_WIDTH * TRANSFORM_WIDTH;
export const TRANSFORM_BYTES = TRANSFORM_SIZE * FLOAT_32_BYTES;
