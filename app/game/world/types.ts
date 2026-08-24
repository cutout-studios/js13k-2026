type EnemyGroup = [
  colorID: number,
  ships: Ship[],
  instanceGroup: XOObject[],
];

type World = [
  activeEnemies: EnemyGroup[],
  droppedItems: Item[],
  currentLevel: [ID: number, wave: number, wavesInLevel: number],
  winCollection: Set<number>,
];
