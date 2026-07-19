import { Packer } from "roadroller";

const APP_DIR = "app";
const OUTPUT_DIR = ".output";

const APP_SCRIPT_ENTRYPOINT = `${APP_DIR}/main.js`;
const APP_HTML_ENTRYPOINT = `${APP_DIR}/index.html.jsx`;

const APP_SCRIPT_OUTPUT = `${OUTPUT_DIR}/main.js`;
const APP_RR_OUTPUT = `${OUTPUT_DIR}/main.rr.js`;
const APP_OUTPUT = `${OUTPUT_DIR}/index.html`;

Deno.bundle({
  entrypoints: [APP_SCRIPT_ENTRYPOINT]
}); 

const packer = new Packer();
await packer.optimize();

// TODO: write to main.rr.js
// TODO: write index.html.jsx and have it write to an output, then bundle
// Deno.bundle({
//   entrypoints: [APP_HTML_ENTRYPOINT]
// })