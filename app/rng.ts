import { doTimes, FLOAT_32_BIN } from "~common";
import content from "./content.ts";

const { random, round, floor, min, max, abs, atan, cos, PI } = Math;

const bell = () => (random() + random() + random()) / 3;
const range = (lo: number, hi: number) => lo + (hi - lo) * bell();
const clamp = (lo: number, hi: number, v: number) => min(hi, max(lo, v));

/** Insert into the first `depth` of the deck. We pop() from the tail, so
 *  index 0 is furthest from being drawn. depth 1 = shuffle. */
const insert = <T>(deck: T[], value: T, depth = 1) =>
  deck.splice(floor(random() * (deck.length * depth + 1)), 0, value);

const shuffled = (length: number) => {
  const deck: number[] = [];
  doTimes(length, (i) => insert(deck, i));
  return deck;
};

/** Draw from the tail, requeue into the back third. */
const draw = (deck: number[]) => {
  const value = deck.pop()!;
  insert(deck, value, 0.33);
  return value;
};

/** 0 → 1, hitting 0.5 at level 1/falloff */
export const difficultyCurve = (level: number, falloff = 0.25) =>
  2 * atan(level * falloff) / PI;

export const difficultyRange = (
  level: number,
  ceiling: number,
  spread = 1.5,
  lo = -Infinity,
  hi = Infinity,
) => {
  const base = ceiling ** difficultyCurve(level);
  return clamp(lo, hi, round(range(base, base * spread)));
};

export const waves = (level: number) => difficultyRange(level, 12, 1.5, 2, 14);

const enemyDeck = shuffled(content.length);
const gearDeck = shuffled(4);

const MAG_CEILING = [35, 100, 250, 800];
const ENEMY_STAT = [
  // spread, floor, cap
  [1.5, 8, Infinity], // health
  [1.2, 10, 100], // speed
  [1.5, 5, Infinity], // damage
  [1, 10, 80], // drop rate. TODO: fix
] as const;

export const enemyStats = (typeIndex: number, level: number) => {
  const { enemy: [count, health, speed, drop], weapon: [, damage] } =
    content[typeIndex];

  return [
    typeIndex,
    count,
    ...[health, speed, damage, drop].map((magnitude, i) => {
      if (magnitude === 0) return 0;

      return difficultyRange(
        level,
        MAG_CEILING[magnitude - 1],
        ...ENEMY_STAT[i],
      );
    }),
  ];
};

export const enemySets = (wave: number, level: number) =>
  doTimes(
    round(clamp(1, 6, abs(cos(wave)) * difficultyCurve(level) * 7.5)),
    () => enemyStats(draw(enemyDeck), level),
  );

/** [gearType][magnitude] */
const MASS_FLOOR = [[3, 10, 20], [3, 10, 20], [8, 32, 80], [2, 7, 12]];

/** [rank][magnitude] */
const RANK_FLOOR = {
  affix: [[2, 10, 25, 50], [5, 15, 35, 85], [8, 20, 45, 100]],
  damage: [[8, 16, 32, 50], [12, 20, 56, 80], [16, 35, 90, 150]],
  speed: [[0.8, 2, 5, 12], [1.2, 3, 7, 15], [1.5, 4, 9, 18]],
  range: [[15, 40, 60, 90], [25, 50, 70, 100], [35, 60, 80, 100]],
} as const;

const rankRoll = (
  stat: keyof typeof RANK_FLOOR,
  rank: number,
  magnitude: number,
  spread = 1.5,
) => {
  const lo = RANK_FLOOR[stat][rank - 1][magnitude - 1];
  return range(lo, lo * spread);
};

const SLOT_AFFIX: Record<number, "body" | "engine"> = {
  2: "body",
  3: "engine",
};

export const rollItem = (colorType: number, level: number) => {
  const rank = round(min(3, range(1, max(1, 3 * difficultyCurve(level)))));

  const gearType = draw(gearDeck);
  const color = content[colorType];

  const slot = SLOT_AFFIX[gearType];
  const extra = slot && color.affix[slot]?.[0];
  const pool: [name: string, magnitude: number, type: number][] = [];
  for (
    const option of extra ? [...color.affix.global, extra] : color.affix.global
  ) {
    insert(pool, option);
  }

  const affixCount = (gearType <= 1 ? rank - 1 : rank) +
    (color.weapon[4] ? 1 : 0);

  const massFloor = MASS_FLOOR[gearType][color.density - 1];
  const result: [
    color: number,
    gear: number,
    rank: number,
    mass: number,
    affixes: [name: string, value: number, type: number][],
  ] = [
    colorType,
    gearType,
    rank,
    round(range(massFloor, massFloor * 2)),
    doTimes(min(affixCount, pool.length), () => {
      const [name, magnitude, type] = pool.pop()!;

      if (type === 2) {
        return [name, magnitude * rank, type];
      }

      return [
        name,
        Number(rankRoll("affix", rank, magnitude, 2).toFixed(1)),
        type,
      ];
    }),
  ];

  if (gearType <= 1) {
    const [count, damage, weaponRange, speed] = color.weapon;
    result.push(
      round(rankRoll("damage", rank, damage)),
      round(rankRoll("speed", rank, speed)),
      count,
      round(min(100, rankRoll("range", rank, weaponRange))),
    );
  }

  return result;
};
