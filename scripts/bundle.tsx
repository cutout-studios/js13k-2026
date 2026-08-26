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

import { rawText } from "@cutout/jsx/projections";

import * as esbuild from "esbuild";
import { minify } from "esbuild-minify-templates";

import { InputAction, InputType, Packer } from "roadroller";

const JS13K_LIMIT = 13_312;
const ESTIMATED_RECLAIMABLE_BYTES = 60;

const APP_DIR = "app";
const OUTPUT_DIR = ".output";

const BUNDLE_ENTRYPOINT = `./${APP_DIR}/module.ts`;
const BUNDLE_OUTPUT_FILE = "index.html";
const BUNDLE_OUTPUT_COMPRESSED_FILE = `${BUNDLE_OUTPUT_FILE}.zip`;
const BUNDLE_OUTPUT_FILEPATH = `./${OUTPUT_DIR}/${BUNDLE_OUTPUT_FILE}`;
const BUNDLE_OUTPUT_COMPRESSED_FILEPATH =
  `./${OUTPUT_DIR}/${BUNDLE_OUTPUT_COMPRESSED_FILE}`;

const PROPS_TO_MANGLE = [] as string[];

Deno.mkdirSync(OUTPUT_DIR, { recursive: true });

await bundle();
logSize(BUNDLE_OUTPUT_COMPRESSED_FILEPATH);

await bundle({ minify: false, sourcemap: "inline" });

await new Deno.Command("open", {
  args: [BUNDLE_OUTPUT_FILEPATH],
}).output();

async function bundle(
  options: Partial<Deno.bundle.Options> = { minify: true },
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

  let code = sourceData.text(), appOutputText = rawText(<script>{code}</script>);
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

    console.log(`%cMinifed Source:\n%c${code}`, "color: blue;", "color: gray;");

    const packer = new Packer([
      {
        data: code,
        type: "js" as InputType,
        action: "eval" as InputAction,
      },
    ], {});
    await packer.optimize();

    const { firstLine, secondLine } = packer.makeDecoder();

    appOutputText = rawText(
      <script>
        {firstLine}
        {secondLine}
      </script>,
    );
  }

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

  await new Deno.Command("./ect/build/ect", {
    args: ["-zip", "-9", BUNDLE_OUTPUT_COMPRESSED_FILE],
    cwd: OUTPUT_DIR,
  }).output();
}

function logSize(filePath: string, customMessage?: string) {
  const { size } = Deno.statSync(filePath);

  console.log(
    `%c${customMessage ?? filePath}: %c${size} / ${JS13K_LIMIT} %c(${
      ((size / JS13K_LIMIT) * 100).toFixed(2)
    }%, ${
      JS13K_LIMIT - size
    } bytes remaining + ~${ESTIMATED_RECLAIMABLE_BYTES} to reclaim)`,
    "color: grey;",
    "color: cyan;",
    "color: white;",
  );
}
