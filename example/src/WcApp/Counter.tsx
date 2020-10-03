import { html } from "react-wc-adapter";

export const Counters = html`
  <style>
    div {
      display: grid;
      grid: auto-flow / repeat(16, 80px);
      gap: 10px;
    }
  </style>
  <div><slot></slot></div>
`;

export const Counter = html`
  <style>
    :host {
      display: flex;
      flex-flow: nowrap row;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      width: 80px;
      height: 80px;
      border: 1px solid #cccccc;
      padding: 2px;
      font-size: 1.5em;
    }
  </style>
  <div>
    <slot></slot>
  </div>
`;
