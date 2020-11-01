import React, { useContext, useLayoutEffect, useRef } from "react";
import {
  customElementBaseClassTemplate,
  CustomElementClass,
} from "./customElementClassTemplate";
import { HtmlComponentProps } from "./HtmlComponentProps";
import { makeChildren } from "./makeChildren";
import { parseTemplate } from "./parseTemplate";
import { ServerRenderingContext } from "./ssr";

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
  /**
   * Whether to enable classic SSR support.
   */
  classicSSR?: boolean;
};

const clientDetected =
  typeof window !== "undefined" && !!window.HTMLTemplateElement;

const getCustomElementClass = new Function(
  "template",
  `const E = ${customElementBaseClassTemplate}; E.template = template; return E`
) as (template: DocumentFragment) => CustomElementClass;

/**
 * Create a React component from given HTML string and list of slot names.
 */
export function wc<SlotName extends string>({
  name,
  shadowHtml,
  slots,
  declarativeShadowDOM,
  classicSSR,
}: WcOptions<SlotName>): React.FunctionComponent<HtmlComponentProps<SlotName>> {
  let Elm: CustomElementClass | undefined;
  let ssrInitialized = false;
  const emitDeclarativeShadowDOM = declarativeShadowDOM && !clientDetected;
  return (props: React.PropsWithChildren<HtmlComponentProps<SlotName>>) => {
    if (clientDetected && !Elm) {
      const template = parseTemplate(shadowHtml);

      const registered = window.customElements.get(name);
      if (registered) {
        // this may happen when the component is loaded by something like fast refresh.
        registered.template = template;
        Elm = registered;
        document.querySelectorAll(name).forEach((elm) => {
          (elm as any).refresh();
        });
      } else {
        Elm = getCustomElementClass(template);
        window.customElements.define(name, Elm);
      }
    }
    if (classicSSR && !clientDetected) {
      const collector = useContext(ServerRenderingContext);
      if (collector && !ssrInitialized) {
        collector.addScriptForCustomElement(name, shadowHtml);
      }
      ssrInitialized = true;
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
      template = parseTemplate(shadowHtml);
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
