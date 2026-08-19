import { PLAYER_BASE_STATS, PLAYER_STAT_TYPES } from "./constants.ts";
import { Item } from "./types.ts";

export const getBaseStats = (
  levels: [shield: number, armor: number, fuel: number],
  equippedItems: Item[],
): number[] => {
  const pct: number[] = [], add: number[] = [];

  for (const item of equippedItems) {
    for (const [name, value, type = 0] of item[4]) {
      (type === 2 ? add : pct)[name] = ((type === 2 ? add : pct)[name] ?? 0) +
        (type === 1 ? -value / 100 : type === 0 ? value / 100 : value);
    }
  }

  // apply levels
  const base = { ...PLAYER_BASE_STATS };
  const _fold = (i: keyof typeof PLAYER_BASE_STATS) =>
    (base[i] ?? 0) * (1 + (pct[i] ?? 0)) + (add[i] ?? 0);

  const quality = _fold(17);

  for (
    const [level, ...stats] of [
      [levels[0], 21, 22], // shield, shieldRegen
      [levels[1], 0], // armor
      [levels[2], 11, 14], // fuel, fuelRegen
    ] as const
  ) {
    const growth = quality ** level;
    for (const i of stats) base[i] = (base[i] ?? 0) * growth;
  }

  const result = PLAYER_STAT_TYPES.map((_, i) =>
    _fold(i as keyof typeof PLAYER_BASE_STATS)
  );

  // special case - lowestResource. armor weighted x10
  const pools = [21, 0, 11], weights = [1, 10, 1];
  let lowest = 0;
  for (let i = 1; i < 3; i++) {
    if (
      result[pools[i]] * weights[i] < result[pools[lowest]] * weights[lowest]
    ) lowest = i;
  }
  result[pools[lowest]] *= 1 + (pct[18] ?? 0);

  return result;
};
