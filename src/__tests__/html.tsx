import { render, screen } from "@testing-library/react";
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

    screen.
  });
});
