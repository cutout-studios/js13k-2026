# js13k 2026 - MISSION: DARKWHITE

## MVP TODOs

- Debug loop: play with mouse at until death. Start over on each bug
  encountered.

- Countered bullets... why they go the way they go? I suspect the "object
  center" is maybe not the geometric center.

## Core Improvements

### UX
- Lots of distinct sound effects. Use RX + spectral analysis to reverse-engineer:
  - Item pickup
  - Menu sounds - select, confirm, success
  - Different damage, weapons, "explosion" sounds for player

### Gameplay
- Enemy bullets start slower, then accelerate
- Add color-specific enemy behaviors
  - swoop + fire: red + green
  - fade in/out: purple
    - switch to box collider? (for oblong bullets/ships)
  - spin + bomb: yellow
- Implement gas canister eject delay (+ lil' animation?)
- Implement KG flinch
- Continue to tune game settings.

### Aesthetics
- Improve the flat-looking shader. Add opacity for a faux glow effect.
- Add FX (chromatic abberation) to background stars, nebula.

### Likely to land in a "director's cut", if any

#### Gameplay
- Boost mechanic? Skip waves you don't like at the expense of one gas canister.
- Improve spin counter
  - map controls to virtual analog stick
  - implement spin handling

#### Aesthetics
- Add thrusters: main + direction-based, explosion effects
- More expressive spin-counter animation: directional, over-spin
- Music


## Misc. Compression Ideas

- Strip all guards/errors/debug checks (scatterObjects)
- Inline one-off functions
- Remove destructuring in favor of repeated individual index access

### The Big One

- Quantize all values (out of 256)... then...
- **Convert all game data (e.g. content definitions) into CSVs.** Then write a
  small compiler that bitepacks each CSV by column into an ASCII string.

### _Very_ small, likely net neutral

- Audio 'connect' and GPU tuple aliai
- "winding" or "gray" iterator that goes xx, xy, yy, yx
