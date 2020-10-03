import { Slot } from "../Slot";
import { slotNameSymbol } from "../symbol";
import { range } from "./range";

export function resolveTemplateString<SlotName extends string>(
  arr: TemplateStringsArray,
  values: readonly Slot<SlotName>[]
): [string, Exclude<SlotName, "children" | "">[]] {
  let result = arr[0];
  const slotNames = [];
  for (const i of range(0, values.length)) {
    const slotName = values[i][slotNameSymbol];
    if (slotName && slotName !== "children") {
      result += `<slot name="${escapeName(slotName)}"></slot>`;
      slotNames.push(slotName as Exclude<SlotName, "children" | "">);
    } else {
      result += "<slot></slot>";
    }
    result += arr[i + 1];
  }
  return [result, slotNames];
}

function replacer(char: string) {
  switch (char) {
    case "&":
      return "&amp;";
    case "<":
      return "&lt;";
    case ">":
      return "&gt;";
    case '"':
      return "&quot;";
    case "'":
      return "&#39;";
    default:
      return char;
  }
}

function escapeName(name: string) {
  return name.replace(/[&<>"']/g, replacer);
}
