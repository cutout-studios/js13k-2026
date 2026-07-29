import { format } from "@std/fmt/bytes";
import { rawText } from "@cutout/jsx/projections";

const JS13K_LIMIT = 13_312;

const APP_DIR = "app";
const OUTPUT_DIR = ".output";

const BUNDLE_ENTRYPOINT = `./${APP_DIR}/start.ts`;
const BUNDLE_OUTPUT_FILE = "index.html";
const BUNDLE_OUTPUT_COMPRESSED_FILE = `${BUNDLE_OUTPUT_FILE}.zip`;
const BUNDLE_OUTPUT_FILEPATH = `./${OUTPUT_DIR}/${BUNDLE_OUTPUT_FILE}`;
const BUNDLE_OUTPUT_COMPRESSED_FILEPATH =
  `./${OUTPUT_DIR}/${BUNDLE_OUTPUT_COMPRESSED_FILE}`;

Deno.mkdirSync(OUTPUT_DIR, { recursive: true });

const LIBRARY_ENTRYPOINT = "./libraries/engine.ts";
await bundle({ minify: true }, LIBRARY_ENTRYPOINT);
logSize(BUNDLE_OUTPUT_COMPRESSED_FILEPATH, LIBRARY_ENTRYPOINT);

await bundle({ minify: true });
logSize(BUNDLE_OUTPUT_COMPRESSED_FILEPATH);

await bundle({ minify: false });

await new Deno.Command("open", {
  args: [BUNDLE_OUTPUT_FILEPATH],
}).output();

async function bundle(
  options: Partial<Deno.bundle.Options> = {},
  entrypoint = BUNDLE_ENTRYPOINT,
) {
  const _result = await Deno.bundle({
    ...options,
    entrypoints: [entrypoint],
    outputDir: OUTPUT_DIR,
    platform: "browser",
    write: false,
  });

  if (_result.errors.length) {
    console.error({ errors: _result.errors });
  }

  const { outputFiles } = _result;
  const [sourceData] = outputFiles!;

  const appOutputText = rawText(
    <body>
      <script type="module">
        {sourceData.text()}
      </script>
    </body>,
  );

  Deno.writeTextFileSync(
    BUNDLE_OUTPUT_FILEPATH,
    appOutputText,
  );

  const zip = await new Deno.Command("advzip", {
    args: ["-a", "-4", BUNDLE_OUTPUT_COMPRESSED_FILE, BUNDLE_OUTPUT_FILE],
    cwd: OUTPUT_DIR,
  }).output();

  if (!zip.success) {
    console.error(new TextDecoder().decode(zip.stderr));
  }
}

function logSize(filePath: string, customMessage?: string) {
  const { size } = Deno.statSync(filePath);

  console.log(
    `%c${customMessage ?? filePath}: %c${format(size)} %c(${
      ((size / JS13K_LIMIT) * 100).toFixed(2)
    }%)`,
    "color: grey;",
    "color: cyan;",
    "color: white;",
  );
}
