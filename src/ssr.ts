import React, { createContext } from "react";
import { customElementBaseClassTemplate } from "./customElementClassTemplate";

declare global {
  namespace ReactWC {
    interface ServerRenderingGetHeadElementsOptions {
      scriptProps?: JSX.IntrinsicElements["script"];
    }
  }
}

export const reactWcGlobal = {
  /**
   * Name of global variable.
   */
  varName: "__REACT_WC__",
  /**
   * Name of getCustomElementClass function
   */
  getCustomElementClass: "c",
  /**
   * Named of parseTemplate function
   */
  parseTemplate: "p",
};

/**
 * Class for collecting data during SSR.
 */
export class ServerRenderingCollector {
  readonly scripts = new Map<string, string>();

  /**
   * @internal
   */
  addScriptForCustomElement(name: string, shadowHtml: string) {
    const script =
      `customElements.define("${escapeForDoubleQuotedString(name)}",` +
      `(E=>(E.template=${reactWcGlobal.varName}.${
        reactWcGlobal.parseTemplate
      }("${escapeForDoubleQuotedString(shadowHtml)}"),E))(${
        reactWcGlobal.varName
      }.${reactWcGlobal.getCustomElementClass}()))`;
    this.scripts.set(name, script);
  }

  /**
   * Returns a list of elements that are to be rendered in <head>.
   */
  getHeadElements(
    options?: ReactWC.ServerRenderingGetHeadElementsOptions
  ): JSX.Element[] {
    const scriptProps = options?.scriptProps;
    let scripts = "";
    for (const script of this.scripts.values()) {
      scripts += script + ";";
    }
    if (scripts) {
      scripts =
        `var ${reactWcGlobal.varName}={` +
        `${reactWcGlobal.getCustomElementClass}:()=>${customElementBaseClassTemplate},` +
        `${reactWcGlobal.parseTemplate}:(t,d)=>{` +
        `return d=document.createElement("div"),d.insertAdjacentHTML("afterbegin",t),` +
        `t=document.createDocumentFragment(),t.appendChild(...d.childNodes),t` +
        `}};${scripts}`;
      return [
        React.createElement("script", {
          key: "react-wc-script",
          ...scriptProps,
          dangerouslySetInnerHTML: {
            __html: scripts,
          },
        }),
      ];
    }
    return [];
  }

  /**
   * Wrap a React element to collect SSR information.
   */
  wrap(component: JSX.Element): JSX.Element {
    return React.createElement(
      ServerRenderingContext.Provider,
      {
        value: this,
      },
      component
    );
  }
}

/**
 * Context for collectiong styles needed for SSR.
 */
export const ServerRenderingContext = createContext<
  ServerRenderingCollector | undefined
>(undefined);

const doubleQuotedEscapeRegExp = /"|\\|\r|\n|\u2028|\u2029|<\/script>/g;
const doubleQuoteEscapeFunc = (str: string) => {
  if (str === '"') {
    return '\\"';
  }
  if (str === "\\") {
    return "\\\\";
  }
  if (str === "\r") {
    return "\\r";
  }
  if (str === "\n") {
    return "\\n";
  }
  if (str === "</script>") {
    return "<\\/script>";
  }
  if (str === "\u2028") {
    return "\\u2028";
  }
  if (str === "\u2029") {
    return "\\u2029";
  }
  return str;
};
function escapeForDoubleQuotedString(str: string) {
  return str.replace(doubleQuotedEscapeRegExp, doubleQuoteEscapeFunc);
}
