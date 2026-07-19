import { format } from "@std/fmt/bytes";
import { rawText } from "@cutout/jsx/projections";
import { Packer } from "roadroller";
import brotli from "brotli";

const APP_DIR = "app";
const OUTPUT_DIR = ".output";

const APP_ENTRYPOINT = `./${APP_DIR}/module.jsx`;
const APP_OUTPUT_JS = `./${OUTPUT_DIR}/module.js`;
const APP_OUTPUT_RR = `./${OUTPUT_DIR}/module.rr.js`;
const APP_OUTPUT = `./${OUTPUT_DIR}/index.html`;
const APP_OUTPUT_COMPRESSED = `${APP_OUTPUT}.br`;

Deno.mkdirSync(OUTPUT_DIR, { recursive: true });

const _result = await Deno.bundle({
  entrypoints: [APP_ENTRYPOINT],
  outputDir: OUTPUT_DIR,
  platform: "browser",
  minify: true,
  write: false,
});

if (_result.errors.length) {
  console.error({ errors: _result.errors });
}

const { outputFiles: [source] } = _result;

Deno.writeTextFileSync(APP_OUTPUT_JS, source.text());

logSize(APP_OUTPUT_JS);

const packer = new Packer([
  {
    data: source.text(),
    type: "js",
    action: "eval",
  },
]);
await packer.optimize();
const { firstLine, secondLine } = packer.makeDecoder();

Deno.writeTextFileSync(APP_OUTPUT_RR, firstLine + "\n" + secondLine);

logSize(APP_OUTPUT_RR);

Deno.writeTextFileSync(
  APP_OUTPUT,
  rawText(
    <body>
      <script>
        {firstLine}
        {secondLine}
      </script>
    </body>,
  ),
);

logSize(APP_OUTPUT);

Deno.writeFileSync(
  APP_OUTPUT_COMPRESSED,
  brotli.compress(Deno.readFileSync(APP_OUTPUT)),
);

logSize(APP_OUTPUT_COMPRESSED);

function logSize(filePath) {
  console.log(
    `%c${filePath}: %c${format(Deno.statSync(filePath).size)}`,
    "color: grey;",
    "color: cyan;",
  );
}
