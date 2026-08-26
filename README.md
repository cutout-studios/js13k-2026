# js13k 2026

Unicorns and Rainbows!!

## Compression TODOs (Total: ~0.25kB):

- quantize all values (woof)
- remove GPU error handler, lol (50B)
- proper CSS bundling (10B)
- "winding" or "gray" iterator that goes xx, xy, yy, yx (a few Bs)

### Dubious Options

- Add map, reduce, push, forEach to `~/alias`.
- **Convert all game data (e.g. content definitions) into CSVs.** Then write a
  small compiler that converts each CSV by column into an ASCII string and
  "legend" file for recurring values. We de-compile the CSVs at runtime:

```ts
// enemies.csv.ts

export default [
  ["Canonical Name", `ASCII string...`, ["name1", "name2"]],
  ["Canonical Name", `ASCII string...`, true /* values are unique */],
  [
    "Canonical Name",
    `ASCII string...`, /* column is numeric, no legend required */
  ],
];
```

- Given the overhead of the decompiler is probably ~150B... we'd probably need
  over 300B of game data for this to pay for itself _maybe_.
- At time of writing, there's ~1.1kB of game data (250 rows @ 5B/line
  heuristic), which will probably increase between 50%-100%.
- If the cost savings are 25%-50% on the data, conservatively we're looking
  at... about 200B of savings. Almost 1kB on the top end (!).
- If we go this route, a `make` file becomes helpful.
