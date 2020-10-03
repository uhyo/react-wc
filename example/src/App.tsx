import React, { useState } from "react";
import { LinariaApp } from "./LinariaApp";
import { StyledApp } from "./StyledApp";
import { WcApp } from "./WcApp";

const modes = ["wc", "linaria", "styled"] as const;

export const App: React.FC = () => {
  const [mode, setMode] = useState<typeof modes[number]>("wc");

  return (
    <div>
      <p>
        Mode{" "}
        <select onChange={(e) => setMode(e.currentTarget.value as any)}>
          {modes.map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
      </p>
      {mode === "wc" ? (
        <WcApp />
      ) : mode === "linaria" ? (
        <LinariaApp />
      ) : (
        <StyledApp />
      )}
    </div>
  );
};
