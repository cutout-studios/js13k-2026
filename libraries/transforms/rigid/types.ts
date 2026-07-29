type XYZ = [x: number, y: number, z: number];

export type RigidTransform = [...Directions, origin: Origin];
export type Directions = [
  xDirection: Direction,
  yDirection: Direction,
  zDirection: Direction,
];
export type Direction = XYZ;
export type Origin = XYZ;
