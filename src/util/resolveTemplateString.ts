import { Slot } from "../Slot";
import { slotNameSymbol } from "../symbol";
import { range } from "./range";

export function resolveTemplateString(
  arr: TemplateStringsArray,
  values: readonly Slot<string>[]
): string {
  let result = arr[0];
  for (const i of range(0, values.length)) {
    const slotName = values[i][slotNameSymbol];
    if (slotName) {
      result += `<slot name="${escapeName(slotName)}"></slot>`;
    } else {
      result += "<slot></slot>";
    }
    result += arr[i + 1];
  }
  console.log(result, arr, values);
  return result;
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
