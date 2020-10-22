import React from "react";
import { WCComponent } from ".";
import { generateElementName } from "./generateElementName";
import { HtmlComponentProps } from "./HtmlComponentProps";
import { makeChildren } from "./makeChildren";
import { Slot } from "./Slot";
import { slotNameSymbol } from "./symbol";
import {
  HtmlInterpolationValue,
  resolveTemplateString,
} from "./util/resolveTemplateString";

/**
 * Creates a component from given HTML string.
 * @deprecated Use `@castella/macro` package instead.
 */
export function html<SlotName extends string>(
  html: TemplateStringsArray,
  ...values: readonly HtmlInterpolationValue<SlotName>[]
): WCComponent<SlotName> {
  const elementName = generateElementName();
  let initFlag = false;
  const template = document.createDocumentFragment();
  const [templateString, slotNames] = resolveTemplateString(html, values);
  return Object.assign(
    (props: React.PropsWithChildren<HtmlComponentProps<SlotName>>) => {
      if (!initFlag) {
        initFlag = true;
        // parse HTML string into DOM nodes
        const div = document.createElement("div");
        div.insertAdjacentHTML("afterbegin", templateString);
        template.append(...div.childNodes);
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
      const children = makeChildren(props, slotNames);
      return React.createElement(elementName, {}, children);
    },
    {
      elementName,
    }
  );
}

/**
 * @deprecated Use `@castella/macro` instead.
 */
export function slot(): Slot<"">;
export function slot<Name extends string>(name: Name): Slot<Name>;
export function slot(name?: string): Slot<string> {
  return {
    [slotNameSymbol]: name || "",
  };
}
