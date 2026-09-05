# js13k 2026 - MISSION: DARKWHITE

## MVP TODOs

- debug through equip/restore/level-up stuff
  - equip doesn't trigger
  - restore prematurely shows preview even when nothing is selected
  - level up should un-disable when there's points to spend

- enemy behaviors
  - meander + fire: pink + blue
  - swoop + fire: red + green
  - fade in/out: purple
  - spin + bomb: yellow

- gas canister eject delay

## Core Polish

- Tune config

- kg flinch
- Lots of sound effects. Use RX + spectral analysis to reverse-engineer.

- improve spin animation
- spin handling? what does it even mean now?
  - map controls to virtual analog stick, might make it make sense

- switch to box collider? (for oblong bullets/ships)

- Clean up missed items && empty player weapons

- Leverage bulk object placement + movement utilities from enemy behaviors to:
  - Place background stars/nebula
  - Do various particle effects. Thrusters, explosions

- Boost mechanic

## Misc. Compression Ideas:

- inline one-off functions
- forgo spread for just individual index access

### The Big One (~150B)

- Quantize all values (out of 256)... then...
- **Convert all game data (e.g. content definitions) into CSVs.** Then write a
  small compiler that bitepacks each CSV by column into an ASCII string.

### _Very_ small, possibly net neutral

- Audio 'connect' and GPU tuple aliai
- tuple-ify styles?
- pull HTML key code strings into player legend
- "winding" or "gray" iterator that goes xx, xy, yy, yx
