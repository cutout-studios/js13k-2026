# js13k 2026 - MISSION: DARKWHITE

> [!WARNING]
> This game is a **WIP submission** for [JS13k 2026](www.js13kgames.com). T his
> is a `Mouse + Keyboard`-only game on `Desktop`. Game controllers not yet
> supported, mobile would likely be too complex to attempt with this
> ([necessary](./RETRO.md)) level of debt.

## Running the game

```
deno setup
deno run bundle:shaders
deno run bundle
```

## Item Effects

| Name               | Description                                                                     |
| ------------------ | ------------------------------------------------------------------------------- |
| AIM TIME           | How quickly your ship aims.                                                     |
| BULLET RATE        | How quickly you fire bullets.                                                   |
| BULLET SPEED       | How fast your bullets travel.                                                   |
| BULLET SPREAD      | How wide your bullets travel.                                                   |
| BULLETS            | How many bullets you fire.                                                      |
| COUNTER DAMAGE     | How much damage your spin-counter does.                                         |
| COUNTER SPEED      | How much faster your ship moves while countering.                               |
| COUNTER TIME       | How long you counter for.                                                       |
| CRIT CHANCE        | How likely it is for each of your bullets to do extra damage.                   |
| CRIT DAMAGE        | How much extra damage you do _when_ you do extra damage.                        |
| DAMAGE             | How much damage you deal overall.                                               |
| DAMAGE TAKEN → GAS | How much damage is routed to your GAS, instead of your HP.                      |
| DAMAGE REDUCTION   | A flat reduction of damage on each hit.                                         |
| DROP RATE          | How often items drop.                                                           |
| GAS                | How much GAS you have.                                                          |
| GAS REGEN          | How quickly your GAS replenishes.                                               |
| HP                 | How much damage you can take before losing a REZ.                               |
| HP REGEN           | How quickly your HP replenishes.                                                |
| KG                 | How heavy your ship is - makes things cost more.                                |
| RESOLVE            | How much extra damage you deal when your REZ is low.                            |
| RESTORE POTENCY    | How much more potent your RESTORE'd items can be.                               |
| REZ                | Every time you run out of HP, your REZ is reduced by one. Zero REZ = Game Over. |
| REZ RECOVERY       | Your chance to not loose REZ when your HP is depleted.                          |
| SPEED              | How fast you move.                                                              |
