# js13k 2026 - MISSION: DARKWHITE

## MVP TODOs

- Tiny cleanup
  - Ship points up on load (some weird input bug)

- Confirm level-up menu works

- Enemies come in from the side, rather than just showing up suddenly.
- Place basic stars in the background, just so we don't have to look at nothing.

## Core Improvements

- Implement gas canister eject delay (+ lil' animation?)
- Implement KG flinch
- Enemy bullets start slower, then accelerate
- Add color-specific enemy behaviors
  - swoop + fire: red + green
  - fade in/out: purple
    - switch to box collider? (for oblong bullets/ships)
  - spin + bomb: yellow
- Key UI: lots of sound effects. Use RX + spectral analysis to reverse-engineer.
- Improve the main shader to add dimensionality.
- Add FX to background stars, nebula.
- Tune game settings.

### Likely to land in a "director's cut", if any

- Improve spin counter
  - slightly more expressive (directional, over-spin animation)
  - map controls to virtual analog stick
  - implement spin handling
- Add thrusters: main + direction-based, explosion effects
- Boost mechanic?
- Music

## Misc. Compression Ideas:

- inline one-off functions
- remove destructuring in favor of repeated individual index access

### The Big One (~150B)

- Quantize all values (out of 256)... then...
- **Convert all game data (e.g. content definitions) into CSVs.** Then write a
  small compiler that bitepacks each CSV by column into an ASCII string.

### _Very_ small, possibly net neutral

- Audio 'connect' and GPU tuple aliai
- tuple-ify styles?
- pull HTML key code strings into player legend
- "winding" or "gray" iterator that goes xx, xy, yy, yx
