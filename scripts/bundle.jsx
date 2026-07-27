import { format } from "@std/fmt/bytes";
import { rawText } from "@cutout/jsx/projections";

const JS13K_LIMIT = 13_312;

const APP_DIR = "app";
const OUTPUT_DIR = ".output";

const APP_ENTRYPOINT = `./${APP_DIR}/start.ts`;
const APP_OUTPUT_FILE = "index.html";
const APP_OUTPUT_COMPRESSED_FILE = `${APP_OUTPUT_FILE}.zip`;

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

const appOutputText = rawText(
  <body>
    <script type="module">
      {source.text()}
    </script>
  </body>,
);

Deno.writeTextFileSync(
  OUTPUT_DIR + "/" + APP_OUTPUT_FILE,
  appOutputText,
);

logSize(OUTPUT_DIR + "/" + APP_OUTPUT_FILE);

const zip = await new Deno.Command("advzip", {
  args: ["-a", "-4", APP_OUTPUT_COMPRESSED_FILE, APP_OUTPUT_FILE],
  cwd: OUTPUT_DIR,
}).output();

if (!zip.success) {
  console.error(new TextDecoder().decode(zip.stderr));
}

logSize(OUTPUT_DIR + "/" + APP_OUTPUT_COMPRESSED_FILE);

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
