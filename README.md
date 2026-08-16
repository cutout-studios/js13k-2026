# js13k 2026

Unicorns and Rainbows!!

## Compaction TODOs

- [ ] **One `memo(map, key, make)` helper** (~30B). Folds four identical
      get-or-create WeakMap blocks (context, pipeline, vertex buffer, bind
      group).
- [ ] **XOCoordinates → bare Float32Array + free functions** (~150–250 raw
      chars). Eight unmanglable property names wrapping sixteen floats.
- [ ] **XOCamera → function form, drop `extends`** (~40–60 raw chars). One
      instance only; closing over fov/near and returning `{render, project}` is
      cheaper than a class plus prototype chain.
