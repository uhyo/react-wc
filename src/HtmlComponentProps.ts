export type HtmlComponentProps<
  SlotName extends string
> = string extends SlotName
  ? {}
  : { [N in Exclude<SlotName, "children" | "">]?: React.ReactNode };
