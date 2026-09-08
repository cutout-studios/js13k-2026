# TODOs

_Currently have ~2kB of space remaining._

## Core Improvements

### Gameplay

- Add color-specific enemy behaviors
  - swoop + fire: red + green
  - fade in/out: purple
    - switch to box collider? (for oblong bullets/ships)
  - spin + bomb: yellow
- Re-allocate modifiers post-cut
- Implement KG flinch

- Continue to tune game settings.

### UX

- Lots of distinct sound effects. Use RX + spectral analysis to
  reverse-engineer:
  - Item pickup
  - Level complete
  - Menu sounds - select, confirm, success
  - Different damage, weapons, "explosion" sounds for player

### Likely to land in a "director's cut", if any

#### UX

- Short wiki explaining how the game works (external link to this repo)

#### Gameplay

- Improve spin counter
  - map controls to virtual analog stick
  - implement spin handling

#### Accessibility

- Support alternative controllers
- _(lot more to be done here)_

#### Aesthetics

- Add FX (chromatic abberation) to background stars, nebula.
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
