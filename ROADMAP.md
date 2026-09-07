# TODOs

_Currently have ~1.5kB of space remaining._

## Core Improvements

### UX

- Lots of distinct sound effects. Use RX + spectral analysis to
  reverse-engineer:
  - Item pickup
  - Level complete
  - Menu sounds - select, confirm, success
  - Different damage, weapons, "explosion" sounds for player

### Gameplay

- Add color-specific enemy behaviors
  - swoop + fire: red + green
  - fade in/out: purple
    - switch to box collider? (for oblong bullets/ships)
  - spin + bomb: yellow

- Implement gas canister eject delay (+ lil' animation?)
- Implement KG flinch

- Continue to tune game settings.

### Aesthetics

- Add FX (chromatic abberation) to background stars, nebula.

### Likely to land in a "director's cut", if any

#### UX

- Short wiki explaining how the game works (external link to this repo)

#### Gameplay

- Boost mechanic? Skip waves you don't like at the expense of one gas canister.
- Improve spin counter
  - map controls to virtual analog stick
  - implement spin handling

#### Accessibility

- Support alternative controllers
- _(lot more to be done here)_

#### Aesthetics

- Add thrusters: main + direction-based, explosion effects
- More expressive spin-counter animation: directional, over-spin
- Music

## Misc. Compression Ideas - mostly considered but probably not worth it

- Remove destructuring in favor of repeated individual index access
- Quantize all values (out of 256)... then...
  - **Convert all game data (e.g. content definitions) into CSVs.** Then write a
    small compiler that bitepacks each CSV by column into an ASCII string.
- Audio 'connect' and GPU enum aliai
- "winding" or "gray" iterator that goes xx, xy, yy, yx
