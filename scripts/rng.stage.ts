import { doTimes } from "~common";
import { difficultyCurve, enemySets, waves } from "../app/rng.ts";
import { logTable } from "./logTable.ts";

const level = Number(Deno.args[0]);

const difficulty = difficultyCurve(level);
const waveCount = waves(level);

console.log({ level, waveCount, difficulty });

doTimes(waveCount, (wave) => {
  console.log({ wave });

  logTable(enemySets(wave, level), [
    "color",
    "count",
    "health",
    "speed",
    "damage",
    "drop%",
  ]);
});
