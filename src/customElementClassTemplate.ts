export type CustomElementClass = {
  template: DocumentFragment;
  new (): HTMLElement & {
    refresh(): void;
  };
};

export const customElementBaseClassTemplate = `
class E extends HTMLElement{
  constructor(){
    super();
    this.attachShadow({
      mode:"open"
    }).appendChild(E.template.cloneNode(true))
  }
  refresh(){
    let c,s=this.shadowRoot;
    if(s){
      while(c=s.firstChild)
        s.removeChild(c);
      s.appendChild(E.template.cloneNode(true))
    }
  }
}`.replace(/\s*\n\s*/g, "");
