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

import { parseArgs } from "@std/cli";

import * as esbuild from "esbuild";
import { minify as minifyTemplates } from "esbuild-minify-templates";
import { minify as minifyHtml } from "html-minifier-next";
import { InputAction, InputType, Packer } from "roadroller";

const JS13K_LIMIT = 13_312;

const { minify, compress, open, roll, verbose, _: targets } = parseArgs(
  Deno.args,
);

const TARGET_DIR = targets[0] || "app";
const IS_DEV_TOOL = TARGET_DIR != "app";

const SOURCE_DIR = IS_DEV_TOOL ? `devtools/${TARGET_DIR}` : "app";
const OUTPUT_DIR = `.output/${TARGET_DIR}`;

const JS_ENTRYPOINT = `./${SOURCE_DIR}/module.ts`;
const HTML_ENTRYPOINT = `./${SOURCE_DIR}/index.html`;
const BUNDLE_OUTPUT_FILE = "index";
const BUNDLE_OUTPUT_COMPRESSED_FILE = `${BUNDLE_OUTPUT_FILE}.zip`;
const BUNDLE_OUTPUT_FILEPATH = `./${OUTPUT_DIR}/${BUNDLE_OUTPUT_FILE}.html`;
const BUNDLE_OUTPUT_COMPRESSED_FILEPATH =
  `./${OUTPUT_DIR}/${BUNDLE_OUTPUT_COMPRESSED_FILE}`;

try {
  Deno.removeSync(OUTPUT_DIR, { recursive: true });
} catch {
  // do nothing
}

Deno.mkdirSync(OUTPUT_DIR, { recursive: true });

console.time("bundle");
await bundle(
  IS_DEV_TOOL
    ? { minify: false, compress: "ect", sourcemap: "inline" }
    : { minify, compress, roll },
);
console.timeEnd("bundle");
logSize(
  compress === "ect"
    ? BUNDLE_OUTPUT_COMPRESSED_FILEPATH
    : compress === "br"
    ? BUNDLE_OUTPUT_FILEPATH + ".br"
    : BUNDLE_OUTPUT_FILEPATH,
);

if (open) {
  await new Deno.Command("open", {
    args: [BUNDLE_OUTPUT_FILEPATH],
  }).output();
}

// --- lib

async function bundle(
  { minify = false, compress, roll = 0, ...options }:
    & Partial<Deno.bundle.Options>
    & { compress?: "ect" | "br"; roll?: 0 | 1 | 2 },
) {
  const _result = await Deno.bundle({
    ...options,
    minify,
    entrypoints: [JS_ENTRYPOINT],
    outputDir: OUTPUT_DIR,
    platform: "browser",
    write: false,
  });

  if (_result.errors.length) {
    console.error({ errors: _result.errors });
  }

  const { outputFiles: [jsFile] = [] } = _result;

  let htmlText = Deno.readTextFileSync(HTML_ENTRYPOINT),
    jsCode = jsFile.text(),
    appOutputText = htmlText + `<script type=module>${jsCode}</script>`;

  if (minify) {
    console.log("Minifying...");

    htmlText = await minifyHtml(htmlText, {
      collapseWhitespace: true,
      removeComments: true,
      removeAttributeQuotes: true,
      removeOptionalTags: true,
      minifyCSS: true,
      minifyJS: false,
    });
    jsCode = minifyTemplates(jsCode).toString();

    const result = await esbuild.transform(jsCode, {
      minify,
      legalComments: "none",
    });

    jsCode = result.code;

    if (verbose) {
      console.log(
        `%cMinifed JavaScript:\n%c${jsCode}`,
        "color: blue;",
        "color: gray;",
      );
    }

    appOutputText = htmlText + `<script type=module>${jsCode}</script>`;
  }

  if (roll) {
    console.log("Roadrolling...");

    const PACK_ATTEMPTS = 12;
    let bestOutputText: string | undefined;

    for (let attempt = 0; attempt < PACK_ATTEMPTS; attempt++) {
      const packer = new Packer([
        {
          data: jsCode,
          type: "text" as InputType,
          action: "write" as InputAction,
        },
      ], { allowFreeVars: true });
      await packer.optimize(roll);

      const { firstLine, secondLine } = packer.makeDecoder(),
        candidate = `<script>${firstLine}\n${secondLine}</script>`;

      if (!bestOutputText || candidate.length < bestOutputText.length) {
        bestOutputText = candidate;
      }
    }

    appOutputText = htmlText + bestOutputText!;
  }

  Deno.writeTextFileSync(
    BUNDLE_OUTPUT_FILEPATH,
    appOutputText,
  );

  if (!compress) return;

  console.log("Compressing...");

  // run `deno run setup` to make sure ect is installed

  if (compress === "ect") {
    await new Deno.Command("./.output/ect/build/ect", {
      args: ["-zip", "-9", BUNDLE_OUTPUT_FILEPATH],
    }).output();
  } else if (compress === "br") {
    await new Deno.Command("brotli", {
      args: [BUNDLE_OUTPUT_FILEPATH],
    }).output();
  }
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
