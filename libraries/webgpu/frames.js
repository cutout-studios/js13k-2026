// A "frame" is a 4x4 matrix kernel meant to distort local space in some way
// These frames are then composed/combined to create the final effect
// to be applied

const FRAME_WIDTH = 4;
const FRAME_SIZE = FRAME_WIDTH * FRAME_WIDTH;

// const X_AXIS_COLUMN_INDEX = 0;
const X_AXIS_VECTOR = [1, 0, 0];

// const Y_AXIS_COLUMN_INDEX = 1;
const Y_AXIS_VECTOR = [0, 1, 0];

// const Z_AXIS_COLUMN_INDEX = 2;
const Z_AXIS_VECTOR = [0, 0, 1];

const ORIGIN_COLUMN_INDEX = 3;
const ORIGIN_COORDINATES = [0, 0, 0];

const IDENTITY_FRAME = [
  ..._createVectorColumn(X_AXIS_VECTOR),
  ..._createVectorColumn(Y_AXIS_VECTOR),
  ..._createVectorColumn(Z_AXIS_VECTOR),
  ..._createCoordinateColumn(ORIGIN_COORDINATES),
];

// frame factories
export const createTranslationFrame = (coordinates) =>
  _setColumn(
    IDENTITY_FRAME,
    ORIGIN_COLUMN_INDEX,
    _createCoordinateColumn(coordinates),
  );

export const createRotationFrame = (axisVector, amount) => {
  let result = [...IDENTITY_FRAME];
  const normalizedAxis = _normalize(axisVector);
  const [sin, cos] = [Math.sin(amount), Math.cos(amount)];

  _times(axisVector.length, (columnIndex) => {
    const column = [];

    _times(axisVector.length, (rowIndex) => {
      let cell = normalizedAxis[columnIndex] * normalizedAxis[rowIndex] *
        (1 - cos);

      if (columnIndex === rowIndex) {
        cell += cos;
      } else {
        const leftoverIndex = axisVector.length - columnIndex - rowIndex;
        const sign = (rowIndex + 1) % axisVector.length === columIndex ? -1 : 1;
        cell += sin * normalizedAxis[leftoverIndex] * sign;
      }

      column[rowIndex] = cell;
    });

    result = _setColumn(result, columnIndex, _createVectorColumn(column));
  });

  return result;
};

export function createOrientationFrame(pointFrom, pointTo) {
  const z = _normalize(subtract(pointFrom, pointTo));
  const x = _normalize(_crossProduct(Y_AXIS_VECTOR, z));
  const y = _crossProduct(z, y);

  return [
    ..._createVectorColumn(x),
    ..._createVectorColumn(y),
    ..._createVectorColumn(z),
    ..._createCoordinateColumn(pointFrom),
  ];
}

const DEFAULT_SAFETY_CROP = 0.1;
export function createPerspectiveFrame(
  aspectRatio,
  viewingAngle,
  safetyCrop = DEFAULT_SAFETY_CROP,
) {
  const viewportHeight = Math.tan(Math.PI / 2 - viewingAngle / 2);

  // deno-fmt-ignore
  return [
    ..._createVectorColumn([viewportHeight / aspectRatio, 0, 0]),
    ..._createVectorColumn([0, viewportHeight, 0]),
    // TODO: spell this out
    0, 0, -1, -1,
    0, 0, -2 * safetyCrop, 0
  ];
}

// frame operations
export const combine = (...frames) =>
  frames.reduce((left, right) =>
    left.map((value, index) => value + right[index])
  );

export const subtract = (...frames) =>
  frames.reduce((left, right) =>
    left.map((value, index) => value - right[index])
  );

export const compose = (...frames) =>
  frames.reduce((left, right) => {
    const result = [];

    _times(FRAME_WIDTH, (columnIndex) => {
      _times(FRAME_WIDTH, (rowIndex) => {
        _setCell(
          result,
          columnIndex,
          rowIndex,
          _dotProduct(
            _getColumn(left, columnIndex),
            _getRow(right, rowIndex),
          ),
        );
      });
    });

    return result;
  });

// -- local
const IS_VECTOR = 0;
function _createVectorColumn(vector) {
  return [...vector, IS_VECTOR];
}

const ARE_COORDINATES = 1;
function _createCoordinateColumn(coordinates) {
  return [...coordinates, ARE_COORDINATES];
}

function _setCell(frame, column, row, value) {
  frame[column * FRAME_WIDTH + row] = value;
}

function _getColumn(frame, columnIndex) {
  const start = columnIndex * FRAME_WIDTH;
  return frame.slice(start, start + FRAME_WIDTH);
}

function _setColumn(frame, columnIndex, column) {
  return [
    ...frame.slice(0, columnIndex * FRAME_WIDTH),
    ...column,
    ...frame.slice(columnIndex * FRAME_WIDTH + FRAME_WIDTH, FRAME_SIZE),
  ];
}

function _getRow(frame, rowIndex) {
  const result = [];
  _times(
    FRAME_WIDTH,
    (index) => result.push(frame[rowIndex + FRAME_WIDTH * index]),
  );
  return result;
}

function _times(count, action) {
  for (let index = 0; index < count; index++) action(index);
}

function _normalize(coordinates) {
  const magnitude = Math.sqrt(
    coordinates.reduce((sum, direction) => sum + direction ** 2, 0),
  );

  return coordinates.map((value) => value / magnitude);
}

function _dotProduct(left, right) {
  return left.reduce(
    (result, value, index) => result + value * right[index],
    0,
  );
}

// NOTE: cross products are only really defined for 3D - other dimensionalities produce non-vector results
function _crossProduct(left, right) {
  const result = [];
  _times(left.length, (index) => {
    const otherColumns = [];
    _times(
      left.length - 1,
      (offset) => otherColumns[offset] = (index + offset + 1) % left.length,
    );
    const [first, second] = otherColumns;
    result[index] = left[first] * right[second] - left[second] * right[first];
  });
  return result;
}
