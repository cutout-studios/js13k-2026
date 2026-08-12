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

import { documentFragment as node } from "~web";

const canvasNode = node(<canvas></canvas>);

export const canvas = canvasNode.querySelector("canvas")!;

document.body.appendChild(node(
  <>
    <style>
      {/* css */ `
      html, body, main, main * { 
        all: initial;
        box-sizing: border-box;
        font-family: system-ui;
        overflow: hidden;
      }
      main {
        position: relative;
      }
      main, canvas, nav {
        display: block;
        width: 100vw;
        height: 100svh;
      }
      nav {
        pointer-events: none;
        position: absolute;
        top: 0;
        left: 0;
      }
    `}
    </style>
    <main>
      {canvasNode}
      <nav>
        {/* TBD: gui here */}
      </nav>
    </main>
  </>,
));
