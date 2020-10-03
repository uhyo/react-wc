import React from "react";
import styled from "styled-components";

export const Counters = styled.div`
  display: grid;
  grid: auto-flow / repeat(16, 80px);
  gap: 10px;
`;

const CounterStyle = styled.div`
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
  <CounterStyle>
    <div>{children}</div>
  </CounterStyle>
);
