import { _parseLoop } from "./musicLoop.ts";

Deno.test("parseLoop smoke test", (test) => {
  test.assertSnapshot(
    _parseLoop(
      `
        melody:  A4 * * * | B4 * *  *
        chords:  AM * * * | *  * Em *
        bass:    A2 * * * | *  * E1 *
      `,
      0.1,
    ),
  );
});
