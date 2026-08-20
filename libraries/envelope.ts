import { min } from "~/alias";

export const approach = (current: number, target: number, ratio: number) =>
  current + (target - current) * min(1, ratio);

export const create = (attack: number, release: number) => {
  let value = 0;
  return (tickLength: number, released?: boolean) =>
    value = approach(
      value,
      +!released,
      tickLength / (released ? release : attack),
    );
};
