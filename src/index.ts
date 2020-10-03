import React from "react";
import { generateElementName } from "./generateElementName";
import { Slot } from "./Slot";
import { slotNameSymbol } from "./symbol";
import { resolveTemplateString } from "./util/resolveTemplateString";

/**
 * Creates a component from given HTML string.
 */
export function html<SlotName extends string>(
  html: TemplateStringsArray,
  ...values: readonly Slot<SlotName>[]
): React.ComponentType {
  const elementName = generateElementName();
  let initFlag = false;
  const template = document.createDocumentFragment();
  const templateString = resolveTemplateString(html, values);
  return (props) => {
    if (!initFlag) {
      initFlag = true;
      // parse HTML string into DOM nodes
      const div = document.createElement("div");
      div.insertAdjacentHTML("afterbegin", templateString);
      template.append(...div.childNodes);
      console.log(templateString);
      class Elm extends HTMLElement {
        constructor() {
          super();
          this.attachShadow({
            mode: "open",
          }).appendChild(template.cloneNode(true));
        }
      }
      window.customElements.define(elementName, Elm);
    }
    return React.createElement(elementName, {}, props.children);
  };
}

export function slot(): Slot<"">;
export function slot<Name extends string>(name: Name): Slot<Name>;
export function slot(name?: string): Slot<string> {
  return {
    [slotNameSymbol]: name || "",
  };
}
