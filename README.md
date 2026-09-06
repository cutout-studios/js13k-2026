# js13k 2026 - MISSION: DARKWHITE

## MVP TODOs

- Enemies come in from the side, rather than just showing up suddenly.

- Debug loop: play with mouse at until death. Start over on each bug
  encountered.

- Countered bullets... why they go the way they go?

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
- Add FX (chromatic abberation) to background stars, nebula.

- Continue to tune game settings.

### Likely to land in a "director's cut", if any

- Improve spin counter
  - slightly more expressive (directional, over-spin animation)
  - map controls to virtual analog stick
  - implement spin handling
- Add thrusters: main + direction-based, explosion effects
- Boost mechanic?
- Music

## Misc. Compression Ideas

- Inline one-off functions
- Remove destructuring in favor of repeated individual index access

### The Big One

- Quantize all values (out of 256)... then...
- **Convert all game data (e.g. content definitions) into CSVs.** Then write a
  small compiler that bitepacks each CSV by column into an ASCII string.

### _Very_ small, likely net neutral

- Audio 'connect' and GPU tuple aliai
- "winding" or "gray" iterator that goes xx, xy, yy, yx
