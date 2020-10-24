import React, { useLayoutEffect, useRef } from "react";
import { HtmlComponentProps } from "./HtmlComponentProps";
import { makeChildren } from "./makeChildren";

export type WcOptions<SlotName extends string> = {
  /**
   * Name of custom element to create.
   */
  name: string;
  /**
   * Contents of shadow dom.
   */
  shadowHtml: string;
  /**
   * Name of slots to accept.
   */
  slots?: readonly SlotName[];
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

export type WcIntrinsicOptions<
  SlotName extends string,
  ElementName extends string
> = {
  /**
   * Name of element to be rendered by this component.
   */
  element: ElementName;
  /**
   * Contents of shadow dom.
   */
  shadowHtml: string;
  /**
   * Name of slots to accept.
   */
  slots?: readonly SlotName[];
};

/**
 * Create a React Element which renders given kind of element.
 */
export function wcIntrinsic<
  SlotName extends string,
  ElementName extends keyof JSX.IntrinsicElements
>({
  element,
  shadowHtml,
  slots,
}: WcIntrinsicOptions<SlotName, ElementName>): React.FunctionComponent<
  JSX.IntrinsicElements[ElementName] & HtmlComponentProps<SlotName>
> {
  let template: DocumentFragment | undefined;
  return (
    props: React.PropsWithChildren<
      JSX.IntrinsicElements[ElementName] & HtmlComponentProps<SlotName>
    >
  ) => {
    if (!template) {
      const t = (template = document.createDocumentFragment());
      // parse HTML string into DOM nodes
      const div = document.createElement("div");
      div.insertAdjacentHTML("afterbegin", shadowHtml);
      t.append(...div.childNodes);
    }
    const children = makeChildren(props, slots);

    const elementRef = useRef<HTMLElement | null>(null);

    const t = template;
    useLayoutEffect(() => {
      if (elementRef.current) {
        elementRef.current
          .attachShadow({ mode: "open" })
          .appendChild(t.cloneNode(true));
      }
    }, []);

    return React.createElement(element, {
      ...props,
      ref: elementRef
    }, children);
  };
}
