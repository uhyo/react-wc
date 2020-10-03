import React from "react";
import { useState } from "react";

export const App: React.FC = () => {
  const [counter, setCounter] = useState(0);

  return (
    <div>
      <p>
        <button onClick={() => setCounter((c) => c + 1)}>+1</button>
      </p>
      <div>{counter}</div>
    </div>
  );
};
