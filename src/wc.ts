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
  /**
   * Whether to emit Declarative Shadow DOM support.
   */
  declarativeShadowDOM?: boolean;
};

const clientDetected =
  typeof window !== "undefined" && !!window.HTMLTemplateElement;

/**
 * Create a React component from given HTML string and list of slot names.
 */
export function wc<SlotName extends string>({
  name,
  shadowHtml,
  slots,
  declarativeShadowDOM,
}: WcOptions<SlotName>): React.FunctionComponent<HtmlComponentProps<SlotName>> {
  let template: DocumentFragment | undefined;
  const emitDeclarativeShadowDOM = declarativeShadowDOM && !clientDetected;
  return (props: React.PropsWithChildren<HtmlComponentProps<SlotName>>) => {
    if (clientDetected && !template) {
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
    const childrenFromProps = makeChildren(props, slots);
    const children = emitDeclarativeShadowDOM
      ? React.createElement(
          React.Fragment,
          {},
          React.createElement("template", {
            shadowroot: "open",
            dangerouslySetInnerHTML: { __html: shadowHtml },
          }),
          childrenFromProps
        )
      : childrenFromProps;
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
  /**
   * Whether to emit Declarative Shadow DOM support.
   */
  declarativeShadowDOM?: boolean;
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
  declarativeShadowDOM,
}: WcIntrinsicOptions<SlotName, ElementName>): React.FunctionComponent<
  JSX.IntrinsicElements[ElementName] & HtmlComponentProps<SlotName>
> {
  let template: DocumentFragment | undefined;
  const emitDeclarativeShadowDOM = declarativeShadowDOM && !clientDetected;
  return (
    props: React.PropsWithChildren<
      JSX.IntrinsicElements[ElementName] & HtmlComponentProps<SlotName>
    >
  ) => {
    if (clientDetected && !template) {
      const t = (template = document.createDocumentFragment());
      // parse HTML string into DOM nodes
      const div = document.createElement("div");
      div.insertAdjacentHTML("afterbegin", shadowHtml);
      t.append(...div.childNodes);
    }
    const children = makeChildren(props, slots);
    const declarativeShadowDOMChildren =
      emitDeclarativeShadowDOM &&
      React.createElement("template", {
        shadowroot: "open",
        dangerouslySetInnerHTML: { __html: shadowHtml },
      });

    const elementRef = useRef<HTMLElement | null>(null);

    if (clientDetected) {
      // `template` is initialized when clientDetected
      const t = template!;
      useLayoutEffect(() => {
        /* istanbul ignore else */
        if (elementRef.current) {
          elementRef.current
            .attachShadow({ mode: "open" })
            .appendChild(t.cloneNode(true));
        }
      }, []);
    }

    const renderedProps: any = { ...props };
    if (slots) {
      for (const slot of slots) {
        renderedProps[slot] = undefined;
      }
    }
    renderedProps.ref = elementRef;

    return declarativeShadowDOMChildren
      ? React.createElement(
          element,
          renderedProps,
          declarativeShadowDOMChildren,
          children
        )
      : React.createElement(element, renderedProps, children);
  };
}
