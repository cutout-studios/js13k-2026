# js13k 2026 - MISSION: DARKWHITE

## MVP TODOs

- misc mechanics
  - stats refresh
  - two weapons
  - wire remaining stats
  - mass disruption, player vulnerability toggle
- remaining UI
  - highlight color
  - level up
- pan audio based on source location
- spin counter
- enemy behaviors

## Core Polish

- Tune and balance controls/stats
- Leverage bulk object placement + movement utilities from enemy behaviors to:
  - Place background stars/nebula
  - Do various particle effects.
- Lots of sound effects. Use RX + spectral analysis to reverse-engineer.

## Misc. Compression Ideas:

### The Big One (~150B)

- Quantize all values (out of 256)... then...
- **Convert all game data (e.g. content definitions) into CSVs.** Then write a
  small compiler that bitepacks each CSV by column into an ASCII string.

### _Very_ small, possibly net neutral

- Audio 'connect' and GPU tuple aliai
- tuple-ify styles?
- pull HTML key code strings into player legend
- "winding" or "gray" iterator that goes xx, xy, yy, yx
