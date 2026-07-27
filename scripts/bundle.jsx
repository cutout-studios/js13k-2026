import { format } from "@std/fmt/bytes";
import { rawText } from "@cutout/jsx/projections";
import { Packer } from "roadroller";

const JS13K_LIMIT = 13_312;

const APP_DIR = "app";
const OUTPUT_DIR = ".output";

const APP_ENTRYPOINT = `./${APP_DIR}/start.ts`;
const APP_OUTPUT_JS = `./${OUTPUT_DIR}/app.js`;
const APP_OUTPUT_RR = `./${OUTPUT_DIR}/app.rr.js`;
const APP_OUTPUT = `./${OUTPUT_DIR}/index.html`;
const APP_OUTPUT_COMPRESSED = `${APP_OUTPUT}.zip`;

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

const appOutputText = rawText(
  <body>
    <script>
      {firstLine}
      {secondLine}
    </script>
  </body>,
);

Deno.writeTextFileSync(
  APP_OUTPUT,
  appOutputText,
);

logSize(APP_OUTPUT);

const zip = await new Deno.Command("advzip", {
  args: ["-a", "-4", APP_OUTPUT_COMPRESSED, APP_OUTPUT],
}).output();

if (!zip.success) {
  console.error(new TextDecoder().decode(zip.stderr));
}

logSize(APP_OUTPUT_COMPRESSED);

function logSize(filePath) {
  const { size } = Deno.statSync(filePath);

  console.log(
    `%c${filePath}: %c${format(size)} %c(${
      ((size / JS13K_LIMIT) * 100).toFixed(2)
    }%)`,
    "color: grey;",
    "color: cyan;",
    "color: white;",
  );
}
