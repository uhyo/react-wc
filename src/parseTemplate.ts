export function parseTemplate(html: string) {
  const template = document.createDocumentFragment();
  // parse HTML string into DOM nodes
  const div = document.createElement("div");
  div.insertAdjacentHTML("afterbegin", html);
  template.append(...div.childNodes);
  return template;
}
