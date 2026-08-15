import { rollItem } from "../app/rng.ts";

import { logTable } from "./logTable.ts";

const [level, type, chance = 100] = Deno.args.map(Number);

if (Math.random() > chance / 100) {
  console.log("No drop.");
  Deno.exit(0);
}

const COLOR_ARRAY = ["purple", "green", "blue", "pink", "red", "yellow"];
const ITEM_ARRAY = ["leftWing", "rightWing", "body", "engine"];

logTable([rollItem(type, level)], [
  "color",
  "item",
  "rank",
  "mass",
  "affixes",
  "count",
  "damage",
  "range",
  "speed",
], {
  color: (index) => COLOR_ARRAY[index as number],
  item: (index) => ITEM_ARRAY[index as number],
  affixes: (affixes) =>
    (affixes as [name: string, value: number, type: number][]).map(
      ([name, value, type]) => {
        switch (type) {
          case 1:
            return `-${value}% ${name}`;
          case 2:
            return `+${value} ${name}`;
          case 0:
          default:
            return `+${value}% ${name}`;
        }
      },
    ),
});
