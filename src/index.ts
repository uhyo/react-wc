import React from "react";
import { HtmlComponentProps } from "./HtmlComponentProps";
export { html, slot } from "./html";
export { wc } from "./wc";

export type WCComponent<SlotName extends string> = React.FunctionComponent<
  HtmlComponentProps<SlotName>
> & {
  readonly elementName: string;
};
