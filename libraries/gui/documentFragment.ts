/// <reference lib="dom" />

import {
  CUTOUT_CHILDREN_LABEL as XO_CHILDREN_LABEL,
  CUTOUT_FRAGMENT_LABEL as XO_FRAGMENT_LABEL,
  CutoutTokenType as XOTokenType,
} from "@cutout/jsx/tokens";
import type { CutoutProjection as XOProjection } from "@cutout/jsx/projections";

export const documentFragment: XOProjection<DocumentFragment, {
  event?: AddEventListenerOptions;
}> = ([, jsxTokens], options): DocumentFragment => {
  const state: _FormatState = {
    root: globalThis.document.createDocumentFragment(),
    stack: [],
    pointers: {},
  };

  for (const [type, value] of jsxTokens()) {
    switch (type) {
      case XOTokenType.ELEMENT_OPEN:
        _openElement(state, value);
        break;
      case XOTokenType.ELEMENT_CLOSE:
        _closeElement(state);
        break;
      case XOTokenType.ATTRIBUTE:
        _targetAttribute(state, value);
        break;
      case XOTokenType.NUMBER:
      case XOTokenType.STRING:
      case XOTokenType.BOOLEAN:
        _handlePrimitive(state, value);
        break;
      case XOTokenType.OBJECT:
      case XOTokenType.ARRAY:
        _handleObject(state, value);
        break;
      case XOTokenType.FUNCTION:
        _addEventListener(
          state,
          (event: Event) => (value as EventListener)(event),
          options?.event,
        );
        break;
      case XOTokenType.SYMBOL:
      case XOTokenType.NULL:
      case XOTokenType.UNDEFINED:
      default:
        break;
    }
  }

  return state.root;
};

type _FormatState = {
  root: DocumentFragment;
  stack: HTMLElement[];
  pointers: {
    element?: HTMLElement;
    attribute?: string;
  };
};

// Cognitive convenience methods
function _openElement(
  state: _FormatState,
  value: string,
) {
  if (value === XO_FRAGMENT_LABEL) {
    return state.stack.push(state.pointers.element!);
  }

  const previous = state.pointers.element ?? state.root;

  state.pointers.element = globalThis.document.createElement(value);

  state.stack.push(state.pointers.element);
  previous.appendChild(state.pointers.element);
}

function _closeElement(
  state: _FormatState,
) {
  state.stack.pop();
  state.pointers.element = state.stack.at(-1);
}

function _targetAttribute(state: _FormatState, value: string) {
  if (value === XO_CHILDREN_LABEL) {
    return state.pointers.attribute = undefined;
  }

  state.pointers.attribute = value;
}

function _handlePrimitive(
  state: _FormatState,
  value: string | number | boolean,
) {
  if (value === false) return;

  if (state.pointers.attribute) {
    return state.pointers.element?.setAttribute(
      state.pointers.attribute,
      value === true ? "" : String(value),
    );
  }

  _appendTextNode(state, value);
}

function _handleObject(state: _FormatState, value: object) {
  if (!state.pointers.element) return;

  if (state.pointers.attribute) return _appendTextNode(state, value);

  if (value instanceof DocumentFragment) {
    for (const child of [...value.children]) {
      state.pointers.element.append(child);
    }
  }
}

function _appendTextNode(state: _FormatState, value: unknown) {
  if (!state.pointers.element) return;

  state.pointers.element.appendChild(
    globalThis.document.createTextNode(
      typeof value === "object" ? JSON.stringify(value) : String(value),
    ),
  );
}

function _addEventListener(
  state: _FormatState,
  value: EventListener,
  options?: EventListenerOptions,
) {
  if (!state.pointers.element || !state.pointers.attribute) return;

  state.pointers.element.addEventListener(
    state.pointers.attribute.replace(/^on/, "").toLowerCase(),
    value,
    options,
  );
}
