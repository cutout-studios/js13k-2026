import { gearDrop } from "../app/rng.ts";

const [level, type, chance = 100] = Deno.args.map(Number);

if (Math.random() > chance / 100) {
  console.log("No drop.");
  Deno.exit(0);
}

// TODO: display better
console.table(gearDrop(type, level));
