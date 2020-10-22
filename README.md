# react-wc

> Tiny wrapper of Web Components for react.

## What `react-wc` does?

It creates a React component which renders a custom element with given HTML fragment in its Shadow DOM.

## Looking for a WebComponents-based CSS-in-JS solution for React?

This package provides some low-level functionality that helps other Web Components-based libraries.

If you are not a package author, you may be interested in [Castella](https://github.com/uhyo/castella), a CSS-in-JS library for React backed by this package.

## Usage

### Defining a Component

```ts
import { wc } from "react-wc";

export const Counters = wc({
  shadowHtml: `
    <style>
      div {
        display: grid;
        grid: auto-flow / repeat(16, 80px);
        gap: 10px;
      }
    </style>
    <div><slot></slot></div>
  `,
  name: "my-counter-element"
});
```

### Using Defined Component

```tsx
<Counters><span>child</span></Counters>
```

### Rendered DOM

```html
<my-counter-element>
  #shadow-root
    <style>
      div {
        display: grid;
        grid: auto-flow / repeat(16, 80px);
        gap: 10px;
      }
    </style>
    <div><slot></slot></div>
  <span>child</span>
</my-counter-element>
```

### Named Slots

```ts
const AppStyle = wc({
  shadowHtml: `
    <style>
      header {
        border: 1px solid #cccccc;
        padding: 4px;
      }
      p {
        border-bottom: 1px dashed #999999;
      }
    </style>
    <header><slot name="header"></slot></header>
    <p>Counter value is <slot name="counter"></slot></p>
    <main><slot></slot></main>
  `,
  slots: ["header", "counter"],
  element: "my-app-style"
});

const CounterValue = ({ children }) => <b>{children}</b>;
```

Named slots can be filled by a prop with the same name. Any React nodes can be passed to those props. 

```tsx
<AppStyle
  header={
    <p>
      <button onClick={() => setCounter((c) => c + 1)}>+1</button>
    </p>
  }
  counter={<CounterValue>{counter}</CounterValue>}
>
  <Counters>
    {[...range(0, 256)].map((i) => (
      <Counter key={i}>{counter}</Counter>
    ))}
  </Counters>
</AppStyle>
```

#### Rendered DOM

Rendered DOM elements are automatically given the `slot` attribute so they fill corresponding `<slot>`s. `react-wc` does all the work needed to achieve this.

```html
<my-app-style>
  #shadow-dom ...
  <p slot="header">
    <button>+1</button>
  </p>
  <b slot="counter">1</b>
  ...
</my-app-style>
```

## Further Reading

- [Blog article (日本語)](https://blog.uhy.ooo/entry/2020-10-03/react-wc/)

## Future Roadmap

- [ ] SSR Support?

## Contributing

Welcome

## License

MIT