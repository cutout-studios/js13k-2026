import { min, max } from "~alias";

export const createEnvelope = (attack: number, release: number) => {
	let value = 0;

	return (tickLength: number, released?: boolean) =>
		value = released
      ? max(0, value - tickLength / release)
			: min(1, value + tickLength / attack);
};
