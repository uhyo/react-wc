import React from "react";
import { textNodeElementName } from "./generateElementName";

let textElementRegistered = false;

export function applySlot(
  node: React.ReactNode,
  slotName: string,
  addedKey?: string | number
): React.ReactNode {
  if (Array.isArray(node)) {
    const children = node.map((n) => applySlot(n, slotName));
    if (addedKey) {
      return React.createElement(
        React.Fragment,
        {
          key: addedKey,
        },
        children
      );
    }
    return children;
  }
  if (typeof node !== "object") {
    if (!textElementRegistered) {
      textElementRegistered = true;
      window.customElements.define(
        textNodeElementName,
        class extends HTMLElement {}
      );
    }
    return React.createElement(
      textNodeElementName,
      {
        key: addedKey,
        slot: slotName,
      },
      node
    );
  }
  if (isReactElement(node)) {
    if (typeof node.type === "string") {
      return {
        ...node,
        type: node.type,
        props: {
          ...node.props,
          slot: slotName,
        },
        key: node.key ?? addedKey,
      };
    }
    const {
      type,
      props: { children, ...props },
      key,
    } = node;
    const w = wrappers.get(type);
    if (w) {
      return React.createElement(
        w,
        {
          ...props,
          key: key ?? addedKey,
          slot: slotName,
        },
        children
      );
    }
    const newWrapper = makeWrapper(type);
    wrappers.set(type, newWrapper);
    return React.createElement(
      newWrapper,
      {
        ...props,
        key: key ?? addedKey,
        slot: slotName,
      },
      children
    );
  }
  return null;
}

const wrappers = new WeakMap<
  React.JSXElementConstructor<any>,
  React.ComponentType<any>
>();

function makeWrapper(
  element: React.JSXElementConstructor<any>
): React.ComponentType<any> {
  if (isClassComponent(element)) {
    return class extends element {
      render() {
        const children = super.render();
        return React.createElement(React.Fragment, {
          children: applySlot(children, this.props.slot),
        });
      }
    };
  }
  return ({ slot, ...props }) => {
    const children = element(props);
    return React.createElement(React.Fragment, {
      children: applySlot(children, slot),
    });
  };
}

function isReactElement(node: any): node is React.ReactElement {
  return node.type !== undefined;
}

function isClassComponent(
  element: React.JSXElementConstructor<any>
): element is new (props: any) => React.Component<any, any> {
  return element.prototype instanceof React.Component;
}
