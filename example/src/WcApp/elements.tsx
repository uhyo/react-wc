import { html, slot } from "react-wc-adapter";

export const AppStyle = html`
  <style>
    header {
      border: 1px solid #cccccc;
      padding: 4px;
    }
    p {
      border-bottom: 1px dashed #999999;
    }
  </style>
  <header>${slot("header")}</header>
  <p>Counter value is ${slot("counter")}</p>
  <main>${slot()}</main>
`;

export const CounterValue = html`
  <style>
    :host {
      font-weight: bold;
    }
  </style>
  ${slot()}
`;

export const Counters = html`
  <style>
    div {
      display: grid;
      grid: auto-flow / repeat(16, 80px);
      gap: 10px;
    }
  </style>
  <div>${slot()}</div>
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
  <div>${slot()}</div>
`;
