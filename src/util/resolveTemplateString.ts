import { range } from "./range";

export function resolveTemplateString(
  arr: TemplateStringsArray,
  values: readonly unknown[]
): string {
  let result = arr[0];
  for (const i of range(0, values.length)) {
    result += values[i];
    result += arr[i + 1];
  }
  console.log(result, arr, values);
  return result;
}
