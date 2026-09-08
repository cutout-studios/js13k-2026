import { normalizeXYZ, XYZ } from "~/3D";
import { floor, length, random } from "~/alias";
import { Band, doTimes, interpolate, repeat, spread, sum } from "~/common";

export const bell = (n = 3) => sum(repeat(n, 0).map(random)) / n;
export const rollBand = (band: Band, order?: number) =>
  interpolate(band, bell(order));
export const rollSpread = (amount?: number, center?: number) =>
  rollBand(spread(amount, center));
export const oneOf = <T>(options: T[]): T =>
  options[floor(random() * length(options))];
export const randomDirection = (
  bands = repeat(3, spread(1)) as [Band, Band, Band],
): XYZ => normalizeXYZ(doTimes(bands, (band) => rollBand(band)) as XYZ);
