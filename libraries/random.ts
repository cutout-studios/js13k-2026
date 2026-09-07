import { floor, length, random } from "~/alias";
import { Band, interpolate, spread } from "~/common";

export const bell = () => (random() + random() + random()) / 3;
export const rollBand = (band: Band) => interpolate(band, bell());
export const rollSpread = (amount?: number, center?: number) =>
  rollBand(spread(amount, center));
export const oneOf = <T>(options: T[]): T =>
  options[floor(random() * length(options))];
