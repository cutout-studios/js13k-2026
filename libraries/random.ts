import { normalizeXYZ, XYZ } from "~/3D";
import { random } from "~/alias";
import { Band, doTimes, interpolate, repeat, spread, sum } from "~/common";

export const bell = (n = 3) => sum(doTimes(n, random)) / n;
export const rollBand = (band: Band, order?: number) =>
  interpolate(band, bell(order));
export const rollSpread = (amount?: number, center?: number, order?: number) =>
  rollBand(spread(amount, center), order);

export const randomPoint = (bands: [Band, Band, Band], order?: number) =>
  doTimes(bands, (band) => rollBand(band, order)) as XYZ;
export const randomDirection = (
  bands = repeat(3, spread(1)) as [Band, Band, Band],
): XYZ => normalizeXYZ(randomPoint(bands));
