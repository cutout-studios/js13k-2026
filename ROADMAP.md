# TODOs

_Currently have ~2kB of space remaining._

## Core Improvements

### Gameplay

- All bullets should "fade out" at the end of their lifetimes, and right before
  they enter the camera's clip plane.
- Add color-specific enemy behaviors
  - all enemies should come in from outside the frame - no "pop-in".
  - enemies cannot fire until they are within camera view, no exceptions
  - enemies' behavior animations are scaled based on their strafe speeds

  - ideal behaviors:
    - green: slight change, has three prongs, each a weapon.
      - each constantly streams bullets
      - the green enemy spirals in from behind the player or from deep field,
        constantly spewing bullets that splay outward
      - the groups enters in as a line
      - if they get out of view, they reverse their spiral

    - red: each ship in the group swoops from back to front across the field,
      firing their weapns in bursts at the player

    - yellow: swoops to the right or left, then alternate between doing a spin
      counter and "dropping a bomb" between swoops to the left or right
      - they practice a zig-zag formation
      - their "bomb" weapon floats forward similar to an item and then
        "explodes" when its lifetime expires, spawing a scatterbox of bullets (1
        for each damage the bomb deals) that go in random directions
        - this "random direction" utility might be used for explosions later,
          maybe not.

    - purple: fades in and is stationary. takes aim, then fires a "laser" at the
      player with extended duration
      - issue: "spin countering" the "laser"?

    - pink: very similar to current behavior, they kinda float in from one side
      of the screen, perhaps a bit more varied in depth than currently and kinda
      gently follow the player around, emitting bullets that moreso drift than
      shoot

    - blue: arcs in through the top of the screen always firing down at the
      player

  - swoop + fire: red + green
  - fade in/out: purple
    - switch to box collider? (for oblong bullets/ships)
  - spin + bomb: yellow
- Re-allocate modifiers post-cut
- Implement KG flinch

- Continue to tune game settings.

### UX

- Lots of distinct sound effects.
  - Item pickup
  - Level complete
  - Different damage, weapons, "explosion" sounds

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
