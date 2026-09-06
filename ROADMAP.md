# TODOs

_Currently have ~2kB of space remaining._

## Known Issues

- Countered bullets... don't go exactly where I tell them to go? I suspect the
  "object center" is maybe not the geometric center.

## Core Improvements

### UX

- Lots of distinct sound effects. Use RX + spectral analysis to
  reverse-engineer:
  - Item pickup
  - Menu sounds - select, confirm, success
  - Different damage, weapons, "explosion" sounds for player
- Enemy bullets start slower, then accelerate
- Short wiki explaining how the game works (external link to this repo)

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

- Improve the flat-looking shader. Add opacity support for a faux-glow effect.
- Add FX (chromatic abberation) to background stars, nebula.

### Likely to land in a "director's cut", if any

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

## Misc. Compression Ideas

- Strip all guards/errors/debug checks (scatterObjects)
- Inline one-off functions (~100 bytes)
  - `smoothstep()` – app/game/ship/spin.ts (used 1x) – ~20-30 bytes
  - `_resolveCollisions()` – app/game/update.ts (used 2x) – ~60-80 bytes
  - `_drawEnemyGroup()` – app/game/world/enemies.ts (used 1x) – ~50-70 bytes
  - `_itemRankRoll()` – app/game/player/items.ts (used 1x) – ~30-40 bytes
  - `_parseHex()` – libraries/3D/materials/paint.ts (used 1x) – ~35-45 bytes
  - `_getVertex()` – libraries/3D/geometry.ts (used 2x) – ~40-60 bytes
  - `_getCanvasDepth()` – libraries/3D/webgpu/createRenderTarget.ts (used 1x) –
    ~60-80 bytes

### Considered, but likely not worth it (break in case of emergency)

- Remove destructuring in favor of repeated individual index access
- Quantize all values (out of 256)... then...
  - **Convert all game data (e.g. content definitions) into CSVs.** Then write a
    small compiler that bitepacks each CSV by column into an ASCII string.
- Audio 'connect' and GPU tuple aliai
- "winding" or "gray" iterator that goes xx, xy, yy, yx
