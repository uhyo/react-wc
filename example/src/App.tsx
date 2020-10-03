import React from "react";
import { useState } from "react";
import { Counter, Counters } from "./Counter";
import { range } from "./util/range";

export const App: React.FC = () => {
  const [counter, setCounter] = useState(0);

  return (
    <div>
      <p>
        <button onClick={() => setCounter((c) => c + 1)}>+1</button>
      </p>
      <div>{counter}</div>
      <Counters>
        {[...range(0, 64)].map((i) => (
          <Counter key={i}>{counter}</Counter>
        ))}
      </Counters>
    </div>
  );
};
