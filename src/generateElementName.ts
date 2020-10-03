let counter = 1;

const prefix = "wc-";

export function generateElementName() {
  const randPart = Math.random().toString(36).slice(2);
  return `${prefix}${randPart}-${counter++}`;
}

export const textNodeElementName = `${prefix}text`;
