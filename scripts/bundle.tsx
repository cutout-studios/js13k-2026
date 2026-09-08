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

import * as esbuild from "esbuild";
import { minify } from "esbuild-minify-templates";
import { minify as minifyHtml } from "html-minifier-next";

import { InputAction, InputType, Packer } from "roadroller";

const JS13K_LIMIT = 13_312;

// `deno task bundle:<name>` passes a devtools/ directory name here (e.g.
// "sandbox", "portrait", "sounds") to build that tool instead of the real,
// size-constrained game - dev tools have no size budget and nothing to
// compress, so they skip straight to an unminified build. every target's
// output nests under .output/<target>/, including the real game's "app"
const TARGET_DIR = Deno.args[0] || "app";
const IS_DEV_TOOL = TARGET_DIR != "app";

const SOURCE_DIR = IS_DEV_TOOL ? `devtools/${TARGET_DIR}` : "app";
const OUTPUT_DIR = `.output/${TARGET_DIR}`;

const JS_ENTRYPOINT = `./${SOURCE_DIR}/module.ts`;
const HTML_ENTRYPOINT = `./${SOURCE_DIR}/index.html`;
const BUNDLE_OUTPUT_FILE = "index.html";
const BUNDLE_OUTPUT_COMPRESSED_FILE = `${BUNDLE_OUTPUT_FILE}.zip`;
const BUNDLE_OUTPUT_FILEPATH = `./${OUTPUT_DIR}/${BUNDLE_OUTPUT_FILE}`;
const BUNDLE_OUTPUT_COMPRESSED_FILEPATH =
  `./${OUTPUT_DIR}/${BUNDLE_OUTPUT_COMPRESSED_FILE}`;

const PROPS_TO_MANGLE = [] as string[];

Deno.mkdirSync(OUTPUT_DIR, { recursive: true });

if (IS_DEV_TOOL) {
  // no size budget to enforce and nothing to compress - just build it fast
  await bundle({ minify: false, sourcemap: "inline" }, JS_ENTRYPOINT, true);
} else {
  await bundle();
  logSize(BUNDLE_OUTPUT_COMPRESSED_FILEPATH);

  await bundle({ minify: false, sourcemap: "inline" });
}

await new Deno.Command("open", {
  args: [BUNDLE_OUTPUT_FILEPATH],
}).output();

async function bundle(
  options: Partial<Deno.bundle.Options> = { minify: true },
  entrypoint = JS_ENTRYPOINT,
  skipCompression = false,
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

  const { outputFiles: [jsFile] = [] } = _result;

  const htmlText = await minifyHtml(Deno.readTextFileSync(HTML_ENTRYPOINT), {
    collapseWhitespace: true,
    removeComments: true,
    removeAttributeQuotes: true,
    removeOptionalTags: true,
    minifyCSS: true,
    minifyJS: false,
  });

  let jsCode = jsFile.text(),
    appOutputText = htmlText + `<script type=module>${jsCode}</script>`;
  if (options.minify) {
    jsCode = minify(jsCode).toString();

    const result = await esbuild.transform(jsCode, {
      minify: true,
      mangleProps: new RegExp(
        `^(${PROPS_TO_MANGLE.join("|")})$`,
      ),
      legalComments: "none",
    });

    jsCode = result.code;

    console.log(
      `%cMinifed JavaScript:\n%c${jsCode}`,
      "color: blue;",
      "color: gray;",
    );

    jsCode = htmlText + `<script type=module>${jsCode}</script>`;
    const packer = new Packer([
      {
        data: jsCode,
        type: "text" as InputType,
        action: "write" as InputAction,
      },
    ], { allowFreeVars: true });
    // await packer.optimize(2); // TODO
    await packer.optimize(1);

    const { firstLine, secondLine } = packer.makeDecoder();

    appOutputText = `<script>${firstLine}\n${secondLine}</script>`;
  }

  Deno.writeTextFileSync(
    BUNDLE_OUTPUT_FILEPATH,
    appOutputText,
  );

  if (skipCompression) return;

  const zip = await new Deno.Command("advzip", {
    args: ["-a", "-4", BUNDLE_OUTPUT_COMPRESSED_FILE, BUNDLE_OUTPUT_FILE],
    cwd: OUTPUT_DIR,
  }).output();

  if (!zip.success) {
    console.error(new TextDecoder().decode(zip.stderr));
  }

  // ect lives at .output/ect/build/ect (see scripts/setup.sh) - a fixed
  // location one level up from every target's own OUTPUT_DIR
  await new Deno.Command("../ect/build/ect", {
    args: ["-zip", "-9", BUNDLE_OUTPUT_COMPRESSED_FILE],
    cwd: OUTPUT_DIR,
  }).output();
}

function logSize(filePath: string, customMessage?: string) {
  const { size } = Deno.statSync(filePath);

  console.log(
    `%c${customMessage ?? filePath}: %c${size} / ${JS13K_LIMIT} %c(~${
      ((size / JS13K_LIMIT) * 100).toFixed(0)
    }%: ${JS13K_LIMIT - size} bytes remaining)`,
    "color: grey;",
    "color: cyan;",
    "color: white;",
  );
}
