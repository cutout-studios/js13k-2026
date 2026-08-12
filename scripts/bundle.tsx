/**
 *    Copyright 2026 Cutout Studios LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { format } from "@std/fmt/bytes";
import { rawText } from "@cutout/jsx/projections";

import * as esbuild from "esbuild";
import { minify } from "esbuild-minify-templates";

const JS13K_LIMIT = 13_312;

const APP_DIR = "app";
const OUTPUT_DIR = ".output";

const BUNDLE_ENTRYPOINT = `./${APP_DIR}/start.ts`;
const BUNDLE_OUTPUT_FILE = "index.html";
const BUNDLE_OUTPUT_COMPRESSED_FILE = `${BUNDLE_OUTPUT_FILE}.zip`;
const BUNDLE_OUTPUT_FILEPATH = `./${OUTPUT_DIR}/${BUNDLE_OUTPUT_FILE}`;
const BUNDLE_OUTPUT_COMPRESSED_FILEPATH =
  `./${OUTPUT_DIR}/${BUNDLE_OUTPUT_COMPRESSED_FILE}`;

const PROPS_TO_MANGLE = [
  "root",
  "stack",
  "pointers",
  "element",
  "attribute",
  "activeInputs",
  "geometry",
  "material",
  "#parseScore",
  "#parsePart",
  "score",
  "start",
  "origin",
  "orthonormalInverse",
  "safetyCropDistance",
  "viewingRadians",
  "position",
  "rotation",
  "coordinates",
  "adjust",
  "render",
  "#makePositionCoordinates",
  "#makeRotationCoordinates",
  "#readLine",
  "localize",
  "xAxis",
  "yAxis",
  "zAxis",
];

const LIBRARY_ENTRYPOINTS = [
  "./libraries/common.ts",
  "./libraries/controller.ts",
  "./libraries/clock.ts",
  "./libraries/3D/module.ts",
  "./libraries/audio/module.ts",
  "./libraries/web.ts",
];

Deno.mkdirSync(OUTPUT_DIR, { recursive: true });

for (const entrypoint of LIBRARY_ENTRYPOINTS) {
  await bundle({ minify: true }, entrypoint);
  logSize(BUNDLE_OUTPUT_COMPRESSED_FILEPATH, entrypoint);
}

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

  let code = sourceData.text();
  if (options.minify) {
    code = minify(code).toString();

    const result = await esbuild.transform(code, {
      minify: true,
      mangleProps: new RegExp(
        `^(${PROPS_TO_MANGLE.join("|")})$`,
      ),
      legalComments: "none",
    });

    code = result.code;
  }

  const appOutputText = rawText(
    <body>
      <script type="module">
        {code}
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
