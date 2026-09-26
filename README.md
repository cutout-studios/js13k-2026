# js13k 2026 - MISSION: DARKWHITE

> [!WARNING]
> 🚨 System Requirements 🚨
> - WebGPU Support
> - A **2-button** mouse and keyboard!

## Running the game

```
deno setup
deno run bundle:shaders
deno run bundle
```

## Item Effects

| Name            | Description                                                                     |
| --------------- | ------------------------------------------------------------------------------- |
| AIM TIME        | How quickly your ship aims.                                                     |
| BULLET RATE     | How quickly you fire bullets.                                                   |
| BULLET SPD      | How fast your bullets travel.                                                   |
| BULLET SPREAD   | How wide your bullets travel.                                                   |
| BULLETS         | How many bullets you fire.                                                      |
| SPIN DMG        | How much damage your spin-counter does.                                         |
| SPIN SPD        | How much faster your ship moves while countering.                               |
| SPIN TIME       | How long you counter for.                                                       |
| CRIT AMT        | How likely it is for each of your bullets to do extra damage.                   |
| CRIT DMG        | How much extra damage you do _when_ you do extra damage.                        |
| DMG             | How much damage you deal overall.                                               |
| DMG TAKEN → GAS | How much damage is routed to your GAS, instead of your HP.                      |
| DMG REDUCE      | A flat reduction of damage on each hit.                                         |
| DROP RATE       | How often items drop.                                                           |
| GAS             | How much GAS you have.                                                          |
| GAS REGEN       | How quickly your GAS replenishes.                                               |
| HP              | How much damage you can take before losing a REZ.                               |
| HP REGEN        | How quickly your HP replenishes.                                                |
| KG              | How heavy your ship is - makes things cost more.                                |
| RESOLVE         | How much extra damage you deal when your REZ is low.                            |
| RESTORE POT     | How much more potent your RESTORE'd items can be.                               |
| REZ             | Every time you run out of HP, your REZ is reduced by one. Zero REZ = Game Over. |
| REZ RECOV       | Your chance to not loose REZ when your HP is depleted.                          |
| SPD             | How fast you move.                                                              |
