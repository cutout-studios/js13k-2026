import { cube } from "./cube.ts";

Deno.test("cube snapshot", async (test) => await test.assertSnapshot(cube()));
