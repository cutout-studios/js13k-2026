import { doTimes } from "~common";
import { waves, difficultyCurve, enemySets } from "../app/rng.ts";

const level = Number(Deno.args[0]);

const difficulty = difficultyCurve(level);
const waveCount = waves(level);

console.log({ level, waveCount, difficulty });

doTimes(waveCount, (wave) => {
  console.log({ wave });

  // TODO: display better
  console.table(enemySets(wave, level));
});
