import React, { useState } from "react";
import { range } from "../util/range";
import { Counter, Counters } from "./Counter";

export const LinariaApp: React.FC = () => {
  const [counter, setCounter] = useState(0);

  return (
    <div>
      <p>
        <button onClick={() => setCounter((c) => c + 1)}>+1</button>
      </p>
      <div>{counter}</div>
      <Counters>
        {[...range(0, 256)].map((i) => (
          <Counter key={i}>{counter}</Counter>
        ))}
      </Counters>
    </div>
  );
};
