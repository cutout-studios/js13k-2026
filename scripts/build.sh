#! bin/bash

set -eou

deno run scripts/build.js

br .output/index.html .output/index.html.br

# TODO: echo file size
