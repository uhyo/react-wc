import React from "react";
import { HtmlComponentProps } from "./HtmlComponentProps";
export { html, slot } from "./html";
export { ServerRenderingCollector, ServerRenderingContext } from "./ssr";
export { wc, wcIntrinsic } from "./wc";

export type WCComponent<SlotName extends string> = React.FunctionComponent<
  HtmlComponentProps<SlotName>
> & {
  readonly elementName: string;
};
