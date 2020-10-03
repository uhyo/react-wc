import { slotNameSymbol } from "./symbol";

export type Slot<Name extends string> = {
  [slotNameSymbol]: Name;
};
