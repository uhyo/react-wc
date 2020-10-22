import { applySlot } from "./applySlot";
import { HtmlComponentProps } from "./HtmlComponentProps";

export function makeChildren<SlotName extends string>(
  props: React.PropsWithChildren<HtmlComponentProps<SlotName>>,
  slotNames?: readonly SlotName[]
): React.ReactNode {
  if (!slotNames || slotNames.length === 0) {
    return props.children;
  }
  const p: HtmlComponentProps<SlotName> = props;
  const result: React.ReactNode[] = [];
  for (const slot of slotNames) {
    const prop = p[
      (slot as unknown) as keyof HtmlComponentProps<SlotName>
    ] as React.ReactNode;
    result.push(applySlot(prop, slot, `slot-${slot}`));
  }
  result.push(props.children);
  return result;
}
