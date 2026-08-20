import { random } from "~/alias";

export type Band = readonly [min: number, max: number];

export const bell = () => (random() + random() + random()) / 3;
export const range = (lo: number, hi: number) => lo + (hi - lo) * bell();
