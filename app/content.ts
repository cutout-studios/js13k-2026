export default [
  {
    type: "purple",
    enemy: [3, 2, 0, 3],
    weapon: [1, 3, 3, 0, 0],
    density: 1,
    affix: {
      global: [
        ["itemQuality", 2],
        ["experience", 2],
        ["criticalChance", 1],
        ["criticalDamage", 3],
      ],
    },
  },
  {
    type: "green",
    enemy: [4, 2, 3, 2],
    weapon: [1, 1, 3, 3],
    density: 1,
    affix: {
      global: [
        ["fuelCost", 1, 1],
        ["strafeSpeed", 2],
        ["range", 4],
      ],
      body: [
        ["damageFromFuel", 1],
      ],
      engine: [
        ["spinTime", 1],
      ],
    },
  },
  {
    type: "blue",
    enemy: [1, 4, 1, 4],
    weapon: [1, 1, 2, 1, 1],
    density: 3,
    affix: {
      global: [["shield", 2], ["damageTaken", 1, 1], ["mass", 2]],
      body: [["armor", 1, 2]],
      engine: [["fuelEjectDelay", 1, 2]],
    },
  },
  {
    type: "pink",
    enemy: [9, 1, 2, 1],
    weapon: [9, 1, 1, 1, 0],
    density: 1,
    affix: {
      global: [["itemMixing", 2], ["bullets", 1, 2], [
        "armorSave",
        1,
      ]],
      body: [["shieldRegen", 1]],
      engine: [["fuelRegen", 1]],
    },
  },
  {
    type: "red",
    enemy: [3, 2, 2, 2],
    weapon: [2, 2, 2, 2, 0],
    density: 2,
    affix: {
      global: [["damage", 2], ["weaponSpeed", 2], ["fuelBoost", 1]],
      body: [["trackSpeed", 2]],
      engine: [["spinHandling", 2]],
    },
  },
  {
    type: "yellow",
    enemy: [2, 3, 3, 2],
    weapon: [1, 2, 0, 1, 0],
    density: 2,
    affix: {
      global: [["lowestStat", 2], ["damagePerLostArmor", 1], [
        "spread",
        2,
      ]],
      body: [["damageTakenPerLostArmor", 1, 1]],
      engine: [["spinDamage", 3]],
    },
  },
];
