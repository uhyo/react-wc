import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import React from "react";
import { html } from "..";

describe("html", () => {
  it("no slot", () => {
    const Hello = html`
      <style>
        div {
          font-size: 100px;
        }
      </style>
      <div>Hello</div>
    `;

    render(<Hello />);

    const el = document.getElementsByTagName(Hello.elementName)[0];

    expect(el.shadowRoot?.innerHTML).toMatchSnapshot();
    expect(el.innerHTML).toMatchSnapshot();
  });
});
