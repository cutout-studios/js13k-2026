import { create as createGeometery } from "./geometery/create.js";
import { IDENTITY_TRANSFORM } from "./transforms/all.js";

// TODO
export const create = () => {
  return {
    geometery: createGeometery(/* TODO */),
    material: null, // just default for now
    transform: IDENTITY_TRANSFORM
  }
}
