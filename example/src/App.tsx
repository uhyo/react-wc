import React, { useState } from "react";
import { LinariaApp } from "./LinariaApp";
import { WcApp } from "./WcApp";

export const App: React.FC = () => {
  const [mode, setMode] = useState<"wc" | "linaria">("wc");

  return (
    <div>
      <p>
        Mode{" "}
        <select onChange={(e) => setMode(e.currentTarget.value as any)}>
          {["wc", "linaria"].map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
      </p>
      {mode === "wc" ? <WcApp /> : <LinariaApp />}
    </div>
  );
};
