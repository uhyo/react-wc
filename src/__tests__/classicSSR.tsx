/**
 * @jest-environment node
 */
import React, { Fragment } from "react";
import { renderToStaticMarkup, renderToString } from "react-dom/server";
import { ServerRenderingCollector, wc } from "..";

describe("Classic SSR", () => {
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
        classicSSR: true,
      });

      const collector = new ServerRenderingCollector();
      const str = renderToString(
        collector.wrap(
          <Hello>
            <span>Foobar</span>
          </Hello>
        )
      );

      expect(str).toMatchSnapshot();
      expect(
        renderToStaticMarkup(<Fragment>{collector.getHeadElements()}</Fragment>)
      ).toMatchSnapshot();
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
        classicSSR: true,
      });

      const collector = new ServerRenderingCollector();
      const str = renderToString(
        collector.wrap(<Hello foo={<span>Hi</span>} />)
      );

      expect(str).toMatchSnapshot();
      expect(
        renderToStaticMarkup(<Fragment>{collector.getHeadElements()}</Fragment>)
      ).toMatchSnapshot();
    });
    it("many components", () => {
      const Hello = wc({
        shadowHtml: `
          <style>
            div {
              font-size: 100px;
            }
          </style>
          <slot name="foo"></slot>
          <slot></slot>
      `,
        slots: ["foo"],
        name: "wc-test-many-components-1",
        classicSSR: true,
      });
      const Hello2 = wc({
        shadowHtml: `
          <style>
            :host { color: red; }
          </style>
          <slot name="foo"></slot>
      `,
        slots: ["foo"],
        name: "wc-test-many-components-2",
        classicSSR: true,
      });

      const collector = new ServerRenderingCollector();
      const str = renderToString(
        collector.wrap(
          <Hello foo={<span>Hi</span>}>
            <div>
              <Hello foo="foo" />
            </div>
            <Hello2 foo={<span>Hey</span>} />
          </Hello>
        )
      );

      expect(str).toMatchSnapshot();
      expect(
        renderToStaticMarkup(<Fragment>{collector.getHeadElements()}</Fragment>)
      ).toMatchSnapshot();
    });
  });
});
