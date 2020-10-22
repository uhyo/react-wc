import React from "react";
import { HtmlComponentProps } from "./HtmlComponentProps";
import { makeChildren } from "./makeChildren";

export type WcOptions<SlotName extends string> = {
  name: string;
  shadowHtml: string;
  slots: readonly SlotName[];
};

/**
 * Create a React component from given HTML string and list of slot names.
 */
export function wc<SlotName extends string>({
  name,
  shadowHtml,
  slots,
}: WcOptions<SlotName>): React.FunctionComponent<HtmlComponentProps<SlotName>> {
  let template: DocumentFragment | undefined;
  return (props: React.PropsWithChildren<HtmlComponentProps<SlotName>>) => {
    if (!template) {
      const t = (template = document.createDocumentFragment());
      // parse HTML string into DOM nodes
      const div = document.createElement("div");
      div.insertAdjacentHTML("afterbegin", shadowHtml);
      t.append(...div.childNodes);
      class Elm extends HTMLElement {
        constructor() {
          super();
          this.attachShadow({
            mode: "open",
          }).appendChild(t.cloneNode(true));
        }
      }
      window.customElements.define(name, Elm);
    }
    const children = makeChildren(props, slots);
    return React.createElement(name, {}, children);
  };
}
