# TODOs

_Currently have ~2kB of space remaining._

## Core Improvements

### Gameplay

- All bullets should "fade out" at the end of their lifetimes, and right before
  they enter the camera's clip plane.
- Re-allocate modifiers post-cut
  - bullet speed
  -
- Implement KG flinch

- Continue to tune game settings.

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
