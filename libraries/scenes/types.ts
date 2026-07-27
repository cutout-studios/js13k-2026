import type { Geometry } from "./geometry/types.ts";
import type { Transform } from "./transforms/types.ts";
import type { Material } from "./materials/types.ts";

export type Object = [
  geometry: Geometry,
  transform?: Transform,
  material?: Material,
];

export type Scene = Object[];
