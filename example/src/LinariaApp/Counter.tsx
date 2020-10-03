import { css } from "linaria";
import React from "react";

const counters = css`
  display: grid;
  grid: auto-flow / repeat(16, 80px);
  gap: 10px;
`;

export const Counters: React.FC = ({ children }) => (
  <div className={counters}>{children}</div>
);

const counter = css`
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
`;

export const Counter: React.FC = ({ children }) => (
  <div className={counter}>
    <div>{children}</div>
  </div>
);
