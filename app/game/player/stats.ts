import { createShipSnapshot } from "../ship/snapshots.ts";
import { Player } from "./types.ts";
import ColorOptions from "../options/module.ts";
import { repeat } from "~/common";
import { createWeaponSnapshot } from "../ship/weapons.ts";

export const generatePlayerSnapshots = (
  [, [shieldLevels, fuelLevels = 0, armorLevels = 0], inventory]: Player,
) => {
  const shipStats = createShipSnapshot(ColorOptions[0]),
    weaponsStats = repeat(2, createWeaponSnapshot(ColorOptions[0]));

  for (const [[, , , , modifiers], equipped] of inventory) {
    if (!equipped) continue;

    for (const [statID, value, operator] of modifiers) {
      const targets = statID > 21 ? weaponsStats : [shipStats];

      for (const target of targets) {
        operator === "x" ? target[statID] *= value : target[statID] += value;
      }
    }
  }

  const levels = [
    armorLevels,
    ...repeat(3, fuelLevels),
    ...repeat(2, shieldLevels),
  ];

  [0, 4, 7, 8, 15, 16].forEach((id, index) =>
    shipStats[id] *= shipStats[11] ** levels[index]
  );

  // TODO: lowestResource

  // TODO: assign to player
  return [shipStats, weaponsStats];
};
