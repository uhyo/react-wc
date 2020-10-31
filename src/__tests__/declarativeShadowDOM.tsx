/**
 * @jest-environment node
 */
import React from "react";
import { renderToString } from "react-dom/server";
import { wc, wcIntrinsic } from "..";

describe("declarativeShadowDOM", () => {
  describe("wc", () => {
    it("one slot", () => {
      const Hello = wc({
        shadowHtml: `
          <style>
            div {
              font-size: 100px;
            }
          </style>
          <div><slot></slot></div>
      `,
        slots: [],
        name: "wc-test-foo",
        declarativeShadowDOM: true,
      });

      const str = renderToString(
        <Hello>
          <span>Foobar</span>
        </Hello>
      );

      expect(str).toMatchSnapshot();
    });
    it("named slot", () => {
      const Hello = wc({
        shadowHtml: `
          <style>
            div {
              font-size: 100px;
            }
          </style>
          <slot name="foo"></slot>
      `,
        slots: ["foo"],
        name: "wc-test-2",
        declarativeShadowDOM: true,
      });

      const str = renderToString(<Hello foo={<span>Hi</span>} />);

      expect(str).toMatchSnapshot();
    });
  });
  describe("wcIntrinsic", () => {
    it("one slot", () => {
      const Hello = wcIntrinsic({
        shadowHtml: `
          <style>
            :host {
              color: red;
            }
          </style>
          <slot></slot>
      `,
        slots: [],
        element: "span",
        declarativeShadowDOM: true,
      });

      const str = renderToString(
        <Hello>
          <span>Foobar</span>
        </Hello>
      );

      expect(str).toMatchSnapshot();
    });
    it("two slots", () => {
      const Hello = wcIntrinsic({
        shadowHtml: `
          <style>
            div {
              font-size: 100px;
            }
          </style>
          <div><slot name="foo"></slot><slot name="bar"></slot></div>
      `,
        slots: ["foo", "bar"],
        element: "div",
        declarativeShadowDOM: true,
      });

      const str = renderToString(<Hello foo={<span>Hi</span>} bar="wow" />);

      expect(str).toMatchSnapshot();
    });
  });
});
